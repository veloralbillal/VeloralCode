import { EventItem, TargetRole } from '../../../types/event';

export interface UserRoleContext {
  currentUser: any;
  userProfile: any;
  isAdmin: boolean;
  isSeller: boolean;
  isCreator: boolean;
}

/**
 * Validates if the active warning popup is targeted for the current visitor or logged-in account
 */
export function isEventTargetedToUser(event: EventItem, context: UserRoleContext): boolean {
  const roles: TargetRole[] = event.targetRoles && event.targetRoles.length > 0
    ? event.targetRoles
    : ['all'];

  // If 'all' is in the target roles, everyone can see this popup
  if (roles.includes('all')) {
    return true;
  }

  const { isAdmin, isSeller, isCreator, userProfile } = context;

  // Administrators always have preview visibility
  if (isAdmin) {
    return true;
  }

  // Seller account target check
  if (roles.includes('seller') && isSeller) {
    return true;
  }

  // Creator account target check
  if (roles.includes('creator') && (isCreator || userProfile?.role === 'creator')) {
    return true;
  }

  // Regular user / visitor target check
  if (roles.includes('user')) {
    if (!isSeller && !isCreator && (!userProfile?.role || userProfile?.role === 'user')) {
      return true;
    }
  }

  return false;
}
