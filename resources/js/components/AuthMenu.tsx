import React, { useState } from 'react';
import { 
  Play, Users, Bot, History, Swords, Shield, 
  Hourglass, User as UserIcon, Trophy, BarChart2, 
  Users as FriendsIcon, LayoutGrid, ChevronRight, 
  LogOut as LogoutIcon 
} from 'lucide-react';
import axios from 'axios';
import { Modal } from '@/components/Modal';

interface AuthMenuProps {
  onNavigate: (view: 'game' | 'practice' | 'gallery') => void;
  userName: string;
  userAvatar?: string | null;
}

interface MenuButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost' | 'action' | 'danger';
  className?: string;
  subtitle?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'solid',
  className = '',
  subtitle
}) => {
  const variants = {
    solid: "bg-slate-800/50 hover:bg-slate-700 text-slate-100 border border-slate-700/50 hover:border-slate-600 shadow-lg",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700/50",
    action: "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/20 border border-blue-400/20",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40"
  };

  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden cursor-pointer ${variants[variant as keyof typeof variants] || variants.solid} ${className}`}
    >
      <div className={`p-2.5 rounded-xl transition-colors duration-300 ${variant === 'action' ? 'bg-white/20' : 'bg-slate-900/50 group-hover:bg-slate-900'}`}>
        <Icon size={20} strokeWidth={2.5} className={variant === 'action' ? 'text-white' : ''} />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-sm tracking-tight">{label}</span>
        {subtitle && <span className="text-[10px] font-medium opacity-50 uppercase tracking-widest">{subtitle}</span>}
      </div>
      <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
    </button>
  );
};

export const AuthMenu: React.FC<AuthMenuProps> = ({ onNavigate, userName, userAvatar }) => {
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
        await axios.post('/logout');
        window.location.href = '/';
    } catch (err) {
        console.error("Logout failed", err);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg flex flex-col gap-4 sm:gap-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-slate-900/40 backdrop-blur-2xl p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-800/50 shadow-2xl gap-4">
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-blue-500/50 animate-active-card shadow-xl transition-all duration-500 shrink-0`}>
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900/50">
                  <UserIcon size={28} className="sm:w-8 sm:h-8" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-sm" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight truncate max-w-[180px] sm:max-w-none">{userName}</h1>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active Session</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            
            {/* Main Action Column */}
            <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid size={12} className="text-blue-500" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Battle Arena</span>
              </div>
              <MenuButton 
                icon={Play} label="New Game" subtitle="Ranked Matchmaking" variant="action" 
                onClick={() => setComingSoonFeature('Online Matchmaking')} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                <MenuButton icon={Users} label="Local Multiplier" subtitle="Play with a friend" onClick={() => onNavigate('game')} />
                <MenuButton icon={Bot} label="Practice Mode" subtitle="vs AI Trainer" onClick={() => onNavigate('practice')} />
              </div>
            </div>

            {/* Side Action Column */}
            <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-2">
                <Trophy size={12} className="text-amber-500" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Discover</span>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => onNavigate('gallery')}
                  className="w-full flex flex-row md:flex-col items-center justify-center gap-4 md:gap-2 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-blue-500/30 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <History size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter">Replays</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setComingSoonFeature('Leaderboards')} className="p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[1.5rem] bg-slate-900/40 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer text-slate-400 text-center">
                    <Trophy size={16} className="sm:w-6 sm:h-6 text-amber-500" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase">Rankings</span>
                  </button>
                  <button onClick={() => setComingSoonFeature('Friends')} className="p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[1.5rem] bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer text-slate-400 text-center">
                    <FriendsIcon size={16} className="sm:w-6 sm:h-6 text-emerald-500" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase">Social</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Account Strip */}
            <div className="md:col-span-12 flex h-min gap-3 mt-1 sm:mt-2">
              <MenuButton 
                icon={UserIcon} label="Profile" className="flex-1"
                onClick={() => setComingSoonFeature('Profile Settings')} 
              />
              <button 
                onClick={handleLogout}
                className="px-6 sm:px-8 flex items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                title="Logout"
              >
                <LogoutIcon size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
        </div>

        <Modal show={!!comingSoonFeature} onClose={() => setComingSoonFeature(null)}>
            <div className="bg-slate-900 border border-slate-800 w-full rounded-[2.5rem] p-8 shadow-2xl text-center">
                <div className="inline-flex p-5 bg-amber-500/10 text-amber-500 rounded-3xl mb-6 border border-amber-500/20 shadow-inner">
                    <Hourglass size={32} className="animate-spin-slow" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">{comingSoonFeature}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">We're crafting something special! This feature will be available in a future update.</p>
                <button 
                    onClick={() => setComingSoonFeature(null)} 
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold border border-slate-700 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                    Got it
                </button>
            </div>
        </Modal>
    </div>
  );
};
