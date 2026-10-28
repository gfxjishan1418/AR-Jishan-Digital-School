import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AIService } from '../../lib/aiService';
import { Button } from '../ui/Button';
import { Sparkles, Copy, Check, HelpCircle, Download } from 'lucide-react';

export const AiQuizGenerator: React.FC = () => {
  const { t, language, isBangla } = useLanguage();
  const [topic, setTopic] = useState('Organic Chemistry & Carbon Compounds');
  const [className, setClassName] = useState('Class 10');
  const [subject, setSubject] = useState('Chemistry');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const quiz = await AIService.generateQuiz({
        subject,
        className,
        topic,
        questionCount: count,
        difficulty,
        language
      });
      setGeneratedQuiz(quiz);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedQuiz);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'অধ্যায় বা বিষয় (Topic)' : 'Topic / Chapter Title'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'শ্রেণি (Class)' : 'Class'}
          </label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'প্রশ্নের সংখ্যা' : 'Question Count'}
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value={3}>3 MCQs</option>
            <option value={5}>5 MCQs</option>
            <option value={10}>10 MCQs</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'কাঠিন্যের মাত্রা' : 'Difficulty'}
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value="easy">Easy (সহজ)</option>
            <option value="medium">Medium (মধ্যম)</option>
            <option value="hard">Hard (উন্নত)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          variant="primary"
          icon={<Sparkles className="w-4 h-4" />}
        >
          {t.ai.generateQuestions}
        </Button>
      </div>

      {generatedQuiz && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-electric-600" />
              <h4 className="font-semibold text-slate-900 dark:text-white">Generated Exam Question Bank</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy} icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {generatedQuiz}
          </div>
        </div>
      )}
    </div>
  );
};
