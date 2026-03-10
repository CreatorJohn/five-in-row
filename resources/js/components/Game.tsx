import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RefreshCw, Info, Swords, Shield, ArrowLeft, Play, Lock } from 'lucide-react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { PlayerCard } from '@/components/PlayerCard';
import { GameOverModal } from '@/components/GameOverModal';
import { INITIAL_SIZE } from '@/constants';

interface GameProps {
  onBack: () => void;
  mode: 'game' | 'practice';
  isAuthenticated: boolean;
  userName?: string | null;
  userAvatar?: string | null;
}

export const Game: React.FC<GameProps> = ({ onBack, mode, isAuthenticated, userName, userAvatar }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableGridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number, x: number, y: number } | null>(null);

  // Check for show_score in URL
  const showScore = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('show_score') && mode === 'practice';
  }, [mode]);

  const {
    dimensions,
    p1Moves,
    p2Moves,
    currentPlayer,
    winner,
    winningCells,
    lastMove,
    showBorderAnim,
    showNewGameDialog,
    handleCellClick,
    resetGame,
    closeDialog,
    lastSavedGameId,
    trainerScores,
    trainer
  } = useGameLogic(mode === 'practice');

  // Optimizing lookups for rendering loop
  const p1MovesSet = useMemo(() => new Set(p1Moves.map(m => `${m.r},${m.c}`)), [p1Moves]);
  const p2MovesSet = useMemo(() => new Set(p2Moves.map(m => `${m.r},${m.c}`)), [p2Moves]);
  const winningCellsSet = useMemo(() => new Set(winningCells.map(([r, c]) => `${r},${c}`)), [winningCells]);
  
  const scoreMap = useMemo(() => {
    const map = new Map<string, {a: number, d: number, t: number}>();
    trainerScores.forEach(s => map.set(`${s.r},${s.c}`, { a: s.attack, d: s.defense, t: Math.round(s.total) }));
    return map;
  }, [trainerScores]);

  // Adjust cell size based on viewport to fit the initial grid
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = containerRef.current!;
      // More aggressive mobile padding (100px vs 80px) to ensure fit on small screens
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 100 : 80;
      
      const minDim = Math.min(clientWidth, clientHeight) - padding;
      const targetSize = Math.floor(minDim / INITIAL_SIZE);
      
      // Smaller mobile minimum (28px)
      setCellSize(Math.max(isMobile ? 28 : 30, Math.min(targetSize, 44)));
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Auto-scroll to center on the last move
  useEffect(() => {
    if (lastMove && scrollableGridRef.current) {
        const { r, c } = lastMove;
        const GAP = 2;
        const PADDING = 2;
        
        const cellCenterX = PADDING + c * (cellSize + GAP) + cellSize / 2;
        const cellCenterY = PADDING + r * (cellSize + GAP) + cellSize / 2;

        const container = scrollableGridRef.current;
        const { clientWidth, clientHeight } = container;

        const scrollLeft = cellCenterX - clientWidth / 2;
        const scrollTop = cellCenterY - clientHeight / 2;

        container.scrollTo({
            left: scrollLeft,
            top: scrollTop,
            behavior: 'smooth'
        });
    }
  }, [lastMove, cellSize]);

  const handleReplayClick = () => {
    if (isAuthenticated && lastSavedGameId) {
      window.location.href = `/replay/${lastSavedGameId}`;
    } else {
      setShowAuthRequired(true);
    }
  };

  const getCellOwner = (r: number, c: number) => {
    const key = `${r},${c}`;
    if (p1MovesSet.has(key)) return 'X';
    if (p2MovesSet.has(key)) return 'O';
    return null;
  };

  const isWinningCell = (r: number, c: number) => winningCellsSet.has(`${r},${c}`);

  const handleCellHover = useCallback((r: number, c: number, e: React.MouseEvent) => {
    if (!showScore) return;
    setHoveredCell({ r, c, x: e.clientX, y: e.clientY });
  }, [showScore]);

  const hoveredEvaluation = useMemo(() => {
    if (!hoveredCell || !showScore) return null;
    return trainer.evaluateSpecificCell(hoveredCell.r, hoveredCell.c, p1Moves, p2Moves);
  }, [hoveredCell, showScore, p1Moves, p2Moves, trainer]);

  return (
    <div className="flex flex-col items-center h-dvh bg-slate-900 text-slate-100 p-3 sm:p-4 md:p-8 font-sans overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-start mb-3 sm:mb-4 shrink-0 z-10">
        <div className="flex items-start gap-2 sm:gap-4">
            <button 
                onClick={onBack}
                className="mt-0.5 sm:mt-1 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700 hover:shadow-lg hover:scale-105 cursor-pointer"
                title="Back to Menu"
            >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-none">
                    Arena
                </h1>
                <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5 flex items-center gap-1">
                    <Info size={12} className="sm:w-3.5 sm:h-3.5" />
                    {dimensions.rows}x{dimensions.cols} 
                    {mode === 'practice' && <span className="ml-1 px-1.5 py-0.5 bg-slate-800 rounded-full text-[8px] sm:text-[10px] border border-slate-700 text-emerald-400 font-bold uppercase">Bot</span>}
                </p>
            </div>
        </div>

        {winner && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button 
                onClick={handleReplayClick}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors border border-blue-500 shadow-lg cursor-pointer text-xs sm:text-sm"
                title="Replay Match"
            >
                {isAuthenticated ? <Play size={14} className="sm:w-4 sm:h-4" fill="currentColor" /> : <Lock size={12} className="sm:w-4 sm:h-4" />}
                <span>Replay</span>
            </button>
            <button 
                onClick={resetGame}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 shadow-lg cursor-pointer text-xs sm:text-sm"
            >
                <RefreshCw size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 w-full max-w-6xl flex flex-row items-center justify-center gap-4 min-h-0">
        
        {/* Left Player */}
        <div className="hidden lg:flex lg:justify-center lg:items-center">
          <PlayerCard 
            player="X" 
            icon={Swords} 
            isActive={currentPlayer === 'X'} 
            isWinner={winner === 'X'}
            moveCount={p1Moves.length} 
            align="left" 
            label={userName || "Player 1"}
            avatar={userAvatar}
          />
        </div>

        {/* Center Board Container */}
        <div className="relative flex-1 h-full flex flex-col z-0 justify-center min-w-0 max-w-3xl">
          
          {showBorderAnim && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
              <rect 
                x="0" 
                y="0" 
                width="100%" 
                height="100%" 
                rx="12" 
                ry="12"
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="6"
                pathLength="100"
                className="animate-draw-border"
                style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.6))' }}
              />
            </svg>
          )}

          <div 
            ref={containerRef}
            className="w-full h-full rounded-2xl bg-slate-950 border-[3px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.6)_inset] relative overflow-hidden flex flex-col"
          >
            <div 
              ref={scrollableGridRef}
              className="flex-1 overflow-auto custom-scrollbar"
            >
                <div className="min-w-full min-h-full flex items-center justify-center p-8">
                    <div 
                      className={`grid gap-[2px] bg-slate-700/50 p-[2px] rounded-lg shadow-2xl border border-slate-700 transition-all duration-300 ease-out flex-shrink-0`}
                      style={{
                          gridTemplateColumns: `repeat(${dimensions.cols}, ${cellSize}px)`,
                          gridTemplateRows: `repeat(${dimensions.rows}, ${cellSize}px)`,
                          width: dimensions.cols * cellSize + (dimensions.cols - 1) * 2 + 4,
                          height: dimensions.rows * cellSize + (dimensions.rows - 1) * 2 + 4,
                      }}
                    >
                    {Array.from({ length: dimensions.rows }).map((_, rIndex) => (
                        Array.from({ length: dimensions.cols }).map((_, cIndex) => {
                        const owner = getCellOwner(rIndex, cIndex);
                        const isWin = isWinningCell(rIndex, cIndex);
                        const isLast = lastMove?.r === rIndex && lastMove?.c === cIndex;
                        const score = scoreMap.get(`${rIndex},${cIndex}`);

                        return (
                            <div
                            key={`${rIndex}-${cIndex}`}
                            onClick={() => handleCellClick(rIndex, cIndex)}
                            onMouseEnter={(e) => handleCellHover(rIndex, cIndex, e)}
                            onMouseLeave={() => setHoveredCell(null)}
                            style={{ width: cellSize, height: cellSize }}
                            className={`
                                rounded-[1px] flex flex-col items-center justify-center font-bold cursor-pointer select-none transition-colors duration-200 relative
                                ${!owner && !winner && (mode !== 'practice' || currentPlayer === 'X') ? 'hover:bg-slate-800 bg-slate-900/90' : 'bg-slate-900/90'}
                                ${isWin ? 'bg-emerald-900/60 z-10 shadow-[0_0_15px_rgba(16,185,129,0.4)_inset]' : ''}
                                ${isLast && !isWin ? 'bg-slate-800 ring-1 ring-inset ring-amber-500/50' : ''}
                                ${mode === 'practice' && currentPlayer === 'O' && !winner ? 'cursor-wait' : ''}
                            `}
                            >
                            {owner === 'X' && (
                                <Swords 
                                className={`transform transition-transform duration-300 drop-shadow-lg w-[60%] h-[60%] 
                                    ${isWin ? 'scale-110 text-emerald-400' : 'text-blue-500'}
                                    ${isLast ? 'animate-pop' : ''} 
                                `} 
                                strokeWidth={2}
                                />
                            )}
                            {owner === 'O' && (
                                <Shield 
                                className={`transform transition-transform duration-300 drop-shadow-lg w-[60%] h-[60%] 
                                    ${isWin ? 'scale-110 text-emerald-400' : 'text-rose-500'}
                                    ${isLast ? 'animate-pop' : ''}
                                `}
                                strokeWidth={2}
                                />
                            )}
                            
                            {/* DEBUG SCORES (Empty cells only) */}
                            {!owner && showScore && score && (
                                <div className="text-[8px] leading-tight flex flex-col items-center font-mono opacity-80 pointer-events-none">
                                    <span className="text-blue-400">A:{score.a}</span>
                                    <span className="text-rose-400">D:{score.d}</span>
                                    <span className="text-amber-400 font-bold border-t border-slate-700 mt-0.5">T:{score.t}</span>
                                </div>
                            )}
                            </div>
                        );
                        })
                    ))}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Player */}
        <div className="hidden lg:flex lg:justify-center lg:items-center">
          <PlayerCard 
            player="O" 
            icon={Shield} 
            isActive={currentPlayer === 'O'} 
            isWinner={winner === 'O'}
            moveCount={p2Moves.length} 
            align="right" 
            label={mode === 'practice' ? "Trainer" : "Player 2"}
          />
        </div>

        {/* Mobile Player Indicators */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 lg:hidden pointer-events-none z-20">
            <div className={`px-4 py-2 rounded-full bg-slate-800/90 backdrop-blur-md border border-slate-700 flex items-center gap-2 shadow-xl ${currentPlayer === 'X' && !winner ? 'ring-2 ring-blue-500 animate-pulse' : 'opacity-70'}`}>
                <Swords size={16} className="text-blue-400"/>
                <span className="text-blue-100 font-bold text-sm">P1</span>
            </div>
            <div className={`px-4 py-2 rounded-full bg-slate-800/90 backdrop-blur-md border border-slate-700 flex items-center gap-2 shadow-xl ${currentPlayer === 'O' && !winner ? 'ring-2 ring-rose-500 animate-pulse' : 'opacity-70'}`}>
                <Shield size={16} className="text-rose-400"/>
                <span className="text-rose-100 font-bold text-sm">{mode === 'practice' ? 'Bot' : 'P2'}</span>
            </div>
        </div>

      </div>

      {showNewGameDialog && (
        <GameOverModal 
          winner={winner!} 
          onClose={closeDialog} 
          onReset={resetGame} 
          gameId={lastSavedGameId}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Auth Required Modal Overlay (Header Button) */}
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
              <button onClick={() => window.location.href = '/register'} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg">Create Account</button>
              <button onClick={() => setShowAuthRequired(false)} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold">Maybe Later</button>
            </div>
          </div>
        </div>
      )}

      {/* DEBUG TOOLTIP (Occupied cells only, while game in progress) */}
      {showScore && !winner && hoveredCell && getCellOwner(hoveredCell.r, hoveredCell.c) && hoveredEvaluation && (
        <div 
            className="fixed z-[200] bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-2xl pointer-events-none animate-scale-in flex flex-col gap-1 min-w-[120px]"
            style={{ 
                left: hoveredCell.x + 15, 
                top: hoveredCell.y + 15 
            }}
        >
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-700 pb-1">
                Cell [{hoveredCell.r},{hoveredCell.c}] ({getCellOwner(hoveredCell.r, hoveredCell.c)})
            </div>
            <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-bold text-blue-400">Attack:</span>
                <span className="text-sm font-black text-blue-100">{hoveredEvaluation.attack}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-bold text-rose-400">Defense:</span>
                <span className="text-sm font-black text-rose-100">{hoveredEvaluation.defense}</span>
            </div>
            <div className="flex justify-between items-center gap-4 pt-1 border-t border-slate-700 mt-1">
                <span className="text-xs font-bold text-amber-400">Total:</span>
                <span className="text-sm font-black text-amber-100">{Math.round(hoveredEvaluation.attack + hoveredEvaluation.defense * 1.1)}</span>
            </div>
        </div>
      )}
    </div>
  );
};
