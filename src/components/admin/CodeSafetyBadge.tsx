import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { scanCodeSafety } from '../../utils/codeSafetyScanner';

interface CodeSafetyBadgeProps {
  html?: string;
  css?: string;
  js?: string;
  code?: string;
  detailed?: boolean;
}

export const CodeSafetyBadge: React.FC<CodeSafetyBadgeProps> = ({ html = '', css = '', js = '', code = '', detailed = false }) => {
  const report = scanCodeSafety(html, css, js, code);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="inline-flex flex-col gap-1.5 text-xs">
      <div
        onClick={() => detailed && setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold cursor-pointer transition ${
          report.riskLevel === 'safe'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : report.riskLevel === 'low'
            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
            : report.riskLevel === 'medium'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
        }`}
      >
        {report.riskLevel === 'safe' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
        {report.riskLevel === 'low' && <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />}
        {report.riskLevel === 'medium' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
        {report.riskLevel === 'high' && <ShieldX className="w-3.5 h-3.5 text-rose-400" />}

        <span>Safety Score: {report.score}/100</span>
        {detailed && (showDetails ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />)}
      </div>

      {detailed && showDetails && (
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300 mt-1 max-w-sm">
          <p className="font-bold text-slate-200">Security Analysis Report</p>
          {report.flags.length === 0 ? (
            <p className="text-emerald-400 text-[11px] flex items-center gap-1">
              ✓ No malicious script signatures or dangerous API calls detected.
            </p>
          ) : (
            report.flags.map((flag, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                <p className="font-semibold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {flag.message}
                </p>
                {flag.detail && <p className="text-[10px] text-slate-400">{flag.detail}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
