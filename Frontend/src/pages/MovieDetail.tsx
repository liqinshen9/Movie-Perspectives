import React, { useEffect, useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieById } from '../api/movieService'
import {
  getAllReviews,
  postReview,
  deleteReview
} from '../api/reviewService'
import type { Movie } from '../models/Movie'
import type { Review } from '../models/Review'
import './MovieDetail.css'

interface MovieDetailProps {
  username: string
}

interface ReviewNode extends Review {
  replies: ReviewNode[]
}

function buildTree(flat: Review[]): ReviewNode[] {
  const map = new Map<number, ReviewNode>()
  flat.forEach(r => map.set(r.id, { ...r, replies: [] }))
  const roots: ReviewNode[] = []
  map.forEach(node => {
    if (node.parentId == null) {
      roots.push(node)
    } else {
      const p = map.get(node.parentId)
      if (p) p.replies.push(node)
    }
  })
  return roots
}

export default function MovieDetail({ username }: MovieDetailProps) {
  const { id } = useParams<{ id: string }>()
  const movieId = Number(id)

  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  const load = async () => {
    try {
      const all = await getAllReviews(movieId)
      setReviews(all)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!movieId) return
    getMovieById(movieId).then(setMovie).catch(console.error)
    load()
  }, [movieId])

  const submitReview = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await postReview({ movieId, rating, text, username })
      setText('')
      setRating(5)
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const submitReply = async (e: FormEvent) => {
    e.preventDefault()
    if (replyTo == null) return
    try {
      await postReview({
        movieId,
        rating: 0,
        text: replyText,
        username,
        parentId: replyTo
      })
      setReplyText('')
      setReplyTo(null)
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const onDelete = async (id: number, author: string) => {
    if (author !== username) return
    await deleteReview(id, username)
    await load()
  }

  if (!movie) return <p className="loading">Loading…</p>

  const tree = buildTree(reviews)

  return (
    <div className="movie-detail">
      <h1 className="title">{movie.title}</h1>
      <div className="poster-container">
        <img src={movie.photoUrl} alt={movie.title} className="movie-poster" />
      </div>
      <p className="movie-intro">{movie.introduction}</p>

      <section className="reviews-section">
        <h2>Reviews</h2>
        {tree.length === 0 && <p>No reviews yet.</p>}
        <div className="reviews-list">
          {tree.map(node => (
            <ReviewCard
              key={node.id}
              node={node}
              level={0}
              currentUser={username}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={submitReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      </section>

      <section className="review-form-section">
        <h2>Leave a review</h2>
        <form className="review-form" onSubmit={submitReview}>
          <label>
            Rating:
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{'★'.repeat(n)}</option>
              ))}
            </select>
          </label>
          <textarea
            placeholder="Please leave a review"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </section>
    </div>
  )
}

interface ReviewCardProps {
  node: ReviewNode
  level: number
  currentUser: string
  replyTo: number | null
  setReplyTo: (id: number | null) => void
  replyText: string
  setReplyText: (t: string) => void
  onSubmitReply: (e: FormEvent) => void
  onDelete: (id: number, author: string) => void
}

function ReviewCard({
  node,
  level,
  currentUser,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  onSubmitReply,
  onDelete
}: ReviewCardProps) {
  const isReplying = replyTo === node.id
  const initial = node.username.charAt(0).toUpperCase()

  return (
    <div className="review-card" style={{ marginLeft: level * 20 }}>
      <div className="review-header">
        <Link to={`/profile/${node.username}`} className="avatar-link">
          <div className="avatar-small">{initial}</div>
        </Link>
        <Link to={`/profile/${node.username}`} className="username-link">
          {node.username}
        </Link>
        {node.reviewDate && (
          <span className="review-date">
            {new Date(node.reviewDate).toLocaleString()}
          </span>
        )}
        <span className="stars">{'★'.repeat(node.rating)}</span>
      </div>

      <p className="review-text">{node.text}</p>

      <div className="review-actions">
        <button
          type="button"
          onClick={() => setReplyTo(isReplying ? null : node.id)}
        >
          {isReplying ? 'Cancel' : 'Reply'}
        </button>

        {node.username === currentUser && (
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(node.id, node.username)}
          >
            Delete
          </button>
        )}
      </div>

      {isReplying && (
        <form className="reply-form" onSubmit={onSubmitReply}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={3}
            placeholder="Your reply…"
          />
          <button type="submit" className="submit-button">
            Post reply
          </button>
        </form>
      )}

      {node.replies.map(child => (
        <ReviewCard
          key={child.id}
          node={child}
          level={level + 1}
          currentUser={currentUser}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          replyText={replyText}
          setReplyText={setReplyText}
          onSubmitReply={onSubmitReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
