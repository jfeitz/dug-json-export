export function isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }
  return true;
}

export function getErrorCells(board: number[][]): boolean[][] {
  const errors: boolean[][] = Array.from({ length: 9 }, () => Array(9).fill(false));
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num === 0) continue;
      if (!isValidPlacement(board, row, col, num)) {
        errors[row][col] = true;
      }
    }
  }
  return errors;
}

export function isRowComplete(board: number[][], row: number): boolean {
  return board[row].every((n) => n !== 0) && !board[row].some((n, _, arr) => arr.indexOf(n) !== arr.lastIndexOf(n));
}

export function isColComplete(board: number[][], col: number): boolean {
  const vals = board.map((r) => r[col]);
  return vals.every((n) => n !== 0) && !vals.some((n, _, arr) => arr.indexOf(n) !== arr.lastIndexOf(n));
}

export function isBoxComplete(board: number[][], boxIndex: number): boolean {
  const boxRow = Math.floor(boxIndex / 3) * 3;
  const boxCol = (boxIndex % 3) * 3;
  const vals: number[] = [];
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      vals.push(board[r][c]);
    }
  }
  return vals.every((n) => n !== 0) && !vals.some((n, _, arr) => arr.indexOf(n) !== arr.lastIndexOf(n));
}

export function isPuzzleComplete(board: number[][]): boolean {
  for (let i = 0; i < 9; i++) {
    if (!isRowComplete(board, i)) return false;
  }
  return true;
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function deepCopyBoard(board: number[][]): number[][] {
  return board.map((row) => [...row]);
}
