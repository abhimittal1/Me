import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Code2, Zap, ArrowRight, Layers } from "lucide-react";
import { useRef } from "react";

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

const HIGHLIGHTS = [
  { icon: Brain, label: "AI / ML", desc: "LLMs & intelligent systems" },
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

// ─── Stats Visual (clean, simple) ────────────────────────────────────────────
function StatsVisual() {
  const stats = [
    { value: process.env.REACT_APP_ABOUT_YEARS || "1+", label: "Years Experience" },
    { value: process.env.REACT_APP_ABOUT_PROJECTS || "10+", label: "Projects Built" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-5"
    >
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300"
          >
            <span className="text-3xl font-display font-bold gradient-text leading-none">
              {stat.value}
            </span>
            <span className="text-xs text-[var(--muted)] font-medium text-center">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Focus areas */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 flex flex-col gap-4"
      >
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[var(--primary)]" />
          <span className="text-xs font-semibold text-[var(--text)]">Focus Areas</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["AI / ML", "Python", "LLMs", "React", "Node.js", "REST APIs", "Full-Stack"].map((tech) => (
            <span
              key={tech}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)] transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Open to work badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl glass"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-medium text-[var(--text)]">
          {process.env.REACT_APP_AVAILABILITY || "Open to opportunities"}
        </span>
      </motion.div>
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
    <section ref={ref} className="relative py-9 sm:py-16 md:py-20 lg:py-28 px-5 md:px-10 lg:px-20 overflow-hidden">
      {/* Subtle gradient transition from Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--bg)] to-transparent pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
      >
        {/* Left: Stats Visual */}
        <StatsVisual />

        {/* Right: text */}
        <div className="flex flex-col gap-7">
          <motion.p {...inView(0.05)} className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]">
            About Me
          </motion.p>

          <motion.h2
            {...inView(0.12)}
            className="font-display text-3xl md:text-4xl font-bold text-[var(--text)] leading-snug"
          >
            Building intelligent{" "}
            <span className="gradient-text">AI-powered solutions</span>
          </motion.h2>

          <motion.p {...inView(0.2)} className="text-[var(--muted)] leading-relaxed text-base">
            {process.env.REACT_APP_ABOUT_BIO_1 || "I'm an AI/ML engineer passionate about building intelligent systems that solve real problems — from LLM-powered tools to scalable full-stack applications."}
          </motion.p>

          <motion.p {...inView(0.27)} className="text-[var(--muted)] leading-relaxed text-base">
            {process.env.REACT_APP_ABOUT_BIO_2 || "I focus on bridging the gap between AI research and real-world deployment, creating solutions that are technically sound, user-friendly, and production-ready."}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {HIGHLIGHTS.map(({ icon, label, desc }, i) => (
              <HighlightCard key={label} icon={icon} label={label} desc={desc} delay={0.32 + i * 0.08} />
            ))}
          </div>

          <motion.div {...inView(0.55)}>
            <Link
              to="/about"
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
