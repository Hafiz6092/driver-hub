import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const DriverChatBot = ({ shifts, currentWeatherData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hey! I'm your Driver Hub Assistant. Ask me how shifts are looking, check real-time NYC traffic status, or review your earnings targets!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    
    // Append the user's message immediately
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setLoading(true);

    // Call our own serverless endpoint — the Gemini API key lives only on
    // the server (frontend/api/assistant.js reads it from process.env), so
    // nothing sensitive is ever present in this client bundle.
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMsg,
          chatHistory: messages,
          shifts,
          currentWeatherData,
        }),
      });

      const data = await res.json();
      const botResponse = data.reply || "Sorry, I ran into an error pulling those insights. Double check your API connection and try again.";

      setMessages((prev) => [...prev, { id: Date.now() + 2, sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Assistant request failed:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: "Sorry, I couldn't reach the assistant right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-[450px] flex-col rounded-2xl border border-slate-200 bg-white shadow-md">
      {/* Header section */}
      <div className="border-b border-slate-100 px-6 py-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Driver AI Copilot</p>
        <h2 className="text-xl font-bold text-slate-800">Chat Strategy Assistant</h2>
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <FaRobot size={14} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                <FaUser size={12} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 animate-spin items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <FaRobot size={14} />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-slate-100 px-4 py-2.5 text-sm text-slate-400">
              Analyzing traffic data and weather metrics...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel block */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your hourly rates, best days, or fuel costs..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:bg-slate-300"
          disabled={!input.trim() || loading}
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </section>
  );
};

export default DriverChatBot;