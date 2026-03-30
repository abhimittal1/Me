import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { GitBranch, Code2, Zap, ArrowRight, Terminal, Layers, Cpu } from "lucide-react";
import { useRef } from "react";

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

function StatCard({ value, label, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
        <Icon size={18} className="text-[var(--primary)]" />
      </div>
      <span className="text-2xl font-display font-bold gradient-text leading-none">
        {value}
      </span>
      <span className="text-xs text-[var(--muted)] font-medium">{label}</span>
    </motion.div>
  );
}

const HIGHLIGHTS = [
  { icon: GitBranch, label: "Open Source", desc: "Active contributor" },
  { icon: Code2, label: "Clean Code", desc: "SOLID & DRY principles" },
  { icon: Zap, label: "Fast Learner", desc: "New tech, no problem" },
];

function HighlightCard({ icon: Icon, label, desc, delay }) {
  return (
    <motion.div
      {...inView(delay)}
      className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 group"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/8 text-[var(--primary)] group-hover:bg-[var(--primary)]/15 transition-colors duration-300">
        <Icon size={18} />
      </span>
      <p className="text-sm font-semibold text-[var(--text)]">{label}</p>
      <p className="text-xs text-[var(--muted)]">{desc}</p>
    </motion.div>
  );
}

// ─── Tech Stack Visual (replaces the image) ─────────────────────────────────
function TechStackVisual() {
  const techRows = [
    ["React", "Node.js", "Python"],
    ["TypeScript", "TailwindCSS", "PostgreSQL"],
    ["Docker", "AWS", "Git"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Decorative ring */}
      <div className="absolute -inset-4 rounded-3xl border border-[var(--primary)]/10" />
      <div className="absolute -inset-8 rounded-[2rem] border border-[var(--accent)]/5" />

      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface)]">
          <Layers size={14} className="text-[var(--primary)]" />
          <span className="text-xs font-semibold text-[var(--text)]">Tech Stack</span>
          <span className="text-[10px] text-[var(--muted)] ml-auto">experience.json</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px bg-[var(--border)]">
          <StatCard
            value={process.env.REACT_APP_ABOUT_YEARS || "3+"}
            label="Years Exp."
            icon={Terminal}
            delay={0.1}
          />
          <StatCard
            value={process.env.REACT_APP_ABOUT_PROJECTS || "20+"}
            label="Projects"
            icon={Layers}
            delay={0.2}
          />
          <StatCard
            value="10+"
            label="Technologies"
            icon={Cpu}
            delay={0.3}
          />
        </div>

        {/* Tech grid */}
        <div className="p-5 space-y-3">
          {techRows.map((row, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + ri * 0.1, duration: 0.5 }}
              className="flex gap-2"
            >
              {row.map((tech) => (
                <span
                  key={tech}
                  className="flex-1 px-3 py-2.5 rounded-xl text-xs font-medium text-center bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)] transition-all duration-300 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Activity bar */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-[var(--muted)]">Activity</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.03, duration: 0.3 }}
                className="flex-1 rounded-sm origin-bottom"
                style={{
                  height: `${12 + Math.random() * 28}px`,
                  backgroundColor: `var(--primary)`,
                  opacity: 0.15 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AboutPreview ─────────────────────────────────────────────────────────────
export default function AboutPreview() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative py-28 px-5 md:px-10 lg:px-20 overflow-hidden">
      {/* Subtle gradient transition from Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--bg)] to-transparent pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        {/* Left: Tech Stack Visual */}
        <TechStackVisual />

        {/* Right: text */}
        <div className="flex flex-col gap-7">
          <motion.p {...inView(0.05)} className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]">
            About Me
          </motion.p>

          <motion.h2
            {...inView(0.12)}
            className="font-display text-3xl md:text-4xl font-bold text-[var(--text)] leading-snug"
          >
            Passionate about building{" "}
            <span className="gradient-text">meaningful experiences</span>
          </motion.h2>

          <motion.p {...inView(0.2)} className="text-[var(--muted)] leading-relaxed text-base">
            {process.env.REACT_APP_ABOUT_BIO_1 || "I'm a full-stack developer with over 3 years of experience crafting scalable web applications. My stack centers on React, Node.js, and TypeScript — always with an eye for performance and accessibility."}
          </motion.p>

          <motion.p {...inView(0.27)} className="text-[var(--muted)] leading-relaxed text-base">
            {process.env.REACT_APP_ABOUT_BIO_2 || "Outside of code I contribute to open-source projects, write technical articles, and mentor junior developers. I believe great software is built by curious, collaborative teams who care about the details."}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {HIGHLIGHTS.map(({ icon, label, desc }, i) => (
              <HighlightCard key={label} icon={icon} label={label} desc={desc} delay={0.32 + i * 0.08} />
            ))}
          </div>

          <motion.div {...inView(0.55)}>
            <Link
              to="/skills"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-2xl border border-[var(--primary)]/30 text-[var(--primary)] font-semibold text-sm hover:bg-[var(--primary)]/8 hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300"
            >
              More About Me
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
