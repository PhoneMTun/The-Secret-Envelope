function WelcomeScene({ nickname, onStart, musicEnabled, onToggleMusic }) {
  return (
    <section className="card welcome-card">
      <p className="eyebrow">valentine quest</p>
      <h1>She&apos;s here. The real one is here. All fake entries rejected, {nickname}.</h1>
      <p className="subcopy">
        Put your speakers on, my valentine. Win each level and unlock my hidden messages.
      </p>

      <div className="controls-row">
        <button type="button" className="btn ghost" onClick={onToggleMusic}>
          {musicEnabled ? 'Music: On' : 'Music: Off'}
        </button>
        <button type="button" className="btn primary" onClick={onStart}>
          Start The Quest
        </button>
      </div>
    </section>
  )
}

export default WelcomeScene
