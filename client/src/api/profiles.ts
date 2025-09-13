// Create a new profile
export async function createProfile(name: string) {
  const res = await fetch('/api/profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

// Get all profiles
export async function getProfiles() {
  const res = await fetch('/api/profiles');
  return res.json();
}