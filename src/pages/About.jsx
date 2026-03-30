import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase, MapPin, Calendar, ChevronDown, Sparkles } from "lucide-react";

const EDUCATION = [
  {
    id: "jiit",
    institution: "Jaypee Institute of Information Technology (JIIT)",
    location: "Noida",
    degree: "Bachelor of Technology — Electronics & Communication Engineering",
    duration: "September 2022 – Present",
    grade: "CGPA: 7.1 / 10",
    status: "Ongoing",
    highlights: [
      "Focused on core domains including Electronics, Signal Processing, and Communication Systems while actively exploring AI/ML and Software Development.",
      "Worked on multiple hands-on projects involving machine learning, full-stack development, and intelligent systems.",
      "Currently expanding expertise in Large Language Models (LLMs), backend systems, and real-world AI applications.",
    ],
    tags: ["Electronics", "Signal Processing", "AI / ML", "Full-Stack", "LLMs"],
  },
  {
    id: "greenfields",
    institution: "Greenfields Public School",
    location: "Dilshad Garden, Delhi",
    degree: "Class 12th & 10th — Mathematics & Science",
    duration: "Completed: March 2021",
    grade: null,
    status: "Completed",
    highlights: [
      "Completed Class 12th and 10th with a strong academic foundation in Mathematics and Science, laying the groundwork for engineering and analytical problem-solving.",
    ],
    tags: ["Mathematics", "Science"],
  },
];

const EXPERIENCE = [
  {
    id: "esolutions",
    role: "AI Engineer Intern",
    company: "E Solutions",
    location: "Noida",
    duration: "January 2026 – Present",
    status: "Current",
    tags: ["Python", "LLMs", "ML Pipelines", "REST APIs", "AI Systems"],
    highlights: [
      "Designed and optimized end-to-end AI/ML pipelines — covering data preprocessing, feature engineering, model training, and evaluation.",
      "Built LLM-powered automation tools for text classification, information extraction, and intelligent document processing.",
      "Improved model accuracy and efficiency through hyperparameter tuning, error analysis, and advanced evaluation metrics.",
      "Developed backend-integrated AI solutions using Python, REST APIs, and scalable services.",
      "Collaborated with cross-functional teams to deploy production-ready solutions, ensuring performance, scalability, and reliability.",
      "Bridged the gap between AI research and real-world deployment through applied system design.",
    ],
  },
  {
    id: "drid",
    role: "Game Development Intern",
    company: "DRID",
    location: null,
    duration: "June 2025 – July 2025",
    status: "Completed",
    tags: ["Python", "OpenCV", "MediaPipe", "Cognitive Games", "Analytics"],
    highlights: [
      "Developed 3 neuro-cognitive training games: Digit Span (memory), Stroop Suite (cognitive flexibility), and Stress Trainer (focus & response control).",
      "Achieved 95% accuracy in evaluation metrics, ensuring reliable cognitive assessment.",
      "Integrated multimodal interaction systems including voice input, gesture recognition (OpenCV + MediaPipe), QR-based interaction, and keyboard controls.",
      "Built cross-platform applications in Python focused on usability and performance.",
      "Implemented data-logging and analytics dashboards to track user performance over time.",
      "Enabled CSV export and structured data storage for further research analysis.",
    ],
  },
];

