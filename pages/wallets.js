import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LiveActivityFeed from '@/components/LiveActivityFeed';

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadWallets() {
    const res = await axios.get('/api/wallets');
    setWallets(res.data);
  }

  async function addWallet() {
    if (!newAddress) return alert('Please enter a wallet address');
    setLoading(true);
    try {
      await axios.post('/api/wallets', { address: newAddress });
      setNewAddress('');
      await loadWallets();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to add wallet');
    } finally {
      setLoading(false);
    }
  }

  async function deleteWallet(id) {
    if (!confirm('Remove this wallet?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/wallets/${id}`);
      await loadWallets();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to delete wallet');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWallets();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🪙 Tracked Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter Solana wallet address..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addWallet} disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </div>
          <ul className="divide-y divide-gray-200">
            {wallets.map((w) => (
              <li key={w.id} className="flex justify-between py-2">
                <span className="font-mono text-sm">{w.address}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteWallet(w.id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </li>
            ))}
            {wallets.length === 0 && (
              <p className="text-sm text-gray-500">No wallets yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      <LiveActivityFeed />
    </div>
  );
}
