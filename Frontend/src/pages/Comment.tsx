import React, { useState } from 'react';
import type { FormEvent } from 'react';
import type { Review } from '../models/Review';
import './Comment.css';

export interface ReviewNode extends Review {
  parentId?: number | null;
  replies: ReviewNode[];
}

interface CommentProps {
  node: ReviewNode;
  currentUser: string;
  onReply: (parentId: number, text: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function Comment({
  node,
  currentUser,
  onReply,
  onDelete
}: CommentProps) {
  const [replying,  setReplying]  = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [text,      setText]      = useState('');

  const submitReply = async (e: FormEvent) => {
    e.preventDefault();
    await onReply(node.id, text);
    setText('');
    setReplying(false);
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <strong>{node.username}</strong>
        {node.rating > 0 && (
          <span className="stars">{'★'.repeat(node.rating)}</span>
        )}
      </div>
      <p className="comment-text">{node.text}</p>

      <div className="comment-actions">
        <button onClick={() => setReplying(r => !r)}>
          {replying ? 'Cancel' : 'Reply'}
        </button>
        {node.username === currentUser && (
          <button onClick={() => onDelete(node.id)}>
            Delete
          </button>
        )}
        {node.replies.length > 0 && (
          <button onClick={() => setCollapsed(c => !c)}>
            {collapsed
              ? `Expand (${node.replies.length})`
              : 'Collapse'}
          </button>
        )}
      </div>

      {replying && (
        <form className="reply-form" onSubmit={submitReply}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Your reply…"
            rows={3}
          />
          <button type="submit">Post reply</button>
        </form>
      )}

      {!collapsed && node.replies.length > 0 && (
        <div className="replies-list">
          {node.replies.map(child => (
            <Comment
              key={child.id}
              node={child}
              currentUser={currentUser}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
