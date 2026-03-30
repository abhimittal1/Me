export async function fetchGitHubRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}
