import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Users, Trophy, Download, Plus, Edit, Trash2, Search, 
  ChevronLeft, ChevronRight, BarChart3, Bell, CheckCircle2, AlertCircle, RefreshCw, 
  Layers, Calendar, MapPin, Eye, Filter, Loader2, Sparkles, MessageSquare, X 
} from 'lucide-react';
import { Hackathon, Registration, AnalyticsData, Announcement } from '../types';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
  hackathons: Hackathon[];
  onRefreshHackathons: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
  hackathons,
  onRefreshHackathons
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'hackathons' | 'registrations' | 'announcements'>('analytics');

  // Stats state
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalRegs, setTotalRegs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedHackathonFilter, setSelectedHackathonFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Modal State for Creating/Editing Hackathon
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);

  // Hackathon Form State
  const [hackathonForm, setHackathonForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    bannerUrl: '',
    startDate: '',
    endDate: '',
    registrationStartDate: '',
    registrationEndDate: '',
    venue: 'Tech X Academy Campus, Karachi',
    mode: 'In-Person (Karachi Campus)' as Hackathon['mode'],
    maxParticipants: 200,
    teamSizeLimit: 4,
    allowTeams: true,
    prizesStr: '1st Place: PKR 150,000\n2nd Place: PKR 75,000\n3rd Place: PKR 35,000',
    rulesStr: 'All code written during event\nMax 4 members per team\nBring student ID',
    eligibilityStr: 'FIT Students & IT Developers in Karachi',
    tracksStr: 'Web Apps & Full Stack Solutions\nAI & Autonomous Agents\nFIT Student Showcase',
    status: 'open' as Hackathon['status'],
    featured: true
  });

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annHackathonId, setAnnHackathonId] = useState('all');

  // Token helper
  const adminToken = 'techx_admin_token_2026';

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLogin(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid admin password');
    }
  };

  // Fetch Analytics Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Registrations
  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        hackathonId: selectedHackathonFilter,
        status: selectedStatusFilter,
        search: regSearchQuery
      });

      const res = await fetch(`/api/registrations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations);
        setTotalRegs(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'analytics') fetchStats();
      if (activeTab === 'registrations') fetchRegistrations();
    }
  }, [isAuthenticated, activeTab, currentPage, pageSize, selectedHackathonFilter, selectedStatusFilter, regSearchQuery]);

  // Handle Hackathon Save / Update
  const handleSaveHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prizes = hackathonForm.prizesStr.split('\n').filter(Boolean).map(line => {
        const [title, amount] = line.split(':');
        return { title: title || 'Award', amount: amount || 'TBD', description: 'Tech X Academy Recognition' };
      });

      const rules = hackathonForm.rulesStr.split('\n').filter(Boolean);
      const eligibility = hackathonForm.eligibilityStr.split('\n').filter(Boolean);
      const tracks = hackathonForm.tracksStr.split('\n').filter(Boolean).map((t, idx) => ({
        id: 'track-' + (idx + 1),
        name: t,
        description: 'Category for ' + t
      }));

      const payload = {
        title: hackathonForm.title,
        shortDescription: hackathonForm.shortDescription,
        fullDescription: hackathonForm.fullDescription,
        bannerUrl: hackathonForm.bannerUrl || 'https://picsum.photos/seed/techx/1200/600',
        startDate: hackathonForm.startDate || new Date().toISOString(),
        endDate: hackathonForm.endDate || new Date(Date.now() + 86400000 * 2).toISOString(),
        registrationStartDate: hackathonForm.registrationStartDate || new Date().toISOString(),
        registrationEndDate: hackathonForm.registrationEndDate || new Date(Date.now() + 86400000 * 15).toISOString(),
        venue: hackathonForm.venue,
        mode: hackathonForm.mode,
        maxParticipants: Number(hackathonForm.maxParticipants),
        teamSizeLimit: Number(hackathonForm.teamSizeLimit),
        allowTeams: hackathonForm.allowTeams,
        prizes,
        rules,
        eligibility,
        tracks,
        status: hackathonForm.status,
        featured: hackathonForm.featured
      };

      const url = editingHackathon ? `/api/hackathons/${editingHackathon.id}` : '/api/hackathons';
      const method = editingHackathon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to save hackathon');
      }

      setIsHackathonModalOpen(false);
      setEditingHackathon(null);
      onRefreshHackathons();
    } catch (err: any) {
      alert(err.message || 'Error saving hackathon');
    }
  };

  // Open Edit Hackathon
  const openEditHackathonModal = (h: Hackathon) => {
    setEditingHackathon(h);
    setHackathonForm({
      title: h.title,
      shortDescription: h.shortDescription,
      fullDescription: h.fullDescription,
      bannerUrl: h.bannerUrl,
      startDate: h.startDate.slice(0, 10),
      endDate: h.endDate.slice(0, 10),
      registrationStartDate: h.registrationStartDate.slice(0, 10),
      registrationEndDate: h.registrationEndDate.slice(0, 10),
      venue: h.venue,
      mode: h.mode,
      maxParticipants: h.maxParticipants,
      teamSizeLimit: h.teamSizeLimit,
      allowTeams: h.allowTeams,
      prizesStr: h.prizes.map(p => `${p.title}:${p.amount}`).join('\n'),
      rulesStr: h.rules.join('\n'),
      eligibilityStr: h.eligibility.join('\n'),
      tracksStr: h.tracks.map(t => t.name).join('\n'),
      status: h.status,
      featured: h.featured
    });
    setIsHackathonModalOpen(true);
  };

  // State for viewing full payment screenshot
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

  // Custom Delete Modal & Toast State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'hackathon' | 'student';
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusToast, setStatusToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Trigger Delete Hackathon
  const handleDeleteHackathon = (id: string, title: string) => {
    setDeleteConfirmTarget({ type: 'hackathon', id, name: title });
  };

  // Trigger Delete Student Registration
  const handleDeleteStudent = (regId: string, studentName: string) => {
    setDeleteConfirmTarget({ type: 'student', id: regId, name: studentName });
  };

  // Execute Confirmed Deletion from Custom Modal
  const executeConfirmedDelete = async () => {
    if (!deleteConfirmTarget) return;
    setIsDeleting(true);
    setStatusToast(null);

    try {
      if (deleteConfirmTarget.type === 'hackathon') {
        const res = await fetch(`/api/hackathons/${deleteConfirmTarget.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          onRefreshHackathons();
          if (activeTab === 'analytics') fetchStats();
          setStatusToast({ type: 'success', message: `Hackathon "${deleteConfirmTarget.name}" deleted successfully!` });
        } else {
          setStatusToast({ type: 'error', message: data.error || 'Failed to delete hackathon.' });
        }
      } else if (deleteConfirmTarget.type === 'student') {
        const res = await fetch(`/api/registrations/${deleteConfirmTarget.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          fetchRegistrations();
          if (activeTab === 'analytics') fetchStats();
          setStatusToast({ type: 'success', message: `Student "${deleteConfirmTarget.name}" deleted from database.` });
        } else {
          setStatusToast({ type: 'error', message: data.error || 'Failed to delete student registration.' });
        }
      }
    } catch (err: any) {
      setStatusToast({ type: 'error', message: err.message || 'Error occurred during deletion.' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmTarget(null);
      setTimeout(() => setStatusToast(null), 5000);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    window.open(`/api/registrations/export?token=${adminToken}`, '_blank');
  };

  // Post Announcement
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          hackathonId: annHackathonId,
          title: annTitle,
          content: annContent,
          important: true
        })
      });

      if (res.ok) {
        setAnnTitle('');
        setAnnContent('');
        alert('Announcement broadcasted successfully to participants!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prompt Password if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Organizer Admin Portal</h2>
          <p className="text-xs text-slate-400">Tech X Arena Management System</p>
        </div>

        {loginError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Passkey
            </label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/20 transition-all"
          >
            Authenticate Admin Access
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">Tech X Admin Organizer Control</h2>
            <p className="text-xs text-cyan-400 font-medium">Manage Hackathons, Participant Registrations & Export Data</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => {
              setEditingHackathon(null);
              setIsHackathonModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Hackathon
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 gap-2 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics & Metrics
        </button>

        <button
          onClick={() => setActiveTab('hackathons')}
          className={`px-5 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'hackathons'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Manage Hackathons ({hackathons.length})
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-5 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'registrations'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Registrations Database ({totalRegs})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-5 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          Broadcast Notice
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              Loading real-time analytics...
            </div>
          ) : stats ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Total Hackathons</div>
                  <div className="text-3xl font-black text-white">{stats.totalHackathons}</div>
                  <div className="text-[10px] text-emerald-400">{stats.activeHackathons} Active Open</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Total Registrations</div>
                  <div className="text-3xl font-black text-cyan-400">{stats.totalRegistrations}</div>
                  <div className="text-[10px] text-cyan-300">+{stats.registrationsThisWeek} this week</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Target Academy WhatsApp</div>
                  <div className="text-sm font-bold text-emerald-400">+92 327 2979729</div>
                  <div className="text-[10px] text-slate-500">Auto Message Link Active</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Location Focus</div>
                  <div className="text-sm font-bold text-amber-400">Karachi, Sindh</div>
                  <div className="text-[10px] text-slate-500">Tech X Academy Campus</div>
                </div>
              </div>

              {/* Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registrations Per Hackathon</h3>
                  <div className="space-y-3">
                    {stats.registrationsByHackathon.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="font-semibold">{item.hackathonTitle}</span>
                          <span className="font-bold text-cyan-400">{item.count} participants</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, (item.count / (stats.totalRegistrations || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Track Popularity</h3>
                  <div className="space-y-3">
                    {stats.registrationsByTrack.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-slate-300 font-semibold">{item.trackName}</span>
                        <span className="font-extrabold text-amber-400">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* TAB 2: MANAGE HACKATHONS */}
      {activeTab === 'hackathons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <div key={h.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{h.status}</span>
                  <span className="text-xs text-slate-500">{h.mode}</span>
                </div>

                <h3 className="font-extrabold text-lg text-white">{h.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{h.shortDescription}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditHackathonModal(h)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteHackathon(h.id, h.title)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: REGISTRATIONS DATABASE */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <input
              type="text"
              placeholder="Search by Name, Father Name, Email, WhatsApp, ID..."
              value={regSearchQuery}
              onChange={(e) => setRegSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <select
              value={selectedHackathonFilter}
              onChange={(e) => setSelectedHackathonFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Hackathons</option>
              {hackathons.map((h) => (
                <option key={h.id} value={h.id}>{h.title}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="winner">Winner</option>
              <option value="disqualified">Disqualified</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-x-auto shadow-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Hackathon ID</th>
                  <th className="p-4">Participant & Team</th>
                  <th className="p-4">Father Name</th>
                  <th className="p-4">Email / WhatsApp</th>
                  <th className="p-4">Payment Method & Proof</th>
                  <th className="p-4">Track</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reg Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      No student registrations match your search filters.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-400">{reg.hackathonIdCode}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{reg.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{reg.teamName ? `Team: ${reg.teamName}` : 'Solo Participant'}</div>
                      </td>
                      <td className="p-4 text-slate-300">{reg.fatherName}</td>
                      <td className="p-4">
                        <div className="text-slate-200">{reg.email}</div>
                        <div className="text-emerald-400 text-[11px] font-semibold">{reg.whatsapp}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.paymentMethod === 'jazzcash'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {reg.paymentMethod === 'jazzcash' ? 'JazzCash Online (03212260509)' : 'Pay on Campus Desk'}
                          </span>

                          {reg.paymentTransactionId && (
                            <div className="text-[10px] font-mono text-slate-300">
                              TxID: {reg.paymentTransactionId}
                            </div>
                          )}

                          {reg.paymentScreenshotUrl && (
                            <button
                              onClick={() => setViewingScreenshot(reg.paymentScreenshotUrl || null)}
                              className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1 mt-1"
                            >
                              <Eye className="w-3 h-3" />
                              View Invoice SS
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-cyan-300 font-semibold">{reg.trackName}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-700 text-emerald-400 uppercase">
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteStudent(reg.id, reg.fullName)}
                          title="Delete Student from Database"
                          className="p-2 rounded-xl text-rose-400 bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing {registrations.length} of {totalRegs} records
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {currentPage}</span>
              <button
                disabled={currentPage * pageSize >= totalRegs}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: BROADCAST NOTICE */}
      {activeTab === 'announcements' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Broadcast Organizer Notice
          </h3>

          <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Event</label>
              <select
                value={annHackathonId}
                onChange={(e) => setAnnHackathonId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="all">All Participants</option>
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notice Heading</label>
              <input
                type="text"
                required
                placeholder="e.g. Reporting time update for Hackathon Day 1"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Content Message</label>
              <textarea
                required
                rows={4}
                placeholder="Message body for participants..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
            >
              Broadcast Announcement
            </button>
          </form>
        </div>
      )}

      {/* CREATE / EDIT HACKATHON MODAL */}
      {isHackathonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 my-8 text-slate-200">
            <h3 className="font-extrabold text-xl text-white">
              {editingHackathon ? 'Edit Hackathon Event' : 'Create New Hackathon Event'}
            </h3>

            <form onSubmit={handleSaveHackathon} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hackathon Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FIT Code Clash 2026"
                  value={hackathonForm.title}
                  onChange={(e) => setHackathonForm({ ...hackathonForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary for list cards"
                  value={hackathonForm.shortDescription}
                  onChange={(e) => setHackathonForm({ ...hackathonForm, shortDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={hackathonForm.fullDescription}
                  onChange={(e) => setHackathonForm({ ...hackathonForm, fullDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Venue Location</label>
                  <input
                    type="text"
                    value={hackathonForm.venue}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={hackathonForm.status}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="open">Open</option>
                    <option value="live">Live</option>
                    <option value="closed">Closed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Prizes (One per line: Title:Amount)</label>
                <textarea
                  rows={3}
                  value={hackathonForm.prizesStr}
                  onChange={(e) => setHackathonForm({ ...hackathonForm, prizesStr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tracks (One track name per line)</label>
                <textarea
                  rows={3}
                  value={hackathonForm.tracksStr}
                  onChange={(e) => setHackathonForm({ ...hackathonForm, tracksStr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Save Hackathon Event
                </button>

                <button
                  type="button"
                  onClick={() => setIsHackathonModalOpen(false)}
                  className="px-5 py-3 rounded-xl font-bold text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT SCREENSHOT INVOICE MODAL */}
      {viewingScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Uploaded Payment Screenshot Invoice
              </h3>
              <button 
                onClick={() => setViewingScreenshot(null)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 p-2 flex items-center justify-center">
              <img 
                src={viewingScreenshot} 
                alt="Full Payment Proof Screenshot" 
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>

            <button
              onClick={() => setViewingScreenshot(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 font-bold text-xs text-white hover:bg-slate-700"
            >
              Close Invoice Viewer
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION DELETE MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-6 text-slate-200 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Confirm Permanent Deletion</h3>
                <p className="text-xs text-slate-400">Database action cannot be undone</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">Target Item:</span>
              <div className="font-bold text-white text-sm break-words">
                {deleteConfirmTarget.name}
              </div>
              <div className="text-[10px] text-rose-400 font-mono mt-1">
                Type: {deleteConfirmTarget.type === 'hackathon' ? 'Hackathon Event Record' : 'Student Registration Record'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={isDeleting}
                onClick={executeConfirmedDelete}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete Record
                  </>
                )}
              </button>

              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmTarget(null)}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION BANNER */}
      {statusToast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 max-w-md ${
          statusToast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
        }`}>
          {statusToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="text-xs font-semibold">{statusToast.message}</div>
          <button 
            onClick={() => setStatusToast(null)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
