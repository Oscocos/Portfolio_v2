import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "../data/resume";

export default function ScrollNav() {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0.055, 0.075], [0, 1]);
  const y = useTransform(scrollYProgress, [0.055, 0.075], [-16, 0]);

  return (
    <motion.header
      style={{ opacity, y }}
      className="fixed left-0 top-0 z-50 w-full border-b border-white/15 bg-black text-[var(--marble)]"
    >
      <nav className="mx-auto flex max-w-none items-center justify-between px-5 py-3 text-xs uppercase tracking-wider md:px-10 md:py-4 md:tracking-[0.22em]">
        <a href="#" className="font-semibold">
          <span className="md:hidden">OZS</span>
          <span className="hidden md:inline">{profile.name}</span>
        </a>

        <div className="flex gap-4 text-white/70 md:gap-5">
          <a href="#profile" className="hidden md:inline">Profile</a>
          <a href="#experience" className="hidden md:inline">Experience</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
    </motion.header>
  );
}