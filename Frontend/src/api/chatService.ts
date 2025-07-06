export interface ChatMessage {
  id: number;
  fromUsername: string;
  toUsername: string;
  text: string;
  sentAt: string;
}
export async function getHistory(
  me: string,
  withUser: string
): Promise<ChatMessage[]> {
  const res = await fetch(
    `/api/chat/${encodeURIComponent(withUser)}?me=${encodeURIComponent(me)}`
  );
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
export async function postMessage(
  fromUsername: string,
  toUsername: string,
  text: string
): Promise<ChatMessage> {
  const res = await fetch(`/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromUsername, toUsername, text })
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
