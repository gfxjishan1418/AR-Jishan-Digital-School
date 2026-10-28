import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AIService } from '../../lib/aiService';
import { Button } from '../ui/Button';
import { Sparkles, Copy, Check, BookOpen, Clock, Download } from 'lucide-react';

export const AiLessonPlanner: React.FC = () => {
  const { t, language, isBangla } = useLanguage();
  const [topic, setTopic] = useState('Newton\'s Laws of Motion');
  const [className, setClassName] = useState('Class 9');
  const [subject, setSubject] = useState('Physics');
  const [duration, setDuration] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const plan = await AIService.generateLessonPlan({
        topic,
        className,
        subject,
        durationMinutes: duration,
        language
      });
      setGeneratedPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedPlan], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Lesson_Plan_${subject}_${className}_${topic.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'পাঠের বিষয় (Topic)' : 'Topic / Chapter Title'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. Photosynthesis, Trigonometry"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'শ্রেণি (Class)' : 'Class / Grade'}
          </label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'বিষয় (Subject)' : 'Subject'}
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="English">English</option>
            <option value="Bangla">Bangla</option>
            <option value="ICT">ICT</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isBangla ? 'ক্লাস সময়কাল (Duration)' : 'Duration'}
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value={40}>40 Minutes</option>
            <option value={45}>45 Minutes (Standard)</option>
            <option value={60}>60 Minutes (Double Period)</option>
            <option value={90}>90 Minutes (Lab Workshop)</option>
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
          {t.ai.generatePlan}
        </Button>
      </div>

      {generatedPlan && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h4 className="font-semibold text-slate-900 dark:text-white">Generated NCTB Lesson Plan</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy} icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDownload} icon={<Download className="w-3.5 h-3.5" />}>
                Export Markdown
              </Button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {generatedPlan}
          </div>
        </div>
      )}
    </div>
  );
};
