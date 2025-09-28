const BASE_URL = "http://localhost:8000/api/guests/names";

// Fetch guest names and room numbers
export async function fetchGuestNames() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch guest names');
  return res.json();
}

