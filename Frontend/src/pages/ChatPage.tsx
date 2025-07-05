// src/pages/ChatPage.tsx
import React, { useEffect, useState, useRef, type FormEvent } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getHistory, postMessage, type ChatMessage } from '../api/chatService';

interface ChatPageProps { currentUser: string }
import './ChatPage.css';


export default function ChatPage({ currentUser }: ChatPageProps) {
  const { withUser } = useParams<{ withUser: string }>();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [draft,  setDraft]  = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!withUser)    return <p>No chat partner specified.</p>;

  // load entire chat history
  const load = async () => {
    const msgs = await getHistory(currentUser, withUser);
    setHistory(msgs);
    // scroll to bottom
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  };

  useEffect(() => { load().catch(console.error) }, [withUser]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    try {
      await postMessage(currentUser, withUser, draft);
      setDraft('');
      await load();            // ← repopulate `history` with the new message
    } catch (err: any) {
      alert(`Failed to send: ${err.message}`);
    }
  };

  return (
    <div className="chat-page">
      <h2>Chat with {withUser}</h2>
      <div ref={boxRef} className="chat-history">
        {history.map(m => (
          <div key={m.id} className={`chat-msg ${m.fromUsername===currentUser?'me':'them'}`}>
            <strong>{m.fromUsername}</strong>
            <span className="text">{m.text}</span>
            <time>{new Date(m.sentAt).toLocaleTimeString()}</time>
          </div>
        ))}
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
