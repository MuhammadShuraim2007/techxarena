import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HackathonCard } from './components/HackathonCard';
import { HackathonDetailModal } from './components/HackathonDetailModal';
import { RegistrationForm } from './components/RegistrationForm';
import { ParticipantIdCard } from './components/ParticipantIdCard';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { AdminPanel } from './components/AdminPanel';
import { Hackathon, Registration } from './types';
import { Search, Trophy, Sparkles, Filter, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'hackathons' | 'lookup' | 'admin'>('home');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);

  // Modals & Selection
  const [selectedHackathonDetail, setSelectedHackathonDetail] = useState<Hackathon | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedRegHackathon, setSelectedRegHackathon] = useState<Hackathon | undefined>(undefined);
  const [successRegistrationPass, setSuccessRegistrationPass] = useState<{ reg: Registration; waUrl: string } | null>(null);

  // Search & Filter state for Hackathons Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('txa_admin_token') === 'techx_admin_token_2026';
  });

  // Fetch Hackathons
  const fetchHackathons = async () => {
    setLoadingHackathons(true);
    try {
      const res = await fetch('/api/hackathons');
      if (res.ok) {
        const data = await res.json();
        setHackathons(data);
      }
    } catch (err) {
      console.error('Failed to load hackathons:', err);
    } finally {
      setLoadingHackathons(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const handleAdminLogin = (token: string) => {
    localStorage.setItem('txa_admin_token', token);
    setIsAdminLoggedIn(true);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('txa_admin_token');
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  const handleOpenApply = (h?: Hackathon) => {
    setSelectedRegHackathon(h || hackathons[0]);
    setIsRegistrationOpen(true);
  };

  const handleRegistrationSuccess = (reg: Registration, waUrl: string) => {
    setIsRegistrationOpen(false);
    setSuccessRegistrationPass({ reg, waUrl });
  };

  // Filtered hackathons
  const filteredHackathons = hackathons.filter(h => {
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    const matchesQuery = !searchQuery.trim() || 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tracks.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesQuery;
  });

  // Welcome / Motivational banner state
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setActiveTab('admin')}
        onLogoutAdmin={handleAdminLogout}
        onQuickApply={() => handleOpenApply()}
      />

      {/* Welcome Announcement Banner */}
      {showWelcomeBanner && (
        <div className="bg-slate-900 border-b border-cyan-500/30 px-4 py-3 text-xs text-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white font-black uppercase tracking-wider">Tech X Arena Karachi:</strong>{' '}
                <span className="text-cyan-300 font-bold">Aghaaz '26 Graphic Design Hackathon</span> • 1st August (3:00 PM to 5:00 PM, Results at 6:00 PM) at New Karachi Ikhwan Masjid. Win <strong className="text-amber-300">PKR 5,000 Cash + Graphic Design Internship Offer!</strong> Registration Deadline: 31st July (11:59 PM).
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleOpenApply()}
                className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-[11px] uppercase tracking-wider transition-colors shadow-md"
              >
                Register Now (PKR 200)
              </button>
              <button 
                onClick={() => setShowWelcomeBanner(false)}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                title="Dismiss message"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-16">
            <Hero
              onExploreClick={() => setActiveTab('hackathons')}
              onApplyClick={() => handleOpenApply()}
              onLookupClick={() => setActiveTab('lookup')}
              totalHackathons={hackathons.length}
              totalParticipants={150 + hackathons.length * 45}
            />

            {/* Featured Hackathons Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Featured Events
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Active & Upcoming Hackathons
                  </h2>
                </div>

                <button
                  onClick={() => setActiveTab('hackathons')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  View All Hackathons →
                </button>
              </div>

              {loadingHackathons ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Loading hackathons...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hackathons.slice(0, 3).map((h) => (
                    <HackathonCard
                      key={h.id}
                      hackathon={h}
                      onSelect={(item) => setSelectedHackathonDetail(item)}
                      onApply={(item) => handleOpenApply(item)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* How It Works Section */}
            <div className="bg-slate-900/60 border-y border-slate-800 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Simple 4-Step Flow</span>
                  <h2 className="text-3xl font-extrabold text-white">How Tech X Arena Works</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400">1</div>
                    <h3 className="font-bold text-base text-white">Select Hackathon</h3>
                    <p className="text-xs text-slate-400">Browse open events hosted by Tech X Academy Karachi and choose your track.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400">2</div>
                    <h3 className="font-bold text-base text-white">Submit Form</h3>
                    <p className="text-xs text-slate-400">Fill in your participant details, FIT course info, and team members if applicable.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400">3</div>
                    <h3 className="font-bold text-base text-white">Get Pass & QR Code</h3>
                    <p className="text-xs text-slate-400">Instantly generate your unique Hackathon ID card (e.g. TXA-ARENA-2026-0001) with scannable QR code.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400">4</div>
                    <h3 className="font-bold text-base text-white">Compete & Win</h3>
                    <p className="text-xs text-slate-400">Send confirmation to WhatsApp +923272979729, join campus arena, and win prizes!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HACKATHONS LISTING */}
        {activeTab === 'hackathons' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white">All Competition Events</h1>
                <p className="text-xs text-cyan-400 font-semibold">Tech X Arena • Powered By Tech X Academy Karachi</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search event title or track..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open For Registration</option>
                  <option value="live">Live Now</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHackathons.map((h) => (
                <HackathonCard
                  key={h.id}
                  hackathon={h}
                  onSelect={(item) => setSelectedHackathonDetail(item)}
                  onApply={(item) => handleOpenApply(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PASS LOOKUP */}
        {activeTab === 'lookup' && (
          <ParticipantDashboard onRegisterClick={() => handleOpenApply()} />
        )}

        {/* TAB 4: ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <AdminPanel
            isAuthenticated={isAdminLoggedIn}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            hackathons={hackathons}
            onRefreshHackathons={fetchHackathons}
          />
        )}

      </main>

      {/* Detail Modal */}
      <HackathonDetailModal
        hackathon={selectedHackathonDetail}
        onClose={() => setSelectedHackathonDetail(null)}
        onApply={(h) => handleOpenApply(h)}
      />

      {/* Registration Form Modal */}
      {isRegistrationOpen && (
        <RegistrationForm
          hackathons={hackathons}
          selectedHackathonId={selectedRegHackathon?.id}
          onClose={() => setIsRegistrationOpen(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Success Pass Modal */}
      {successRegistrationPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-2xl">
            <ParticipantIdCard
              registration={successRegistrationPass.reg}
              whatsappDirectUrl={successRegistrationPass.waUrl}
              onClose={() => setSuccessRegistrationPass(null)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} />

    </div>
  );
}
