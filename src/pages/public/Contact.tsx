import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const { school } = useSchool();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="md">Get in Touch</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Contact Campus Admissions Office
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          We welcome inquiries from prospective families, visitors, and educational partners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Information (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Campus Information</h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Campus Address</p>
                  <p className="text-slate-500">{school.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Phone & Hotline</p>
                  <p className="text-slate-500">{school.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Address</p>
                  <p className="text-slate-500">{school.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Visiting Hours</p>
                  <p className="text-slate-500">Sunday - Thursday: 08:00 AM - 04:00 PM</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs">
            <p className="font-bold text-brand-800 dark:text-brand-300">Educational Institute Details:</p>
            <p className="text-brand-700 dark:text-brand-400 mt-0.5">EIIN: {school.eiinNumber} • Affiliated with {school.board}</p>
          </Card>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-8">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Send an Inquiry</h3>

            {sent ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Thank You for Reaching Out!</h4>
                <p className="text-xs text-slate-500">
                  Our admissions office has received your message and will contact you via phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="e.g. Tareq Ahmed"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="+880 1711-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Your Message / Query *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                    placeholder="Please specify student class interest, syllabus questions, or campus visit request..."
                  />
                </div>

                <Button type="submit" variant="primary" size="md" icon={<Send className="w-4 h-4" />}>
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};
