import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import HeroCanvas from "./HeroCanvas";
import HeroPillar from "./HeroPillar";
import { profile } from "../data/resume";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SCATTER_SCROLL_END   = 0.08;
const PILLAR_FADE_DELAY    = 0.4;
const PILLAR_FADE_DURATION = 0.9;
// ─────────────────────────────────────────────────────────────────────────────

const name = profile.name.toUpperCase();

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const scatterMV = useTransform(scrollYProgress, [0, SCATTER_SCROLL_END], [0, 1]);

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative grid h-[55vh] gap-10 md:h-[92vh] md:grid-cols-12">

      <div className="relative h-full md:col-span-10">
        <HeroCanvas
          name={name}
          headline={profile.headline}
          scatterMV={scatterMV}
        />
        <span className="sr-only">{profile.name}</span>
        <span className="sr-only">{profile.headline}</span>
      </div>

      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: PILLAR_FADE_DELAY, duration: PILLAR_FADE_DURATION }}
          className="h-full overflow-visible md:col-span-2"
        >
          <HeroPillar />
        </motion.div>
      )}

      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: PILLAR_FADE_DELAY, duration: PILLAR_FADE_DURATION }}
          style={{
            position: "absolute",
            right: 47,    // ~100px left of original position; nameW:pillarW = 48%:52%
            top: 0,
            height: "100%",
            width: "38%",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <HeroPillar extendLeft={0} bleedRight={0} />
        </motion.div>
      )}

    </section>
  );
}
