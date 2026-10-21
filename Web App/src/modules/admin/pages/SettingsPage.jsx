import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { 
  Settings, Type, Moon, Sun, Globe, DollarSign, 
  Store, Shield, Bell, Check, Sparkles, Volume2, VolumeX, Smartphone, AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/Button';
import { playTestRingtone } from '../../../utils/soundEffects';

export const SettingsPage = () => {
  const { 
    lang, 
    setLang, 
    theme, 
    toggleTheme, 
    fontSize, 
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white">
            {lang === 'km' ? 'ការកំណត់ប្រព័ន្ធ (Admin Settings)' : 'Admin Settings'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'km' ? 'កំណត់ភាសា រូបិយវត្ថុ សំឡេង និង SMS Notifications' : 'Configure display preferences, sound, and SMS notifications'}
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
      </div>
    </div>
  );
};

export default SettingsPage;
