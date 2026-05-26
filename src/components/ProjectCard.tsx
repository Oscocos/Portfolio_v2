import { motion } from "motion/react";
import PretextBody from "./PretextBody";

type ProjectCardProps = {
  title: string;
  type: string;
  description: string;
  link?: string;
};

export default function ProjectCard({
  title,
  type,
  description,
  link,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      whileHover={{ x: 8 }}
      className="group grid gap-4 border-t border-[var(--sand)] py-8 md:grid-cols-12"
    >
      <div className="md:col-span-3">
        <p className="text-sm uppercase tracking-wide text-[var(--olive)]">
          {type}
        </p>
      </div>

      <div className="md:col-span-8">
        <h2 className="font-display text-5xl leading-none md:text-7xl">
          {title}
        </h2>

        <PretextBody
          text={description}
          font="18px Inter"
          lineHeight={30}
          className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--olive)]"
        />

        {link && (
          <p className="mt-4 font-mono text-xs uppercase tracking-wide text-[var(--aegean)]">
            {link}
          </p>
        )}
      </div>

      <div className="flex justify-end md:col-span-1">
        <span className="text-4xl text-[var(--terracotta)] transition-transform group-hover:rotate-45">
          /
        </span>
      </div>
    </motion.article>
  );
}