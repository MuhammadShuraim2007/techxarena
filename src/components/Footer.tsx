import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, Award, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import logoImg from '../assets/images/techx_academy_logo_1784655126257.jpg';

interface FooterProps {
  onNavigateTab: (tab: 'home' | 'hackathons' | 'lookup' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-[#0A0A0B] border-t border-white/10 text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Tech X Arena & Academy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoImg} 
                alt="Tech X Logo" 
                className="w-10 h-10 rounded-lg object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-lg text-white tracking-tight">TECH X <span className="text-cyan-400">ARENA</span></h3>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Powered by Tech X Academy</p>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Karachi’s premier competitive hackathon arena and tech hub. Empowering students, FIT enrollees, and creators to build production-grade projects, graphic design art, and software solutions.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-cyan-400">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Official Program: <strong>FIT (Foundation In IT)</strong></span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('hackathons')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  Active Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('lookup')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  Download Hackathon Pass / ID Card
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('admin')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  Admin Organizer Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Academy Contact</h4>
            <ul className="space-y-2.5 text-xs text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Tech X Academy Campus, Karachi, Sindh, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="https://wa.me/923272979729" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  WhatsApp: +92 327 2979729
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Phone: +92 327 2979729</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>techxacademypk@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: FIT Course Announcement */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Enrollment Spotlight
            </div>
            <h5 className="font-bold text-sm text-white">Foundation In IT (FIT)</h5>
            <p className="text-xs text-white/60 leading-relaxed">
              Master web development, graphic design, modern IT fundamentals, and AI workflows with Tech X Academy Karachi.
            </p>
            <a 
              href="https://wa.me/923272979729?text=Hi%20Tech%20X%20Academy!%20I%20want%20information%20about%20the%20FIT%20Course."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-md"
            >
              Inquire About FIT Course
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/30 uppercase tracking-[0.2em] gap-4">
          <p>© {new Date().getFullYear()} Tech X Arena • Tech X Academy Karachi</p>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">Karachi, Pakistan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
