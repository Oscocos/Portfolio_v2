import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { profile } from "../data/resume";

const name = profile.name.toUpperCase();

export default function ZephyrName() {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 0.35, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const zSlash = useTransform(scrollYProgress, [0, 1], ["0deg", "-18deg"]);

  return (
    <section
      ref={ref}
      className="relative flex h-[180vh] items-start justify-center pt-[18vh]"
    >
      <motion.div
        style={{ opacity, scale }}
        className="sticky top-[18vh] flex flex-wrap justify-center gap-x-[0.04em] overflow-hidden px-4 text-center font-display text-[clamp(4.5rem,13vw,15rem)] leading-[0.78] tracking-[-0.08em]"
        aria-label={profile.name}
      >
        {name.split("").map((char, index) => {
          const isSpace = char === " ";
          const direction = index % 2 === 0 ? -1 : 1;

          const y = useTransform(
            scrollYProgress,
            [0.08, 0.85],
            [0, direction * (120 + index * 7)],
          );

          const rotate = useTransform(
            scrollYProgress,
            [0.08, 0.85],
            [0, direction * (index % 3 === 0 ? 9 : 5)],
          );

          const blur = useTransform(
            scrollYProgress,
            [0.05, 0.8],
            ["blur(0px)", "blur(1.5px)"],
          );

          if (isSpace) {
            return (
              <span key={index} className="w-[0.22em]">
                &nbsp;
              </span>
            );
          }

          const isZ = char === "Z";

          return (
            <motion.span
              key={`${char}-${index}`}
              style={{
                y,
                rotate,
                filter: blur,
              }}
              className={isZ ? "relative inline-block text-[var(--aegean)]" : "inline-block"}
            >
              {char}

              {isZ && (
                <motion.span
                  style={{ rotate: zSlash }}
                  className="absolute left-1/2 top-1/2 h-[0.08em] w-[1.05em] -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)]"
                />
              )}
            </motion.span>
          );
        })}
      </motion.div>

      <motion.p
        style={{
          opacity: useTransform(scrollYProgress, [0.05, 0.3, 0.72], [0, 1, 0]),
          y: useTransform(scrollYProgress, [0.05, 0.72], [20, -30]),
        }}
        className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--olive)]"
      >
        Zephyros scroll
      </motion.p>
    </section>
  );
}