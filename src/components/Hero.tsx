import React, { useState, useEffect } from 'react';
import { Trophy, Users, ShieldCheck, Zap, Sparkles, ArrowRight, Play, Clock, Code2 } from 'lucide-react';
import heroBgImg from '../assets/images/hackathon_hero_bg_1784655148853.jpg';
import logoImg from '../assets/images/techx_academy_logo_1784655126257.jpg';
import posterImg from '../assets/images/aghaaz26_poster_1784702908845.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onApplyClick: () => void;
  onLookupClick: () => void;
  totalHackathons: number;
  totalParticipants: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onApplyClick,
  onLookupClick,
  totalHackathons,
  totalParticipants
}) => {
  // Live Countdown state for Graphic Design Hackathon - Aghaaz '26 (Aug 1, 2026)
  const targetDate = new Date('2026-08-01T09:00:00Z').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-[#0A0A0B] text-white overflow-hidden py-12 lg:py-20 border-b border-white/10">
      
      {/* Background Hero Asset & Overlays */}
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
        <img 
          src={heroBgImg} 
          alt="Hackathon Arena Hero Background" 
          className="w-full h-full object-cover filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-xs font-medium text-cyan-400 backdrop-blur-md">
            <img 
              src={logoImg} 
              alt="Tech X Logo" 
              className="w-4 h-4 rounded object-cover border border-cyan-400/30"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold tracking-widest uppercase">Tech X Academy Karachi</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70">Next Event: 1st August 2026</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Aghaaz '26 Registration Live</span>
          </div>
        </div>

        {/* Main Split Grid Layout matching design structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Typography & Slogan */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
              Inaugural Graphic Design Challenge
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-light leading-[0.95] tracking-tight text-white">
              Graphic Design <br/>
              <span className="font-black italic text-cyan-400">Aghaaz '26</span> <br/>
              Hackathon.
            </h1>

            <p className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
              <strong>Ideas Meet Creativity.</strong> The ultimate visual design competition hosted by Tech X Academy Karachi. Build stunning brand identities, posters, and digital art.
            </p>

            {/* Event Highlights Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-white/80">
              <span className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg font-bold">
                Date & Timing: <strong>1st August • 3:00 PM to 5:00 PM</strong>
              </span>
              <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg font-bold">
                Results: <strong>Announcement at 6:00 PM</strong>
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg font-bold">
                Prize: <strong>PKR 5,000 Cash + Graphic Design Internship</strong>
              </span>
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white">
                JazzCash: <strong>03212260509 (Title: Muhammad Sufiyan)</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={onApplyClick}
                className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Register For Aghaaz '26
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 text-cyan-400" />
                View All Events
              </button>

              <button
                onClick={onLookupClick}
                className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 font-medium rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                My Pass / ID
              </button>
            </div>
          </div>

          {/* Right Column: Featured Hackathon Poster Card & Live Countdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] rounded border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Registration Open
                </span>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  Featured Competition
                </span>
              </div>

              {/* Poster Image */}
              <div className="rounded-2xl overflow-hidden border border-white/10 mb-4 bg-black aspect-video relative group">
                <img 
                  src={posterImg}
                  alt="Aghaaz '26 Graphic Design Hackathon Poster" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">Graphic Design Hackathon - Aghaaz '26</h3>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                Create. Compete. Inspire. Show your visual art mastery at Tech X Academy Karachi.
              </p>

              <div className="space-y-2 mb-6 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Event Timing</span>
                  <span className="font-bold text-cyan-300">1st August • 3:00 PM to 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Registration Deadline</span>
                  <span className="font-bold text-rose-300">31st July • 11:59 PM Midnight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Result Announcement</span>
                  <span className="font-bold text-amber-300">6:00 PM Sharp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Winning Award</span>
                  <span className="font-extrabold text-emerald-400">PKR 5,000 Cash + Graphic Design Internship Offer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">JazzCash Payment</span>
                  <span className="font-mono text-cyan-300">03212260509 (Title: Muhammad Sufiyan)</span>
                </div>
                <div className="flex flex-col gap-1 pt-1 border-t border-white/5">
                  <span className="text-white/40 font-semibold">Venue Location</span>
                  <span className="font-medium text-white text-[11px]">
                    New Karachi Ikhwan Masjid
                  </span>
                  <div className="text-[10px] text-slate-300 space-y-0.5">
                    <div>• Females: 1st Floor Ikhwan Masjid Hall</div>
                    <div>• Males: Ground Floor Ikhwan Digital Lab</div>
                  </div>
                </div>
              </div>

              {/* Countdown Grid */}
              <div className="bg-black/80 border border-white/10 rounded-2xl p-4 mb-6">
                <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest mb-2 flex items-center justify-between">
                  <span>Countdown to 1st August</span>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-lg font-bold text-cyan-400">{timeLeft.days}</div>
                    <div className="text-[9px] uppercase text-white/40">Days</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-lg font-bold text-cyan-400">{timeLeft.hours}</div>
                    <div className="text-[9px] uppercase text-white/40">Hours</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-lg font-bold text-cyan-400">{timeLeft.minutes}</div>
                    <div className="text-[9px] uppercase text-white/40">Mins</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-lg font-bold text-cyan-400">{timeLeft.seconds}</div>
                    <div className="text-[9px] uppercase text-white/40">Secs</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onApplyClick}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-colors"
              >
                Apply Now • PKR 200
              </button>
            </div>
          </div>

        </div>

        {/* Statistics Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold mb-1">Aghaaz '26</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Inaugural Design Event</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold text-cyan-400 mb-1">PKR 200</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Registration Fee</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold text-emerald-400 mb-1">PKR 5,000</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Prize + Internship Offer</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold font-mono mb-1">FIT</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Tech X Academy Karachi</div>
          </div>
        </div>

      </div>
    </div>
  );
};
