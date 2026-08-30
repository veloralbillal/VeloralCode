import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CodeItem } from '../../types';
import { getCodeItemById, incrementCodeViewCount } from '../../services/codeService';
import { copyTextToClipboard } from '../../utils/helpers';
import { ToolTopBar } from '../output/ToolTopBar';
import { ToolInfoModal } from '../output/ToolInfoModal';
import { ToolCodeModal } from '../output/ToolCodeModal';
import { PremiumCodeLockModal } from '../output/PremiumCodeLockModal';
import { FullScreenToolCanvas } from '../output/FullScreenToolCanvas';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface CodeDetailsProps {
  codeId: string;
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const CodeDetails: React.FC<CodeDetailsProps> = ({ codeId, onBack, onNavigate }) => {
  const { showToast } = useToast();
  const { isPremium } = useAuth();

  const [item, setItem] = useState<CodeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tool Controls
  const [reloadKey, setReloadKey] = useState(0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Modals
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCodeItemById(codeId);
        if (!isMounted) return;
        if (!data) {
          setError('Tool or code item not found.');
        } else {
          setItem(data);
          incrementCodeViewCount(codeId).catch(() => {});
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load tool.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadItem();
    return () => {
      isMounted = false;
    };
  }, [codeId]);

  const handleShare = async () => {
    const url = window.location.href;
    const ok = await copyTextToClipboard(url);
    if (ok) {
      setCopiedShare(true);
      showToast('Tool link copied to clipboard!', 'success');
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleOpenCode = () => {
    if (!isPremium) {
      setPremiumModalOpen(true);
    } else {
      setCodeModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3 z-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs font-semibold tracking-wide">Launching live tool environment...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center z-50 space-y-4">
        <div className="p-5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm font-medium max-w-md">
          {error || 'Tool not found.'}
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools Hub
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* 1. Full-Screen Tool Topbar */}
      <ToolTopBar
        title={item.title}
        category={item.category}
        language={item.language}
        deviceMode={deviceMode}
        isPremium={isPremium}
        setDeviceMode={setDeviceMode}
        onBack={onBack}
        onReload={() => setReloadKey((k) => k + 1)}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenInfo={() => setInfoModalOpen(true)}
        onOpenCode={handleOpenCode}
        onShare={handleShare}
        copiedShare={copiedShare}
      />

      {/* 2. Direct Live Output / Working Tool Canvas */}
      <main className="flex-1 w-full h-[calc(100vh-56px)] overflow-hidden relative">
        <FullScreenToolCanvas
          code={item.code}
          language={item.language}
          title={item.title}
          reloadKey={reloadKey}
          deviceMode={deviceMode}
        />
      </main>

      {/* 3. Info Details Modal */}
      <ToolInfoModal
        item={item}
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        onOpenCode={handleOpenCode}
      />

      {/* 4. Code Inspection Modal (for Premium & Preview) */}
      <ToolCodeModal
        code={item.code}
        language={item.language}
        title={item.title}
        isOpen={codeModalOpen}
        isPremium={isPremium}
        onClose={() => setCodeModalOpen(false)}
        onOpenPremiumPrompt={() => {
          setCodeModalOpen(false);
          setPremiumModalOpen(true);
        }}
      />

      {/* 5. Premium Code Lock Modal (for Free Users) */}
      <PremiumCodeLockModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
