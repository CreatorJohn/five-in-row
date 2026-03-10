import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Swords, Shield, Clock, FastForward, Trophy } from 'lucide-react';
import { ANIMATION_STYLES } from '@/constants';

interface GameRecord {
    id: number;
    winner: string;
    mode: string;
    moves: { r: number, c: number, p: string }[];
    initial_dimensions: { rows: number, cols: number };
}

interface ReplayProps {
    game: GameRecord;
}

export default function Replay({ game }: ReplayProps) {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(600);
    const scrollableGridRef = useRef<HTMLDivElement>(null);

    const currentMoves = game.moves.slice(0, step);
    const lastMove = currentMoves[currentMoves.length - 1];

    const dimensions = currentMoves.reduce((acc, move) => ({
        rows: Math.max(acc.rows, move.r + 3),
        cols: Math.max(acc.cols, move.c + 3)
    }), { rows: game.initial_dimensions.rows, cols: game.initial_dimensions.cols });

    const cellSize = 36;

    useEffect(() => {
        let interval: any;
        if (isPlaying && step < game.moves.length) {
            interval = setInterval(() => {
                setStep(s => s + 1);
            }, playbackSpeed);
        } else if (step >= game.moves.length) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, step, game.moves.length, playbackSpeed]);

    useEffect(() => {
        if (lastMove && scrollableGridRef.current) {
            const GAP = 2;
            const PADDING = 32;
            const cellCenterX = PADDING + lastMove.c * (cellSize + GAP) + cellSize / 2;
            const cellCenterY = PADDING + lastMove.r * (cellSize + GAP) + cellSize / 2;

            const container = scrollableGridRef.current;
            container.scrollTo({
                left: cellCenterX - container.clientWidth / 2,
                top: cellCenterY - container.clientHeight / 2,
                behavior: 'smooth'
            });
        }
    }, [lastMove]);

    const handleBack = () => window.location.href = '/gallery';

    return (
        <div className="flex flex-col items-center h-dvh bg-slate-950 text-slate-100 p-4 md:p-8 font-sans overflow-hidden relative">
            <style>{ANIMATION_STYLES}</style>
            
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Header Card */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center bg-slate-900/40 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-slate-800/50 shadow-2xl mb-6 relative z-10 gap-6">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={handleBack} 
                        className="p-3 bg-slate-800/50 hover:bg-slate-700 text-slate-400 rounded-2xl border border-slate-700/50 cursor-pointer transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Match Replay #{game.id}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">{game.mode}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                                <Clock size={10} /> step {step}/{game.moves.length}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/50 p-2 rounded-[1.5rem] border border-slate-800/50 shadow-inner">
                    <button onClick={() => setStep(0)} className="p-2.5 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-xl transition-all cursor-pointer"><RefreshCw size={18} /></button>
                    <div className="w-px h-6 bg-slate-800 mx-1" />
                    <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2.5 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer"><ChevronLeft size={22} /></button>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`p-4 rounded-2xl transition-all shadow-xl active:scale-95 cursor-pointer ${isPlaying ? 'bg-amber-500 text-amber-950 shadow-amber-500/20' : 'bg-blue-600 text-white shadow-blue-600/20'}`}
                    >
                        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                    </button>
                    <button onClick={() => setStep(s => Math.min(game.moves.length, s + 1))} className="p-2.5 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer"><ChevronRight size={22} /></button>
                    <div className="w-px h-6 bg-slate-800 mx-1" />
                    <div className="relative group px-2">
                        <select 
                            value={playbackSpeed} 
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="bg-transparent border-none text-slate-400 font-black text-[10px] uppercase tracking-tighter cursor-pointer focus:ring-0 appearance-none"
                        >
                            <option value={1000}>0.5x</option>
                            <option value={600}>1.0x</option>
                            <option value={300}>2.0x</option>
                            <option value={100}>4.0x</option>
                        </select>
                        <FastForward size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Board Replay Area */}
            <div className="flex-1 w-full max-w-5xl flex flex-col min-h-0 bg-slate-900/20 backdrop-blur-sm rounded-[3rem] border-2 border-slate-800/50 shadow-2xl relative overflow-hidden">
                <div ref={scrollableGridRef} className="flex-1 overflow-auto custom-scrollbar">
                    <div className="min-w-full min-h-full flex items-center justify-center p-12">
                        <div 
                            className="grid gap-[2px] bg-slate-700/30 p-[2px] rounded-2xl border border-slate-700/50 transition-all duration-500 ease-out shadow-2xl"
                            style={{
                                gridTemplateColumns: `repeat(${dimensions.cols}, ${cellSize}px)`,
                                gridTemplateRows: `repeat(${dimensions.rows}, ${cellSize}px)`,
                                width: dimensions.cols * cellSize + (dimensions.cols - 1) * 2 + 4,
                                height: dimensions.rows * cellSize + (dimensions.rows - 1) * 2 + 4,
                            }}
                        >
                            {Array.from({ length: dimensions.rows }).map((_, r) => 
                                Array.from({ length: dimensions.cols }).map((_, c) => {
                                    const move = currentMoves.find(m => m.r === r && m.c === c);
                                    const isLast = lastMove?.r === r && lastMove?.c === c;
                                    return (
                                        <div key={`${r}-${c}`} style={{ width: cellSize, height: cellSize }} className="bg-slate-950/60 rounded-[2px] flex items-center justify-center transition-colors duration-300">
                                            {move?.p === 'X' && (
                                                <div className={`p-1 rounded-lg ${isLast ? 'bg-blue-500/10' : ''}`}>
                                                    <Swords size={cellSize * 0.55} className={`text-blue-500 drop-shadow-lg ${isLast ? 'animate-pop' : ''}`} strokeWidth={2.5} />
                                                </div>
                                            )}
                                            {move?.p === 'O' && (
                                                <div className={`p-1 rounded-lg ${isLast ? 'bg-rose-500/10' : ''}`}>
                                                    <Shield size={cellSize * 0.55} className={`text-rose-500 drop-shadow-lg ${isLast ? 'animate-pop' : ''}`} strokeWidth={2.5} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrubber / Progress Bar */}
                <div className="h-2 w-full bg-slate-900/50 relative overflow-hidden group cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percent = x / rect.width;
                    setStep(Math.round(percent * game.moves.length));
                }}>
                    <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300" 
                        style={{ width: `${(step / game.moves.length) * 100}%` }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity" />
                </div>
            </div>

            {/* Replay Footer */}
            <div className="w-full max-w-5xl mt-6 flex justify-between items-center">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">P1</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">P2</span>
                    </div>
                </div>
                
                <div className={`px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 flex items-center gap-2 transition-all duration-500 ${step === game.moves.length ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <Trophy size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <span className="hidden sm:inline">Match Concluded: </span>
                        <span className={game.winner === 'X' ? 'text-blue-400' : 'text-rose-400'}>P{game.winner === 'X' ? '1' : '2'} Victory</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
