import React from 'react';
import { Calendar, MapPin, Users, Trophy, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Hackathon } from '../types';

interface HackathonCardProps {
  hackathon: Hackathon;
  onSelect: (h: Hackathon) => void;
  onApply: (h: Hackathon) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  onSelect,
  onApply
}) => {

  const getStatusBadge = (status: Hackathon['status']) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Registration Open</span>;
      case 'live':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30"><span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>Live Now</span>;
      case 'upcoming':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-md"><Clock className="w-3 h-3" />Coming Soon</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Closed</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white/60 border border-white/10">Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white/40">Draft</span>;
    }
  };

  const topPrize = hackathon.prizes?.[0]?.amount || 'PKR 5,000 + Internship Offer';

  return (
    <div className="group relative bg-white/5 rounded-3xl border border-white/10 hover:border-cyan-500/40 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Banner Top */}
      <div className="relative h-48 w-full overflow-hidden bg-black">
        <img 
          src={hackathon.bannerUrl} 
          alt={hackathon.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent"></div>

        {/* Big "COMING SOON" Overlay Banner for upcoming items */}
        {hackathon.status === 'upcoming' && (
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-amber-500/90 text-black font-extrabold uppercase tracking-widest text-xs py-1.5 text-center shadow-lg transform -rotate-2">
            Coming Soon • Next Competition
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {getStatusBadge(hackathon.status)}
          {hackathon.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500 text-black shadow-md">
              <Sparkles className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* Mode & Fee Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-xs text-white bg-black/80 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">{hackathon.mode}</span>
          </div>
          {hackathon.registrationFee && (
            <div className="font-bold text-cyan-400">
              Fee: {hackathon.registrationFee}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
            {hackathon.organizer}
          </div>
          <h3 
            onClick={() => onSelect(hackathon)}
            className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
          >
            {hackathon.title}
          </h3>
          <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
            {hackathon.shortDescription}
          </p>
        </div>

        {/* Highlighted Prize & Internship Banner */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300">
          <Trophy className="w-5 h-5 shrink-0 text-amber-400" />
          <div className="text-xs font-bold leading-tight">
            <span className="block text-amber-200 uppercase text-[9px] tracking-wider font-extrabold">Winning Award</span>
            <span>{topPrize}</span>
          </div>
        </div>

        {/* Tracks badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {hackathon.tracks.slice(0, 2).map((t) => (
            <span key={t.id} className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-white/5 text-white/80 border border-white/10">
              {t.name}
            </span>
          ))}
          {hackathon.tracks.length > 2 && (
            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-lg bg-white/5 text-white/40">
              +{hackathon.tracks.length - 2}
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">Winning Prize</div>
              <div className="font-bold text-white text-xs">{topPrize}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">Team Size</div>
              <div className="font-bold text-white text-xs">
                {hackathon.teamSizeLimit === 1 ? '1 Solo Member' : `1 - ${hackathon.teamSizeLimit} Members`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onSelect(hackathon)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            View Details
          </button>

          {(hackathon.status === 'open' || hackathon.status === 'upcoming') ? (
            <button
              onClick={() => onApply(hackathon)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-md flex items-center justify-center gap-1"
            >
              <span>Apply Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white/30 bg-white/5 cursor-not-allowed"
            >
              Registration Closed
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
