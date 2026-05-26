import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const ORBIT_RADIUS_FRAC  = 0.38;  // orbit radius as fraction of container width
const PNG_SIZE_FRAC      = 0.20;  // each figure width as fraction of container width
const AMPHORA_SIZE_FRAC  = 0.68;  // amphora width as fraction of container width
const TOTAL_ROTATIONS    = 1.5;   // full rotations across the scroll range
const ACTIVE_SCALE       = 1.30;
const ACTIVE_OPACITY     = 1.0;
const INACTIVE_OPACITY   = 0.35;
const SCROLL_START       = 0.08;
const SCROLL_END         = 0.96;
const SECTION_THRESHOLD  = 0.35;
// ─────────────────────────────────────────────────────────────────────────────

type SectionId =
  | "profile" | "skills" | "experience" | "work"
  | "education" | "certifications" | "contact";

const SECTIONS: SectionId[] = [
  "profile","skills","experience","work","education","certifications","contact",
];

// The 6 unique figures, evenly spaced around the orbit
const ORBIT_PNGS = [
  "/01_coding_programmer_black_figure_transparent.png",
  "/02_graduation_certificate_black_figure_transparent.png",
  "/03_tinkering_engineering_black_figure_transparent.png",
  "/04_planning_strategy_black_figure_transparent.png",
  "/05_awards_laurel_black_figure_transparent.png",
  "/06_music_tech_black_figure_transparent.png",
];

// Which orbit index lights up for each section
const ACTIVE_IDX: Record<SectionId, number> = {
  profile:        3,  // 04_planning_strategy
  skills:         0,  // 01_coding_programmer
  experience:     2,  // 03_tinkering_engineering
  work:           5,  // 06_music_tech
  education:      1,  // 02_graduation_certificate
  certifications: 4,  // 05_awards_laurel
  contact:        5,  // 06_music_tech
};

export default function StickyVessel({
  sections = SECTIONS,
}: {
  sections?: SectionId[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(280);
  const [angle, setAngle]           = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>(sections[0]);

  const { scrollYProgress } = useScroll();
  const rotationMV = useTransform(
    scrollYProgress,
    [SCROLL_START, SCROLL_END],
    [0, TOTAL_ROTATIONS * 360],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => rotationMV.on("change", setAngle), [rotationMV]);

  useEffect(() => {
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id as SectionId); },
        { threshold: SECTION_THRESHOLD },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [sections]);

  const orbitRadius = containerW * ORBIT_RADIUS_FRAC;
  const pngSize     = containerW * PNG_SIZE_FRAC;
  const amphoraW    = containerW * AMPHORA_SIZE_FRAC;
  const activeIdx   = ACTIVE_IDX[activeSection];

  const positions = useMemo(
    () =>
      ORBIT_PNGS.map((_, i) => {
        const theta = ((i / ORBIT_PNGS.length) * 360 + angle) * (Math.PI / 180);
        return {
          x: Math.cos(theta) * orbitRadius,
          y: Math.sin(theta) * orbitRadius,
        };
      }),
    [angle, orbitRadius],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-visible"
      style={{ aspectRatio: "3 / 5" }}
      aria-hidden="true"
    >
      <img
        src="/reference.jpg"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: amphoraW,
          height: "auto",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "multiply",
          opacity: 0.88,
          pointerEvents: "none",
        }}
      />

      {ORBIT_PNGS.map((src, i) => {
        const { x, y } = positions[i];
        const isActive = activeIdx === i;

        return (
          <motion.img
            key={src}
            src={src}
            alt=""
            draggable={false}
            animate={{
              opacity: isActive ? ACTIVE_OPACITY : INACTIVE_OPACITY,
              scale:   isActive ? ACTIVE_SCALE   : 1,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              position:      "absolute",
              left:          `calc(50% + ${x}px - ${pngSize / 2}px)`,
              top:           `calc(50% + ${y}px - ${pngSize / 2}px)`,
              width:         pngSize,
              height:        "auto",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}
