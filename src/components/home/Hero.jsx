import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Download } from "lucide-react";

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
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay } },
});

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16 px-5 md:px-10 lg:px-20">

      {/* Static background blobs — zero JS animation cost */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-[640px] h-[640px] rounded-full"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 65%)", opacity: 0.07 }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)", opacity: 0.06 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center gap-14 lg:gap-20">

        {/* Left: text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* Status badge */}
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 rounded-full text-xs font-semibold tracking-wide border border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {process.env.REACT_APP_HERO_GREETING || "Available for work"}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            {...fadeUp(0.1)}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight text-[var(--text)] mb-4"
          >
            Hi, I'm
            <br />
            <span className="gradient-text">
              {process.env.REACT_APP_FULL_NAME || "Your Name"}
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-xl md:text-2xl text-[var(--muted)] mb-5 min-h-[2rem]"
          >
            <Typewriter />
          </motion.p>

          {/* Bio */}
          <motion.p
            {...fadeUp(0.28)}
            className="text-[var(--muted)] leading-relaxed max-w-md mb-8 text-base"
          >
            {process.env.REACT_APP_HERO_BIO || "Building intelligent AI systems and scalable full-stack applications."}
          </motion.p>

          {/* Stats row */}
          <motion.div {...fadeUp(0.36)} className="flex items-center gap-6 sm:gap-8 mb-8">
            {[
              { value: process.env.REACT_APP_ABOUT_YEARS || "1+", label: "Years Exp." },
              { value: process.env.REACT_APP_ABOUT_PROJECTS || "10+", label: "Projects" },
              { value: "500+", label: "DSA Solved" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-8">
                {i > 0 && <div className="h-9 w-px bg-[var(--border)]" />}
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-[var(--text)] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-[var(--muted)] uppercase tracking-widest font-medium mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.44)} className="flex flex-row gap-3 w-full sm:w-auto mb-8">
            <Link
              to="/projects"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:brightness-110 transition-all duration-300 text-sm"
            >
              View Projects
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="/Abhishek_Resume_AI.pdf"
              download="Abhishek_Resume_AI.pdf"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-[var(--border)] text-[var(--text)] font-semibold hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-all duration-300 text-sm"
            >
              <Download size={15} />
              Download CV
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div {...fadeUp(0.52)} className="flex items-center gap-2.5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all duration-300"
              >
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: Circular photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex-shrink-0 relative flex items-center justify-center"
        >
          {/* Soft glow behind circle */}
          <div
            className="absolute inset-0 rounded-full -z-10 scale-125 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--primary), var(--accent))", opacity: 0.15 }}
          />
          {/* 3px gradient ring via padding trick */}
          <div
            className="p-[3px] rounded-full"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--accent), var(--primary))" }}
          >
            <div className="rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
              <img
                src={require("../../assets/Abhishek_Mittal.png")}
                alt={process.env.REACT_APP_FULL_NAME || "Profile"}
                className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[290px] md:h-[290px] lg:w-[330px] lg:h-[330px] object-cover block"
                style={{ objectPosition: "center top" }}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}