
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition, speakText } from './ChatInterface';

const ChatInterface = () => {
  const { activeChat, addMessage } = useChat();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const { startListening, stopListening } = useSpeechRecognition((transcript) => {
    setInput(transcript);
    handleSend(transcript);
  });

  const handleSend = (messageText) => {
    if (!messageText.trim()) return;
    addMessage({ role: 'user', content: messageText });
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeakingEnabled(!isSpeakingEnabled);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat]);

  useEffect(() => {
    if (!isSpeakingEnabled) return;
    const lastMessage = activeChat?.messages?.slice(-1)[0];
    if (lastMessage?.role === 'assistant') {
      speakText(lastMessage.content);
    }
  }, [activeChat, isSpeakingEnabled]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat?.messages?.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 border-t">
        <button type="button" onClick={toggleListening} className="mr-2">
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <button type="button" onClick={toggleSpeaking} className="mr-2">
          {isSpeakingEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
        <input
          className="flex-1 border rounded px-4 py-2 mr-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or speak your message..."
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

// --- Simple Speech Recognition + Text-to-Speech Hooks ---

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function useSpeechRecognition(onResult) {
  useEffect(() => {
    if (!recognition) return;
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }, [onResult]);
  
  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return { startListening, stopListening };
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis not supported");
  }
}