function StatusBadge({ status }) {
  const map = {
    Current:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Ongoing:   "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
    Completed: "bg-[var(--muted)]/8 text-[var(--muted)] border-[var(--muted)]/15",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border ${map[status] ?? map.Completed}`}>
      {status === "Current" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {status}
    </span>
  );
}

function Tag({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/25 hover:text-[var(--primary)] transition-all duration-300">
      {label}
    </span>
  );
}

function EduCard({ item, index, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="relative flex gap-5 md:gap-7"
    >
      <div className="relative flex flex-col items-center shrink-0">
        <div className="relative z-10 w-11 h-11 rounded-2xl bg-[var(--card)] border-2 border-[var(--primary)]/40 flex items-center justify-center shadow-lg shadow-[var(--primary)]/10">
          <GraduationCap size={18} className="text-[var(--primary)]" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-3 bg-gradient-to-b from-[var(--primary)]/25 to-transparent min-h-[2rem]" />
        )}
      </div>

      <div className={`flex-1 ${!isLast ? "pb-10" : ""}`}>
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 hover:border-[var(--primary)]/20 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="font-display font-bold text-[var(--text)] text-base md:text-lg leading-snug">
                {item.institution}
              </h3>
              <p className="text-sm text-[var(--primary)] font-medium">{item.degree}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {item.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {item.location}
            </span>
            {item.grade && (
              <span className="flex items-center gap-1.5 text-[var(--primary)] font-semibold">
                🎯 {item.grade}
              </span>
            )}
          </div>

          <div className="h-px bg-[var(--border)]" />

          <ul className="flex flex-col gap-3">
            {item.highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-[var(--muted)] leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExpCard({ item, index, isOpen, toggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={`rounded-2xl bg-[var(--card)] border transition-all duration-300 overflow-hidden ${
        isOpen ? "border-[var(--primary)]/25 shadow-lg shadow-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--primary)]/15"
      }`}
    >
      <button
        onClick={toggle}
        className="w-full text-left p-6 flex gap-4 items-start group"
        aria-expanded={isOpen}
      >
        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all duration-300 ${
          item.status === "Current"
            ? "bg-emerald-500/8 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
            : "bg-[var(--surface)] border-[var(--border)]"
        }`}>
          <Briefcase size={20} className={item.status === "Current" ? "text-emerald-400" : "text-[var(--muted)]"} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-[var(--text)] text-base md:text-lg leading-snug">
              {item.role}
            </h3>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-sm font-semibold text-[var(--primary)] mb-2">{item.company}</p>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {item.duration}
            </span>
            {item.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} />
                {item.location}
              </span>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 mt-1 text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors duration-300"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 flex flex-col gap-5">
              <div className="h-px bg-[var(--border)]" />
              <ul className="flex flex-col gap-3">
                {item.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex gap-2.5 text-sm text-[var(--muted)] leading-relaxed"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 shrink-0" />
                    {h}
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => <Tag key={t} label={t} />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function About() {
  const [openExp, setOpenExp] = useState("esolutions");
  const toggle = (id) => setOpenExp((prev) => (prev === id ? null : id));

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-20 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/3 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-20">

        {/* Header */}
        <div className="flex flex-col gap-5">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]"
          >
            My Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl md:text-6xl font-bold text-[var(--text)]"
          >
            Education &{" "}
            <span className="gradient-text">Experience</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--muted)] max-w-xl text-lg"
          >
            The academic foundations and professional milestones that shaped how I think, build, and solve problems.
          </motion.p>
        </div>

        {/* Education */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]">
                Education
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
              Academic Background
            </h2>
          </motion.div>

          <div className="flex flex-col">
            {EDUCATION.map((item, i) => (
              <EduCard key={item.id} item={item} index={i} isLast={i === EDUCATION.length - 1} />
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]">
                Work Experience
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
              Professional Journey
            </h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            {EXPERIENCE.map((item, i) => (
              <ExpCard key={item.id} item={item} index={i} isOpen={openExp === item.id} toggle={() => toggle(item.id)} />
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl bg-gradient-to-br from-[var(--card)] to-[var(--surface)] border border-[var(--primary)]/15 p-8 md:p-10 overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[var(--primary)]/5 blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[var(--accent)]/5 blur-[40px] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--accent)]" />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--accent)]">
                What Drives Me
              </span>
            </div>
            <p className="text-[var(--text)] text-lg md:text-xl leading-relaxed font-medium max-w-2xl">
              I enjoy building intelligent systems that combine{" "}
              <span className="text-[var(--primary)]">AI</span>,{" "}
              <span className="text-[var(--primary)]">real-world usability</span>, and{" "}
              <span className="text-[var(--primary)]">scalable backend architecture</span>.
            </p>
            <p className="text-[var(--muted)] text-sm md:text-base leading-relaxed max-w-2xl">
              My work focuses on creating solutions that are not just technically sound, but also impactful and user-centric — bridging the gap between research and deployment.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
