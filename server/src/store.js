const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'server', 'data');
const dataFile = path.join(dataDir, 'messages.json');

function ensure(){
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ messages: [] }, null, 2));
}

function read(){
  ensure();
  const raw = fs.readFileSync(dataFile, 'utf8');
  try { return JSON.parse(raw); } catch { return { messages: [] }; }
}

function write(data){
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function saveInbound({ phone, body, waId, ts, status = 'received' }){
  const db = read();
  db.messages.push({ phone, direction: 'in', body: body || '', wa_message_id: waId || null, status, ts: ts || Date.now() });
  write(db);
}

function saveOutbound({ phone, body, waId, ts, status = 'sent' }){
  const db = read();
  db.messages.push({ phone, direction: 'out', body: body || '', wa_message_id: waId || null, status, ts: ts || Date.now() });
  write(db);
}

function updateStatus({ waId, status, ts }){
  if (!waId) return;
  const db = read();
  for (const m of db.messages) {
    if (m.wa_message_id === waId) {
      m.status = status || m.status;
      m.ts = ts || m.ts;
      break;
    }
  }
  write(db);
}

function listInbox({ limit = 50 } = {}){
  const db = read();
  const byPhone = new Map();
  for (const m of db.messages) {
    const cur = byPhone.get(m.phone);
    if (!cur || m.ts > cur.last_ts) {
      byPhone.set(m.phone, { phone: m.phone, last_ts: m.ts, last_body: m.body, last_direction: m.direction });
    }
  }
  return Array.from(byPhone.values())
    .sort((a,b)=> b.last_ts - a.last_ts)
    .slice(0, limit);
}

function listThread({ phone, limit = 100 } = {}){
  const db = read();
  return db.messages
    .filter(m => m.phone === phone)
    .sort((a,b)=> a.ts - b.ts)
    .slice(-limit);
}

module.exports = { saveInbound, saveOutbound, updateStatus, listInbox, listThread };

