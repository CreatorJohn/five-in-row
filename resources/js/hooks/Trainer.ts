import { Move, Player } from '@/types';
import { WIN_COUNT } from '@/constants';

export interface DetailedScore {
    r: number;
    c: number;
    attack: number;
    defense: number;
    total: number;
}

export class Trainer {
    private player: Player;
    private opponent: Player;

    // Pattern Weights
    private readonly WEIGHTS = {
        FIVE: 100000,
        LIVE_FOUR: 10000,
        DEAD_FOUR: 1000,
        LIVE_THREE: 500,
        DEAD_THREE: 100,
        LIVE_TWO: 50,
        DEAD_TWO: 10,
    };

    constructor(player: Player = 'O') {
        this.player = player;
        this.opponent = player === 'X' ? 'O' : 'X';
    }

    /**
     * Evaluates a specific cell for both players.
     */
    public evaluateSpecificCell(r: number, c: number, p1Moves: Move[], p2Moves: Move[]): { attack: number, defense: number } {
        const myMoves = this.player === 'X' ? p1Moves : p2Moves;
        const opMoves = this.player === 'X' ? p2Moves : p1Moves;

        const myMoveSet = new Set(myMoves.map(m => `${m.r},${m.c}`));
        const opMoveSet = new Set(opMoves.map(m => `${m.r},${m.c}`));

        // For evaluation, we treat the cell as if the player just moved there
        const attack = this.evaluateCell(r, c, myMoveSet, opMoveSet);
        const defense = this.evaluateCell(r, c, opMoveSet, myMoveSet);

        return { attack, defense };
    }

    public getDetailedScores(p1Moves: Move[], p2Moves: Move[], rows: number, cols: number): DetailedScore[] {
        const myMoves = this.player === 'X' ? p1Moves : p2Moves;
        const opMoves = this.player === 'X' ? p2Moves : p1Moves;

        const candidates = this.getCandidates(myMoves, opMoves, rows, cols);
        const myMoveSet = new Set(myMoves.map(m => `${m.r},${m.c}`));
        const opMoveSet = new Set(opMoves.map(m => `${m.r},${m.c}`));

        return candidates.map(move => {
            const attack = this.evaluateCell(move.r, move.c, myMoveSet, opMoveSet);
            const defense = this.evaluateCell(move.r, move.c, opMoveSet, myMoveSet);
            return {
                r: move.r,
                c: move.c,
                attack,
                defense,
                total: attack + (defense * 1.1)
            };
        });
    }

    public calculateBestMove(p1Moves: Move[], p2Moves: Move[], rows: number, cols: number): Move {
        const scores = this.getDetailedScores(p1Moves, p2Moves, rows, cols);
        
        if (scores.length === 0) {
            return { r: Math.floor(rows / 2), c: Math.floor(cols / 2) };
        }

        let best = scores[0];
        for (const score of scores) {
            if (score.total > best.total) {
                best = score;
            }
        }

        return { r: best.r, c: best.c };
    }

    private getCandidates(myMoves: Move[], opMoves: Move[], rows: number, cols: number): Move[] {
        const occupied = new Set([...myMoves, ...opMoves].map(m => `${m.r},${m.c}`));
        const candidates = new Map<string, Move>();

        [...myMoves, ...opMoves].forEach(m => {
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const nr = m.r + dr;
                    const nc = m.c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        const key = `${nr},${nc}`;
                        if (!occupied.has(key)) {
                            candidates.set(key, { r: nr, c: nc });
                        }
                    }
                }
            }
        });

        return Array.from(candidates.values());
    }

    private evaluateCell(r: number, c: number, myMoves: Set<string>, enemyMoves: Set<string>): number {
        let totalScore = 0;
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

        for (const [dr, dc] of directions) {
            totalScore += this.getPatternInDirection(r, c, dr, dc, myMoves, enemyMoves);
        }

        return totalScore;
    }

    private getPatternInDirection(r: number, c: number, dr: number, dc: number, myMoves: Set<string>, enemyMoves: Set<string>): number {
        let count = 1;
        let openEnds = 0;

        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            const key = `${nr},${nc}`;
            if (myMoves.has(key)) {
                count++;
            } else if (!enemyMoves.has(key)) {
                openEnds++;
                break;
            } else {
                break;
            }
        }

        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r - dr * i;
            const nc = c - dc * i;
            const key = `${nr},${nc}`;
            if (myMoves.has(key)) {
                count++;
            } else if (!enemyMoves.has(key)) {
                openEnds++;
                break;
            } else {
                break;
            }
        }

        if (count >= WIN_COUNT) return this.WEIGHTS.FIVE;
        
        if (count === 4) {
            return openEnds === 2 ? this.WEIGHTS.LIVE_FOUR : (openEnds === 1 ? this.WEIGHTS.DEAD_FOUR : 0);
        }
        if (count === 3) {
            return openEnds === 2 ? this.WEIGHTS.LIVE_THREE : (openEnds === 1 ? this.WEIGHTS.DEAD_THREE : 0);
        }
        if (count === 2) {
            return openEnds === 2 ? this.WEIGHTS.LIVE_TWO : (openEnds === 1 ? this.WEIGHTS.DEAD_TWO : 0);
        }

        return count;
    }
}
