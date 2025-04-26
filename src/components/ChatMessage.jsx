export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={\`flex \${isUser ? 'justify-end' : 'justify-start'} mb-2\`}>
      <div className={\`max-w-xs p-3 rounded-lg \${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}\`}>
        {content}
      </div>
    </div>
  );
}