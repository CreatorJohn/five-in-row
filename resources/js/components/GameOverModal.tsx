import React, { useState } from 'react';
import { RefreshCw, X, Trophy, Play, Lock } from 'lucide-react';
import { Player } from '@/types';

interface GameOverModalProps {
  winner: Player;
  onClose: () => void;
  onReset: () => void;
  gameId?: number | null;
  isAuthenticated: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
    winner, 
    onClose, 
    onReset,
    gameId,
    isAuthenticated
}) => {
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  const handleReplayClick = () => {
    if (isAuthenticated && gameId) {
      window.location.href = `/replay/${gameId}`;
    } else {
      setShowAuthRequired(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 border-2 border-slate-700 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-scale-in overflow-hidden">
        
        {/* Victory Glow */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-50 ${winner === 'X' ? 'bg-blue-500' : 'bg-rose-500'}`} />
        <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-50 ${winner === 'X' ? 'bg-blue-500' : 'bg-rose-500'}`} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`p-6 rounded-3xl mb-6 shadow-xl ${winner === 'X' ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
            <Trophy size={48} strokeWidth={2.5} />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Victory!
          </h2>
          
          <p className="text-slate-400 font-medium mb-8">
            <span className={`font-black ${winner === 'X' ? 'text-blue-400' : 'text-rose-400'}`}>
              Player {winner === 'X' ? '1' : '2'}
            </span> has conquered the board!
          </p>

          <div className="w-full space-y-3">
            <button 
                onClick={onReset}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg"
            >
                <RefreshCw size={20} strokeWidth={2.5} />
                <span>Play Again</span>
            </button>

            <button 
                onClick={handleReplayClick}
                className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg relative"
            >
                {isAuthenticated ? <Play size={20} fill="currentColor" /> : <Lock size={18} />}
                <span>Replay Match</span>
            </button>

            <button 
                onClick={onClose}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
            >
                <X size={20} strokeWidth={2.5} />
                <span>Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Required Modal Overlay */}
      {showAuthRequired && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowAuthRequired(false)} />
          <div className="relative bg-slate-800 border border-slate-700 w-full max-w-xs rounded-3xl p-8 shadow-2xl animate-scale-in text-center">
            <div className="inline-flex p-4 bg-blue-500/10 text-blue-500 rounded-2xl mb-4 border border-blue-500/20">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Save Your Victories</h3>
            <p className="text-slate-400 text-sm mb-6">Replay functionality is exclusive to registered players. Sign up now to review your strategies!</p>
            <div className="space-y-3">
              <button onClick={() => alert("Register")} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg">Create Account</button>
              <button onClick={() => setShowAuthRequired(false)} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold">Maybe Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
