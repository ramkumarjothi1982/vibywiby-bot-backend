export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "🟢 VibyWiby backend is alive!",
    timestamp: new Date().toISOString(),
  });
}
