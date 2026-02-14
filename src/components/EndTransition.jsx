function EndTransition({ onReplay }) {
  return (
    <section className="card end-card">
      <p className="eyebrow">the end</p>
      <h1>Our little love quest is complete.</h1>
      <p className="subcopy">Thank you for playing my heart out.</p>
      <div className="end-glow" aria-hidden="true">
        <span>✦</span>
        <span>♥</span>
        <span>✦</span>
      </div>
      <button type="button" className="btn primary" onClick={onReplay}>
        Play Again
      </button>
    </section>
  )
}

export default EndTransition
