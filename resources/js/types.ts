import { LucideIcon } from 'lucide-react';

export type Player = 'X' | 'O';

export interface Move {
  r: number;
  c: number;
}

export interface Dimensions {
  rows: number;
  cols: number;
}

export interface WinResult {
  hasWon: boolean;
  cells: number[][];
}

export interface PlayerCardProps {
  player: Player;
  icon: LucideIcon;
  isActive: boolean;
  isWinner?: boolean;
  moveCount: number;
  align: 'left' | 'right';
  label?: string; // Optional custom label (e.g., "Trainer")
  avatar?: string | null; // Optional profile picture URL
}
