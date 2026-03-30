import { useState, useEffect, useCallback, useRef } from "react";

const CACHE_KEY = "gh_projects_cache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

function buildHeaders() {
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJSON(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

async function fetchReadme(username, repoName, headers) {
  // Use GitHub API endpoint (more reliable than raw.githubusercontent.com)
  try {
    const url = `https://api.github.com/repos/${username}/${repoName}/readme`;
    const res = await fetch(url, {
      headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
    });
    if (res.ok) return await res.text();
  } catch {
    // API approach failed
  }

  // Fallback: try raw.githubusercontent.com with multiple branches
  const branches = ["main", "master", "HEAD"];
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/README.md`;
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch {
      // continue to next branch
    }
  }
  return null;
}

async function loadProjects() {
  const username =
    process.env.REACT_APP_GITHUB_USERNAME ||
    process.env.VITE_GITHUB_USERNAME;

  if (!username) throw new Error("GitHub username env variable is not set.");

  const headers = buildHeaders();

  // 1. Fetch all repos
  const repos = await fetchJSON(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    headers
  );

  // 2. Filter forks, sort by stars descending
  const ownRepos = repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  // 3. Enrich each repo with languages in parallel (README loaded lazily on detail page)
  const projects = await Promise.all(
    ownRepos.map(async (repo) => {
      const languages = await fetchJSON(repo.languages_url, headers).catch(() => ({}));

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        topics: repo.topics ?? [],
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
        license: repo.license?.spdx_id ?? null,
        readme: null, // loaded lazily via useProjectReadme
        languages,
        primaryLanguage: repo.language,
      };
    })
  );

  return projects;
}

export function useGitHubProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(async (bustCache = false) => {
    if (bustCache) clearCache();

    // Abort any in-flight fetch
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    // Try cache first (unless busting)
    if (!bustCache) {
      const cached = readCache();
      if (cached) {
        setProjects(cached);
        setLoading(false);
        return;
      }
    }

    try {
      const data = await loadProjects();
      writeCache(data);
      setProjects(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message ?? "Failed to fetch projects.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { projects, loading, error, refetch };
}

// ─── Lazy README loader for individual project detail pages ──────────────────
export function useProjectReadme(repoName) {
  const [readme, setReadme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repoName) return;

    let cancelled = false;
    const username =
      process.env.REACT_APP_GITHUB_USERNAME ||
      process.env.VITE_GITHUB_USERNAME;

    if (!username) {
      setLoading(false);
      return;
    }

    const headers = buildHeaders();

    fetchReadme(username, repoName, headers).then((content) => {
      if (!cancelled) {
        setReadme(content);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [repoName]);

  return { readme, loading };
}
