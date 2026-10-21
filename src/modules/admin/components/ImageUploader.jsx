import React, { useState, useRef } from 'react';
import { Upload, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { processImageFile } from '../../../services/imageUploadService';
import api from '../../../services/api';

export const ImageUploader = ({ 
  currentImage, 
  onImageChange, 
  label = 'រូបភាពទំនិញ (Product Image)', 
  targetSizeKB = 150 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelected = async (file) => {
    if (!file) return;
    setError('');
    setLoading(true);
    setProgress(10);

    // Instant local preview using Object URL
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      // 1. Client-side WebP compression under 150KB with progress tracking
      const result = await processImageFile(file, targetSizeKB, (p) => {
        setProgress(Math.round(p * 0.7)); // 0% - 70% compression progress
      });

      setStats({
        original: result.originalFormatted,
        compressed: result.compressedFormatted,
        ratio: result.ratio
      });

      setProgress(85);

      // 2. Upload compressed WebP file to server
      let finalServerUrl = result.base64;
      try {
        const uploadRes = await api.uploadProductImage(result.file || result.base64);
        if (uploadRes && uploadRes.image_url) {
          finalServerUrl = uploadRes.image_url;
        }
      } catch (uploadErr) {
        console.warn('Backend upload notice (using compressed WebP base64):', uploadErr.message);
      }

      setProgress(100);
      setPreviewUrl(finalServerUrl);
      onImageChange(finalServerUrl);
    } catch (err) {
      setError(err.message || 'Failed to compress or upload image');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onImageChange('');
    setPreviewUrl('');
    setStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeImage = previewUrl || currentImage;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 overflow-hidden ${
          isDragging 
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]' 
            : activeImage 
              ? 'border-emerald-800/60 bg-slate-900/80 hover:border-emerald-500' 
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />

        {loading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            {/* Image Instant Preview during processing */}
            {activeImage && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-emerald-500/40 opacity-70 mb-1">
                <img src={activeImage} alt="Compressing Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5">
              <span>កំពុងបង្រួមទំហំ WebP ({progress}%)...</span>
            </p>
          </div>
        ) : activeImage ? (
          <div className="relative group">
            {/* Instant Image Preview */}
            <div className="max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
              <img
                src={activeImage}
                alt="Product Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer z-10"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Change Hint */}
            <div className="mt-3 text-xs text-slate-400 font-medium">
              ចុច ឬ Drag & Drop ដើម្បីប្ដូររូបភាពផ្សេង (Click or Drop to change)
            </div>

            {/* WebP Compression Stats Badge */}
            {stats && (
              <div className="mt-2 inline-flex items-center space-x-2 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>WebP: {stats.original} ➔ {stats.compressed} ({stats.ratio}% Saved)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                ទម្លាក់រូបភាពនៅទីនេះ ឬ ចុចដើម្បីជ្រើសរើស (Drag & Drop or Click)
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                ⚡ Auto WebP Compression &#60; {targetSizeKB}KB for Max Speed
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
