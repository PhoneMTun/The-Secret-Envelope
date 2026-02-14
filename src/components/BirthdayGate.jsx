import { useState } from 'react'
import { trackEntryAttempt } from '../services/tracking'

function BirthdayGate({ expectedBirthday, adminBirthday, onUnlock, nickname }) {
  const [birthday, setBirthday] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const isAdminAttempt = birthday === adminBirthday

    if (birthday === expectedBirthday || birthday === adminBirthday) {
      void trackEntryAttempt({ wasSuccessful: true, isAdminAttempt })
      setError('')
      onUnlock(birthday === adminBirthday)
      return
    }

    void trackEntryAttempt({ wasSuccessful: false, isAdminAttempt })
    setError('Nice try, fake Valentine. If it is really you, try your birthday again. 💌')
  }

  return (
    <section className="card gate-card">
      <p className="eyebrow">private little world</p>
      <h1>Only my true Valentine can enter</h1>
      <p className="subcopy">If that is you, {nickname}, use your birthday key to open our love quest.</p>

      <form onSubmit={handleSubmit} className="gate-form">
        <label htmlFor="birthday" className="label">
          Your birthday
        </label>
        <input
          id="birthday"
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
          required
        />
        <button type="submit" className="btn primary">
          Unlock My Heart
        </button>
      </form>

      {error ? <p className="feedback error">{error}</p> : <p className="feedback">You get unlimited cute attempts.</p>}
    </section>
  )
}

export default BirthdayGate
