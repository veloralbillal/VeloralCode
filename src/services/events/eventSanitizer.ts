/**
 * Sanitizes event data payloads before sending to Firebase Realtime Database.
 *
 * Firebase RTDB strictly rejects any payload containing `undefined`:
 * Error: "set failed: value argument contains undefined in property 'events.<id>.<property>'"
 *
 * - In database `set()`: Keys with `undefined` values are completely omitted.
 * - In database `update()`: Keys with `undefined` values are replaced with `null` so
 *   Firebase safely deletes the property from the remote record without throwing.
 */

export function cleanFirebasePayload<T extends Record<string, any>>(
  data: T,
  replaceUndefinedWithNull = false
): Record<string, any> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const clean: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      if (replaceUndefinedWithNull) {
        clean[key] = null;
      }
      // If not replacing with null, the property is safely omitted
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      clean[key] = cleanFirebasePayload(value, replaceUndefinedWithNull);
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Specifically cleans and validates an EventItem payload for write operations
 */
export function sanitizeEventPayload(
  raw: Record<string, any>,
  isUpdate = false
): Record<string, any> {
  const prepared: Record<string, any> = { ...raw };

  // Price sanitization
  if (prepared.price === '' || prepared.price === undefined || isNaN(Number(prepared.price))) {
    prepared.price = isUpdate ? null : undefined;
  } else {
    prepared.price = Number(prepared.price);
  }

  // DownPrice sanitization
  if (prepared.downPrice === '' || prepared.downPrice === undefined || isNaN(Number(prepared.downPrice))) {
    prepared.downPrice = isUpdate ? null : undefined;
  } else {
    prepared.downPrice = Number(prepared.downPrice);
  }

  // Ensure arrays like targetRoles don't contain undefined
  if (Array.isArray(prepared.targetRoles)) {
    prepared.targetRoles = prepared.targetRoles.filter(Boolean);
  }

  return cleanFirebasePayload(prepared, isUpdate);
}
