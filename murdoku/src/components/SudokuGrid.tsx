import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = Math.min(SCREEN_WIDTH - 32, 360);
const CELL_SIZE = GRID_SIZE / 9;

interface Props {
  board: number[][];
  puzzle: number[][];
  errors: boolean[][];
  notes: Set<number>[][];
  selectedCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
}

export function SudokuGrid({ board, puzzle, errors, notes, selectedCell, onSelectCell }: Props) {
  const isSelected = (r: number, c: number) =>
    selectedCell?.row === r && selectedCell?.col === c;

  const isSameRowOrCol = (r: number, c: number) =>
    selectedCell !== null && (selectedCell.row === r || selectedCell.col === c);

  const isSameBox = (r: number, c: number) =>
    selectedCell !== null &&
    Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(c / 3);

  const isSameNumber = (r: number, c: number) =>
    selectedCell !== null &&
    board[selectedCell.row][selectedCell.col] !== 0 &&
    board[r][c] === board[selectedCell.row][selectedCell.col];

  const isGiven = (r: number, c: number) => puzzle[r][c] !== 0;

  function getCellBackground(r: number, c: number): string {
    if (isSelected(r, c)) return COLORS.cellSelected;
    if (isSameNumber(r, c)) return COLORS.cellSameNumber;
    if (isSameRowOrCol(r, c) || isSameBox(r, c)) return COLORS.cellHighlight;
    return COLORS.cellDefault;
  }

  function getCellBorderStyle(r: number, c: number) {
    return {
      borderRightWidth: c === 2 || c === 5 ? 2 : 0.5,
      borderBottomWidth: r === 2 || r === 5 ? 2 : 0.5,
      borderRightColor: c === 2 || c === 5 ? COLORS.gridBorderBold : COLORS.gridBorder,
      borderBottomColor: r === 2 || r === 5 ? COLORS.gridBorderBold : COLORS.gridBorder,
    };
  }

  return (
    <View style={[styles.grid, { width: GRID_SIZE, height: GRID_SIZE }]}>
      {board.map((rowArr, r) =>
        rowArr.map((val, c) => {
          const cellNotes = notes[r][c];
          const showNotes = val === 0 && cellNotes.size > 0;
          return (
            <TouchableOpacity
              key={`${r}-${c}`}
              style={[
                styles.cell,
                { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: getCellBackground(r, c) },
                getCellBorderStyle(r, c),
              ]}
              onPress={() => onSelectCell(r, c)}
              activeOpacity={0.7}
            >
              {showNotes ? (
                <View style={styles.notesContainer}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <Text key={n} style={styles.noteText}>
                      {cellNotes.has(n) ? n : ''}
                    </Text>
                  ))}
                </View>
              ) : val !== 0 ? (
                <Text
                  style={[
                    styles.cellText,
                    isGiven(r, c) && styles.givenText,
                    errors[r][c] && styles.errorText,
                    isSelected(r, c) && styles.selectedText,
                  ]}
                >
                  {val}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: COLORS.gridBorderBold,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cellText: {
    fontSize: CELL_SIZE * 0.5,
    fontWeight: '600',
    color: COLORS.textEntry,
  },
  givenText: {
    color: COLORS.textGiven,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.error,
  },
  selectedText: {
    color: COLORS.accent,
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 1,
  },
  noteText: {
    width: '33.33%',
    height: '33.33%',
    fontSize: CELL_SIZE * 0.22,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
