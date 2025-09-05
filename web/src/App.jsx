import { useEffect, useMemo, useState } from 'react'
import { improveText, sendMessage, getInbox, getMessages } from './api'

const TONES = [
  { value: 'profissional e cordial', label: 'Profissional e cordial' },
  { value: 'amigável', label: 'Amigável' },
  { value: 'objetivo', label: 'Objetivo' }
]

const DEFAULT_TEMPLATE = `Olá {nome}, aqui é da Clínica Odontológica.
Posso ajudar com seu agendamento?`;

const TEMPLATES = [
  { key:'greeting', name:'Saudação / Primeiro contato', text: DEFAULT_TEMPLATE },
  { key:'confirm', name:'Confirmação de consulta', text: 'Olá {nome}, confirmando sua consulta no dia {data} às {hora}. Pode confirmar por favor?' },
  { key:'followup', name:'Follow-up pós-procedimento', text: 'Olá {nome}, como você está após o procedimento de {procedimento}? Qualquer desconforto, nos avise. Estamos à disposição.' },
  { key:'budget', name:'Envio de orçamento', text: 'Olá {nome}, conforme combinado, segue o orçamento estimado para {procedimento}: R$ {valor}. Dúvidas, fico à disposição.' }
]

export default function App(){
  const [to, setTo] = useState('')
  const [tone, setTone] = useState(TONES[0].value)
  const [language, setLanguage] = useState('pt-BR')
  const [message, setMessage] = useState('')
  const [template, setTemplate] = useState('')
  const [improved, setImproved] = useState('')
  const [autoImprove, setAutoImprove] = useState(true)
  const [busyImprove, setBusyImprove] = useState(false)
  const [busySend, setBusySend] = useState(false)
  const [log, setLog] = useState('')
  const [inbox, setInbox] = useState([])
  const [selected, setSelected] = useState('')
  const [thread, setThread] = useState([])

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const canImprove = useMemo(()=> message.trim().length>0, [message])
  const canSend = useMemo(()=> (selected || to).trim().length>5 && (autoImprove || message.trim().length>0), [selected, to, message, autoImprove])

  function applyTemplate(key){
    const t = TEMPLATES.find(x=>x.key===key)
    if(!t) return
    setTemplate(key)
    setMessage(t.text)
    setImproved('')
  }

  async function onImprove(){
    if(!canImprove) return
    setBusyImprove(true)
    setLog('')
    try{
      const res = await improveText({ text: message, tone, language })
      setImproved(res.improvedText)
      setLog('Texto melhorado com sucesso.')
    }catch(err){
      setLog(String(err.message||err))
    }finally{
      setBusyImprove(false)
    }
  }

  async function onSend(){
    if(!canSend) return
    setBusySend(true)
    setLog('')
    try{
      const dest = (selected || to)
      const res = await sendMessage({ to: dest, message, autoImprove, tone, language })
      const id = res?.whatsapp?.messages?.[0]?.id || res?.whatsapp?.messages?.[0]?.message_id
      const finalText = res?.improvedText || message
      setImproved(finalText)
      setLog(`Enviado com sucesso. ID: ${id || 'desconhecido'}`)
      // Refresh thread and inbox
      if (selected) {
        const t = await getMessages(selected)
        setThread(t.items || [])
      }
      const ib = await getInbox();
      setInbox(ib.items||[])
    }catch(err){
      setLog(String(err.message||err))
    }finally{
      setBusySend(false)
    }
  }

  // Load inbox initially and each 10s
  useEffect(()=>{
    let alive = true;
    async function load(){
      try{ const data = await getInbox(); if(alive) setInbox(data.items||[]) }catch{}
    }
    load();
    const i = setInterval(load, 10000);
    return ()=>{ alive=false; clearInterval(i); }
  },[])

  // Load thread when selection changes
  useEffect(()=>{
    let alive=true
    async function load(){
      if(!selected) return setThread([])
      try{ const data = await getMessages(selected); if(alive) setThread(data.items||[]) }catch{}
    }
    load()
    const i = setInterval(load, 5000);
    return ()=>{ alive=false; clearInterval(i) }
  }, [selected])

  return (
    <div className="container">
      <h2 className="title">WhatsApp AI Assistant — MVP</h2>

      <div className="card" style={{marginBottom:16}}>
        <div className="row">
          <div className="col">
            <label>Número do destinatário (E.164 sem +)</label>
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="5561999999999" />
          </div>
          <div className="col">
            <label>Tom da mensagem</label>
            <select value={tone} onChange={e=>setTone(e.target.value)}>
              {TONES.map(t=> <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col">
            <label>Idioma</label>
            <input value={language} onChange={e=>setLanguage(e.target.value)} placeholder="pt-BR" />
          </div>
        </div>
        <div className="toolbar" style={{marginTop:8}}>
          <span className="badge">API: {baseUrl}</span>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <label>Inbox</label>
          <div style={{maxHeight: 320, overflow: 'auto', marginTop: 8}}>
            {inbox.length===0 && <div className="badge">Sem conversas ainda</div>}
            {inbox.map(item=> (
              <div key={item.phone} onClick={()=>setSelected(item.phone)} style={{padding:'10px 8px', borderBottom:'1px solid #1f2937', cursor:'pointer', background: selected===item.phone? '#0d1b2a' : 'transparent'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <strong>{item.phone}</strong>
                  <span style={{color:'#9ca3af', fontSize:12}}>{new Date(item.last_ts).toLocaleString()}</span>
                </div>
                <div style={{color:'#9ca3af', fontSize:13}}>
                  {item.last_direction==='out' ? 'Você: ' : ''}{item.last_body}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <label>Templates rápidos</label>
          <div className="toolbar">
            {TEMPLATES.map(t=> (
              <button key={t.key} className="secondary" onClick={()=>applyTemplate(t.key)}>{t.name}</button>
            ))}
          </div>

          <div style={{height:12}} />
          <label>Mensagem original</label>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder={DEFAULT_TEMPLATE} />

          <div className="toolbar">
            <button disabled={!canImprove || busyImprove} onClick={onImprove}>
              {busyImprove? 'Melhorando...' : 'Melhorar texto com IA'}
            </button>
            <label style={{display:'flex', alignItems:'center', gap:8}}>
              <input type="checkbox" checked={autoImprove} onChange={e=>setAutoImprove(e.target.checked)} /> Melhorar automaticamente ao enviar
            </label>
          </div>
        </div>

        <div className="card">
          <label>Thread {selected? `— ${selected}` : ''}</label>
          <div style={{maxHeight:220, overflow:'auto', border:'1px solid #374151', borderRadius:8, padding:8, background:'#0b1220', marginBottom:8}}>
            {thread.length===0 && <div className="badge">Selecione uma conversa ou aguarde novas mensagens.</div>}
            {thread.map((m, idx)=> (
              <div key={idx} style={{display:'flex', justifyContent: m.direction==='out'?'flex-end':'flex-start', margin:'6px 0'}}>
                <div style={{maxWidth:'70%', background: m.direction==='out'?'#16a34a':'#1f2937', color: m.direction==='out'?'#06220f':'#e5e7eb', padding:'8px 10px', borderRadius:8}}>
                  <div style={{fontSize:13}}>{m.body}</div>
                  <div style={{fontSize:10, color:m.direction==='out'?'#053816':'#9ca3af', marginTop:4}}>
                    {new Date(m.ts).toLocaleString()} {m.status? `· ${m.status}`: ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <label>Prévia melhorada</label>
          <textarea value={improved} onChange={e=>setImproved(e.target.value)} placeholder="Use o botão para gerar uma versão melhorada" />
          <div className="toolbar">
            <button disabled={!canSend || busySend} onClick={onSend}>
              {busySend? 'Enviando...' : 'Enviar via WhatsApp'}
            </button>
            <span className="badge">Aprovação manual acima</span>
          </div>
        </div>
      </div>

      <div style={{height:16}} />
      <div className="card">
        <label>Log</label>
        <div className="log">{log || '—'}</div>
      </div>
    </div>
  )
}
