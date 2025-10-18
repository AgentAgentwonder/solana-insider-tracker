import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'Missing wallet address' });

    const { data, error } = await supabase
      .from('wallets')
      .insert([{ address }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
