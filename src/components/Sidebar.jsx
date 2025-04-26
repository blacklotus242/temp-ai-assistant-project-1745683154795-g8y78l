import React, { useState } from 'react';
import { useChat, Chat } from '../contexts/ChatContext';
import { PlusCircle, MessageSquare, Edit2, Trash2, Check, X, ChevronRight, ChevronLeft } from 'lucide-react';

const ChatItem: React.FC<{ chat: Chat }> = ({ chat }) => {
  const { activeChat, setActiveChat, updateChatTitle, deleteChat } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  
  const isActive = activeChat?.id === chat.id;
  
  const handleSaveTitle = () => {
    updateChatTitle(chat.id, editTitle);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(chat.title);
      setIsEditing(false);
    }
  };
  
  return (
    <div 
      className={`flex items-center group p-2 rounded-md mb-1 cursor-pointer transition-colors duration-150 ${
        isActive ? 'bg-gray-800' : 'hover:bg-gray-800/70'
      }`}
      onClick={() => !isEditing && setActiveChat(chat)}
    >
      <MessageSquare className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
      
      {isEditing ? (
        <div className="flex items-center flex-grow">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-gray-700 text-gray-200 px-2 py-1 rounded border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveTitle();
            }}
            className="p-1 ml-1 text-green-400 hover:text-green-300"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditTitle(chat.title);
              setIsEditing(false);
            }}
            className="p-1 text-red-400 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <span className="text-gray-300 text-sm truncate flex-grow">{chat.title}</span>
          
          <div className="flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 text-gray-500 hover:text-gray-300"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="p-1 text-gray-500 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { chats, createNewChat } = useChat();
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="relative h-full">
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800 p-1 rounded-full border border-gray-700 shadow-lg hover:bg-gray-700 transition-colors"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4 text-gray-300" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-300" />
        )}
      </button>
      
      {/* Sidebar content */}
      <div 
        className={`absolute top-0 left-0 h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mt-2">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recent Chats
            </h3>
            
            {chats.length === 0 ? (
              <p className="text-gray-500 text-sm p-2">No chats yet</p>
            ) : (
              chats.map((chat) => <ChatItem key={chat.id} chat={chat} />)
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 text-center">
            Nova AI Assistant v1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;