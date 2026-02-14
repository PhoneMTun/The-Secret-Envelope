import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BirthdayGate from './components/BirthdayGate'
import EntryTransition from './components/EntryTransition'
import EndTransition from './components/EndTransition'
import LoveLetter from './components/LoveLetter'
import PuzzleQuest from './components/PuzzleQuest'
import WelcomeScene from './components/WelcomeScene'
import { completePlaySession, startPlaySession, trackLevelReached } from './services/tracking'

const SETTINGS = {
  nickname: 'My Sunshine',
  expectedBirthday: '1996-07-23',
  adminBirthday: '7777-07-07',
  puzzleImages: ['/pooh1.jpg', '/pooh2.png', '/pooh3.jpg'],
  musicTrack: '/love-song.mp3',
  letter: [
    'Hahaha, well doneee! 🎉😄',
    'Honestly… I care about you a lot 🤍',
    'Maybe more than I usually know how to say 🫶',
    'I made this little game just to show you how special you are to me 🎮✨',
    'I simply wanted you to know that.',
    'I hope it made you smile 😊',
    'Wishing you lots of happiness in all the years ahead 🌷',
    'From someone who holds you a little closer in their heart 💫',
  ],
}

function App() {
  const [stage, setStage] = useState('gate')
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [finalTime, setFinalTime] = useState(0)
  const [isAdminEntry, setIsAdminEntry] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const audioRef = useRef(null)

  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${6 + Math.random() * 6}s`,
      })),
    [],
  )

  useEffect(() => {
    const audio = new Audio(SETTINGS.musicTrack)
    audio.loop = true
    audio.volume = 0.45
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (stage !== 'entry') {
      return
    }

    const nextId = window.setTimeout(() => {
      setStage('welcome')
    }, 5000)

    return () => window.clearTimeout(nextId)
  }, [stage])

  async function playMusic() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    try {
      await audio.play()
      setMusicEnabled(true)
    } catch {
      setMusicEnabled(false)
    }
  }

  function pauseMusic() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    setMusicEnabled(false)
  }

  async function handleMusicToggle() {
    if (musicEnabled) {
      pauseMusic()
      return
    }

    await playMusic()
  }

  function handleUnlock(adminUnlocked) {
    setIsAdminEntry(Boolean(adminUnlocked))
    setStage('entry')
    void playMusic()
  }

  async function handleStartQuest() {
    const nextSessionId = await startPlaySession({ isAdminEntry })
    setSessionId(nextSessionId)
    setStage('game')
  }

  const handleLevelComplete = useCallback(
    (levelReached) => {
      void trackLevelReached(sessionId, levelReached)
    },
    [sessionId],
  )

  const handleGameComplete = useCallback(
    (seconds) => {
      void completePlaySession(sessionId, seconds)
      setFinalTime(seconds)
      setStage('letter')
    },
    [sessionId],
  )

  function handleReplay() {
    setFinalTime(0)
    setIsAdminEntry(false)
    setSessionId(null)
    setStage('welcome')
  }

  return (
    <main className={`app-shell ${musicEnabled ? 'music-on' : ''}`}>
      <div className="bg-glow" aria-hidden="true" />

      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="heart"
            style={{ left: heart.left, animationDelay: heart.delay, animationDuration: heart.duration }}
          >
            ♥
          </span>
        ))}
      </div>

      {stage === 'gate' && (
        <BirthdayGate
          expectedBirthday={SETTINGS.expectedBirthday}
          adminBirthday={SETTINGS.adminBirthday}
          nickname={SETTINGS.nickname}
          onUnlock={handleUnlock}
        />
      )}

      {stage === 'entry' && <EntryTransition />}

      {stage === 'welcome' && (
        <WelcomeScene
          nickname={SETTINGS.nickname}
          musicEnabled={musicEnabled}
          onToggleMusic={handleMusicToggle}
          onStart={handleStartQuest}
        />
      )}

      {stage === 'game' && (
        <PuzzleQuest
          isAdminEntry={isAdminEntry}
          levelImages={SETTINGS.puzzleImages}
          onLevelComplete={handleLevelComplete}
          onComplete={handleGameComplete}
        />
      )}

      {stage === 'letter' && <LoveLetter letter={SETTINGS.letter} seconds={finalTime} onNext={() => setStage('ending')} />}

      {stage === 'ending' && (
        <EndTransition
          onReplay={handleReplay}
        />
      )}
    </main>
  )
}

export default App
