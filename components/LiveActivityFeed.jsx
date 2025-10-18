import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

const mockData = [
  { id: 1, wallet: "HebqKJ8Ts5HGWY37EXZxmRo8LxCxrLZossTxvVg8J7HW", token: "SOL", amountUsd: 1234.56, type: "Buy", time: "2 minutes ago" },
  { id: 2, wallet: "6JtPjA9PzZdBxFo7iZQKs5SRZBjdUV9gLthLTx6pnrFz", token: "BONK", amountUsd: 87.12, type: "Sell", time: "5 minutes ago" },
  { id: 3, wallet: "9QeHkLP2RkADnLpDTTBv8J1zUZxGLrruQ7Q3V8q8vVjW", token: "JUP", amountUsd: 305.75, type: "Buy", time: "12 minutes ago" },
];

export default function LiveActivityFeed() {
  const [data, setData] = useState(mockData);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Live Activity Feed (Demo)</h2>
      {data.map((tx) => (
        <Card key={tx.id}>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{tx.wallet.slice(0, 8)}...{tx.wallet.slice(-4)}</p>
                <p className="font-semibold">{tx.token} {tx.type}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${tx.amountUsd.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{tx.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={() => alert("This is demo data. Connect Supabase for live updates.")}>Refresh Demo</Button>
    </div>
  );
}
