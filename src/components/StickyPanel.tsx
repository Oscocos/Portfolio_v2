import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SECTION_ORDER, type SectionId, profile } from "../data/resume";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CAROUSEL_MAX_W   = 120;
const SWIPE_DURATION   = 0.52;
const SWIPE_EASE       = [0.4, 0, 0.6, 1] as const;
const STICKY_TOP_PX    = 80;
const FADE_DISTANCE_PX = 100;
const TRIM_SIZE        = 24;   // px — width/height of each pattern tile (square)
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_PNG: Record<SectionId, string> = {
  profile:        "/04_planning_strategy_black_figure_transparent.png",
  skills:         "/01_coding_programmer_black_figure_transparent.png",
  experience:     "/03_tinkering_engineering_black_figure_transparent.png",
  work:           "/projectssection.png",
  education:      "/02_graduation_certificate_black_figure_transparent.png",
  certifications: "/05_awards_laurel_black_figure_transparent.png",
  contact:        "/01_coding_programmer_black_figure_transparent.png",
};

function PatternStrip() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: `${TRIM_SIZE}px`,
        backgroundImage: "url('/patternfinal.png')",
        backgroundRepeat: "repeat-x",
        backgroundSize: `${TRIM_SIZE}px ${TRIM_SIZE}px`,
        backgroundPosition: "center",
        maskImage:
          "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
        opacity: 0.72,
      }}
    />
  );
}

// ── SceneCarousel ─────────────────────────────────────────────────────────────
function SceneCarousel({
  activeSection,
  prevSection,
}: {
  activeSection: SectionId;
  prevSection: SectionId;
}) {
  const dir =
    SECTION_ORDER.indexOf(activeSection) > SECTION_ORDER.indexOf(prevSection)
      ? -1
      : 1;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: CAROUSEL_MAX_W,
        overflow: "hidden",
        maskImage:
          "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
      }}
    >
      <AnimatePresence mode="popLayout" custom={dir}>
        <motion.img
          key={activeSection}
          src={SCENE_PNG[activeSection]}
          alt=""
          draggable={false}
          custom={dir}
          initial={{ x: `${-dir * 100}%`, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: `${dir * 100}%`, opacity: 0 }}
          transition={{ duration: SWIPE_DURATION, ease: SWIPE_EASE }}
          style={{
            position: "absolute",
            inset: "-5.5px 0",
            width: "100%",
            height: "calc(100% + 11px)",
            objectFit: "contain",
          }}
        />
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StickyPanel({
  sections = [...SECTION_ORDER] as SectionId[],
}: {
  sections?: SectionId[];
}) {
  const [activeSection, setActiveSection] = useState<SectionId>(sections[0]);
  const [prevSection, setPrevSection]     = useState<SectionId>(sections[0]);
  const [opacity, setOpacity]             = useState(0);

  const activeSectionRef = useRef<SectionId>(sections[0]);

  // Combined scroll handler: scroll-driven fade-in + section tracking
  useEffect(() => {
    const profileEl = document.getElementById("profile");
    const els = sections
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);

    const update = () => {
      if (profileEl) {
        const fadeEnd   = profileEl.offsetTop - STICKY_TOP_PX;
        const fadeStart = fadeEnd - FADE_DISTANCE_PX;
        const t = Math.min(1, Math.max(0, (window.scrollY - fadeStart) / FADE_DISTANCE_PX));
        setOpacity(t);
      }

      const checkY = window.scrollY + STICKY_TOP_PX;
      let current = els[0].id;
      for (const { id, el } of els) {
        if (el.offsetTop <= checkY) current = id;
      }
      if (current !== activeSectionRef.current) {
        setPrevSection(activeSectionRef.current);
        activeSectionRef.current = current as SectionId;
        setActiveSection(current as SectionId);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [sections]);

  return (
    <div className="flex flex-col items-center" style={{ opacity }} aria-hidden="true">
      <PatternStrip />

      <div className="w-full flex flex-col items-center" style={{ padding: "5.5px 0" }}>
        <SceneCarousel activeSection={activeSection} prevSection={prevSection} />
      </div>

      <PatternStrip />

      <div className="mt-3 flex items-center justify-center gap-4">
        <a href="https://linkedin.com/in/ollantay-scocos" target="_blank" rel="noopener noreferrer">
          <img
            src="/InBug-Black%20(1).svg"
            alt="LinkedIn"
            style={{ height: TRIM_SIZE, width: "auto", display: "block" }}
          />
        </a>
        <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">
          <img
            src="/github-mark.svg"
            alt="GitHub"
            style={{ height: TRIM_SIZE, width: "auto", display: "block" }}
          />
        </a>
        <a href={`mailto:${profile.email}`}>
          <img
            src="/gmail-icon.svg"
            alt="Email"
            style={{ height: TRIM_SIZE, width: "auto", display: "block" }}
          />
        </a>
        <a
          href="/resume.pdf"
          download="OllantayScocosResume.pdf"
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity"
          style={{ lineHeight: `${TRIM_SIZE}px` }}
        >
          Resume
        </a>
      </div>
    </div>
  );
}
