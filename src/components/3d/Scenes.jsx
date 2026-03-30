import { motion } from "framer-motion";

// ─── Lightweight CSS-based animated backgrounds (replaces Three.js) ──────────

function FloatingOrb({ className, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={style}
    />
  );
}

function GridPattern({ opacity = 0.03 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(var(--primary) 1px, transparent 1px),
          linear-gradient(90deg, var(--primary) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
      }}
    />
  );
}

function ParticleDots({ count = 20 }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <>
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-[var(--primary)] pointer-events-none"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

// ─── Hero Scene ──────────────────────────────────────────────────────────────
export function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <GridPattern opacity={0.04} />
      <ParticleDots count={25} />

      {/* Animated gradient orbs */}
      <FloatingOrb
        delay={0}
        className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] animate-float"
        style={{
          top: "10%",
          left: "5%",
          background: "radial-gradient(circle, var(--primary), transparent 70%)",
          opacity: 0.08,
          filter: "blur(60px)",
        }}
      />
      <FloatingOrb
        delay={0.3}
        className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] animate-float-delayed"
        style={{
          bottom: "10%",
          right: "5%",
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          opacity: 0.06,
          filter: "blur(50px)",
        }}
      />

      {/* Geometric wireframe shapes (CSS) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[15%] w-24 h-24 md:w-40 md:h-40 border border-[var(--primary)]/10 rounded-2xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] left-[10%] w-20 h-20 md:w-32 md:h-32 border border-[var(--accent)]/8 rounded-full"
      />
    </div>
  );
}

// ─── Projects Scene ──────────────────────────────────────────────────────────
export function ProjectsScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <GridPattern opacity={0.03} />
      <ParticleDots count={15} />

      <FloatingOrb
        delay={0}
        className="w-[300px] h-[300px] animate-float"
        style={{
          top: "5%",
          right: "-5%",
          background: "radial-gradient(circle, var(--primary), transparent 70%)",
          opacity: 0.06,
          filter: "blur(50px)",
        }}
      />
      <FloatingOrb
        delay={0.5}
        className="w-[250px] h-[250px] animate-float-delayed"
        style={{
          bottom: "10%",
          left: "-5%",
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          opacity: 0.05,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

// ─── Skills Scene ────────────────────────────────────────────────────────────
export function SkillsScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <GridPattern opacity={0.03} />
      <ParticleDots count={12} />

      <FloatingOrb
        delay={0}
        className="w-[280px] h-[280px] animate-float"
        style={{
          top: "10%",
          left: "-5%",
          background: "radial-gradient(circle, var(--primary), transparent 70%)",
          opacity: 0.06,
          filter: "blur(45px)",
        }}
      />
      <FloatingOrb
        delay={0.4}
        className="w-[200px] h-[200px] animate-float-delayed"
        style={{
          bottom: "15%",
          right: "-5%",
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          opacity: 0.05,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
