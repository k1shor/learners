import { useState } from 'react'
import { Link } from 'react-router-dom'
import profileAvatar from '../assets/profile-avatar.svg'
import './Profile.css'

const MAX_PROFILE_IMAGE_SIZE_BYTES = 8 * 1024 * 1024
const PROFILE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const Profile = ({ profile, onUpdateProfile }) => {
  const [form, setForm] = useState(() => ({
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    username: profile?.username ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    bio: profile?.bio ?? '',
    links: Array.isArray(profile?.links) ? profile.links : [],
    profilePicture: profile?.profilePicture ?? '',
  }))
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFormError('')
    setSaved(false)
  }

  const handleProfilePictureChange = (event) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''

    if (!file) return

    if (!PROFILE_IMAGE_TYPES.has(file.type)) {
      setFormError('Choose a JPG, PNG, or WebP image.')
      setSaved(false)
      return
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
      setFormError('Choose an image smaller than 8 MB.')
      setSaved(false)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setFormError('The selected image could not be read.')
        setSaved(false)
        return
      }

      const image = new Image()
      image.onload = () => {
        if (!image.naturalWidth || !image.naturalHeight) {
          setFormError('The selected image could not be opened.')
          setSaved(false)
          return
        }

        const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight))
        const width = Math.max(1, Math.round(image.naturalWidth * scale))
        const height = Math.max(1, Math.round(image.naturalHeight * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        if (!context) {
          setFormError('Your browser could not process this image.')
          setSaved(false)
          return
        }

        context.fillStyle = '#fff'
        context.fillRect(0, 0, width, height)
        context.drawImage(image, 0, 0, width, height)

        let profilePicture
        try {
          profilePicture = canvas.toDataURL('image/jpeg', 0.85)
        } catch {
          setFormError('Your browser could not process this image.')
          setSaved(false)
          return
        }

        setForm((current) => ({ ...current, profilePicture }))
        setFormError('')
        setSaved(false)
      }
      image.onerror = () => {
        setFormError('The selected image could not be opened.')
        setSaved(false)
      }
      image.src = reader.result
    }
    reader.onerror = () => {
      setFormError('The selected image could not be read.')
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  const removeProfilePicture = () => {
    setForm((current) => ({ ...current, profilePicture: '' }))
    setFormError('')
    setSaved(false)
  }

  const updateLink = (index, key, value) => {
    setForm((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [key]: value } : link,
      ),
    }))
    setFormError('')
    setSaved(false)
  }

  const addLink = () => {
    setForm((current) => ({
      ...current,
      links: [...current.links, { label: '', url: '' }],
    }))
    setSaved(false)
  }

  const removeLink = (index) => {
    setForm((current) => ({
      ...current,
      links: current.links.filter((_, linkIndex) => linkIndex !== index),
    }))
    setSaved(false)
  }

  const saveProfile = (event) => {
    event.preventDefault()

    const hasIncompleteLink = form.links.some(
      (link) => Boolean(link.label.trim()) !== Boolean(link.url.trim()),
    )
    if (hasIncompleteLink) {
      setFormError('Add both a name and a URL for each profile link.')
      return
    }

    onUpdateProfile({
      ...profile,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      links: form.links.filter((link) => link.label.trim() && link.url.trim()),
      profilePicture: form.profilePicture,
    })
    setSaved(true)
    setFormError('')
  }

  return (
    <section className="profile-page">
      <div className="profile-editor-card">
        <header className="profile-editor-heading">
          <p className="profile-editor-eyebrow">YOUR ACCOUNT</p>
          <h1>My profile</h1>
          <p>Update how your profile appears to others.</p>
        </header>

        <form className="profile-form" onSubmit={saveProfile}>
          <section className="profile-picture-field" aria-labelledby="profile-picture-heading">
            <img
              className="profile-picture-preview"
              src={form.profilePicture || profileAvatar}
              alt={form.profilePicture ? 'Profile picture preview' : 'Default profile picture'}
            />
            <div className="profile-picture-details">
              <h2 id="profile-picture-heading">Profile picture</h2>
              <p>Choose a JPG, PNG, or WebP image up to 8 MB.</p>
              <div className="profile-picture-actions">
                <label className="profile-add-link profile-picture-upload">
                  Choose picture
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    aria-label="Upload profile picture"
                    onChange={handleProfilePictureChange}
                    type="file"
                  />
                </label>
                {form.profilePicture && (
                  <button
                    className="profile-remove-link"
                    onClick={removeProfilePicture}
                    type="button"
                  >
                    Remove picture
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="profile-fields">
            <label className="profile-field">
              <span>First name</span>
              <input autoComplete="given-name" name="firstName" onChange={updateField} value={form.firstName} />
            </label>
            <label className="profile-field">
              <span>Last name</span>
              <input autoComplete="family-name" name="lastName" onChange={updateField} value={form.lastName} />
            </label>
            <label className="profile-field">
              <span>Username</span>
              <input
                autoComplete="username"
                minLength="3"
                name="username"
                onChange={updateField}
                pattern="[A-Za-z0-9_]+"
                title="Use at least 3 letters, numbers, or underscores."
                value={form.username}
              />
            </label>
            <label className="profile-field">
              <span>Email address</span>
              <input autoComplete="email" name="email" onChange={updateField} type="email" value={form.email} />
            </label>
            <label className="profile-field">
              <span>Phone number</span>
              <input autoComplete="tel" name="phone" onChange={updateField} type="tel" value={form.phone} />
            </label>
            <label className="profile-field profile-field-wide">
              <span>Bio</span>
              <textarea
                maxLength="500"
                name="bio"
                onChange={updateField}
                placeholder="Tell people a little about yourself"
                rows="4"
                value={form.bio}
              />
              <small>{form.bio.length}/500 characters</small>
            </label>
          </div>

          <section className="profile-links" aria-labelledby="profile-links-heading">
            <div className="profile-links-heading">
              <div>
                <h2 id="profile-links-heading">Profile links</h2>
                <p>Add websites, social profiles, or other links.</p>
              </div>
              <button className="profile-add-link" onClick={addLink} type="button">Add link</button>
            </div>

            {form.links.map((link, index) => (
              <div className="profile-link-row" key={`profile-link-${index}`}>
                <label className="profile-field">
                  <span>Link name</span>
                  <input
                    onChange={(event) => updateLink(index, 'label', event.target.value)}
                    placeholder="LinkedIn, portfolio, etc."
                    value={link.label}
                  />
                </label>
                <label className="profile-field">
                  <span>URL</span>
                  <input
                    onChange={(event) => updateLink(index, 'url', event.target.value)}
                    placeholder="https://"
                    type="url"
                    value={link.url}
                  />
                </label>
                <button
                  aria-label={`Remove link ${index + 1}`}
                  className="profile-remove-link"
                  onClick={() => removeLink(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          {formError && <p className="profile-form-error" role="alert">{formError}</p>}
          {saved && <p className="profile-form-success" role="status">Profile updated.</p>}

          <button className="profile-save-button" type="submit">Save profile</button>
        </form>

        <p className="profile-back">
          <Link to="/dashboard">← Back to dashboard</Link>
        </p>
      </div>
    </section>
  )
}

export default Profile
