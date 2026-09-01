import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, MessageSquare, Star, Heart } from 'lucide-react';
import { CodeItem } from '../../types';
import { getCodeItemById, incrementCodeViewCount } from '../../services/codeService';
import { recordToolRunReward } from '../../services/toolInteractionService';
import { ToolTopBar } from '../output/ToolTopBar';
import { ToolInfoModal } from '../output/ToolInfoModal';
import { ToolCodeModal } from '../output/ToolCodeModal';
import { PremiumCodeLockModal } from '../output/PremiumCodeLockModal';
import { FullScreenToolCanvas } from '../output/FullScreenToolCanvas';
import { TipCreatorModal } from '../output/TipCreatorModal';
import { EmbedShareModal } from '../output/EmbedShareModal';
import { ToolConsoleDrawer } from '../output/ToolConsoleDrawer';
import { CreatorRemixModal } from '../creator/CreatorRemixModal';
import { ToolReviewsSection } from '../output/ToolReviewsSection';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface CodeDetailsProps {
  codeId: string;
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const CodeDetails: React.FC<CodeDetailsProps> = ({ codeId, onBack, onNavigate }) => {
  const { showToast } = useToast();
  const { isPremium, currentUser } = useAuth();

  const [item, setItem] = useState<CodeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tool Controls
  const [reloadKey, setReloadKey] = useState(0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Console Logs
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: 'log' | 'warn' | 'error' | 'info'; message: string; timestamp: number }>>([]);

  // Modals & Drawers
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [remixModalOpen, setRemixModalOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

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
          // Increment views & record creator run reward
          incrementCodeViewCount(codeId).catch(() => {});
          if (data.creatorUid) {
            recordToolRunReward(codeId, data.creatorUid).catch(() => {});
          }
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

  // Listen to messages from child iframe runner for live console logging
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'LOG') {
        setLogs((prev) => [
          ...prev,
          {
            type: 'log',
            message: typeof e.data.data === 'string' ? e.data.data : JSON.stringify(e.data.data),
            timestamp: Date.now(),
          },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
        item={item}
        deviceMode={deviceMode}
        isPremium={isPremium}
        setDeviceMode={setDeviceMode}
        onBack={onBack}
        onReload={() => {
          setReloadKey((k) => k + 1);
          setLogs((prev) => [...prev, { type: 'info', message: 'Reloading sandbox environment...', timestamp: Date.now() }]);
        }}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenInfo={() => setInfoModalOpen(true)}
        onOpenCode={handleOpenCode}
        onShare={() => setShareModalOpen(true)}
        onOpenTip={() => setTipModalOpen(true)}
        onOpenRemix={() => setRemixModalOpen(true)}
        onToggleConsole={() => setConsoleOpen(!consoleOpen)}
        consoleOpen={consoleOpen}
        logCount={logs.length}
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

        {/* Floating Reviews / Feedback Trigger at bottom right */}
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setReviewsOpen(!reviewsOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold shadow-xl backdrop-blur-md transition hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Community Reviews & Ratings</span>
            {item.ratingsCount ? (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                ★ {item.averageRating || 5.0} ({item.ratingsCount})
              </span>
            ) : null}
          </button>
        </div>

        {/* Console Drawer */}
        <ToolConsoleDrawer
          logs={logs}
          isOpen={consoleOpen}
          onToggle={() => setConsoleOpen(!consoleOpen)}
          onClear={() => setLogs([])}
        />

        {/* Reviews Slide-out Drawer */}
        {reviewsOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-950/95 border-l border-slate-800 shadow-2xl z-40 p-5 overflow-y-auto backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Ratings & Comments</span>
              </h3>
              <button
                onClick={() => setReviewsOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-900 rounded-lg"
              >
                Close
              </button>
            </div>
            <ToolReviewsSection codeId={item.id || ''} />
          </div>
        )}
      </main>

      {/* 3. Info Details Modal */}
      <ToolInfoModal
        item={item}
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        onOpenCode={handleOpenCode}
        onNavigate={onNavigate}
        onOpenTip={() => setTipModalOpen(true)}
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

      {/* 6. Tip Creator Modal */}
      {tipModalOpen && (
        <TipCreatorModal
          codeId={item.id || ''}
          toolTitle={item.title}
          creatorUid={item.creatorUid}
          creatorName={item.creatorName}
          creatorEmail={item.creatorEmail || item.createdBy}
          isOpen={tipModalOpen}
          onClose={() => setTipModalOpen(false)}
          onSuccess={() => {
            showToast('Thank you for supporting this creator!', 'success');
          }}
        />
      )}

      {/* 7. Embed & Share Modal */}
      <EmbedShareModal
        codeId={item.id || ''}
        toolTitle={item.title}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* 8. Remix / Fork Tool Modal */}
      {remixModalOpen && (
        <CreatorRemixModal
          code={item}
          isOpen={remixModalOpen}
          onClose={() => setRemixModalOpen(false)}
          onConfirmRemix={(codeToRemix) => {
            setRemixModalOpen(false);
            sessionStorage.setItem('remix_base_tool', JSON.stringify(codeToRemix));
            onNavigate('#/creator/upload');
          }}
        />
      )}
    </div>
  );
};
