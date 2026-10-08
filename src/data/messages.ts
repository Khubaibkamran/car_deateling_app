import { ImageSourcePropType } from 'react-native';

export type ChatMessage = {
  id: string;
  from: 'me' | 'them';
  text: string;
  /** Shown as written, e.g. "10:42 AM". */
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  /** The other person's photo; falls back to their initial when missing. */
  photo?: ImageSourcePropType;
  subtitle: string;
  unread: number;
  messages: ChatMessage[];
};
