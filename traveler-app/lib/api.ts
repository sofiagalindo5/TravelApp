export const API_URL = "http://10.138.15.93:8000";

export async function healthCheck() {
  const res = await fetch(`${API_URL}/api/health/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}