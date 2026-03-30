import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectFilters({
  search,
  onSearch,
  languages,
  selectedLang,
  onSelectLang,
  activeTab,
  onTabChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex flex-col gap-4"
    >
      {/* Tab switcher + search row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass self-start">
          {["All", "Featured"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={[
                "px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px]",
                activeTab === tab
                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/20"
                  : "text-[var(--muted)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-[320px]">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl glass text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)] transition-all duration-300 min-h-[44px]"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Language pills */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectLang(null)}
            className={[
              "px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 min-h-[36px]",
              selectedLang === null
                ? "bg-[var(--primary)]/12 text-[var(--primary)] border border-[var(--primary)]/30 shadow-sm shadow-[var(--primary)]/10"
                : "text-[var(--muted)] border border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--primary)]/25",
            ].join(" ")}
          >
            All
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => onSelectLang(lang === selectedLang ? null : lang)}
              className={[
                "px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 min-h-[36px]",
                selectedLang === lang
                  ? "bg-[var(--primary)]/12 text-[var(--primary)] border border-[var(--primary)]/30 shadow-sm shadow-[var(--primary)]/10"
                  : "text-[var(--muted)] border border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--primary)]/25",
              ].join(" ")}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
