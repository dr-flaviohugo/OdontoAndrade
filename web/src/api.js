const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function improveText({ text, tone, language }) {
  const res = await fetch(`${BASE_URL}/api/improve-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tone, language }),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Erro ${res.status}`);
  }
  return res.json();
}

export async function sendMessage({ to, message, autoImprove, tone, language }) {
  const res = await fetch(`${BASE_URL}/api/send-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message, autoImprove, tone, language }),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Erro ${res.status}`);
  }
  return res.json();
}

export async function getInbox() {
  const res = await fetch(`${BASE_URL}/api/inbox`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export async function getMessages(phone) {
  const url = new URL(`${BASE_URL}/api/messages`);
  url.searchParams.set('phone', phone);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function safeJson(res){
  try{ return await res.json(); }catch{ return null; }
}
