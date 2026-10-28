import React, { useState } from 'react';
import { StorageService } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Pin, Search, Calendar, FileText } from 'lucide-react';

export const Notices: React.FC = () => {
  const notices = StorageService.getNotices();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = notices.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="md">Official Bulletin</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Notices & Circulars
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official announcements regarding examinations, holidays, events, and academic schedules
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search circulars..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="all">All Categories</option>
              <option value="Exam">Exam Routine</option>
              <option value="Holiday">Holidays</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filtered.map((n) => (
          <Card key={n.id} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {n.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                <Badge variant="blue" size="sm">{n.category}</Badge>
              </div>
              <span className="text-xs text-slate-400 font-medium">{n.publishedDate}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{n.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.content}</p>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
              Authority: <strong>{n.author}</strong>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
