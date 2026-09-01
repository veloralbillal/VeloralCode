/**
 * User and Creator Name Formatting Utilities
 * Guarantees privacy: No raw email addresses are ever shown publicly.
 */

/**
 * Format creator or user display name without exposing their Gmail / Email
 */
export function formatCreatorName(
  name?: string | null,
  email?: string | null,
  fallback = 'Creator'
): string {
  // 1. If explicit name is provided and doesn't look like a raw email
  if (name && name.trim()) {
    const cleanName = name.trim();
    if (!cleanName.includes('@') && !cleanName.includes('.com')) {
      return cleanName;
    }
    // If name is accidentally set to an email, extract prefix
    const usernamePart = cleanName.split('@')[0].trim();
    if (usernamePart) {
      return usernamePart;
    }
  }

  // 2. If only email is provided, NEVER display @gmail.com or the domain
  if (email && email.trim()) {
    const cleanEmail = email.trim();
    const parts = cleanEmail.split('@');
    if (parts.length > 0 && parts[0]) {
      return parts[0];
    }
  }

  return fallback;
}

/**
 * Mask an email for sensitive admin logs if needed (e.g., b***5@gmail.com)
 */
export function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return 'Confidential';
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }
  const first = username[0];
  const last = username[username.length - 1];
  return `${first}${'*'.repeat(Math.min(username.length - 2, 4))}${last}@${domain}`;
}

/**
 * Clean initials for avatar fallback (e.g. "Billal Hossain" -> "BH")
 */
export function getInitials(name?: string | null, fallback = 'CR'): string {
  const displayName = formatCreatorName(name, null, fallback);
  const words = displayName.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase() || fallback;
}
