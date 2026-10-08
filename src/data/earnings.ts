export type Period = 'week' | 'month';

export type Bar = { label: string; amount: number };

export type Payment = {
  id: string;
  title: string;
  customer: string;
  date: string;
  /** Negative for money paid out to the technician's bank. */
  amount: number;
  /** Money that hasn't reached the wallet yet. */
  pending?: boolean;
};
