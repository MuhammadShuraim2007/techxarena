import React from 'react';
import { ShieldCheck, Trophy, Sparkles, UserCheck, ShieldAlert, Layers } from 'lucide-react';
import logoImg from '../assets/images/techx_academy_logo_1784655126257.jpg';

interface HeaderProps {
  activeTab: 'home' | 'hackathons' | 'lookup' | 'admin';
  setActiveTab: (tab: 'home' | 'hackathons' | 'lookup' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
  onQuickApply: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onLogoutAdmin,
  onQuickApply
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-500 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImg} 
                alt="Tech X Academy Logo" 
                className="w-full h-full object-cover rounded-[6px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tighter leading-none">
                  TECH X <span className="text-cyan-400">ARENA</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                  PORTAL
                </span>
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                Powered by Tech X Academy
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-full">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('hackathons')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'hackathons'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-cyan-300" />
              Active Hackathons
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'lookup'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              My ID Pass
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-white/10 text-white font-bold border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Admin Login
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onQuickApply}
              className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase text-black bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25 transition-all duration-200"
            >
              Register Now
            </button>

            {isAdminLoggedIn ? (
              <button
                onClick={onLogoutAdmin}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 rounded-lg transition-colors"
                title="Logout Admin Session"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Logout
              </button>
            ) : null}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto gap-2 py-2.5 border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'home' ? 'bg-cyan-500 text-black font-bold' : 'text-white/70 bg-white/5'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'hackathons' ? 'bg-cyan-500 text-black font-bold' : 'text-white/70 bg-white/5'
            }`}
          >
            Hackathons
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'lookup' ? 'bg-cyan-500 text-black font-bold' : 'text-white/70 bg-white/5'
            }`}
          >
            My ID Pass
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'admin' ? 'bg-white/20 text-white' : 'text-white/70 bg-white/5'
            }`}
          >
            Admin
          </button>
        </div>

      </div>
    </header>
  );
};
