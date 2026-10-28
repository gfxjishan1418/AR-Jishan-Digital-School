import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { Notice } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MessageSquare, Plus, Bell, Pin, Send, CheckCircle2, Search } from 'lucide-react';

export const CommunicationNotice: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>(() => StorageService.getNotices());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [broadcastFeedback, setBroadcastFeedback] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('Academic');
  const [targetAudience, setTargetAudience] = useState<Notice['targetAudience']>('All');

  const filtered = notices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      title,
      content,
      category,
      targetAudience,
      publishedDate: new Date().toISOString().split('T')[0],
      isPinned: true,
      author: 'Principal Administration',
    };

    const updated = StorageService.addNotice(newNotice);
    setNotices(updated);
    setIsAddOpen(false);
    setTitle('');
    setContent('');
  };

  const handleSimulateSmsBroadcast = () => {
    setBroadcastFeedback(true);
    setTimeout(() => setBroadcastFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.communication} & Notice Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish school announcements, urgent holiday alerts and simulate SMS broadcast to 1,248 guardians
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateSmsBroadcast}
            icon={<Send className="w-3.5 h-3.5 text-brand-600" />}
          >
            {broadcastFeedback ? 'SMS Broadcast Sent (1,248) ✓' : 'Broadcast SMS Alert'}
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Notice
          </Button>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filtered.map((n) => (
          <Card key={n.id} className="p-5 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {n.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                <Badge variant={n.category === 'Exam' ? 'blue' : n.category === 'Holiday' ? 'rose' : 'emerald'} size="sm">
                  {n.category}
                </Badge>
                <span className="text-[11px] text-slate-400 font-mono">
                  Audience: <strong>{n.targetAudience}</strong>
                </span>
              </div>

              <span className="text-xs text-slate-400 font-medium">{n.publishedDate}</span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
              {n.title}
            </h3>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {n.content}
            </p>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span>Published by: <strong>{n.author}</strong></span>
              <span className="text-emerald-600 font-medium">Delivered to Portals & Mobile app</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Notice Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Publish Official School Notice"
        maxWidth="lg"
      >
        <form onSubmit={handleAddNotice} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-sm"
              placeholder="e.g. Schedule for Science Olympiad 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Academic">Academic</option>
                <option value="Exam">Exam</option>
                <option value="Holiday">Holiday</option>
                <option value="Urgent">Urgent</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="All">All Campus</option>
                <option value="Students">Students Only</option>
                <option value="Teachers">Teachers Only</option>
                <option value="Parents">Parents Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Notice Body / Description *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed"
              placeholder="Provide full announcement details..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
