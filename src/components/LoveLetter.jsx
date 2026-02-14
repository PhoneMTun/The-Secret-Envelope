function LoveLetter({ letter, seconds, onNext }) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  return (
    <section className="card letter-card">
      <p className="eyebrow">you did it</p>
      <h1>The Envelope Is Open 💌</h1>
      <p className="subcopy">You solved every level in {mins}:{secs}. Beautiful and brilliant.</p>

      <article className="letter-paper">
        {letter.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </article>

      <button type="button" className="btn primary" onClick={onNext}>
        See The Ending
      </button>
    </section>
  )
}

export default LoveLetter
