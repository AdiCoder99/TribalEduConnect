import { useState } from 'react';
import { Bot, Send, Sparkles, UserRound } from 'lucide-react';

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

const starterQuestions = [
  'Which documents do I need?',
  'What is the National Overseas Scholarship?',
  'How do I check my application status?',
];

const StudentChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I can answer questions about scholarship eligibility, documents, schemes, and the application process using the published portal guidance.',
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (event, suggestedMessage = '') => {
    event?.preventDefault();
    const message = (suggestedMessage || input).trim();
    if (!message || sending) return;

    setInput('');
    setError('');
    setMessages((current) => [...current, { role: 'user', text: message, sources: [] }]);
    setSending(true);

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/rag/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.detail || payload.error || 'The guidance service could not answer right now.');
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
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-5xl flex-col gap-5">
      <header className="bg-emerald-800 p-5 text-white shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-950 p-2"><Bot className="h-6 w-6 text-emerald-200" /></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Student guidance</span>
            <h1 className="mt-1 text-xl font-bold">Ask the scholarship assistant</h1>
            <p className="mt-1 max-w-2xl text-xs text-emerald-100">Answers are retrieved from the portal knowledge base and include their source topics. The assistant does not replace an official eligibility decision.</p>
          </div>
        </div>
      </header>

      <section className="flex flex-1 flex-col overflow-hidden border border-slate-200 bg-white shadow-2xs">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 h-fit rounded-full bg-emerald-100 p-2 text-emerald-800"><Bot className="h-4 w-4" /></div>}
              <div className={`max-w-3xl rounded-lg px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-800'}`}>
                <div className="flex items-start gap-2"><span>{message.text}</span>{message.role === 'assistant' && <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />}</div>
                {message.sources.length > 0 && <div className="mt-3 border-t border-slate-300 pt-2 text-[11px] text-slate-500"><strong>Sources:</strong> {message.sources.map((source) => source.title).join(' · ')}</div>}
              </div>
              {message.role === 'user' && <div className="mt-1 h-fit rounded-full bg-slate-200 p-2 text-slate-600"><UserRound className="h-4 w-4" /></div>}
            </div>
          ))}
          {sending && <div className="text-xs text-slate-500">Searching the scholarship guidance…</div>}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {starterQuestions.map((question) => <button key={question} type="button" onClick={(event) => sendMessage(event, question)} className="border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100">{question}</button>)}
          </div>
          {error && <p role="alert" className="mb-2 text-xs text-rose-700">{error} Make sure the AI service is running and VITE_AI_SERVICE_URL is configured.</p>}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={500} placeholder="Ask about scholarships, documents, or your application…" className="min-w-0 flex-1 border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700" />
            <button type="submit" disabled={sending || !input.trim()} className="inline-flex items-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /> Ask</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StudentChatbot;
