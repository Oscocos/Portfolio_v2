import { motion } from "motion/react";

export default function IntroReveal() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999] bg-black"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{
        delay: 0.15,
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--gold)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "left" }}
      />

      <div className="absolute bottom-4 left-0 h-2 w-full greek-border opacity-80" />
    </motion.div>
  );
}