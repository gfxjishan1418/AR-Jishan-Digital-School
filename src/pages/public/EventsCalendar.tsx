import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const EventsCalendar: React.FC = () => {
  const events = [
    {
      title: 'Digital AI Olympiad & Robotics Championship 2026',
      date: 'May 20, 2026',
      time: '09:00 AM - 04:00 PM',
      location: 'Central Multipurpose Auditorium',
      description: 'Annual inter-school robotics demonstration, coding marathon, and AI science fair for secondary students.',
      tag: 'Competition'
    },
    {
      title: 'Mid-Term Assessment Examination 2026 Begins',
      date: 'May 15, 2026',
      time: '08:30 AM - 11:30 AM',
      location: 'Campus Academic Blocks A & B',
      description: 'First term comprehensive assessment for junior and secondary batches following Dhaka Board standards.',
      tag: 'Examinations'
    },
    {
      title: 'Parent-Teacher Consultative Conference (Term 1)',
      date: 'May 28, 2026',
      time: '10:00 AM - 02:00 PM',
      location: 'Respective Classrooms',
      description: 'Detailed one-on-one reviews of student attendance, diagnostic report cards, and behavioral growth.',
      tag: 'Meeting'
    },
    {
      title: 'World Environment Day Tree Planting Campaign',
      date: 'June 05, 2026',
      time: '08:00 AM - 12:00 PM',
      location: 'School Botanical Garden & Dhanmondi Lake',
      description: 'Eco Club led green initiative planting 500 indigenous trees across the neighborhood.',
      tag: 'Community'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <Badge variant="blue" size="md">Academic Session 2026</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Events & Institutional Calendar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upcoming scholastic fixtures, co-curricular tournaments, and parent assemblies
        </p>
      </div>

      <div className="space-y-4">
        {events.map((ev, i) => (
          <Card key={i} className="p-6 space-y-3 border-l-4 border-l-brand-600">
            <div className="flex items-center justify-between">
              <Badge variant="emerald" size="sm">{ev.tag}</Badge>
              <span className="text-xs font-bold font-mono text-brand-700 dark:text-brand-300">
                {ev.date}
              </span>
            </div>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{ev.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ev.description}</p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {ev.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {ev.location}
              </span>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
