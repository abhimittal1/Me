import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SkillsScene } from "../components/3d/Scenes";

const USERNAME = process.env.REACT_APP_GITHUB_USERNAME || "abhimittal1";

const CATEGORIES = [
  {
    key: "frontend",
    label: "Frontend",
    icon: "🖥️",
    col: "col-span-12 md:col-span-7",
    skills: [
      { emoji: "⚛️", name: "React" },
      { emoji: "🔷", name: "TypeScript" },
      { emoji: "🟨", name: "JavaScript" },
      { emoji: "💨", name: "Tailwind CSS" },
      { emoji: "🎞️", name: "Framer Motion" },
      { emoji: "🔼", name: "Next.js" },
      { emoji: "🧩", name: "HTML5" },
      { emoji: "🎨", name: "CSS3" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icon: "⚙️",
    col: "col-span-12 md:col-span-5",
    skills: [
      { emoji: "🟢", name: "Node.js" },
      { emoji: "🚂", name: "Express" },
      { emoji: "🐍", name: "Python" },
      { emoji: "🦀", name: "Rust" },
      { emoji: "🔌", name: "REST APIs" },
      { emoji: "🔗", name: "GraphQL" },
    ],
  },
  {
    key: "devops",
    label: "DevOps & Cloud",
    icon: "☁️",
    col: "col-span-12 md:col-span-5",
    skills: [
      { emoji: "🐳", name: "Docker" },
      { emoji: "☸️", name: "Kubernetes" },
      { emoji: "🔧", name: "GitHub Actions" },
      { emoji: "🌩️", name: "AWS" },
      { emoji: "▲", name: "Vercel" },
      { emoji: "🔥", name: "Firebase" },
    ],
  },
  {
    key: "databases",
    label: "Databases",
    icon: "🗄️",
    col: "col-span-12 md:col-span-4",
    skills: [
      { emoji: "🐘", name: "PostgreSQL" },
      { emoji: "🍃", name: "MongoDB" },
      { emoji: "⚡", name: "Redis" },
      { emoji: "🪶", name: "SQLite" },
    ],
  },
  {
    key: "learning",
    label: "Currently Learning",
    icon: "🚀",
    col: "col-span-12 md:col-span-3",
    isLearning: true,
    skills: [
      { emoji: "🤖", name: "AI / LLMs", progress: 60 },
      { emoji: "🦀", name: "Rust (deep)", progress: 40 },
      { emoji: "☸️", name: "K8s advanced", progress: 30 },
    ],
  },
];

const TOOLS = [
  { emoji: "💻", name: "VS Code" },
  { emoji: "🐙", name: "Git" },
  { emoji: "🐧", name: "Linux" },
  { emoji: "🎨", name: "Figma" },
  { emoji: "📮", name: "Postman" },
  { emoji: "🧠", name: "Cursor" },
  { emoji: "📦", name: "pnpm" },
  { emoji: "🛡️", name: "Prettier" },
];

function SkillPill({ emoji, name }) {
  return (
    <motion.span
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)] hover:shadow-md hover:shadow-[var(--primary)]/5 transition-all duration-300 cursor-default select-none"
    >
      <span>{emoji}</span>
      <span>{name}</span>
    </motion.span>
  );
}

function ProgressBar({ label, emoji, value }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[var(--text)] font-medium">
          {emoji} {label}
        </span>
        <span className="text-[var(--muted)]">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--surface)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function BentoCard({ category, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={`${category.col} flex flex-col gap-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 hover:border-[var(--primary)]/20 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{category.icon}</span>
        <h3 className="font-display font-semibold text-[var(--text)] text-sm">{category.label}</h3>
      </div>

      {category.isLearning ? (
        <div className="flex flex-col gap-5 flex-1 justify-center">
          {category.skills.map((s) => (
            <ProgressBar key={s.name} label={s.name} emoji={s.emoji} value={s.progress} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {category.skills.map((s) => (
            <SkillPill key={s.name} emoji={s.emoji} name={s.name} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ContributionGraph() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        const days = data.contributions ?? [];
        const chunked = [];
        for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7));
        setWeeks(chunked);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const maxCount = Math.max(...weeks.flat().map((d) => d.count ?? 0), 1);

  const cellColor = (count) => {
    if (!count) return "bg-[var(--surface)]";
    const ratio = count / maxCount;
    if (ratio > 0.75) return "bg-[var(--primary)]";
    if (ratio > 0.5) return "opacity-80 bg-[var(--primary)]";
    if (ratio > 0.25) return "opacity-50 bg-[var(--primary)]";
    return "opacity-25 bg-[var(--primary)]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 flex flex-col gap-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-[var(--text)] text-lg">GitHub Contributions</h3>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--primary)] hover:underline underline-offset-2"
        >
          @{USERNAME}
        </a>
      </div>

      {loading && (
        <div className="h-24 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-xs text-[var(--muted)] text-center py-6">
          Couldn't load contribution data.
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[3px]" style={{ minWidth: `${weeks.length * 13}px` }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.count} contributions`}
                    className={`w-[10px] h-[10px] rounded-[3px] ${cellColor(day.count)} hover:ring-1 hover:ring-[var(--primary)]/50 transition-all`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] self-end">
          <span>Less</span>
          {["opacity-25 bg-[var(--primary)]", "opacity-50 bg-[var(--primary)]", "opacity-80 bg-[var(--primary)]", "bg-[var(--primary)]"].map((cls, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-[3px] ${cls}`} />
          ))}
          <span>More</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-20 overflow-hidden">
      {/* 3D Background */}
      <SkillsScene />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/3 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-14">

        {/* Header */}
        <div className="flex flex-col gap-5">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]"
          >
            Expertise
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl md:text-6xl font-bold text-[var(--text)]"
          >
            Skills &{" "}
            <span className="gradient-text">Technologies</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--muted)] max-w-xl text-lg"
          >
            Tools and technologies I use to bring ideas to life — from pixel to production.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4">
          {CATEGORIES.map((cat, i) => (
            <BentoCard key={cat.key} category={cat} delay={i * 0.07} />
          ))}
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-display text-xl font-semibold text-[var(--text)]"
          >
            Tools I Use Daily
          </motion.h2>
          <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-8 gap-4">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="flex flex-col items-center gap-2.5 py-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/25 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 cursor-default"
              >
                <span className="text-3xl">{tool.emoji}</span>
                <span className="text-[10px] text-[var(--muted)] text-center leading-tight font-medium">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contribution graph */}
        <ContributionGraph />

      </div>
    </section>
  );
}
