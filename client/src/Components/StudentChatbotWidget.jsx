import { useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

const StudentChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! Ask me about scholarships, documents, eligibility, or your application process.',
      sources: [],
    },
  ]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || sending) return;

    setInput('');
    setError('');
    setMessages((current) => [...current, { role: 'user', text: message, sources: [] }]);
    setSending(true);

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/rag/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.slice(-8).map(({ role, text }) => ({ role, text })),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.detail || 'The assistant is unavailable right now.');
      }
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: payload.answer, sources: payload.sources || [] },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <section className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-200" />
              <div>
                <h2 className="text-sm font-bold">Scholarship Assistant</h2>
                <p className="text-[10px] text-emerald-100">Grounded in portal guidance</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close scholarship assistant" className="rounded p-1 hover:bg-emerald-700">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-xs">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-lg px-3 py-2 leading-relaxed ${message.role === 'user' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <div className="flex gap-1.5">
                    <span>{message.text}</span>
                    {message.role === 'assistant' && <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />}
                  </div>
                  {message.sources.length > 0 && (
                    <p className="mt-2 border-t border-slate-300 pt-1 text-[10px] text-slate-500">
                      Source: {message.sources[0].title}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && <p className="text-[11px] text-slate-500">Searching guidance…</p>}
          </div>

          <div className="border-t border-slate-200 p-3">
            {error && <p className="mb-2 text-[11px] text-rose-700">{error}</p>}
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={500}
                placeholder="Ask a question…"
                aria-label="Ask scholarship assistant"
                className="min-w-0 flex-1 rounded border border-slate-300 px-2.5 py-2 text-xs outline-none focus:border-emerald-700"
              />
              <button type="submit" disabled={sending || !input.trim()} aria-label="Send question" className="rounded bg-emerald-700 px-3 text-white hover:bg-emerald-800 disabled:opacity-50">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ml-auto flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-800 hover:shadow-xl"
      >
        <Bot className="h-5 w-5" />
        {open ? 'Close assistant' : 'Ask assistant'}
      </button>
    </div>
  );
};

export default StudentChatbotWidget;
