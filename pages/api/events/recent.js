import { supabase } from '../../../lib/supabaseServer.js';
export default async function handler(req,res){
  const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending:false }).limit(200);
  if(error) return res.status(500).json({ error: error.message });
  res.json(data);
}
