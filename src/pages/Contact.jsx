import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Clock, Github, Linkedin, Twitter, Send, ArrowRight } from "lucide-react";

const FORMSPREE_ID = process.env.REACT_APP_FORMSPREE_ID || "";
const EMAIL = process.env.REACT_APP_EMAIL || "you@example.com";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: MapPin, label: "Location", value: process.env.REACT_APP_LOCATION || "Your City, Country", href: null },
  { icon: Clock, label: "Availability", value: process.env.REACT_APP_AVAILABILITY || "Open to opportunities", href: null },
];

const SOCIALS = [
  { icon: Github, label: "GitHub", href: process.env.REACT_APP_SOCIAL_GITHUB || "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: process.env.REACT_APP_SOCIAL_LINKEDIN || "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: process.env.REACT_APP_SOCIAL_TWITTER || "https://twitter.com" },
  { icon: Mail, label: "Email", href: `mailto:${EMAIL}` },
];

function AnimatedCheck() {
  return (
    <motion.svg viewBox="0 0 52 52" className="w-16 h-16" initial="hidden" animate="visible">
      <motion.circle
        cx="26" cy="26" r="25" fill="none" stroke="var(--primary)" strokeWidth="2"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } }}
      />
      <motion.path
        d="M14 27 l8 8 16-16" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut", delay: 0.45 } } }}
      />
    </motion.svg>
  );
}

function FloatingInput({ id, label, type = "text", value, onChange, error, required }) {
  const borderClass = error
    ? "border-red-500/60 focus:border-red-500"
    : "border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)]";

  return (
    <div className="relative">
      <input
        id={id} type={type} value={value} onChange={onChange} placeholder={label} required={required}
        className={`peer w-full bg-[var(--surface)]/50 backdrop-blur-sm border rounded-2xl px-5 pt-6 pb-2.5 text-sm text-[var(--text)] placeholder-transparent focus:outline-none transition-all duration-300 ${borderClass}`}
      />
      <label
        htmlFor={id}
        className="absolute left-5 top-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted)] peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-wider peer-focus:uppercase peer-focus:text-[var(--primary)] transition-all duration-300 pointer-events-none"
      >
        {label}{required && " *"}
      </label>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function FloatingTextarea({ id, label, value, onChange, error, required }) {
  const borderClass = error
    ? "border-red-500/60 focus:border-red-500"
    : "border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)]";

  return (
    <div className="relative">
      <textarea
        id={id} value={value} onChange={onChange} placeholder={label} required={required} rows={5}
        className={`peer w-full bg-[var(--surface)]/50 backdrop-blur-sm border rounded-2xl px-5 pt-6 pb-2.5 text-sm text-[var(--text)] placeholder-transparent focus:outline-none transition-all duration-300 resize-none ${borderClass}`}
      />
      <label
        htmlFor={id}
        className="absolute left-5 top-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted)] peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-wider peer-focus:uppercase peer-focus:text-[var(--primary)] transition-all duration-300 pointer-events-none"
      >
        {label}{required && " *"}
      </label>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function validate({ name, email, subject, message }) {
  const errs = {};
  if (!name.trim()) errs.name = "Name is required.";
  if (!email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
  if (!subject.trim()) errs.subject = "Subject is required.";
  if (!message.trim()) errs.message = "Message is required.";
  return errs;
}

function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) { setStatus("success"); setFields({ name: "", email: "", subject: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 text-center py-20"
      >
        <AnimatedCheck />
        <h3 className="font-display text-xl font-semibold text-[var(--text)]">Message sent!</h3>
        <p className="text-sm text-[var(--muted)] max-w-xs">Thanks for reaching out — I'll get back to you within 24 hours.</p>
        <button onClick={() => setStatus("idle")} className="mt-2 text-xs text-[var(--primary)] hover:underline underline-offset-2">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FloatingInput id="name" label="Name" value={fields.name} onChange={set("name")} error={errors.name} required />
        <FloatingInput id="email" label="Email" type="email" value={fields.email} onChange={set("email")} error={errors.email} required />
      </div>
      <FloatingInput id="subject" label="Subject" value={fields.subject} onChange={set("subject")} error={errors.subject} required />
      <FloatingTextarea id="message" label="Message" value={fields.message} onChange={set("message")} error={errors.message} required />

      {status === "error" && (
        <p className="text-sm text-red-400 text-center">Something went wrong. Please try again or email me directly.</p>
      )}

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-semibold text-sm shadow-xl shadow-[var(--primary)]/20 hover:shadow-2xl hover:shadow-[var(--primary)]/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
      >
        {status === "loading" ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={15} /> Send Message
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
});

export default function Contact() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-20 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-40 left-0 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/3 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-5">
          <motion.p {...fadeUp(0)} className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary)]">
            Contact
          </motion.p>
          <motion.h1 {...fadeUp(0.06)} className="font-display text-4xl md:text-6xl font-bold text-[var(--text)]">
            Get In{" "}
            <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p {...fadeUp(0.12)} className="text-[var(--muted)] max-w-xl text-lg">
            {process.env.REACT_APP_CONTACT_TAGLINE || "Have a project in mind or just want to say hi? My inbox is always open."}
          </motion.p>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left: info */}
          <div className="flex flex-col gap-8">
            <motion.div {...fadeUp(0.15)} className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-[var(--text)]">Let's work together</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                {process.env.REACT_APP_CONTACT_BLURB || "I'm currently open to freelance projects and full-time roles. Whether it's a small landing page or a complex SaaS — let's talk and see if we're a good fit."}
              </p>
            </motion.div>

            <div className="flex flex-col gap-3">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(0.2 + i * 0.07)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/25 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/8 text-[var(--primary)] flex-shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)]">{label}</span>
                    {href ? (
                      <a href={href} className="text-sm text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-300 truncate">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--text)] truncate">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp(0.42)} className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">Find me on</p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              <ContactForm key="contact-form" />
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
