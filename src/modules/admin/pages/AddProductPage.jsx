import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../context/StoreContext';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Package, DollarSign, Tag, Layers, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { PACKAGING_UNITS, applyUnitToTitle } from '../../../components/admin/InventoryTable';

export const AddProductPage = () => {
  const navigate = useNavigate();
  const { categories, addProduct, lang } = useStore();

  const [formData, setFormData] = useState({
    title_kh: '',
    title_en: '',
    category_id: categories[0]?.id || 'cat-1',
    price: '',
    cost_price: '',
    stock_quantity: '20',
    low_stock_threshold: '5',
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: '',
    unit: '',
    auto_append_unit: true,
    description_kh: '',
    description_en: '',
    images: []
  });

  const handleSelectUnit = (unitItem) => {
    const isAlreadySelected = formData.unit === unitItem.short_km;
    if (isAlreadySelected) {
      setFormData(prev => ({
        ...prev,
        unit: '',
        title_kh: prev.auto_append_unit ? applyUnitToTitle(prev.title_kh, '') : prev.title_kh
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        unit: unitItem.short_km,
        title_kh: prev.auto_append_unit ? applyUnitToTitle(prev.title_kh, unitItem.tag) : prev.title_kh
      }));
    }
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title_kh && !formData.title_en) {
      setError(lang === 'km' ? 'សូមបញ្ចូលឈ្មោះទំនិញ (Product Title Required)' : 'Please enter product title');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError(lang === 'km' ? 'សូមបញ្ចូលតម្លៃទំនិញ (Price Required)' : 'Please enter valid product price');
      return;
    }

    setLoading(true);

    try {
      const selectedCategory = categories.find(c => c.id === formData.category_id);
      
      const newProduct = {
        title_kh: formData.title_kh || formData.title_en,
        title_en: formData.title_en || formData.title_kh,
        unit: formData.unit || '',
        category_id: formData.category_id,
        category_name_kh: selectedCategory ? selectedCategory.name_kh : 'ទូទៅ',
        category_name_en: selectedCategory ? selectedCategory.name_en : 'General',
        price: parseFloat(formData.price),
        cost_price: parseFloat(formData.cost_price || formData.price * 0.7),
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold, 10) || 5,
        sku: formData.sku,
        barcode: formData.barcode || formData.sku,
        description_kh: formData.description_kh,
        description_en: formData.description_en,
        images: formData.images.length > 0 ? formData.images : ['/products/coca.jpg'],
        is_active: true
      };

      addProduct(newProduct);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/inventory');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChanged = (base64Image) => {
    if (base64Image) {
      setFormData(prev => ({ ...prev, images: [base64Image] }));
    } else {
      setFormData(prev => ({ ...prev, images: [] }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/inventory')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'km' ? 'ត្រឡប់ទៅបញ្ជីស្តុក' : 'Back to Inventory'}</span>
        </button>
        <h1 className="text-xl font-black text-white">
          {lang === 'km' ? 'បន្ថែមទំនិញថ្មី (Add New Product)' : 'Add New Product'}
        </h1>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-emerald-400 text-sm flex items-center space-x-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{lang === 'km' ? 'បន្ថែមទំនិញបានជោគជ័យ! កំពុងផ្លាស់ទី...' : 'Product added successfully! Redirecting...'}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded-2xl text-rose-400 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* 1. Drag & Drop Image Uploader */}
        <div>
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">
            ១. រូបភាពទំនិញ (Product Image Upload)
          </h3>
          <ImageUploader
            currentImage={formData.images[0] || ''}
            onImageChange={handleImageChanged}
            targetSizeKB={150}
          />
        </div>

        {/* 2. Basic Info */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              ២. ព័ត៌មានទូទៅ (Basic Product Information)
            </h3>

            {/* Auto-append Unit to Title Toggle */}
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-300 font-semibold select-none">
              <input
                type="checkbox"
                checked={Boolean(formData.auto_append_unit)}
                onChange={(e) => setFormData(prev => ({ ...prev, auto_append_unit: e.target.checked }))}
                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-700 bg-slate-950 focus:ring-emerald-500 cursor-pointer"
              />
              <span>{lang === 'km' ? 'បញ្ចូលឈ្មោះឯកតាស្វ័យប្រវត្ត (Auto-Append Tag)' : 'Auto-Append Tag to Title'}</span>
            </label>
          </div>

          {/* Quick Unit Checkboxes Grid */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                {lang === 'km' ? '📦 ជ្រើសរើសឯកតាគិតទំនិញរហ័ស (Quick Unit / Packaging Selector)' : 'Quick Unit Selector'}
              </span>
              {formData.unit && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {formData.unit}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
              {PACKAGING_UNITS.map((u) => {
                const isChecked = formData.unit === u.short_km || (formData.title_kh && formData.title_kh.includes(u.tag));
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUnit(u)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/25 font-black scale-[1.02]'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500 hover:bg-slate-850'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
                      isChecked 
                        ? 'bg-white text-emerald-700 border-white' 
                        : 'border-slate-600 bg-transparent'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span className="text-sm leading-none flex-shrink-0">{u.emoji}</span>
                    
                    <div className="min-w-0 flex-1 truncate">
                      <div className={`text-xs truncate ${isChecked ? 'text-white font-black' : 'font-bold text-slate-200'}`}>
                        {u.label_km}
                      </div>
                      <div className={`text-[10px] truncate ${isChecked ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {u.label_en}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="ឈ្មោះទំនិញ (ភាសាខ្មែរ)"
              placeholder="ឧទាហរណ៍៖ កូកាកូឡា ៣៣០មីលីលីត្រ"
              value={formData.title_kh}
              onChange={(e) => setFormData({ ...formData, title_kh: e.target.value })}
              required
            />
            <Input
              label="Product Title (English)"
              placeholder="e.g. Coca-Cola Original 330ml"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ប្រភេទទំនិញ (Category) *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {lang === 'km' ? cat.name_kh : cat.name_en}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="SKU Code"
              placeholder="e.g. BEV-001"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>
        </div>

        {/* 3. Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
            ៣. តម្លៃ & ចំនួនស្តុក (Pricing & Stock Management)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="តម្លៃលក់ (Selling Price USD) *"
              type="number"
              step="0.01"
              placeholder="1.50"
              icon={DollarSign}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="តម្លៃដើម (Cost Price USD)"
              type="number"
              step="0.01"
              placeholder="1.00"
              icon={DollarSign}
              value={formData.cost_price}
              onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
            />
            <Input
              label="ចំនួនស្តុកដំបូង (Stock Qty) *"
              type="number"
              placeholder="20"
              icon={Package}
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              required
            />
            <Input
              label="កម្រិតព្រមានស្តុក (Low Threshold)"
              type="number"
              placeholder="5"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-800 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/inventory')}
          >
            {lang === 'km' ? 'បោះបង់ (Cancel)' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant="emerald"
            isLoading={loading}
            icon={Check}
          >
            {lang === 'km' ? 'រក្សាទុកទំនិញ (Save Product)' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
