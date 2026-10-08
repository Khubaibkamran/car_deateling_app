export type NotificationType = 'booking' | 'onTheWay' | 'completed' | 'payment' | 'promo' | 'job' | 'reminder';

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Shown as written, e.g. "2m ago". */
  time: string;
  /** "Today" notifications are listed first; everything else goes under "Earlier". */
  group: 'Today' | 'Earlier';
  read: boolean;
  /** The booking this is about, if any. */
  bookingId?: number;
};
