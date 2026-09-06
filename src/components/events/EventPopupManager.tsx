import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types/event';
import { subscribeToActiveEvents } from '../../services/eventService';
import { EventPopupModal } from './EventPopupModal';
import { isEventTargetedToUser } from './popup/audienceHelper';
import { useAuth } from '../../context/AuthContext';

interface EventPopupManagerProps {
  onNavigate?: (tab: string) => void;
}

export const EventPopupManager: React.FC<EventPopupManagerProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, isAdmin, isSeller, isCreator } = useAuth();
  const [popupEvent, setPopupEvent] = useState<EventItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToActiveEvents((events) => {
      // Find events marked as popup and active
      const activePopup = events.find((e) => {
        if (!e.isPopup || e.status !== 'active') return false;
        // Verify target audience for user, creator, seller, or all
        return isEventTargetedToUser(e, {
          currentUser,
          userProfile,
          isAdmin,
          isSeller,
          isCreator,
        });
      });

      if (activePopup) {
        const isDismissed = sessionStorage.getItem(`dismissed_popup_${activePopup.id}`);
        if (!isDismissed) {
          setPopupEvent(activePopup);
          setIsOpen(true);
        }
      } else {
        setPopupEvent(null);
        setIsOpen(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser, userProfile, isAdmin, isSeller, isCreator]);

  if (!isOpen || !popupEvent) return null;

  return (
    <EventPopupModal
      isOpen={isOpen}
      event={popupEvent}
      onClose={() => setIsOpen(false)}
      onNavigate={onNavigate}
    />
  );
};
