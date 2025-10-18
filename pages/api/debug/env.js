export default function handler(req, res) {
  res.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL || "❌ MISSING",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✅ PRESENT" : "❌ MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ PRESENT" : "❌ MISSING",
  });
}
