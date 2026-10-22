import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { 
  Type, Globe, Volume2, Smartphone, Check, Sparkles, RotateCcw, PackageCheck
} from 'lucide-react';
import { Button } from '../../../components/Button';
import { playTestRingtone } from '../../../utils/soundEffects';
import { PACKAGING_UNITS } from '../../../utils/unitHelper';

export const SettingsPage = () => {
  const { 
    lang, 
    setLang, 
    theme, 
    toggleTheme, 
    fontSize = 'normal', 
    setFontSize, 
    currency, 
    setCurrency, 
    exchangeRate,
    showToast,
    smsSettings,
    updateSmsSettings,
    sendSmsNotification,
    orderAudioEnabled,
    toggleOrderAudioAlert
  } = useStore();

  const [testPhone, setTestPhone] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSendTestSms = async () => {
    const cleanPhone = (testPhone || '').trim();
    if (!cleanPhone) {
      showToast(lang === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទតេស្ត!' : 'Please enter a test phone number!', 'error');
      return;
    }
    setIsSendingTest(true);
    try {
      const res = await sendSmsNotification(
        cleanPhone,
        lang === 'km'
          ? '🔔 សារតេស្តផ្ទៀងផ្ទាត់ប្រព័ន្ធ SMS ពីហាង V8 Mini Mart!'
          : '🔔 Test SMS from V8 Mini Mart! Your SMS gateway is working successfully.'
      );
      if (res.success) {
        showToast(lang === 'km' ? '✅ សារតេស្តត្រូវបានផ្ញើជោគជ័យ!' : '✅ Test SMS sent successfully!', 'success');
      } else {
        showToast(`❌ ${res.error || 'Failed'}`, 'error');
      }
    } catch (err) {
      showToast(`❌ Error: ${err.message}`, 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  // Standard Font Size Presets Configuration
  const fontOptions = [
    {
      id: 'small',
      label_km: 'តូចល្មម (Compact)',
      label_en: 'Compact (Small)',
      percent: '90%',
      px: '14.5px',
      badge: null,
      desc_km: 'សមស្របសម្រាប់អេក្រង់តូច ឬចង់ឃើញទិន្នន័យបានច្រើនក្នុងទំព័រតែមួយ',
      desc_en: 'Compact layout for viewing more data rows & dense tables',
      stepIndex: 0
    },
    {
      id: 'normal',
      label_km: 'ស្តង់ដារ (Standard)',
      label_en: 'Standard (Normal)',
      percent: '100%',
      px: '16px',
      badge: lang === 'km' ? 'លំនាំដើម' : 'Default',
      desc_km: 'ទំហំដើមលំនាំដើមរបស់ប្រព័ន្ធ មានតុល្យភាពល្អ និងស្រួលភ្នែកបំផុត',
      desc_en: 'Recommended default balanced scale for all displays',
      stepIndex: 1
    },
    {
      id: 'large',
      label_km: 'ធំស្រួលមើល (Large)',
      label_en: 'Large',
      percent: '115%',
      px: '18px',
      badge: lang === 'km' ? 'ពេញនិយម' : 'Popular',
      desc_km: 'អក្សរធំច្បាស់ ងាយស្រួលអានលើទូរស័ព្ទដៃ និងថេប្លេត មិនពិបាកសម្លឹង',
      desc_en: 'Enhanced readability on phones, tablets & high-DPI screens',
      stepIndex: 2
    },
    {
      id: 'xlarge',
      label_km: 'ធំខ្លាំង (Extra Large)',
      label_en: 'Extra Large',
      percent: '125%',
      px: '20px',
      badge: null,
      desc_km: 'អក្សរធំពិសេស មើលឃើញច្បាស់ល្អ ងាយស្រួលពិនិត្យទិន្នន័យពីចម្ងាយ',
      desc_en: 'Maximum accessibility scaling for effortless reading',
      stepIndex: 3
    }
  ];

  const currentOption = fontOptions.find(f => f.id === fontSize) || fontOptions[1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white">
            {lang === 'km' ? 'ការកំណត់ប្រព័ន្ធ (Admin Settings)' : 'Admin Settings'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'km' 
              ? 'កំណត់ភាសា សំឡេង SMS Notifications និងទំហំអក្សរប្រព័ន្ធ (Font Size)' 
              : 'Configure display preferences, audio alerts, SMS gateway, and system font sizing'}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* 1. Language */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'km' ? '១. ភាសាប្រព័ន្ធ (System Language)' : '1. Language'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLang('km')}
              className={`p-4 rounded-2xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                lang === 'km' 
                  ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/20' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl">🇰🇭</span>
              <div>
                <div className="text-sm font-bold text-white">ភាសាខ្មែរ (Khmer)</div>
                <div className="text-[11px] text-slate-400">ភាសាផ្លូវការក្នុងប្រព័ន្ធ</div>
              </div>
            </button>

            <button
              onClick={() => setLang('en')}
              className={`p-4 rounded-2xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                lang === 'en' 
                  ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/20' 
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl">🇬🇧</span>
              <div>
                <div className="text-sm font-bold text-white">English (US)</div>
                <div className="text-[11px] text-slate-400">Default global language</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Audio Alert */}
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'km' ? '២. សំឡេងជូនដំណឹង Order (Order Audio Alert)' : '2. Audio Alert'}</span>
          </h3>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <div className="text-sm font-bold text-white">
                {orderAudioEnabled ? '🔔 សំឡេង alert បើក (Audio Enabled)' : '🔕 សំឡេង alert បិទ (Audio Muted)'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                បន្លឺសំឡេងប្រកាសពេលមាន Order ថ្មីចូល (Play chime when new order arrives)
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={playTestRingtone}
              >
                Test Sound 🔊
              </Button>
              <button
                onClick={toggleOrderAudioAlert}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                  orderAudioEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {orderAudioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. SMS Gateway */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'km' ? '៣. ប្រព័ន្ធផ្ញើសារ SMS (SMS Gateway Config)' : '3. SMS Gateway'}</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsSettings?.enabled || false}
                onChange={(e) => updateSmsSettings({ enabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
              <span className="text-sm font-bold text-white">
                បើកដំណើរការផ្ញើសារ SMS ជូនដំណឹងអតិថិជនពេល Order ជោគជ័យ (Enable SMS Notification)
              </span>
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="012345678 (Test Phone)"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                size="sm"
                variant="emerald"
                isLoading={isSendingTest}
                onClick={handleSendTestSms}
              >
                Test SMS 📲
              </Button>
            </div>
          </div>
        </div>

        {/* 4. Standard Font Size Preference (ទំហំអក្សរតាមបែប Standard) */}
        <div className="space-y-5 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                <Type className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'km' 
                    ? '៤. កំណត់ទំហំអក្សរប្រព័ន្ធ (Standard Font Size Scaling)' 
                    : '4. System Font Size Scaling'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'km'
                  ? 'កែសម្រួលទំហំអក្សរតាមបែប Standard ដូចកម្មវិធីធំៗ (Telegram / iOS / Android) ដើម្បីមើលកាន់តែស្រួលភ្នែក និងច្បាស់ល្អ'
                  : 'Adjust system text scaling using standard presets for maximum readability and visual comfort'}
              </p>
            </div>

            {/* Current Badge & Quick Reset */}
            <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-auto">
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                {currentOption.percent} • {currentOption.px}
              </span>
              {fontSize !== 'normal' && (
                <button
                  type="button"
                  onClick={() => {
                    setFontSize('normal');
                    showToast(
                      lang === 'km' 
                        ? '🔄 បានកំណត់ទំហំអក្សរមកស្តង់ដារដើមវិញ (100%)' 
                        : '🔄 Reset font size to default standard (100%)',
                      'info'
                    );
                  }}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer border border-slate-700"
                  title={lang === 'km' ? 'កំណត់មកស្តង់ដារវិញ' : 'Reset to Standard'}
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>{lang === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Standard 4-Step Interactive Slider Track (Like iOS / Telegram Display Scaling) */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-sm font-bold text-slate-500">A</span>
                <span className="text-[11px] text-slate-400">{lang === 'km' ? 'តូច (Small)' : 'Small'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-400">{lang === 'km' ? 'ធំខ្លាំង (Extra Large)' : 'Extra Large'}</span>
                <span className="font-serif text-xl font-black text-emerald-400">A</span>
              </div>
            </div>

            {/* Slider Steps Control */}
            <div className="relative py-2 px-1">
              {/* Background Track */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                  style={{
                    width: fontSize === 'small' ? '0%' 
                         : fontSize === 'normal' ? '33.33%' 
                         : fontSize === 'large' ? '66.66%' 
                         : '100%'
                  }}
                />
              </div>

              {/* 4 Step Dots Clickable Track */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0.5 pointer-events-none">
                {['small', 'normal', 'large', 'xlarge'].map((stepId, idx) => {
                  const isCurrent = fontSize === stepId;
                  const isPassed = ['small', 'normal', 'large', 'xlarge'].indexOf(fontSize) >= idx;
                  return (
                    <div
                      key={stepId}
                      className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                        isCurrent 
                          ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/25 scale-125' 
                          : isPassed
                            ? 'bg-emerald-600 border-emerald-400'
                            : 'bg-slate-900 border-slate-700'
                      }`}
                    >
                      {isCurrent && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  );
                })}
              </div>

              {/* Range input for slider dragging */}
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={['small', 'normal', 'large', 'xlarge'].indexOf(fontSize)}
                onChange={(e) => {
                  const stepIndex = parseInt(e.target.value, 10);
                  const newSize = ['small', 'normal', 'large', 'xlarge'][stepIndex];
                  setFontSize(newSize);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                aria-label="Font size slider"
              />
            </div>

            {/* Step Labels */}
            <div className="grid grid-cols-4 text-center pt-1 text-[11px] font-semibold text-slate-400">
              {fontOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontSize(opt.id)}
                  className={`cursor-pointer transition-colors ${fontSize === opt.id ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
                >
                  <div>{opt.percent}</div>
                  <div className="text-[10px] text-slate-500 hidden sm:block">({opt.px})</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4 Preset Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {fontOptions.map((item) => {
              const isSelected = fontSize === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFontSize(item.id);
                    showToast(
                      lang === 'km'
                        ? `🔤 បានប្តូរទំហំអក្សរទៅជា៖ ${item.label_km} (${item.percent})`
                        : `🔤 Font size set to: ${item.label_en} (${item.percent})`,
                      'success'
                    );
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-3 cursor-pointer group ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Card Top: Preview Icon & Badges */}
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-serif font-black transition ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-850 text-slate-300 group-hover:bg-slate-800'
                    }`}>
                      <span className={item.id === 'small' ? 'text-sm' : item.id === 'normal' ? 'text-base' : item.id === 'large' ? 'text-lg' : 'text-xl'}>
                        Aa
                      </span>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {item.percent}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Middle: Title & Description */}
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-white">
                        {lang === 'km' ? item.label_km : item.label_en}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {lang === 'km' ? item.desc_km : item.desc_en}
                    </p>
                  </div>

                  {/* Card Bottom: Pixel Scale Indicator */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Root Base:</span>
                    <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{item.px}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Real-Time Live Preview Box (Dynamic Rendering showing real impact) */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'km' ? 'គំរូទិដ្ឋភាពអក្សរផ្ទាល់ (Live Typography Preview)' : 'Live Typography Preview'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Active Scale: <span className="text-emerald-400 font-bold">{currentOption.percent}</span> ({currentOption.px})
              </span>
            </div>

            {/* Live Preview Elements displaying typical admin UI cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Sample Order Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">📦 ការបញ្ជាទិញ #8824</span>
                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    បានទូទាត់ជោគជ័យ
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  ភេសជ្ជៈប៉ូវកម្លាំង Bacchus × 3 កំប៉ុង
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>អតិថិជន: ចាន់ តារា (012 889 900)</span>
                  <span className="font-bold text-emerald-400">$4.50 (18,450៛)</span>
                </div>
              </div>

              {/* Sample Inventory Alert */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">⚠️ ស្តុកទំនិញជិតអស់ (Low Stock Alert)</span>
                  <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    នៅសល់ 4 មុខ
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  ទឹកបរិសុទ្ធ វីតាាល់ Vital 500ml (កេស 24ដប)
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>កម្រិតព្រមានស្តុក: &lt; 10 កេស</span>
                  <span className="font-bold text-rose-400">នៅសល់ត្រឹម 3 កេស</span>
                </div>
              </div>
            </div>

            {/* Helpful notice */}
            <div className="text-[11px] text-slate-500 pt-2 flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>
                {lang === 'km' 
                  ? 'ការកំណត់ទំហំអក្សរនេះ នឹងត្រូវចងចាំដោយស្វ័យប្រវត្តលើ Browser នេះ (Persisted via LocalStorage)។' 
                  : 'Font scaling is automatically remembered on this browser across all admin sessions.'}
              </span>
            </div>
          </div>

          {/* SECTION 4: PACKAGING UNIT CONFIGURATIONS (ការកំណត់ឯកតាគិតទំនិញ Quick Unit Presets) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'km' ? 'ការកំណត់ឯកតាគិតទំនិញ (Packaging Unit Configurations)' : 'Packaging Unit Configurations'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'km' 
                      ? 'ឯកតាស្តង់ដារទាំង 10 សម្រាប់គិតថ្លៃ និងបង្ហាញលើតារាងស្តុក និងទំព័រទំនិញភ្ញៀវ' 
                      : '10 standard packaging units active across inventory tables & storefront'}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs rounded-xl">
                {PACKAGING_UNITS.length} Standard Presets
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PACKAGING_UNITS.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-1.5 hover:border-emerald-500/40 transition"
                >
                  <span className="text-2xl">{u.emoji}</span>
                  <span className="font-bold text-white text-xs leading-tight">
                    {lang === 'km' ? u.label_km : u.label_en}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.badgeClasses}`}>
                    {u.tag_en}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'km' 
                    ? 'ឯកតាទាំងអស់ត្រូវបានភ្ជាប់ស្វ័យប្រវត្តទៅនឹងប្រព័ន្ធគណនាតម្លៃ និងការបញ្ជាទិញរបស់ភ្ញៀវ។'
                    : 'All units are automatically bound to item pricing, cart calculation, and client orders.'}
                </span>
              </div>
              <span className="text-emerald-400 font-bold font-mono">100% Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
