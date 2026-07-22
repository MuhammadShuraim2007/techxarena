import React, { useState } from 'react';
import { X, Trophy, Calendar, MapPin, Users, ShieldCheck, CheckCircle2, Clock, Award, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { Hackathon } from '../types';
import logoImg from '../assets/images/techx_academy_logo_1784655126257.jpg';

interface HackathonDetailModalProps {
  hackathon: Hackathon | null;
  onClose: () => void;
  onApply: (h: Hackathon) => void;
}

export const HackathonDetailModal: React.FC<HackathonDetailModalProps> = ({
  hackathon,
  onClose,
  onApply
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'prizes' | 'rules' | 'tracks' | 'timeline'>('overview');

  if (!hackathon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img 
            src={hackathon.bannerUrl} 
            alt={hackathon.title} 
            className="w-full h-full object-cover filter brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {hackathon.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                {hackathon.mode}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-medium bg-slate-800 text-slate-200 border border-slate-700">
                <img src={logoImg} alt="Tech X Logo" className="w-4 h-4 rounded object-cover" referrerPolicy="no-referrer" />
                <span>By {hackathon.organizer}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {hackathon.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
              {hackathon.shortDescription}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('prizes')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'prizes'
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Prizes & Awards
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'tracks'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tracks & Categories
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rules & Eligibility
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Schedule & Timeline
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">About The Event</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {hackathon.fullDescription}
                </p>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Start Date</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {new Date(hackathon.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Venue / Location</span>
                  </div>
                  <div className="text-sm font-bold text-white line-clamp-1">
                    {hackathon.venue}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Team Limits</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {hackathon.allowTeams ? `Up to ${hackathon.teamSizeLimit} Members` : 'Individual Solo Entry'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Prize Pool & Awards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.prizes.map((prize, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">{prize.title}</div>
                      <div className="text-xl font-extrabold text-amber-400">{prize.amount}</div>
                      <p className="text-xs text-slate-300 mt-1">{prize.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tracks' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Hackathon Tracks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.tracks.map((track) => (
                  <div key={track.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      {track.name}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Official Rules</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {hackathon.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Eligibility Criteria</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {hackathon.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Schedule & Milestones</h3>
              <div className="space-y-3 relative pl-4 border-l-2 border-slate-800">
                {hackathon.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6 space-y-1">
                    <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-slate-900"></span>
                    <div className="text-xs text-cyan-400 font-semibold">{item.date}</div>
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom CTA Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Registration Deadline</div>
            <div className="text-sm font-bold text-white">
              {new Date(hackathon.registrationEndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {(hackathon.status === 'open' || hackathon.status === 'upcoming') ? (
            <button
              onClick={() => {
                onClose();
                onApply(hackathon);
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply / Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs text-slate-500 bg-slate-800 cursor-not-allowed"
            >
              Registration Closed
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
