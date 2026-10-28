import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { t, isBangla } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="AR Jishan Digital School & College"
                className="w-12 h-12 rounded-xl object-contain bg-white p-0.5 ring-2 ring-brand-500/50"
              />
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  {t.brandName}
                </span>
                <p className="text-xs text-brand-400 font-medium">{t.tagline}</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {isBangla 
                ? 'বাংলাদেশের শিক্ষা ব্যবস্থাকে আধুনিকায়ন ও ডিজিটাল রূপান্তরের লক্ষ্যে নির্মিত এআই-পাওয়ার্ড সমন্বিত স্মার্ট এডুকেশন ম্যানেজমেন্ট প্ল্যাটফর্ম।'
                : 'A next-generation AI-powered School Management SaaS designed specifically for educational institutions across Bangladesh. Automating administration, grading, and digital learning.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>EIIN: 134892 • Dhaka Education Board & NCTB Approved</span>
            </div>
          </div>

          {/* Academic Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isBangla ? 'শিক্ষা কার্যক্রম' : 'Academic Programs'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Junior Secondary (Class 6-8)</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Secondary SSC (Class 9-10)</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Science & STEM Lab</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">AI & Robotics Olympiad</button></li>
              <li><button onClick={() => onNavigate('events')} className="hover:text-white transition-colors">Academic Calendar 2026</button></li>
            </ul>
          </div>

          {/* Portals & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isBangla ? 'অনলাইন সেবাসমূহ' : 'Online Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onNavigate('apply')} className="hover:text-white transition-colors">Apply for Admission</button></li>
              <li><button onClick={() => onNavigate('track')} className="hover:text-white transition-colors">Track Application Status</button></li>
              <li><button onClick={() => onNavigate('results')} className="hover:text-white transition-colors">Board & Term Result Lookup</button></li>
              <li><button onClick={() => onNavigate('notices')} className="hover:text-white transition-colors">Official Notice Board</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy & Data Protection</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isBangla ? 'যোগাযোগ' : 'Campus Office'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+880 1711-234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>info@arjishandigitalschool.edu.bd</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Digital Payment Gateways:</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-pink-900/60 text-pink-300 font-bold text-[10px] border border-pink-700/50">bKash</span>
                <span className="px-2 py-0.5 rounded-md bg-orange-900/60 text-orange-300 font-bold text-[10px] border border-orange-700/50">Nagad</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 font-bold text-[10px] border border-purple-700/50">Rocket</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 font-bold text-[10px] border border-blue-700/50">VISA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AR Jishan Digital School & College. All Rights Reserved. Built for Smart Bangladesh 2041.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-400">Terms of Service</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-400">Privacy Policy</button>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Education
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
