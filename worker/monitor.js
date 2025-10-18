import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// --- Initialize Supabase ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // safe for server-side
);

// --- Environment Setup ---
const HELIUS = process.env.HELIUS_API_KEY;
const SINGLE_MS = Number(process.env.SINGLE_INSIDER_INTERVAL || 30000);
const MULTI_MS = Number(process.env.MULTI_INSIDER_INTERVAL || 120000);
const NEXT_BASE = process.env.NEXT_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

if (!HELIUS) {
  console.error('❌ Missing HELIUS_API_KEY - worker exiting');
  process.exit(1);
}

const seenMap = new Map();

// --- Load wallets from Supabase ---
async function loadWallets() {
  const { data, error } = await supabase
    .from('wallets')
    .select('address')
    .order('created_at', { ascending: true });

  if (error) console.error('⚠️ Error loading wallets:', error.message);
  return (data || []).map((r) => r.address);
}

// --- Poll Helius for a wallet's transactions ---
async function pollWallet(w) {
  try {
    const url = `https://api.helius.xyz/v0/addresses/${w}/transactions?api-key=${HELIUS}`;
    const r = await axios.get(url, { timeout: 20000 });
    const data = r.data || [];

    if (!seenMap.has(w)) seenMap.set(w, new Set());
    const seen = seenMap.get(w);

    for (const tx of data) {
      const sig = tx.signature || tx.txHash || (tx.transaction && tx.transaction.signature);
      if (!sig || seen.has(sig)) continue;
      seen.add(sig);

      // Build simplified transaction payload
      const payload = {
        wallet_address: w,
        tx_signature: sig,
        action: tx.type?.includes('sell') ? 'SELL' : 'BUY',
        token: tx.tokenTransfers?.[0]?.symbol || 'UNKNOWN',
        amount: tx.amountUsd || 0,
        risk_score: Math.round(Math.random() * 100), // Replace with real risk logic
      };

      // --- Insert transaction into Supabase ---
      const { error: insertError } = await supabase
        .from('transactions')
        .insert([payload]);

      if (insertError) console.error('🟥 Supabase insert failed:', insertError.message);
      else console.log(`🟩 Recorded tx for ${w}: ${sig}`);

      // --- Post event to API ---
      try {
        await axios.post(`${NEXT_BASE}/api/events`, payload, { timeout: 15000 });
      } catch (e) {
        console.error('post event failed', e.message);
      }
    }
  } catch (e) {
    console.error('poll error for', w, e.message);
  }
}

// --- Main Loop ---
async function loop() {
  console.log('🚀 Worker started in POLLING mode with Supabase logging...');
  while (true) {
    const wallets = await loadWallets();
    const single = wallets.length ? [wallets[0]] : [];
    const multi = wallets.slice(1);
    const promises = [];

    for (const w of single) promises.push(pollWallet(w));
    for (const w of multi) promises.push(pollWallet(w));

    await Promise.allSettled(promises);

    await new Promise((r) => setTimeout(r, SINGLE_MS));
    await new Promise((r) => setTimeout(r, Math.max(0, MULTI_MS - SINGLE_MS)));
  }
}

loop();
