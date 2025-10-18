import { supabase } from '../../../lib/supabaseServer.js';
import { computeRiskScore } from '../../../utils/riskScore.js';

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const payload = req.body;
    const score = computeRiskScore({
      tradeValueUSD: payload.amountUsd || 0,
      avgDailyVolumeUSD: payload.avgDailyVolumeUSD || 1,
      priceImpactPercent: payload.priceImpactPercent || 0,
      insiderSellRatio: payload.insiderSellRatio || 0,
      timeSinceLastTradeDays: payload.timeSinceLastTradeDays || 30
    });
    const side = (payload.tokenChange && payload.tokenChange > 0) ? 'buy' : 'sell';
    const ev = {
      wallet: payload.wallet,
      signature: payload.signature,
      summary: payload.summary,
      amount_usd: payload.amountUsd || 0,
      risk: score,
      side,
      raw: payload
    };
    const { data, error } = await supabase.from('events').insert([ev]).select();
    if(error) return res.status(500).json({ error: error.message });
    try{ await fetchNotify(ev); }catch(e){ console.error('notify failed', e.message); }
    return res.json(data[0]);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

async function fetchNotify(ev){
  const tg = process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID;
  const slack = process.env.SLACK_WEBHOOK_URL;
  const text = `Insider ${ev.side.toUpperCase()}: ${ev.wallet} — ${ev.summary} (risk ${ev.risk})`;
  if(tg){
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
    });
  }
  if(slack){
    await fetch(slack, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
  }
}
