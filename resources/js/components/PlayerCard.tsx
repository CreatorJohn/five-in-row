import React from 'react';
import { PlayerCardProps } from '@/types';

export const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  icon: Icon, 
  isActive, 
  isWinner, 
  moveCount, 
  align,
  label,
  avatar
}) => {
  return (
    <div className={`
      flex flex-col gap-3 p-6 rounded-2xl border-2 transition-all duration-500 w-48 shrink-0 relative
      ${isActive && !isWinner ? 'bg-slate-800 scale-105 animate-active-card z-10' : 'bg-slate-800/50 border-slate-700 opacity-80'}
      ${isWinner ? 'bg-emerald-900/30 border-emerald-500 scale-110 shadow-xl shadow-emerald-900/20' : ''}
      ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}
    `}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${player === 'X' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'} ${isActive ? 'ring-2 ring-offset-2 ring-offset-slate-800 ' + (player === 'X' ? 'ring-blue-500' : 'ring-rose-500') : ''}`}>
        {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
            <Icon size={32} strokeWidth={2.5} className={`${isActive ? 'animate-float' : ''}`} />
        )}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          {isWinner ? 'Winner' : 'Player'}
        </div>
        <div className={`text-2xl font-bold transition-colors duration-300 ${player === 'X' ? 'text-blue-100' : 'text-rose-100'}`}>
          {label || (player === 'X' ? 'Player 1' : 'Player 2')}
        </div>
      </div>
      <div className="text-slate-400 text-sm font-mono mt-2 flex items-center gap-2 w-full">
        <div className={`h-1.5 rounded-full flex-1 bg-slate-700 overflow-hidden ${align === 'right' ? 'order-first' : ''}`}>
             <div 
                className={`h-full transition-all duration-500 ${player === 'X' ? 'bg-blue-500' : 'bg-rose-500'}`} 
                style={{ width: `${Math.min(moveCount * 2, 100)}%`}} 
             />
        </div>
      </div>
      {isActive && !isWinner && (
        <div className="text-amber-400 text-xs font-bold flex items-center gap-2 mt-1 animate-pulse">
          Current Turn
        </div>
      )}
    </div>
  );
};
