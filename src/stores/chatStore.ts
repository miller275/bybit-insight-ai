import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName?: string;
  toolResult?: any;
  createdAt: string;
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  
  // Actions
  createConversation: () => string;
  addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  setCurrentConversation: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  getCurrentMessages: () => ChatMessage[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  
  createConversation: () => {
    const id = crypto.randomUUID();
    const newConversation: Conversation = {
      id,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      conversations: [...state.conversations, newConversation],
      currentConversationId: id,
    }));
    
    return id;
  },
  
  addMessage: (conversationId, message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      ),
    }));
  },
  
  updateMessage: (conversationId, messageId, content) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, content } : msg
              ),
            }
          : conv
      ),
    }));
  },
  
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  getCurrentMessages: () => {
    const state = get();
    const conversation = state.conversations.find(
      (c) => c.id === state.currentConversationId
    );
    return conversation?.messages ?? [];
  },
}));
