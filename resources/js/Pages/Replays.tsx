import React, { useState } from 'react';
import { ArrowLeft, Play, Calendar, Trophy, Zap, Clock, ChevronRight, History, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface GameRecord {
    id: number;
    winner: string;
    mode: string;
    created_at: string;
    moves: any[];
}

interface ReplaysProps {
    games: GameRecord[];
}

export default function Replays({ games: initialGames }: ReplaysProps) {
    const [games, setGames] = useState(initialGames);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleBack = () => window.location.href = '/';
    const handleReplay = (id: number) => window.location.href = `/replay/${id}`;

    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/api/games/${deletingId}`);
            setGames(prev => prev.filter(g => g.id !== deletingId));
            setDeletingId(null);
        } catch (err) {
            console.error("Failed to delete match", err);
            alert("Failed to delete match. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col h-dvh bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Header Section (Fixed) */}
            <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-12 pb-4 md:pb-6">
                <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-slate-800/50 shadow-2xl">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={handleBack}
                            className="p-4 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700/50 cursor-pointer group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                                Match Replays
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Review your performance
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-slate-500">Total Recorded</span>
                            <span className="text-xl font-black text-blue-400">{games.length}</span>
                        </div>
                        <History size={24} className="text-slate-700 ml-2" />
                    </div>
                </div>
            </div>

            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar pb-12">
                <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
                    {games.length === 0 ? (
                        <div className="text-center py-24 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-800/50 shadow-2xl">
                            <div className="inline-flex p-8 bg-slate-950/50 rounded-full mb-8 border border-slate-800 shadow-inner">
                                <Zap size={48} className="text-slate-700" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3">The Arena is Quiet</h2>
                            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">No battle records found yet. Conquer the board to start building your legacy!</p>
                            <button 
                                onClick={handleBack}
                                className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-900/20 transition-all cursor-pointer active:scale-95"
                            >
                                Start New Match
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {games.map((game) => (
                                <div 
                                    key={game.id} 
                                    className="group bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden flex flex-col"
                                    onClick={() => handleReplay(game.id)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all duration-500" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${game.mode === 'practice' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            {game.mode}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                                                <Clock size={12} />
                                                {new Date(game.created_at).toLocaleDateString()}
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteClick(e, game.id)}
                                                className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-rose-500/10"
                                                title="Delete Replay"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl shadow-inner ${game.winner === 'X' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                <Trophy size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Winner</span>
                                                <span className={`text-lg font-black ${game.winner === 'X' ? 'text-blue-400' : 'text-rose-400'}`}>
                                                    {game.winner === 'X' ? 'Player 1' : 'Player 2'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Moves</span>
                                            <span className="text-lg font-black text-slate-300">{game.moves.length}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-800/50 relative z-10">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleReplay(game.id); }}
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-800/50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 border border-slate-700/50 group-hover:border-blue-500 shadow-lg active:scale-95 cursor-pointer"
                                        >
                                            <Play size={14} fill="currentColor" />
                                            <span>Replay Match</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Section (Fixed) */}
            <div className="relative z-20 w-full bg-slate-950/80 backdrop-blur-md py-6 border-t border-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="text-center text-[10px] text-slate-700 font-mono uppercase tracking-[0.3em]">
                    Archive Secured • Strategic Records
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isDeleting && setDeletingId(null)} />
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl animate-scale-in text-center">
                        <div className="inline-flex p-5 bg-rose-500/10 text-rose-500 rounded-3xl mb-6 border border-rose-500/20 shadow-inner">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Delete Replay?</h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">This action cannot be undone. Are you sure you want to remove this battle record?</p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-xl shadow-rose-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                <span>Delete Record</span>
                            </button>
                            <button 
                                onClick={() => setDeletingId(null)}
                                disabled={isDeleting}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold border border-slate-700 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
