// Create a new profile
export async function createProfile(email: string, password: string) {
  const res = await fetch('http://localhost:3000/api/profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log("create Profile called");
  return res.json();
}

export async function loginProfile(email: string, password: string) {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log("login Profile called");
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }
  return res.json();
}

// // Get all profiles
// export async function getProfiles() {
//   const res = await fetch('/api/profiles');
//   return res.json();
// }