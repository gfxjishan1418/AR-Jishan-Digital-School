import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AIService, AiChatMessage } from '../../lib/aiService';
import { Bot, Send, Sparkles, X, User, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { t, language, isBangla } = useLanguage();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      content: isBangla 
        ? 'আসসালামু আলাইকুম! আমি এআর জিশান ডিজিটাল স্কুল অ্যান্ড কলেজের নোভা এআই সহকারী। পাঠ পরিকল্পনা তৈরি, পরীক্ষার প্রশ্ন প্রণয়ন, সিলেবাসের জটিল বিষয় সহজভাবে বোঝা অথবা স্কুল প্রশাসনের তথ্য জানতে আমাকে প্রশ্ন করতে পারেন।'
        : "Hello! I'm Nova AI, your AR Jishan Digital School & College Assistant. How can I help you today? I can explain lessons, help draft NCTB curriculum lesson plans, prepare quizzes, or analyze school operational statistics.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = isBangla ? [
    '১০ম শ্রেণির ত্রিকোণমিতির ওপর ৪৫ মিনিটের লেসন প্ল্যান তৈরি করো',
    'বকেয়া ফি আদায়ে অভিভাবকদের জন্য একটি নম্র এসএমএস ড্রাফট করো',
    '৯ম শ্রেণির পদার্থবিজ্ঞানের গতি অধ্যায়ের ৫টি এমসিকিউ প্রশ্ন দাও',
    'অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশের নোটিশ তৈরি করো'
  ] : [
    'Create a 45-min lesson plan on Photosynthesis for Class 9',
    'Draft a polite SMS reminder to parents for pending tuition fee',
    'Generate 5 conceptual MCQs on Quadratic Equations with answer keys',
    'Write an official notice for Upcoming Science Olympiad 2026'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: AiChatMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await AIService.chatWithTutor(query, messages, language);
      const botMsg: AiChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-xl h-[85vh] sm:h-[680px] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-200">
        
        {/* Header */}
        <div className="p-4 px-6 bg-gradient-to-r from-brand-700 via-brand-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-wide">Nova AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-400/20 text-brand-200 border border-brand-300/30">
                  {AIService.isConfigured() ? 'Gemini Live' : 'Education Engine'}
                </span>
              </div>
              <p className="text-xs text-brand-100/80">AR Jishan Digital School & College • Smart Education Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs relative group ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700'
              }`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className={`text-[10px] mt-1.5 flex items-center justify-between ${m.role === 'user' ? 'text-brand-100' : 'text-slate-400'}`}>
                  <span>{m.timestamp}</span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(m.content, idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-brand-600 dark:hover:text-brand-400"
                      title="Copy content"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs italic">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">Nova AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length < 3 && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-2 no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3 h-3 inline mr-1 text-brand-500" />
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.ai.askAnything}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || isLoading}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
