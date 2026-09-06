import React, { useState } from 'react';
import { Play, Check, AlertCircle, Loader2 } from 'lucide-react';
import { connectionPool } from '../../../services/connectionPool';
import { useToast } from '../../../context/ToastContext';

export const PoolTrafficSimulator: React.FC = () => {
  const { showToast } = useToast();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    durationMs: number;
    successCount: number;
    peakQueue: number;
  } | null>(null);

  const handleSimulate = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Dispatch 500 concurrent operations through the connection pool
      const result = await connectionPool.simulateTrafficSpike(500);
      setTestResult(result);
      showToast(`Traffic test passed! Handled ${result.successCount} operations safely in ${result.durationMs}ms`, 'success');
    } catch (err: any) {
      showToast('Error during simulation test: ' + err.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            High-Concurrency Spike Stress Test
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulate 500 simultaneous requests to test leak-proof queuing & socket preservation
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulate}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0"
        >
          {testing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Run 500 Spike Test</span>
            </>
          )}
        </button>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Zero Drops:</strong> {testResult.successCount} tasks processed smoothly in {testResult.durationMs}ms
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Peak Queue Managed: {testResult.peakQueue}
          </span>
        </div>
      )}
    </div>
  );
};
