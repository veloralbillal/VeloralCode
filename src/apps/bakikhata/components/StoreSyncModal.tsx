import React, { useState, useEffect } from 'react';
import {
  X,
  Store,
  Check,
  Copy,
  RefreshCw,
  Smartphone,
  Shield,
  KeyRound,
  CloudUpload,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  PhoneCall,
} from 'lucide-react';
import {
  getStoreDeviceId,
  getStorePin,
  generateRandomDeviceId,
  generateRandomPin,
  setStoreDeviceCredentials,
  pushStoreDataToCloud,
  connectAndSyncFromCloud,
} from '../services/bakiStorageService';
import { useToast } from '../../../context/ToastContext';

interface StoreSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export const StoreSyncModal: React.FC<StoreSyncModalProps> = ({ isOpen, onClose, currentUser }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'my_device' | 'connect_device'>('my_device');

  // Current Device State
  const [deviceId, setDeviceId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [customPinInput, setCustomPinInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);

  // Connect Another Device State
  const [targetDeviceId, setTargetDeviceId] = useState('');
  const [targetPin, setTargetPin] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentId = getStoreDeviceId(currentUser?.uid);
      const currentPin = getStorePin();
      setDeviceId(currentId);
      setPin(currentPin);
      setCustomPinInput(currentPin);
      const savedTime = localStorage.getItem('bakikhata_last_cloud_sync');
      if (savedTime) {
        setLastBackupTime(new Date(Number(savedTime)).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopiedId(true);
    showToast('Device ID কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(true);
    showToast('PIN কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleGenerateNewId = () => {
    if (window.confirm('নতুন Device ID তৈরি করতে চান? আগের ডিভাইস কানেকশন পরিবর্তন হবে।')) {
      const newId = generateRandomDeviceId();
      const newPin = generateRandomPin();
      setStoreDeviceCredentials(newId, newPin);
      setDeviceId(newId);
      setPin(newPin);
      setCustomPinInput(newPin);
      showToast(`নতুন Device ID (${newId}) তৈরি হয়েছে!`, 'success');
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customPinInput.trim();
    if (clean.length < 4) {
      showToast('পিন অবশ্যই কমপক্ষে ৪ সংখ্যার হতে হবে!', 'error');
      return;
    }
    setStoreDeviceCredentials(deviceId, clean);
    setPin(clean);
    setIsEditingPin(false);
    showToast('নতুন PIN সফলভাবে সেভ হয়েছে!', 'success');
  };

  const handlePushToCloud = async () => {
    setIsPushing(true);
    try {
      const res = await pushStoreDataToCloud(currentUser?.uid);
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        setLastBackupTime(timeStr);
        showToast(`ক্লাউডে সমস্ত কাস্টমার, হিসাব ও কল রেকর্ড সফলভাবে ব্যাকআপ হয়েছে!`, 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে!', 'error');
    } finally {
      setIsPushing(false);
    }
  };

  const handleConnectTargetDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = targetDeviceId.trim().toUpperCase();
    const cleanPin = targetPin.trim();

    if (!cleanId) {
      showToast('অনুগ্রহ করে অন্য মোবাইলের Device ID লিখুন', 'error');
      return;
    }
    if (!cleanPin) {
      showToast('অনুগ্রহ করে ৪-ডিজিট PIN নম্বর দিন', 'error');
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectAndSyncFromCloud(cleanId, cleanPin);
      if (result.success) {
        showToast(result.message, 'success');
        onClose();
        // Reload page to re-subscribe with new path and data
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } else {
        showToast(result.message, 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'কানেক্ট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>ডিভাইস আইডি ও ক্লাউড সিঙ্ক</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Firebase Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Device ID ও PIN দিয়ে যেকোনো মোবাইলে খাতা ও কল ডাটা সিঙ্ক করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-900/50 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('my_device')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'my_device'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>এই মোবাইলের আইডি ও পিন</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('connect_device')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'connect_device'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>অন্য মোবাইল থেকে ডাটা আনুন</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'my_device' ? (
            <div className="space-y-4">
              {/* Device ID Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>আপনার বর্তমান Device ID:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateNewId}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>নতুন আইডি জেনারেট</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/80 font-mono text-lg font-black text-emerald-700 dark:text-emerald-300 tracking-wider">
                    {deviceId}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 shrink-0 cursor-pointer"
                  >
                    {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId ? 'কপি হয়েছে' : 'কপি ID'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-tight">
                  📌 এই আইডি দিয়ে আপনার খাতা ও কল রেকর্ড ক্লাউডে জমা থাকে।
                </p>
              </div>

              {/* PIN Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span>নিরাপত্তা পিন (Security PIN):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingPin(!isEditingPin)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isEditingPin ? 'বাতিল' : 'পিন পরিবর্তন করুন'}
                  </button>
                </div>

                {isEditingPin ? (
                  <form onSubmit={handleSavePin} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={8}
                        value={customPinInput}
                        onChange={(e) => setCustomPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="যেমন: 1234"
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 font-mono text-base font-bold text-slate-900 dark:text-white"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        সেভ করুন
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-lg font-black text-slate-800 dark:text-slate-100 flex items-center justify-between">
                      <span>{showPin ? pin : '••••'}</span>
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPin}
                      className="px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedPin ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPin ? 'কপি হয়েছে' : 'কপি PIN'}</span>
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  🔒 অন্য ডিভাইসে খাতা খুলতে এই পিনটি প্রয়োজন হবে।
                </p>
              </div>

              {/* Calling Data & Cloud Push Section */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-xs font-bold">
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  <span>কলিং ডাটা ও হিসাব ব্যাকআপ</span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  আপনার কাস্টমারকে করা সব ফোন কল, এসএমএস, বাকি লেনদেন এবং বিকাশ তথ্য এখনই ক্লাউডে সেভ করুন যাতে অন্য মোবাইলে সাথে সাথে দেখা যায়।
                </p>
                <button
                  type="button"
                  onClick={handlePushToCloud}
                  disabled={isPushing}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPushing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CloudUpload className="w-4 h-4" />
                  )}
                  <span>{isPushing ? 'ক্লাউডে সেভ হচ্ছে...' : 'ক্লাউডে সব ডাটা সেভ / ব্যাকআপ করুন'}</span>
                </button>
                {lastBackupTime && (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 py-1.5 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>সর্বশেষ ক্লাউড ব্যাকআপ: {lastBackupTime}</span>
                  </div>
                )}
              </div>

              {/* Instruction Guide */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>💡 অন্য মোবাইলে খাতা দেখার নিয়ম:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
                  <li>অন্য মোবাইলে অ্যাপটি খুলুন।</li>
                  <li>মেনু থেকে <strong>"Store Address / Cloud Sync"</strong> এ যান।</li>
                  <li><strong>"অন্য মোবাইল থেকে ডাটা আনুন"</strong> ট্যাবে ক্লিক করুন।</li>
                  <li>
                    উপরে দেখানো Device ID (<strong>{deviceId}</strong>) এবং পিন (<strong>{pin}</strong>) দিন।
                  </li>
                  <li>কানেক্ট বাটনে চাপলেই সব কাস্টমার ও হিসাব লোড হয়ে যাবে!</li>
                </ol>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnectTargetDevice} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>অন্য মোবাইলের খাতা লোড করুন:</span>
                </div>
                <p>
                  আপনার আগের মোবাইলে যে <strong>Device ID</strong> এবং <strong>Security PIN</strong> রয়েছে, তা এখানে সঠিকভাবে ইনপুট করুন। সফল হলে এই ডিভাইসে আপনার দোকানের আগের সব খাতা ও কল রেকর্ড প্রদর্শিত হবে।
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  অন্য মোবাইলের Device ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs">
                    📱
                  </span>
                  <input
                    type="text"
                    required
                    value={targetDeviceId}
                    onChange={(e) => setTargetDeviceId(e.target.value.toUpperCase())}
                    placeholder="যেমন: BK-84920"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-base font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  সেই মোবাইলের ৪-ডিজিট Security PIN
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs">
                    🔑
                  </span>
                  <input
                    type="password"
                    maxLength={8}
                    required
                    value={targetPin}
                    onChange={(e) => setTargetPin(e.target.value)}
                    placeholder="যেমন: 1234"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isConnecting ? 'ডাটা চেক ও লোড হচ্ছে...' : 'কানেক্ট ও সমস্ত ডাটা আনুন'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
