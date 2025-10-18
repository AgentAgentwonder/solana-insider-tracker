import { Card } from './ui/card'

export default function LiveActivityFeed({ data = [] }) {
  if (data.length === 0) {
    return <p className="text-gray-500">No recent activity.</p>
  }

  return (
    <div className="space-y-3">
      {data.map((tx, i) => (
        <Card key={i}>
          <div className="flex justify-between items-center">
            <span className="font-semibold">{tx.wallet}</span>
            <span className="text-sm text-gray-500">{tx.time}</span>
          </div>
          <p className="text-gray-700">{tx.action}</p>
        </Card>
      ))}
    </div>
  )
}
