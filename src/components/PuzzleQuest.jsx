import { useEffect, useMemo, useState } from 'react'
import { canMove, createSolvedBoard, isSolved, moveTile, shuffleBoard } from '../utils/puzzle'

const LEVELS = [
  {
    size: 2,
    shuffleSteps: 16,
    label: 'Level 1 - Warmup',
    note: 'Sometimes things between us do not feel perfectly smooth 🌙 but every time I see you, I am just someone trying to understand you a little better than yesterday 🌸 I know there are moments where I might say or do something clumsy… 😅 and maybe it makes you uncomfortable or sad 🥺 Please believe me — that was never what my heart wanted 🤍 I am still learning you… slowly, carefully, and sincerely 🫶 And I think I will always keep learning you, because you are someone worth understanding more each day ✨',
  },
  {
    size: 3,
    shuffleSteps: 36,
    label: 'Level 2 - Sweet Challenge',
    note: 'The first time I talked to you, something in me just felt a little lighter 🤍 When we ended up working on the same project and I heard you speak, I caught myself smiling without even realizing it 😊 Your way of talking, your accent… and especially your smile — they stayed in my mind longer than I expected 🫶 Since then, I have always looked forward to our conversations. And on the days we do not talk, things feel just slightly incomplete 🌙 Somehow, you quietly became one of the nicest parts of my day ✨',
  },
  {
    size: 4,
    shuffleSteps: 38,
    label: 'Final Level - Love Master',
    note: 'If you let me, I would like to stay by your side — not to rush anything, just to share the little moments together 🌙 Sometimes I think of Winnie the Pooh — he does not force, he does not hurry… he just stays, quietly and patiently 🧸🤍 That is how I want to be with you. No pressure… just someone who cares, and is here.',
  },
]

const SPARKLE_POINTS = [
  { left: '8%', top: '20%', delay: '0s' },
  { left: '20%', top: '8%', delay: '0.12s' },
  { left: '35%', top: '16%', delay: '0.2s' },
  { left: '50%', top: '10%', delay: '0.34s' },
  { left: '66%', top: '16%', delay: '0.44s' },
  { left: '82%', top: '10%', delay: '0.54s' },
  { left: '92%', top: '24%', delay: '0.66s' },
  { left: '14%', top: '74%', delay: '0.26s' },
  { left: '30%', top: '86%', delay: '0.39s' },
  { left: '47%', top: '80%', delay: '0.48s' },
  { left: '63%', top: '88%', delay: '0.6s' },
  { left: '79%', top: '82%', delay: '0.73s' },
]

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function toPercent(position, size) {
  if (size <= 1) {
    return 0
  }

  return (position / (size - 1)) * 100
}

