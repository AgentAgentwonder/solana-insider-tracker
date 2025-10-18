import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home(){
  const [wallets, setWallets] = useState([]);
  const [addr, setAddr] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(()=>{ loadWallets(); loadEvents(); const id=setInterval(loadEvents,5000); return ()=>clearInterval(id); },[]);

  async function loadWallets(){ const { data } = await axios.get('/api/wallets'); setWallets(data || []); }
  async function add(){ if(!addr) return; await axios.post('/api/wallets', { address: addr }); setAddr(''); loadWallets(); }
  async function remove(a){ await axios.delete('/api/wallets/'+encodeURIComponent(a)); loadWallets(); }
  async function loadEvents(){ const { data } = await axios.get('/api/events/recent'); setEvents(data || []); }

  const chartData = events.slice(0,50).map(ev=>({ time: new Date(ev.created_at).toLocaleTimeString(), risk: ev.risk })).reverse();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Solana Insider Tracker — Upgraded</h1>
        </header>
        <section className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Events</h2>
            <table className="w-full text-sm">
              <thead><tr><th>Time</th><th>Wallet</th><th>Side</th><th>Risk</th><th>Summary</th></tr></thead>
              <tbody>{events.map(ev=>(<tr key={ev.id}><td>{new Date(ev.created_at).toLocaleString()}</td><td>{ev.wallet}</td><td className={ev.side==='buy'?'text-green-600':'text-red-600'}>{ev.side}</td><td>{ev.risk}</td><td>{ev.summary}</td></tr>))}</tbody>
            </table>
          </div>
          <aside className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Manage Wallets</h3>
            <div className="flex gap-2 mb-3"><input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Add wallet" className="flex-1 border p-2 rounded" /><button onClick={add} className="px-3 py-1 bg-green-600 text-white rounded">Add</button></div>
            <ul className="text-sm space-y-1">{wallets.map(w=>(<li key={w.address} className="flex justify-between"><span>{w.address}</span><button onClick={()=>remove(w.address)} className="text-red-500">Remove</button></li>))}</ul>
            <div className="mt-4"><h4 className="font-semibold">Risk Chart (recent)</h4><div style={{width:'100%',height:200}}><ResponsiveContainer><LineChart data={chartData}><XAxis dataKey="time" /><YAxis /><Tooltip /><Line type="monotone" dataKey="risk" stroke="#8884d8" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div>
          </aside>
        </section>
      </div>
    </div>
  );
}
