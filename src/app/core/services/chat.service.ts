import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { MessageThread, Message } from '../models';
import { AuthService } from './auth.service';

export interface SendMessageRequest {
  threadId: string;
  toUserId: string;
  text: string;
  attachments?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  private _threads = signal<MessageThread[]>([]);
  private _messages = signal<Record<string, Message[]>>({});
  private _loading = signal<boolean>(false);
  
  readonly threads = computed(() => this._threads());
  readonly userThreads = computed(() => {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return [];
    
    return this._threads().filter(thread => 
      thread.participants.includes(currentUser.id)
    );
  });
  readonly loading = computed(() => this._loading());
  
  constructor() {
    this.loadChats();
  }
  
  private loadChats() {
    this._loading.set(true);
    
    this.http.get<any[]>('assets/data/chats.json').pipe(
      tap(chats => {
        const threads: MessageThread[] = [];
        const messages: Record<string, Message[]> = {};
        
        chats.forEach(chat => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const unreadCount = chat.messages.filter((m: Message) => 
            !m.read && m.toUserId === this.authService.currentUser()?.id
          ).length;
          
          threads.push({
            threadId: chat.threadId,
            participants: chat.participants,
            lastMessage,
            unreadCount,
            createdAt: chat.messages[0]?.sentAt || new Date().toISOString(),
            updatedAt: lastMessage.sentAt
          });
          
          messages[chat.threadId] = chat.messages;
        });
        
        this._threads.set(threads);
        this._messages.set(messages);
        this._loading.set(false);
      })
    ).subscribe();
  }
  
  getThreadMessages(threadId: string): Observable<Message[]> {
    return new Observable(observer => {
      const messages = this._messages()[threadId] || [];
      observer.next(messages);
      observer.complete();
    });
  }
  
  sendMessage(request: SendMessageRequest): Observable<Message> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to send messages');
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      threadId: request.threadId,
      fromUserId: currentUser.id,
      toUserId: request.toUserId,
      text: request.text,
      read: false,
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString()
    };
    
    return of(newMessage).pipe(
      tap(message => {
        // Add message to thread
        const currentMessages = this._messages();
        const threadMessages = currentMessages[request.threadId] || [];
        currentMessages[request.threadId] = [...threadMessages, message];
        this._messages.set({ ...currentMessages });
        
        // Update thread with new last message
        const currentThreads = this._threads();
        const threadIndex = currentThreads.findIndex(t => t.threadId === request.threadId);
        
        if (threadIndex >= 0) {
          currentThreads[threadIndex] = {
            ...currentThreads[threadIndex],
            lastMessage: message,
            updatedAt: message.sentAt
          };
          this._threads.set([...currentThreads]);
        }
      })
    );
  }
  
  createThread(participantId: string): Observable<MessageThread> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to create threads');
    }
    
    const threadId = `thread-${Date.now()}`;
    const newThread: MessageThread = {
      threadId,
      participants: [currentUser.id, participantId],
      lastMessage: {} as Message, // Will be set when first message is sent
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return of(newThread).pipe(
      tap(thread => {
        const current = this._threads();
        this._threads.set([...current, thread]);
        
        // Initialize empty message array for this thread
        const currentMessages = this._messages();
        currentMessages[threadId] = [];
        this._messages.set({ ...currentMessages });
      })
    );
  }
  
  markMessageAsRead(messageId: string): Observable<void> {
    return of(void 0).pipe(
      tap(() => {
        const currentMessages = this._messages();
        
        Object.keys(currentMessages).forEach(threadId => {
          const messages = currentMessages[threadId];
          const messageIndex = messages.findIndex(m => m.id === messageId);
          
          if (messageIndex >= 0) {
            messages[messageIndex] = {
              ...messages[messageIndex],
              read: true,
              readAt: new Date().toISOString()
            };
            
            // Update unread count in thread
            const currentThreads = this._threads();
            const threadIndex = currentThreads.findIndex(t => t.threadId === threadId);
            
            if (threadIndex >= 0) {
              const unreadCount = messages.filter(m => 
                !m.read && m.toUserId === this.authService.currentUser()?.id
              ).length;
              
              currentThreads[threadIndex] = {
                ...currentThreads[threadIndex],
                unreadCount
              };
              this._threads.set([...currentThreads]);
            }
          }
        });
        
        this._messages.set({ ...currentMessages });
      })
    );
  }
  
  getUnreadMessagesCount(): Observable<number> {
    return new Observable(observer => {
      const currentUser = this.authService.currentUser();
      if (!currentUser) {
        observer.next(0);
        observer.complete();
        return;
      }
      
      let totalUnread = 0;
      const messages = this._messages();
      
      Object.values(messages).forEach(threadMessages => {
        totalUnread += threadMessages.filter(m => 
          !m.read && m.toUserId === currentUser.id
        ).length;
      });
      
      observer.next(totalUnread);
      observer.complete();
    });
  }
  
  searchMessages(query: string): Observable<Message[]> {
    return new Observable(observer => {
      const allMessages: Message[] = [];
      const messages = this._messages();
      
      Object.values(messages).forEach(threadMessages => {
        allMessages.push(...threadMessages);
      });
      
      const filtered = allMessages.filter(message =>
        message.text.toLowerCase().includes(query.toLowerCase())
      );
      
      observer.next(filtered);
      observer.complete();
    });
  }
}