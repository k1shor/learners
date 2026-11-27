import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'

const Signup = ({ onSignup }) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const submitSignup = (event) => {
    event.preventDefault()

    if (password !== passwordConfirmation) {
      setPasswordError('Your passwords do not match.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const profile = Object.fromEntries(formData.entries())
    delete profile.password
    delete profile.passwordConfirmation
    delete profile.terms

    onSignup(profile)
    navigate('/dashboard')
  }

  return (
    <section className="signup-page">
      <div className="signup-card">
        <div className="signup-heading">
          <p className="signup-eyebrow">JOIN E-LEARNERS HUB</p>
          <h1>Create your account</h1>
          <p>Set up your learner profile to get started.</p>
        </div>

        <form className="signup-form" onSubmit={submitSignup}>
          <div className="signup-fields">
            <label className="signup-field">
              <span>First name</span>
              <input autoComplete="given-name" name="firstName" required />
            </label>
            <label className="signup-field">
              <span>Last name</span>
              <input autoComplete="family-name" name="lastName" required />
            </label>
            <label className="signup-field">
              <span>Username</span>
              <input
                autoComplete="username"
                minLength="3"
                name="username"
                pattern="[A-Za-z0-9_]+"
                required
                title="Use at least 3 letters, numbers, or underscores."
              />
            </label>
            <label className="signup-field">
              <span>Date of birth</span>
              <input autoComplete="bday" max={new Date().toISOString().slice(0, 10)} name="birthDate" type="date" required />
            </label>
            <label className="signup-field">
              <span>Email address</span>
              <input autoComplete="email" name="email" type="email" required />
            </label>
            <label className="signup-field">
              <span>Phone number <small>(optional)</small></span>
              <input autoComplete="tel" name="phone" type="tel" />
            </label>
            <label className="signup-field">
              <span>Password</span>
              <input
                autoComplete="new-password"
                minLength="8"
                name="password"
                onChange={(event) => {
                  setPassword(event.target.value)
                  setPasswordError('')
                }}
                required
                type="password"
              />
            </label>
            <label className="signup-field">
              <span>Confirm password</span>
              <input
                autoComplete="new-password"
                minLength="8"
                name="passwordConfirmation"
                onChange={(event) => {
                  setPasswordConfirmation(event.target.value)
                  setPasswordError('')
                }}
                required
                type="password"
              />
            </label>
          </div>

          {passwordError && <p className="signup-error" role="alert">{passwordError}</p>}

          <label className="signup-terms">
            <input name="terms" required type="checkbox" />
            <span>I agree to the terms and confirm that the information above is accurate.</span>
          </label>

          <p className="signup-notice">
            This demo keeps your profile in this browser session only. It does not create a server-backed account.
          </p>

          <button className="signup-submit" type="submit">Create account</button>
        </form>

        <p className="signup-back">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </section>
  )
}

export default Signup
