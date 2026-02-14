const MOVES = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

export function createSolvedBoard(size) {
  const board = []
  const total = size * size

  for (let i = 1; i < total; i += 1) {
    board.push(i)
  }

  board.push(0)
  return board
}

export function indexToRowCol(index, size) {
  return {
    row: Math.floor(index / size),
    col: index % size,
  }
}

export function rowColToIndex(row, col, size) {
  return row * size + col
}

export function canMove(board, index, size) {
  const emptyIndex = board.indexOf(0)
  const a = indexToRowCol(index, size)
  const b = indexToRowCol(emptyIndex, size)
  const distance = Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
  return distance === 1
}

export function moveTile(board, index, size) {
  if (!canMove(board, index, size)) {
    return board
  }

  const next = [...board]
  const emptyIndex = board.indexOf(0)
  ;[next[index], next[emptyIndex]] = [next[emptyIndex], next[index]]
  return next
}

export function isSolved(board) {
  for (let i = 0; i < board.length - 1; i += 1) {
    if (board[i] !== i + 1) {
      return false
    }
  }

  return board[board.length - 1] === 0
}

export function shuffleBoard(size, steps = size * size * 20) {
  let board = createSolvedBoard(size)
  let emptyIndex = board.indexOf(0)

  for (let i = 0; i < steps; i += 1) {
    const { row, col } = indexToRowCol(emptyIndex, size)
    const options = []

    for (const [dr, dc] of MOVES) {
      const nextRow = row + dr
      const nextCol = col + dc

      if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
        options.push(rowColToIndex(nextRow, nextCol, size))
      }
    }

    const pick = options[Math.floor(Math.random() * options.length)]
    board = moveTile(board, pick, size)
    emptyIndex = board.indexOf(0)
  }

  if (isSolved(board)) {
    return shuffleBoard(size, steps + 10)
  }

  return board
}
