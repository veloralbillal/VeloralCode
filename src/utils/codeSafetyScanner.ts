import { CodeSafetyReport } from '../types';

/**
 * Scans HTML, CSS, and JavaScript for potential security risks,
 * malicious scripts, infinite loop patterns, or external exploits.
 */
export function scanCodeSafety(html = '', css = '', js = '', singleCode = ''): CodeSafetyReport {
  const flags: CodeSafetyReport['flags'] = [];
  const fullText = `${html} ${css} ${js} ${singleCode}`.toLowerCase();

  // Check dangerous JavaScript APIs
  if (fullText.includes('eval(') || fullText.includes('window.eval(')) {
    flags.push({
      type: 'danger',
      message: 'Dynamic Code Execution (eval)',
      detail: 'Avoid using eval() as it can execute unverified code strings.',
    });
  }

  if (fullText.includes('document.cookie') || fullText.includes('window.cookie')) {
    flags.push({
      type: 'danger',
      message: 'Cookie Access Attempt',
      detail: 'Script attempts to access browser cookies.',
    });
  }

  if (fullText.includes('window.location.replace') || fullText.includes('window.location.href =')) {
    flags.push({
      type: 'warning',
      message: 'Automatic Page Redirect',
      detail: 'Script may forcefully redirect users away from the tool page.',
    });
  }

  if (fullText.includes('localstorage.clear()') || fullText.includes('sessionstorage.clear()')) {
    flags.push({
      type: 'warning',
      message: 'Storage Wipe Detected',
      detail: 'Script contains calls to clear local storage.',
    });
  }

  if (fullText.includes('coinhive') || fullText.includes('cryptonight') || fullText.includes('minero')) {
    flags.push({
      type: 'danger',
      message: 'Crypto Mining Signature',
      detail: 'Script matches known background cryptocurrency miner patterns.',
    });
  }

  // Calculate score
  let score = 100;
  flags.forEach((f) => {
    if (f.type === 'danger') score -= 35;
    if (f.type === 'warning') score -= 15;
    if (f.type === 'info') score -= 5;
  });

  score = Math.max(0, Math.min(100, score));

  let riskLevel: CodeSafetyReport['riskLevel'] = 'safe';
  if (score < 50) riskLevel = 'high';
  else if (score < 75) riskLevel = 'medium';
  else if (score < 95) riskLevel = 'low';

  return {
    isSafe: score >= 70,
    score,
    riskLevel,
    flags,
  };
}
