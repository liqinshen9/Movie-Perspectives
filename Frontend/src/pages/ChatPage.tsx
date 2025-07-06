import React, { useEffect, useState, useRef, type FormEvent } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getHistory, postMessage, type ChatMessage } from '../api/chatService';
import './ChatPage.css';

interface ChatPageProps {
  currentUser: string;
}

export default function ChatPage({ currentUser }: ChatPageProps) {
  const { withUser } = useParams<{ withUser: string }>();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [draft,  setDraft]  = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!withUser)    return <p>No chat partner specified.</p>;


  const load = async () => {
    const msgs = await getHistory(currentUser, withUser);
    msgs.sort((a, b) =>
      new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
    setHistory(msgs);
  };

  useEffect(() => {
    load().catch(console.error);
  }, [withUser]);

 
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo(0, boxRef.current.scrollHeight);
    }
  }, [history]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    try {
      await postMessage(currentUser, withUser, draft);
      setDraft('');
      await load();  
    } catch (err: any) {
      alert(`Failed to send: ${err.message}`);
    }
  };

  
  const recall = async (id: number) => {
    if (!confirm('Recall this message?')) return;
    const res = await fetch(
      `/api/chat/${id}?me=${encodeURIComponent(currentUser)}`,
      { method: 'DELETE' }
    );
    if (res.ok) {
      await load();  
    } else {
      const text = await res.text().catch(() => res.statusText);
      alert(`Failed to recall: ${text}`);
    }
  };

  return (
    <div className="chat-page">
      <h2>Chat with {withUser}</h2>

      <div ref={boxRef} className="chat-history">
        {history.map(m => {
          const mine = m.fromUsername === currentUser;
          return (
            <div
              key={m.id}
              className={`chat-msg-container ${mine ? 'me' : 'them'}`}
            >
              <div className={`chat-msg ${mine ? 'me' : 'them'}`}>
                <strong>{m.fromUsername}</strong>
                <span className="text">{m.text}</span>
                <time>{new Date(m.sentAt).toLocaleTimeString()}</time>
              </div>
              {mine && (
                <button
                  className="recall-button"
                  onClick={() => recall(m.id)}
                  aria-label="Recall message"
                >
                  ↩
                </button>
              )}
            </div>
          );
        })}
      </div>

      <form className="chat-input" onSubmit={send}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type your message…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
