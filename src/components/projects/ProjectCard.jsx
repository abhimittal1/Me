import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, GitFork, Clock, ArrowUpRight } from "lucide-react";

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#2b7489", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051",
  Kotlin: "#A97BFF", Swift: "#F05138", Ruby: "#701516", PHP: "#4F5D95",
  Dart: "#00B4AB", Vue: "#41b883", "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54", SCSS: "#c6538c", Mako: "#7e858d",
};

function relativeTime(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function ProjectCard({ project }) {
  const { name, description, stars, forks, primaryLanguage, languages, topics, pushedAt } = project;

  const langColor = LANG_COLORS[primaryLanguage] ?? "#6b7a90";
  const isFeatured = topics?.includes("featured");
  const topLangs = Object.keys(languages ?? {}).slice(0, 4);
  const updatedAt = relativeTime(pushedAt);

  const cardRef = useRef(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        ref={cardRef}
        to={`/project/${name}`}
        onMouseMove={handleMouseMove}
        className="relative flex flex-col h-full rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] hover:scale-[1.02] transition-transform duration-300"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
        aria-label={`View details for ${name}`}
      >
        {/* Gradient accent bar */}
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${langColor}, ${langColor}88, transparent)`,
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${langColor}10, transparent 60%)`,
          }}
        />

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 0 1px ${langColor}30, 0 0 30px ${langColor}08`,
          }}
        />

        <div className="flex flex-col flex-1 p-6 gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: langColor + "18" }}>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }} />
              </div>
              <h3 className="font-display font-bold text-[var(--text)] text-sm leading-snug truncate group-hover:text-[var(--primary)] transition-colors duration-300">
                {name}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent)]/12 text-[var(--accent)] border border-[var(--accent)]/25">
                  Featured
                </span>
              )}
              <ArrowUpRight
                size={16}
                className="text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2 flex-1 min-h-[2.5rem]">
            {description ?? "No description provided."}
          </p>

          {/* Language badges */}
          {topLangs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topLangs.map((lang) => (
                <span
                  key={lang}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{
                    backgroundColor: (LANG_COLORS[lang] ?? "#6b7a90") + "10",
                    color: LANG_COLORS[lang] ?? "#6b7a90",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: LANG_COLORS[lang] ?? "#6b7a90" }}
                  />
                  {lang}
                </span>
              ))}
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/50 min-h-[44px]">
            <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <Star size={12} className="text-yellow-400" />
                {stars}
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork size={12} />
                {forks}
              </span>
              {updatedAt && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {updatedAt}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
