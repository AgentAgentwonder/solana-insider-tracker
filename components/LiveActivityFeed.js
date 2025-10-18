'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LiveActivityFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setEvents(data || []);
    }

    fetchEvents();

    const channel = supabase
      .channel('events-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          setEvents((prev) => [payload.new, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">⚡ Live Activity</h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent events.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="border-b pb-1 text-sm">
              <strong>{e.wallet}</strong> — {e.summary} (${e.amountUsd})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
