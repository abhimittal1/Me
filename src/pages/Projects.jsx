import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, BookOpen, RefreshCw, Sparkles } from "lucide-react";
import { useGitHubProjects } from "../hooks/useGitHubProjects";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectSkeleton from "../components/projects/ProjectSkeleton";
import ProjectFilters from "../components/projects/ProjectFilters";
import { ProjectsScene } from "../components/3d/Scenes";

// ─── GitHub stats bar ─────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/20 transition-colors duration-300">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)]/10">
        <Icon size={14} className="text-[var(--primary)]" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-[var(--muted)]">{label}</span>
        <span className="text-sm font-bold text-[var(--text)]">{value}</span>
      </div>
    </div>
  );
}

function GitHubStatsBar({ projects }) {
  const totalStars = projects.reduce((s, p) => s + p.stars, 0);

  // Hard-coded to Python as top language
  const topLang = "Python";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap gap-3"
    >
      <StatPill icon={BookOpen} label="Repositories" value={projects.length} />
      <StatPill icon={Star} label="Total Stars" value={totalStars} />
      <StatPill icon={Sparkles} label="Top Language" value={topLang} />
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-5 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-3xl">
        🔍
      </div>
      <p className="text-[var(--text)] font-display font-semibold text-lg">No projects match your filters</p>
      <p className="text-sm text-[var(--muted)]">Try a different search term or language</p>
      <button
        onClick={onClear}
        className="mt-1 px-6 py-2.5 rounded-2xl glass text-sm text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all duration-300"
      >
        Clear filters
      </button>
    </div>
  );
}

// ─── Projects page ────────────────────────────────────────────────────────────
export default function Projects() {
  const { projects, loading, error, refetch } = useGitHubProjects();

  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const languages = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => { if (p.primaryLanguage) set.add(p.primaryLanguage); });
    return [...set].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    if (activeTab === "Featured") list = list.filter((p) => p.stars >= 1);
    if (selectedLang) list = list.filter((p) => p.primaryLanguage === selectedLang);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          p.topics.some((t) => t.includes(q))
      );
    }
    return list;
  }, [projects, activeTab, selectedLang, search]);

  const clearFilters = () => {
    setSearch("");
    setSelectedLang(null);
    setActiveTab("All");
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-20 overflow-hidden">
      {/* 3D Background */}
      <ProjectsScene />

      {/* Gradient orbs */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/3 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-10">

        {/* Page header */}
        <div className="flex flex-col gap-5">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]"
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl md:text-6xl font-bold text-[var(--text)]"
          >
            My{" "}
            <span className="gradient-text">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--muted)] max-w-xl text-lg"
          >
            A collection of things I've built, experimented with, and shipped — fetched live from GitHub.
          </motion.p>

          {!loading && !error && <GitHubStatsBar projects={projects} />}
        </div>

        {/* Filters */}
        {!loading && !error && (
          <ProjectFilters
            search={search}
            onSearch={setSearch}
            languages={languages}
            selectedLang={selectedLang}
            onSelectLang={setSelectedLang}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <p className="text-[var(--text)] font-display font-semibold text-lg">Failed to load projects</p>
            <p className="text-sm text-[var(--muted)]">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 mt-1 px-6 py-3 rounded-2xl bg-[var(--primary)] text-[var(--bg)] text-sm font-semibold hover:shadow-xl hover:shadow-[var(--primary)]/20 transition-all duration-300"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProjectSkeleton key={i} />)
            : (
              <AnimatePresence mode="popLayout">
                {filtered.length === 0
                  ? <EmptyState key="empty" onClear={clearFilters} />
                  : filtered.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                }
              </AnimatePresence>
            )
          }
        </div>

      </div>
    </section>
  );
}
