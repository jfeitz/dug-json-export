import { useState, useCallback } from 'react';
import { MurderCase, Clue } from '../types';
import {
  deepCopyBoard,
  getErrorCells,
  isRowComplete,
  isPuzzleComplete,
} from './sudoku';

export interface GameState {
  board: number[][];
  selectedCell: { row: number; col: number } | null;
  errors: boolean[][];
  completedRows: Set<number>;
  revealedClues: Clue[];
  newlyRevealedClue: Clue | null;
  isComplete: boolean;
  notesMode: boolean;
  notes: Set<number>[][];
}

export function useGameState(murderCase: MurderCase) {
  const initialBoard = deepCopyBoard(murderCase.puzzle);

  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<boolean[][]>(getErrorCells(initialBoard));
  const [completedRows, setCompletedRows] = useState<Set<number>>(new Set());
  const [revealedClues, setRevealedClues] = useState<Clue[]>([]);
  const [newlyRevealedClue, setNewlyRevealedClue] = useState<Clue | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Set<number>[][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()))
  );

  const isGivenCell = useCallback(
    (row: number, col: number) => murderCase.puzzle[row][col] !== 0,
    [murderCase.puzzle]
  );

  const selectCell = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  const enterNumber = useCallback(
    (num: number) => {
      if (!selectedCell) return;
      const { row, col } = selectedCell;
      if (isGivenCell(row, col)) return;

      if (notesMode && num !== 0) {
        setNotes((prev) => {
          const next = prev.map((r) => r.map((s) => new Set(s)));
          const cell = next[row][col];
          if (cell.has(num)) {
            cell.delete(num);
          } else {
            cell.add(num);
          }
          return next;
        });
        return;
      }

      setNotes((prev) => {
        const next = prev.map((r) => r.map((s) => new Set(s)));
        next[row][col] = new Set();
        return next;
      });

      setBoard((prev) => {
        const next = deepCopyBoard(prev);
        next[row][col] = num;

        const newErrors = getErrorCells(next);
        setErrors(newErrors);

        setCompletedRows((prevCompleted) => {
          const nextCompleted = new Set(prevCompleted);
          if (num !== 0 && isRowComplete(next, row) && !newErrors[row].some(Boolean)) {
            if (!nextCompleted.has(row)) {
              nextCompleted.add(row);
              const clue = murderCase.clues.find((c) => c.triggeredByRow === row);
              if (clue) {
                setRevealedClues((prev) => {
                  if (prev.find((c) => c.id === clue.id)) return prev;
                  return [...prev, clue];
                });
                setNewlyRevealedClue(clue);
                setTimeout(() => setNewlyRevealedClue(null), 4000);
              }
            }
          }
          return nextCompleted;
        });

        if (isPuzzleComplete(next) && !newErrors.some((r) => r.some(Boolean))) {
          setIsComplete(true);
        }

        return next;
      });
    },
    [selectedCell, isGivenCell, notesMode, murderCase.clues]
  );

  const toggleNotesMode = useCallback(() => {
    setNotesMode((prev) => !prev);
  }, []);

  const resetPuzzle = useCallback(() => {
    setBoard(deepCopyBoard(murderCase.puzzle));
    setErrors(getErrorCells(murderCase.puzzle));
    setSelectedCell(null);
    setCompletedRows(new Set());
    setRevealedClues([]);
    setNewlyRevealedClue(null);
    setIsComplete(false);
    setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>())));
  }, [murderCase.puzzle]);

  return {
    board,
    selectedCell,
    errors,
    completedRows,
    revealedClues,
    newlyRevealedClue,
    isComplete,
    notesMode,
    notes,
    isGivenCell,
    selectCell,
    enterNumber,
    toggleNotesMode,
    resetPuzzle,
  };
}