function PuzzleQuest({
  onComplete,
  onLevelComplete,
  isAdminEntry = false,
  levelImages = ['/love-photo.svg', '/love-photo.svg', '/love-photo.svg'],
}) {
  const [levelIndex, setLevelIndex] = useState(0)
  const [board, setBoard] = useState(() => shuffleBoard(LEVELS[0].size, LEVELS[0].shuffleSteps))
  const [seconds, setSeconds] = useState(0)
  const [showNote, setShowNote] = useState(false)
  const [completedLevels, setCompletedLevels] = useState(() => new Set())
  const [helpEnabled, setHelpEnabled] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const level = LEVELS[levelIndex]
  const imageSrc = levelImages[levelIndex] ?? levelImages[levelImages.length - 1] ?? '/love-photo.svg'

  const movableLookup = useMemo(() => {
    const map = new Set()
    board.forEach((value, index) => {
      if (value !== 0 && canMove(board, index, level.size)) {
        map.add(index)
      }
    })
    return map
  }, [board, level.size])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (!isSolved(board)) {
      return
    }

    if (showNote) {
      return
    }

    setCelebrating(true)
    setCompletedLevels((prev) => {
      const next = new Set(prev)
      next.add(levelIndex)
      return next
    })
    onLevelComplete?.(levelIndex + 1)

    const revealId = window.setTimeout(() => {
      setShowNote(true)
      setCelebrating(false)
    }, 1700)

    return () => window.clearTimeout(revealId)
  }, [board, showNote, levelIndex, onLevelComplete])

  function onTileClick(index) {
    setBoard((prev) => moveTile(prev, index, level.size))
  }

  function handleContinue() {
    if (!completedLevels.has(levelIndex)) {
      return
    }

    const isLastLevel = levelIndex === LEVELS.length - 1

    if (isLastLevel) {
      onComplete(seconds)
      return
    }

    const nextIndex = levelIndex + 1
    setLevelIndex(nextIndex)
    setBoard(shuffleBoard(LEVELS[nextIndex].size, LEVELS[nextIndex].shuffleSteps))
    setShowNote(false)
    setCelebrating(false)
  }

  function restartLevel() {
    setBoard(shuffleBoard(level.size, level.shuffleSteps))
    setShowNote(false)
    setCelebrating(false)
  }

  function unlockLevelNow() {
    setBoard(createSolvedBoard(level.size))
  }

  const totalTiles = level.size * level.size

  return (
    <section className="card puzzle-card">
      <p className="eyebrow">{level.label}</p>
      <h1>Slide The Photo Tiles</h1>
      <p className="subcopy">Win each level to unlock hidden messages. Tap a tile next to the empty space and rebuild the image.</p>

      <div className="stats-row">
        <span>Timer: {formatTime(seconds)}</span>
        <span>Grid: {level.size} x {level.size}</span>
      </div>

      <div className="puzzle-preview-wrap">
        <img src={imageSrc} alt="Reference" className="puzzle-preview" />
        <span>Reference</span>
      </div>

      <div className={`board-wrap ${celebrating ? 'is-celebrating' : ''}`}>
        <div className={`board ${celebrating ? 'board-celebrate' : ''}`} style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}>
        {Array.from({ length: totalTiles }).map((_, index) => {
          const value = board[index]
          const row = Math.floor(index / level.size)
          const col = index % level.size
          const cellX = toPercent(col, level.size)
          const cellY = toPercent(row, level.size)

          if (value === 0) {
            return (
              <div
                key={`empty-${index}`}
                className="tile empty image-tile ghost-tile"
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: `${level.size * 100}% ${level.size * 100}%`,
                  backgroundPosition: `${cellX}% ${cellY}%`,
                }}
                aria-hidden="true"
              />
            )
          }

          const solvedIndex = value - 1
          const solvedRow = Math.floor(solvedIndex / level.size)
          const solvedCol = solvedIndex % level.size
          const x = toPercent(solvedCol, level.size)
          const y = toPercent(solvedRow, level.size)

          return (
            <button
              key={`${value}-${index}`}
              type="button"
              className={`tile image-tile ${movableLookup.has(index) ? 'movable' : ''}`}
              onClick={() => onTileClick(index)}
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${level.size * 100}% ${level.size * 100}%`,
                backgroundPosition: `${x}% ${y}%`,
              }}
              aria-label={`Puzzle tile ${value}`}
            >
              {helpEnabled ? <span className="tile-index">{value}</span> : null}
            </button>
          )
        })}
        </div>

        {celebrating && (
          <div className="grid-celebrate-overlay" aria-hidden="true">
            {SPARKLE_POINTS.map((sparkle, index) => (
              <span
                key={`grid-${sparkle.left}-${sparkle.top}-${index}`}
                className="sparkle grid-sparkle"
                style={{ left: sparkle.left, top: sparkle.top, animationDelay: sparkle.delay }}
              >
                ✦
              </span>
            ))}
            <div className="grid-transition-card">
              <p>Here is my hidden message 💖</p>
            </div>
          </div>
        )}
      </div>

      <div className="controls-row">
        <button type="button" className="btn ghost" onClick={() => setHelpEnabled((prev) => !prev)}>
          {helpEnabled ? 'Help: Numbering On' : 'Help: Numbering Off'}
        </button>
        <button type="button" className="btn ghost" onClick={restartLevel}>
          Shuffle Level
        </button>
        {isAdminEntry ? (
          <button type="button" className="btn ghost" onClick={unlockLevelNow}>
            Stuck? Unlock Level
          </button>
        ) : null}
      </div>

      {showNote && (
        <div className="completion-overlay" role="status" aria-live="polite">
          <div className="sparkle-layer" aria-hidden="true">
            {SPARKLE_POINTS.map((sparkle, index) => (
              <span
                key={`${sparkle.left}-${sparkle.top}-${index}`}
                className="sparkle"
                style={{ left: sparkle.left, top: sparkle.top, animationDelay: sparkle.delay }}
              >
                ✦
              </span>
            ))}
          </div>

          <div className="note-pop celebration-card">
            <p className="celebrate-title">Level Complete, cutie 💖</p>
            <p>{level.note}</p>
            <button type="button" className="btn primary" onClick={handleContinue}>
              {levelIndex === LEVELS.length - 1 ? 'Open Love Letter' : 'Next Level'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default PuzzleQuest
