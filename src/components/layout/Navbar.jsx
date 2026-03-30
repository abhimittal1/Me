import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Github, Linkedin, Twitter, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { href: process.env.REACT_APP_SOCIAL_GITHUB || "https://github.com", icon: Github, label: "GitHub" },
  { href: process.env.REACT_APP_SOCIAL_LINKEDIN || "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: process.env.REACT_APP_SOCIAL_TWITTER || "https://twitter.com", icon: Twitter, label: "Twitter" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07 + 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

const desktopLinkClass = ({ isActive }) =>
  [
    "relative text-sm font-medium transition-all duration-300 py-2 px-3 rounded-xl",
    isActive
      ? "text-[var(--primary)] bg-[var(--primary)]/8"
      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50",
  ].join(" ");

const mobileLinkClass = ({ isActive }) =>
  [
    "text-4xl font-display font-bold tracking-tight transition-colors duration-300",
    isActive ? "gradient-text" : "text-[var(--text)] hover:text-[var(--primary)]",
  ].join(" ");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const overlayRef = useRef(null);
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={[
          "fixed top-4 inset-x-4 md:inset-x-6 z-50 flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500",
          scrolled
            ? "glass shadow-xl shadow-black/10"
            : "bg-transparent",
        ].join(" ")}
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 select-none group-hover:shadow-xl group-hover:shadow-[var(--primary)]/30 group-hover:scale-105 transition-all duration-300">
            {process.env.REACT_APP_INITIALS || "YN"}
          </span>
          <span className="hidden xs:block font-display text-base font-semibold text-[var(--text)] leading-none">
            {(process.env.REACT_APP_FULL_NAME || "YourName").split(" ").slice(0, -1).join(" ")}
            <span className="text-[var(--primary)]">
              {(process.env.REACT_APP_FULL_NAME || "YourName").split(" ").slice(-1)[0]}
            </span>
          </span>
        </NavLink>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} className={desktopLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--surface)]/50 transition-all duration-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={17} />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={17} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <NavLink
            to="/contact"
            className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:scale-[1.03] transition-all duration-300"
          >
            Hire Me
          </NavLink>
        </div>

        {/* Mobile right actions */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="flex items-center justify-center w-11 h-11 min-w-[44px] rounded-xl text-[var(--text)] hover:text-[var(--primary)] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            key="mobile-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleOverlayClick}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--bg)]/98 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map(({ to, label }, i) => (
                <motion.div key={to} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                  <NavLink
                    to={to}
                    end={to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div custom={NAV_LINKS.length} variants={itemVariants} initial="hidden" animate="visible">
                <NavLink
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex items-center px-8 py-3 text-base font-semibold rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-all duration-300"
                >
                  Hire Me
                </NavLink>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.3 } }}
              className="absolute bottom-12 flex items-center gap-7"
            >
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors duration-300"
                >
                  <Icon size={24} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
