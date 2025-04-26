import { useState, useRef, useEffect } from 'react';
import { fetchFromOpenAI } from '../api/openaiApi';
import ChatMessage from '../components/ChatMessage';
import { saveChatMessage } from '../services/db';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [language, setLanguage] = useState('en-US');
  const messagesEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user', content: newMessage, userId: 'current-user' };
    saveChatMessage(userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    const aiResponse = await fetchFromOpenAI(newMessage);
    const aiMessage = { role: 'assistant', content: aiResponse.choices[0].message.content, userId: 'current-user' };
    saveChatMessage(aiMessage);
    setMessages((prev) => [...prev, aiMessage]);

    speak(aiMessage.content);
  };

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 flex flex-col gap-2 border-t">
        <div className="flex gap-2 items-center">
          <button type="button" onClick={startListening} className="bg-green-500 text-white px-4 py-2 rounded">
            🎤 Speak
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="fr-FR">French (France)</option>
            <option value="de-DE">German (Germany)</option>
            <option value="it-IT">Italian (Italy)</option>
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Type or speak your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}