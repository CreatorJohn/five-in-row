import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Move, Dimensions, Player, WinResult } from '@/types';
import { INITIAL_SIZE, WIN_COUNT } from '@/constants';
import { Trainer, DetailedScore } from '@/hooks/Trainer';
import axios from 'axios';

export const useGameLogic = (isPracticeMode: boolean = false) => {
  const [dimensions, setDimensions] = useState<Dimensions>({ rows: INITIAL_SIZE, cols: INITIAL_SIZE });
  const [p1Moves, setP1Moves] = useState<Move[]>([]); 
  const [p2Moves, setP2Moves] = useState<Move[]>([]); 
  const [currentPlayer, setCurrentPlayer] = useState<Player>(() => Math.random() < 0.5 ? 'X' : 'O');
  const [winner, setWinner] = useState<Player | null>(null); 
  const [winningCells, setWinningCells] = useState<number[][]>([]); 
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [allMoves, setAllMoves] = useState<{r: number, c: number, p: Player}[]>([]);
  const [lastSavedGameId, setLastSavedGameId] = useState<number | null>(null);
  const [trainerScores, setTrainerScores] = useState<DetailedScore[]>([]);
  
  const gameSaved = useRef(false);

  const [showBorderAnim, setShowBorderAnim] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

  const trainer = useMemo(() => new Trainer('O'), []);

  const hasMove = useCallback((moves: Move[], r: number, c: number) => {
    return moves.some(m => m.r === r && m.c === c);
  }, []);

  const checkWin = useCallback((moves: Move[], lastR: number, lastC: number): WinResult => {
    const moveSet = new Set(moves.map(m => `${m.r},${m.c}`));
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
      let count = 1;
      const cells = [[lastR, lastC]];
      for (let i = 1; i < WIN_COUNT; i++) {
        const r = lastR + dr * i;
        const c = lastC + dc * i;
        if (moveSet.has(`${r},${c}`)) {
          count++;
          cells.push([r, c]);
        } else break;
      }
      for (let i = 1; i < WIN_COUNT; i++) {
        const r = lastR - dr * i;
        const c = lastC - dc * i;
        if (moveSet.has(`${r},${c}`)) {
          count++;
          cells.push([r, c]);
        } else break;
      }
      if (count >= WIN_COUNT) return { hasWon: true, cells };
    }
    return { hasWon: false, cells: [] };
  }, []);

  const saveGame = useCallback(async (winner: Player, moves: any[]) => {
    if (gameSaved.current) return;
    try {
        const response = await axios.post('/api/games', {
            winner,
            mode: isPracticeMode ? 'practice' : 'game',
            moves,
            initial_dimensions: { rows: INITIAL_SIZE, cols: INITIAL_SIZE }
        });
        setLastSavedGameId(response.data.id);
        gameSaved.current = true;
    } catch (err) {
        console.error("Failed to save game", err);
    }
  }, [isPracticeMode]);

  const handleWin = useCallback((player: Player, cells: number[][], moves: any[]) => {
    setWinner(player);
    setWinningCells(cells);
    setShowBorderAnim(true);
    saveGame(player, moves);
    setTimeout(() => {
        setShowBorderAnim(false);
        setShowNewGameDialog(true);
    }, 3000);
  }, [saveGame]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (winner || hasMove(p1Moves, r, c) || hasMove(p2Moves, r, c)) return;

    let addTop = 0, addBottom = 0, addLeft = 0, addRight = 0;
    const { rows, cols } = dimensions;

    if (r === 0) addTop = 2; else if (r === 1) addTop = 1;
    if (r === rows - 1) addBottom = 2; else if (r === rows - 2) addBottom = 1;
    if (c === 0) addLeft = 2; else if (c === 1) addLeft = 1;
    if (c === cols - 1) addRight = 2; else if (c === cols - 2) addRight = 1;

    const newRows = rows + addTop + addBottom;
    const newCols = cols + addLeft + addRight;
    
    const shiftMoves = (moves: Move[]) => moves.map(m => ({ r: m.r + addTop, c: m.c + addLeft }));
    const shiftAllMoves = (moves: any[]) => moves.map(m => ({ ...m, r: m.r + addTop, c: m.c + addLeft }));

    let nextP1Moves = p1Moves;
    let nextP2Moves = p2Moves;
    let nextAllMoves = allMoves;

    if (addTop > 0 || addLeft > 0) {
        nextP1Moves = shiftMoves(p1Moves);
        nextP2Moves = shiftMoves(p2Moves);
        nextAllMoves = shiftAllMoves(allMoves);
    }

    const newMoveR = r + addTop;
    const newMoveC = c + addLeft;
    const newMove = { r: newMoveR, c: newMoveC };
    const recordedMove = { r: newMoveR, c: newMoveC, p: currentPlayer };

    let currentMovesList;
    if (currentPlayer === 'X') {
      nextP1Moves = [...nextP1Moves, newMove];
      currentMovesList = nextP1Moves;
      setP1Moves(nextP1Moves);
      if (addTop > 0 || addLeft > 0) setP2Moves(nextP2Moves); 
    } else {
      nextP2Moves = [...nextP2Moves, newMove];
      currentMovesList = nextP2Moves;
      setP2Moves(nextP2Moves);
      if (addTop > 0 || addLeft > 0) setP1Moves(nextP1Moves);
    }

    const finalAllMoves = [...nextAllMoves, recordedMove];
    setAllMoves(finalAllMoves);

    if (newRows !== rows || newCols !== cols) {
        setDimensions({ rows: newRows, cols: newCols });
    }
    setLastMove(newMove);
    
    const winResult = checkWin(currentMovesList, newMoveR, newMoveC);
    
    if (winResult.hasWon) {
      handleWin(currentPlayer, winResult.cells, finalAllMoves);
    } else {
      setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
    }
  }, [dimensions, p1Moves, p2Moves, currentPlayer, winner, hasMove, checkWin, handleWin, allMoves]);

  // Trainer logic and score calculation
  useEffect(() => {
    if (isPracticeMode && !winner) {
        const scores = trainer.getDetailedScores(p1Moves, p2Moves, dimensions.rows, dimensions.cols);
        setTrainerScores(scores);

        if (currentPlayer === 'O') {
            const timer = setTimeout(() => {
                const bestMove = trainer.calculateBestMove(p1Moves, p2Moves, dimensions.rows, dimensions.cols);
                handleCellClick(bestMove.r, bestMove.c);
            }, 600);
            return () => clearTimeout(timer);
        }
    } else {
        setTrainerScores([]);
    }
  }, [isPracticeMode, currentPlayer, winner, p1Moves, p2Moves, dimensions, trainer, handleCellClick]);

  const resetGame = useCallback(() => {
    setDimensions({ rows: INITIAL_SIZE, cols: INITIAL_SIZE });
    setP1Moves([]);
    setP2Moves([]);
    setAllMoves([]);
    setCurrentPlayer(Math.random() < 0.5 ? 'X' : 'O');
    setWinner(null);
    setWinningCells([]);
    setLastMove(null);
    setShowBorderAnim(false);
    setShowNewGameDialog(false);
    setLastSavedGameId(null);
    setTrainerScores([]);
    gameSaved.current = false;
  }, []);

  const closeDialog = useCallback(() => setShowNewGameDialog(false), []);

  return {
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
    allMoves,
    lastSavedGameId,
    trainerScores,
    trainer
  };
};
