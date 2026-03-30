import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Star, GitFork, ArrowLeft, Github, Globe, Calendar, Tag, ExternalLink, BookOpen } from "lucide-react";
import { useGitHubProjects, useProjectReadme } from "../hooks/useGitHubProjects";

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#2b7489", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051",
  Kotlin: "#A97BFF", Swift: "#F05138", Ruby: "#701516", PHP: "#4F5D95",
  Dart: "#00B4AB", Vue: "#41b883", "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54", SCSS: "#c6538c", Mako: "#7e858d",
};

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[var(--primary)] animate-spin" />
      </div>
    </div>
  );
}

// ─── Language bar (visual) ────────────────────────────────────────────────────
function LanguageBar({ languages }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (!total) return null;

  const entries = Object.entries(languages).slice(0, 8);

  return (
    <div className="flex flex-col gap-3">
      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden flex bg-[var(--surface)]">
        {entries.map(([lang, bytes]) => (
          <div
            key={lang}
            className="h-full transition-all duration-500"
            style={{
              width: `${(bytes / total) * 100}%`,
              backgroundColor: LANG_COLORS[lang] ?? "#6b7a90",
              minWidth: "2px",
            }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {entries.map(([lang, bytes]) => (
          <div key={lang} className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: LANG_COLORS[lang] ?? "#6b7a90" }}
            />
            <span className="text-[var(--text)] font-medium">{lang}</span>
            <span className="text-[var(--muted)]">{((bytes / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ project }) {
  const { url, homepage, stars, forks, topics, languages, createdAt, pushedAt, license } = project;

  return (
    <aside className="flex flex-col gap-4 sm:gap-5 w-full">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl glass text-sm font-semibold text-[var(--text)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300 min-h-[48px]"
        >
          <Github size={17} /> View on GitHub
        </a>
        {homepage && (
          <a
            href={homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white text-sm font-semibold hover:shadow-xl hover:shadow-[var(--primary)]/20 hover:scale-[1.02] transition-all duration-300 min-h-[48px]"
          >
            <Globe size={17} /> Live Demo <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Stats + Languages + Topics — horizontal on mobile, vertical on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-3 lg:gap-5">
        {/* Stats card */}
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-5 flex flex-col gap-4 sm:gap-5">
          <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">Repository Info</h3>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-[var(--surface)]">
              <Star size={14} className="text-yellow-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text)]">{stars}</span>
                <span className="text-[10px] text-[var(--muted)]">Stars</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-[var(--surface)]">
              <GitFork size={14} className="text-[var(--muted)]" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text)]">{forks}</span>
                <span className="text-[10px] text-[var(--muted)]">Forks</span>
              </div>
            </div>
          </div>

          {license && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <BookOpen size={12} />
              <span>License:</span>
              <span className="text-[var(--text)] font-medium">{license}</span>
            </div>
          )}

          {createdAt && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <Calendar size={12} />
              Created {formatDate(createdAt)}
            </div>
          )}
          {pushedAt && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <Calendar size={12} />
              Last pushed {formatDate(pushedAt)}
            </div>
          )}
        </div>

        {/* Languages */}
        {Object.keys(languages ?? {}).length > 0 && (
          <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">Languages</h3>
            <LanguageBar languages={languages} />
          </div>
        )}
      </div>

      {/* Topics */}
      {topics?.length > 0 && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-5 flex flex-col gap-3">
          <h3 className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">
            <Tag size={10} /> Topics
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {topics.map((t) => (
              <span
                key={t}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium bg-[var(--primary)]/8 text-[var(--primary)] border border-[var(--primary)]/15 hover:bg-[var(--primary)]/15 transition-colors duration-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── ProjectDetail ────────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const { projects, loading } = useGitHubProjects();
  const { readme, loading: readmeLoading } = useProjectReadme(repoName);

  if (loading) return <Spinner />;

  const project = projects.find((p) => p.name === repoName);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-5">
        <div className="w-20 h-20 rounded-3xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-3xl">
          🔍
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Project not found</h2>
        <p className="text-[var(--muted)]">"{repoName}" doesn't exist in your GitHub repos.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-6 py-3 rounded-2xl bg-[var(--primary)] text-[var(--bg)] font-semibold text-sm hover:shadow-xl hover:shadow-[var(--primary)]/20 transition-all"
        >
          Go back
        </button>
      </div>
    );
  }

  const { name, description, primaryLanguage, languages, stars, forks, url } = project;
  const langColor = LANG_COLORS[primaryLanguage] ?? "#6b7a90";
  const topLangs = Object.keys(languages ?? {}).slice(0, 5);

  return (
    <section className="min-h-screen pt-24 pb-20 px-4 sm:px-5 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 md:gap-8">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors duration-200 min-h-[44px] group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex flex-col gap-3 sm:gap-4 md:gap-5"
        >
          <div
            className="w-12 sm:w-16 h-1 rounded-full"
            style={{ background: `linear-gradient(90deg, ${langColor}, transparent)` }}
          />

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text)] break-words">
            {name}
          </h1>

          {description && (
            <p className="text-[var(--muted)] text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">{description}</p>
          )}

          {topLangs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {topLangs.map((lang) => (
                <span
                  key={lang}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium"
                  style={{
                    backgroundColor: (LANG_COLORS[lang] ?? "#6b7a90") + "12",
                    color: LANG_COLORS[lang] ?? "#6b7a90",
                    border: `1px solid ${(LANG_COLORS[lang] ?? "#6b7a90")}25`,
                  }}
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[lang] ?? "#6b7a90" }} />
                  {lang}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400" /> {stars}
            </span>
            <span className="flex items-center gap-1.5">
              <GitFork size={14} /> {forks}
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors duration-200"
            >
              <Github size={14} /> GitHub
            </a>
          </div>
        </motion.div>

        {/* Body: sidebar first on mobile (for context), README below */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">

          {/* Sidebar — shows first on mobile for quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-80 flex-shrink-0 order-first lg:order-last lg:sticky lg:top-24"
          >
            <Sidebar project={project} />
          </motion.div>

          {/* README */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1 min-w-0 w-full"
          >
            {readmeLoading ? (
              <div className="flex flex-col items-center gap-4 py-16 sm:py-24 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-[var(--primary)] animate-spin" />
                </div>
                <p className="text-sm text-[var(--muted)]">Loading README...</p>
              </div>
            ) : readme ? (
              <article className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-3 sm:p-5 md:p-8 lg:p-10 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[var(--border)]">
                  <BookOpen size={16} className="text-[var(--primary)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">README.md</span>
                </div>
                <div className="prose prose-invert prose-sm sm:prose-sm md:prose-base max-w-none overflow-x-auto prose-headings:font-display prose-headings:text-[var(--text)] prose-p:text-[var(--muted)] prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--text)] prose-code:text-[var(--primary)] prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-xl prose-img:rounded-xl prose-img:border prose-img:border-[var(--border)] prose-hr:border-[var(--border)] prose-blockquote:border-l-[var(--primary)] prose-blockquote:text-[var(--muted)]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {readme}
                  </ReactMarkdown>
                </div>
              </article>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:gap-5 py-16 sm:py-24 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] px-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center">
                  <BookOpen size={24} className="text-[var(--muted)]" />
                </div>
                <p className="font-display font-semibold text-base sm:text-lg text-[var(--text)]">No README found</p>
                <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xs">This repository doesn't have a README yet. Check the GitHub page for more details.</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--bg)] text-sm font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all"
                >
                  <Github size={15} /> View on GitHub
                </a>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
