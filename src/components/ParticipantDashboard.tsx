import React, { useState } from 'react';
import { Search, UserCheck, ShieldAlert, Sparkles, MessageSquare, AlertCircle, Loader2, Award, Bell } from 'lucide-react';
import { Registration, Announcement } from '../types';
import { ParticipantIdCard } from './ParticipantIdCard';

interface ParticipantDashboardProps {
  onRegisterClick: () => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ onRegisterClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Registration[] | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`/api/registrations/lookup?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search registrations');
      }

      setResults(data);

      if (data.length === 0) {
        setError('No registration found matching this Hackathon ID Code, Email, or WhatsApp number.');
      } else {
        // Fetch announcements for first result's hackathon
        fetchAnnouncements(data[0].hackathonId);
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async (hackathonId: string) => {
    try {
      const res = await fetch(`/api/announcements?hackathonId=${hackathonId}`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-xs font-bold text-cyan-300">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          Participant Portal & Pass Lookup
        </div>
        <h2 className="text-3xl font-extrabold text-white">Find Your Hackathon Digital ID Pass</h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Enter your unique Hackathon ID (e.g. <strong>TXA-ARENA-2026-0001</strong>), registered Email address, or WhatsApp phone number to retrieve your pass.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. TXA-ARENA-2026-0001 or email@example.com"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-xl"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search Pass'}
        </button>
      </form>

      {/* Error / Not Found message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-3 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <strong className="block text-white font-bold">Search Result</strong>
            <span>{error}</span>
          </div>
          <button
            onClick={onRegisterClick}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shrink-0"
          >
            Register Now
          </button>
        </div>
      )}

      {/* Results Section */}
      {results && results.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              {results.length} Registration Found
            </h3>
          </div>

          {/* Render Announcements if any */}
          {announcements.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-400 uppercase tracking-wider">
                <Bell className="w-4 h-4" />
                Organizer Announcements
              </div>
              <div className="space-y-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <h4 className="font-bold text-xs text-white">{ann.title}</h4>
                    <p className="text-xs text-slate-300">{ann.content}</p>
                    <span className="text-[10px] text-slate-500">{new Date(ann.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cards list */}
          {results.map((reg) => (
            <ParticipantIdCard key={reg.id} registration={reg} />
          ))}
        </div>
      )}

    </div>
  );
};
