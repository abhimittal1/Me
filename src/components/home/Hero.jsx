import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Download } from "lucide-react";
import { HeroScene } from "../3d/Scenes";

// ─── Typewriter ───────────────────────────────────────────────────────────────
const ROLES = [
  process.env.REACT_APP_HERO_ROLE_1 || "Full-Stack Developer",
  process.env.REACT_APP_HERO_ROLE_2 || "UI / UX Enthusiast",
  process.env.REACT_APP_HERO_ROLE_3 || "Open-Source Contributor",
];

function Typewriter() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const current = ROLES[roleIdx];

    if (!deleting && displayed === current) {
      timeout.current = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed === "") {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    } else {
      timeout.current = setTimeout(
        () =>
          setDisplayed((d) =>
            deleting ? d.slice(0, -1) : current.slice(0, d.length + 1)
          ),
        deleting ? 40 : 70
      );
    }

    return () => clearTimeout(timeout.current);
  }, [displayed, deleting, roleIdx]);

  return (
    <span className="gradient-text font-bold">
      {displayed}
      <span className="animate-[blink_0.9s_step-end_infinite] border-r-2 border-[var(--primary)] ml-0.5" />
    </span>
  );
}

// ─── Social links ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon: Github, href: process.env.REACT_APP_SOCIAL_GITHUB || "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: process.env.REACT_APP_SOCIAL_LINKEDIN || "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: process.env.REACT_APP_SOCIAL_TWITTER || "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: `mailto:${process.env.REACT_APP_EMAIL || "you@example.com"}`, label: "Email" },
];

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});

// ─── Profile Image Component ──────────────────────────────────────────────────
function ProfileImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="relative w-[160px] sm:w-[180px] md:w-[220px] lg:w-[300px]"
    >
      {/* Animated gradient ring behind */}
      <div className="absolute inset-0 -z-10 scale-110">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-[spin_8s_linear_infinite] blur-2xl opacity-21" />
      </div>

      {/* Image container */}
      <div className="relative rounded-3xl border border-[var(--border)]/50 bg-gradient-to-b from-[var(--card)]/80 to-[var(--surface)]/60 backdrop-blur-xl shadow-2xl shadow-[var(--primary)]/20 overflow-hidden">
        {/* Profile image — face-first crop */}
        <div className="aspect-[3/4] w-full">
          <img
            src={require("../../assets/Abhishek_Mittal.png")}
            alt={process.env.REACT_APP_FULL_NAME || "Profile"}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent pointer-events-none" />

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[var(--primary)]/10 to-transparent rounded-bl-3xl" />
        <div className="absolute bottom-0 left-0 w-14 h-14 bg-gradient-to-tr from-[var(--accent)]/8 to-transparent rounded-tr-3xl" />
      </div>

      {/* Floating decorative elements — hidden on small screens */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute -top-4 -right-4 w-12 h-12 rounded-2xl border-2 border-[var(--primary)]/20 -z-10 rotate-12"
      />
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute -bottom-6 -left-6 w-16 h-16 rounded-full border-2 border-[var(--accent)]/15 -z-10"
      />
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative min-h-screen lg:h-screen flex flex-col justify-center overflow-hidden pt-24 pb-20 lg:pt-0 lg:pb-0 px-5 md:px-10 lg:px-20">
      {/* Animated background */}
      <HeroScene />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">

        {/* Left: text content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* Status badge */}
          <motion.div {...fadeUp(0.05)}>
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-medium glass text-[var(--text)] mb-5 lg:mb-8 shadow-lg shadow-black/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {process.env.REACT_APP_HERO_GREETING || "Available for work"}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            {...fadeUp(0.15)}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[var(--text)] mb-3 lg:mb-4"
          >
            Hi, I'm{" "}
            <span className="gradient-text">
              {process.env.REACT_APP_FULL_NAME || "Your Name"}
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.p
            {...fadeUp(0.25)}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-body text-[var(--muted)] mb-4 lg:mb-6 min-h-[2rem] lg:min-h-[2.5rem]"
          >
            <Typewriter />
          </motion.p>

          {/* Bio */}
          <motion.p
            {...fadeUp(0.35)}
            className="text-[var(--muted)] leading-relaxed max-w-lg mb-6 lg:mb-10 text-sm md:text-base lg:text-lg"
          >
            {process.env.REACT_APP_HERO_BIO || "I craft fast, accessible, and beautiful web experiences — from pixel-perfect UIs to resilient back-end services. Passionate about clean code and great DX."}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            {...fadeUp(0.45)}
            className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto mb-6 lg:mb-10"
          >
            <Link
              to="/projects"
              className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-[var(--primary)] text-[var(--bg)] font-semibold shadow-xl shadow-[var(--primary)]/25 hover:shadow-2xl hover:shadow-[var(--primary)]/30 hover:scale-[1.02] transition-all duration-300 text-center overflow-hidden text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Projects
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <a
              href={"/Abhishek_Resume_AI.pdf"}
              download="Abhishek_Resume_AI.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl glass text-[var(--text)] font-semibold hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300 text-center text-sm sm:text-base"
            >
              <Download size={16} />
              Download CV
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div {...fadeUp(0.55)} className="flex items-center gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-2xl glass text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/10 hover:scale-110 transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: Profile image */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <ProfileImage />
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile/tablet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-[var(--muted)]/30 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[var(--primary)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
