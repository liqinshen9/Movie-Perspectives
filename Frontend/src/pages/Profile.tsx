import React, { useEffect, useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCurrentUser } from '../api/authService'
import './Profile.css'

const AVATAR_COLORS = [
  '#e57373', '#f06292', '#ba68c8',
  '#9575cd', '#7986cb', '#4fc3f7',
  '#4dd0e1', '#4db6ac', '#81c784',
  '#aed581', '#ffb74d', '#ff8a65'
]

function getAvatarColor(name: string): string {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

interface PrivateInfo {
  phone: string
  email: string
  occupation: string
}

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const currentUser = getCurrentUser()
  const [followers, setFollowers]     = useState<string[]>([])
  const [following, setFollowing]     = useState<string[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [intro, setIntro]             = useState('')
  const [draftIntro, setDraftIntro]   = useState('')
  const [editingIntro, setEditingIntro] = useState(false)

  const [privateInfo, setPrivateInfo]     = useState<PrivateInfo>({ phone: '', email: '', occupation: '' })
  const [draftPrivate, setDraftPrivate]   = useState<PrivateInfo>(privateInfo)
  const [editingPrivate, setEditingPrivate] = useState(false)

  const loadProfile = async () => {
    if (!username) return

    // introduction
    const introRes = await fetch(`/api/user/${encodeURIComponent(username)}/introduction`)
    if (introRes.ok) {
      const { introduction } = await introRes.json()
      setIntro(introduction || '')
    }

    // followers
    const fRes = await fetch(`/api/user/${encodeURIComponent(username)}/followers`)
    if (fRes.ok) {
      const fData: string[] = await fRes.json()
      setFollowers(fData)
      setIsFollowing(!!currentUser && fData.includes(currentUser))
    }

    // following
    const foRes = await fetch(`/api/user/${encodeURIComponent(username)}/following`)
    if (foRes.ok) {
      setFollowing(await foRes.json())
    }

    // private info (only owner)
    if (currentUser === username) {
      const pRes = await fetch(`/api/user/${encodeURIComponent(username)}/private`)
      if (pRes.ok) {
        setPrivateInfo(await pRes.json())
      }
    }
  }

  useEffect(() => {
    loadProfile().catch(console.error)
  }, [username])

  const saveIntro = async (e: FormEvent) => {
    e.preventDefault()
    if (!username) return
    const res = await fetch(
      `/api/user/${encodeURIComponent(username)}/introduction`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ introduction: draftIntro })
      }
    )
    if (res.ok) {
      setIntro(draftIntro)
      setEditingIntro(false)
    }
  }

  const savePrivate = async (e: FormEvent) => {
    e.preventDefault()
    if (!username) return
    const res = await fetch(
      `/api/user/${encodeURIComponent(username)}/private`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftPrivate)
      }
    )
    if (res.ok) {
      setPrivateInfo(draftPrivate)
      setEditingPrivate(false)
    }
  }

  const toggleFollow = async () => {
    if (!currentUser || !username) return
    const res = await fetch(
      `/api/user/${encodeURIComponent(username)}/follow`,
      {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerUsername: currentUser,
          followeeUsername: username
        })
      }
    )
    if (res.ok) await loadProfile()
  }

  const removeFollower = async (f: string) => {
    if (!username) return
    const res = await fetch(
      `/api/user/${encodeURIComponent(username)}/follow`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerUsername: f,
          followeeUsername: username
        })
      }
    )
    if (res.ok) await loadProfile()
  }

  const initial     = username?.charAt(0).toUpperCase() || '?'
  const avatarColor = getAvatarColor(username!)

  return (
    <div className="profile-page">
      <h2>Profile: {username}</h2>

      <div className="profile-header">
        <div className="avatar-large" style={{ background: avatarColor }}>
          {initial}
        </div>
        <div className="profile-info">
          <p><strong>Username:</strong> {username}</p>
          {currentUser && currentUser !== username && (
            <>
              <button
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={toggleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <Link to={`/chat/${username}`}>
                <button style={{ marginLeft: 8 }}>Message</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <section className="profile-intro-section">
        <h3>Introduction</h3>
        {!editingIntro ? (
          <>
            <p>{intro || <em>No introduction yet.</em>}</p>
            {currentUser === username && (
              <button
                onClick={() => {
                  setDraftIntro(intro)
                  setEditingIntro(true)
                }}
              >
                {intro ? 'Edit' : 'Add'}
              </button>
            )}
          </>
        ) : (
          <form onSubmit={saveIntro} className="profile-intro-edit">
            <textarea
              value={draftIntro}
              onChange={e => setDraftIntro(e.target.value)}
              rows={4}
              placeholder="Write your introduction…"
            />
            <div className="intro-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingIntro(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {currentUser === username && (
        <section className="profile-private-section">
          <h3>Contact & Occupation</h3>
          {!editingPrivate ? (
            <>
              <p><strong>Phone:</strong> {privateInfo.phone || <em>Not set</em>}</p>
              <p><strong>Email:</strong> {privateInfo.email || <em>Not set</em>}</p>
              <p><strong>Occupation:</strong> {privateInfo.occupation || <em>Not set</em>}</p>
              <button
                onClick={() => {
                  setDraftPrivate(privateInfo)
                  setEditingPrivate(true)
                }}
              >
                {privateInfo.phone || privateInfo.email || privateInfo.occupation ? 'Edit' : 'Add'}
              </button>
            </>
          ) : (
            <form onSubmit={savePrivate} className="profile-private-edit">
              <label>
                Phone:
                <input
                  type="text"
                  value={draftPrivate.phone}
                  onChange={e => setDraftPrivate({ ...draftPrivate, phone: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={draftPrivate.email}
                  onChange={e => setDraftPrivate({ ...draftPrivate, email: e.target.value })}
                />
              </label>
              <label>
                Occupation:
                <input
                  type="text"
                  value={draftPrivate.occupation}
                  onChange={e => setDraftPrivate({ ...draftPrivate, occupation: e.target.value })}
                />
              </label>
              <div className="private-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingPrivate(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <div className="lists">
        <section>
          <h3>Followers ({followers.length})</h3>
          <ul>
            {followers.map(u => (
              <li key={u} className="user-list-item">
                <Link to={`/profile/${u}`} className="user-link">
                  <div className="avatar-small" style={{ background: getAvatarColor(u) }}>
                    {u[0].toUpperCase()}
                  </div>
                  {u}
                </Link>
                {currentUser === username && u !== username && (
                  <button className="remove-button" onClick={() => removeFollower(u)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Following ({following.length})</h3>
          <ul>
            {following.map(u => (
              <li key={u} className="user-list-item">
                <Link to={`/profile/${u}`} className="user-link">
                  <div className="avatar-small" style={{ background: getAvatarColor(u) }}>
                    {u[0].toUpperCase()}
                  </div>
                  {u}
                </Link>
                {currentUser === username && u !== username && (
                  <button className="remove-button" onClick={() => removeFollower(u)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
