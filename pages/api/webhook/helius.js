import axios from 'axios';
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const events = req.body?.data || req.body;
    const arr = Array.isArray(events) ? events : [events];
    for(const e of arr){
      const payload = {
        wallet: e?.address || e?.account || 'unknown',
        signature: e?.signature || e?.txHash || e?.transaction?.signature,
        summary: e?.type || e?.description || 'tx',
        amountUsd: e?.amountUsd || 0,
        tokenChange: e?.tokenChange || 0,
        priceImpactPercent: e?.priceImpactPercent || 0,
        insiderSellRatio: e?.insiderSellRatio || 0,
        timeSinceLastTradeDays: e?.timeSinceLastTradeDays || 30
      };
      await axios.post(`${process.env.NEXT_BASE_URL || ('http://localhost:'+ (process.env.PORT||3000))}/api/events`, payload);
    }
    res.json({ ok:true });
  }catch(e){
    console.error('webhook failed', e.message);
    res.status(500).json({ error: e.message });
  }
}
