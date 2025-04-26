import React from 'react';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import { ChatProvider } from '../contexts/ChatContext';

const Dashboard: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-900">
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <ChatInterface />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Dashboard;