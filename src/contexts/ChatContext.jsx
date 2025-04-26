import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

type ChatContextType = {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  createNewChat: () => void;
  addMessage: (content: string, sender: 'user' | 'assistant') => void;
  updateChatTitle: (chatId: string, newTitle: string) => void;
  deleteChat: (chatId: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    if (user) {
      const storedChats = localStorage.getItem('nova_chats');
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats);
        setChats(parsedChats);
        
        // Set the most recent chat as active if no active chat
        if (parsedChats.length > 0 && !activeChat) {
          setActiveChat(parsedChats[0]);
        }
      } else {
        // Create a default chat if none exist
        createNewChat();
      }
    }
  }, [user]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('nova_chats', JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    if (!activeChat) return;
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender,
      timestamp: Date.now(),
    };
    
    // Update the active chat with the new message
    const updatedActiveChat: Chat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      updatedAt: Date.now(),
    };
    
    // If this is the first user message, update the chat title
    if (sender === 'user' && activeChat.messages.length === 0) {
      const titlePreview = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      updatedActiveChat.title = titlePreview;
    }
    
    // Update the chats array
    const updatedChats = chats.map((chat) => 
      chat.id === activeChat.id ? updatedActiveChat : chat
    );
    
    setChats(updatedChats);
    setActiveChat(updatedActiveChat);
  };

  const updateChatTitle = (chatId: string, newTitle: string) => {
    const updatedChats = chats.map((chat) => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    );
    
    setChats(updatedChats);
    
    if (activeChat && activeChat.id === chatId) {
      setActiveChat({ ...activeChat, title: newTitle });
    }
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    
    // If the deleted chat was active, set the first chat as active
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(updatedChats.length > 0 ? updatedChats[0] : null);
    }
    
    // If no chats left, create a new one
    if (updatedChats.length === 0) {
      createNewChat();
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        chats, 
        activeChat, 
        setActiveChat, 
        createNewChat, 
        addMessage, 
        updateChatTitle, 
        deleteChat 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};