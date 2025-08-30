export interface MessageThread {
  threadId: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  attachments?: MessageAttachment[];
  read: boolean;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  name: string;
  size: number;
}