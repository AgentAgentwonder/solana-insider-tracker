export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.WORKER_SECRET_KEY}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    console.log("Running background worker task...");
    // Example: fetch recent events or run cleanup
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Worker failed' });
  }
}
