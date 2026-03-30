import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Star, GitFork, ExternalLink, Heart } from "lucide-react";
import { useGitHubProjects } from "../../hooks/useGitHubProjects";

const USERNAME = process.env.REACT_APP_GITHUB_USERNAME || "abhimittal1";

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/contact", label: "Contact" },
];

const NAME = process.env.REACT_APP_FULL_NAME || "YourName";
const INITIALS = process.env.REACT_APP_INITIALS || "YN";
const EMAIL = process.env.REACT_APP_EMAIL || "you@example.com";

const SOCIALS = [
  { icon: Github, href: process.env.REACT_APP_SOCIAL_GITHUB || "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: process.env.REACT_APP_SOCIAL_LINKEDIN || "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: process.env.REACT_APP_SOCIAL_TWITTER || "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
];

function MiniRepoCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
          {project.name}
        </span>
        <ExternalLink size={11} className="text-[var(--muted)] flex-shrink-0 group-hover:text-[var(--primary)]" />
      </div>
      {project.description && (
        <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}
      <div className="flex items-center gap-3 text-[11px] text-[var(--muted)]">
        {project.primaryLanguage && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            {project.primaryLanguage}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={10} className="text-yellow-400" />
          {project.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={10} />
          {project.forks}
        </span>
      </div>
    </a>
  );
}

function StarCount() {
  const { projects } = useGitHubProjects();
  const total = projects.reduce((s, p) => s + (p.stars ?? 0), 0);
  if (!total) return null;
  return (
    <span className="flex items-center gap-1.5 text-[var(--muted)]">
      <Star size={12} className="text-yellow-400" />
      {total} stars on GitHub
    </span>
  );
}

export default function Footer() {
  const { projects, loading } = useGitHubProjects();
  const latest = projects.length > 0 ? projects[0] : null;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-[var(--surface)]/50 text-[var(--text)]">
      {/* Top gradient line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary), var(--accent), var(--primary), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-20 pt-16 pb-8 flex flex-col gap-14">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-sm font-bold text-white select-none shadow-lg shadow-[var(--primary)]/20 group-hover:scale-105 transition-transform duration-300">
                {INITIALS}
              </span>
              <span className="font-display text-base font-semibold text-[var(--text)]">
                {NAME.split(" ").slice(0, -1).join(" ")}
                <span className="text-[var(--primary)]">{NAME.split(" ").slice(-1)[0]}</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
              {process.env.REACT_APP_FOOTER_TAGLINE || "Full-stack developer crafting fast, accessible, and beautiful web experiences. Always learning, always shipping."}
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors duration-300 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">
              Currently Building
            </h3>
            {loading ? (
              <div className="h-24 rounded-2xl bg-[var(--card)] animate-pulse" />
            ) : latest ? (
              <MiniRepoCard project={latest} />
            ) : (
              <p className="text-xs text-[var(--muted)]">No repos found.</p>
            )}
            <a
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--primary)] hover:underline underline-offset-2 w-fit"
            >
              <Github size={12} />
              See all on GitHub
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          <span>&copy; {year} {NAME}. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart size={12} className="text-red-400" />{" "}
            using <span className="text-[var(--text)] font-medium">React</span> +{" "}
            <span className="text-[var(--text)] font-medium">Three.js</span> +{" "}
            <span className="text-[var(--text)] font-medium">Tailwind</span>
          </span>
          <StarCount />
        </div>
      </div>
    </footer>
  );
}
