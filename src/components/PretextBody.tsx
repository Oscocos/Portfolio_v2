import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

type PretextBodyProps = {
  text: string;
  className?: string;
  font?: string;
  lineHeight?: number;
};

type PretextLine = {
  text: string;
};

type PretextLinesResult = {
  lines: PretextLine[];
};

type PretextApi = {
  prepareWithSegments: (
    text: string,
    font: string,
    options?: { whiteSpace?: string },
  ) => unknown;
  layoutWithLines: (
    prepared: unknown,
    width: number,
    lineHeight: number,
  ) => PretextLinesResult;
};

export default function PretextBody({
  text,
  className = "",
  font = "18px Inter, system-ui, sans-serif",
  lineHeight = 30,
}: PretextBodyProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? Math.max(1, window.innerWidth - 80) : 640
  );
  const [lines, setLines] = useState<string[]>([text]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setWidth(Math.max(1, entry.contentRect.width));
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runPretext() {
      try {
        await document.fonts.ready;

        let resolvedFont = font;
        let resolvedLineH = lineHeight;
        if (ref.current) {
          const cs = getComputedStyle(ref.current);
          const csSize = parseFloat(cs.fontSize);
          if (!isNaN(csSize) && csSize > 0) {
            resolvedFont = font.replace(/^[\d.]+px/, `${csSize}px`);
            const origSize = parseFloat(font);
            if (!isNaN(origSize) && origSize > 0) {
              resolvedLineH = Math.round(lineHeight * (csSize / origSize));
            }
          }
        }

        const pretext = (await import("@chenglou/pretext")) as PretextApi;
        const prepared = pretext.prepareWithSegments(text, resolvedFont, {
          whiteSpace: "normal",
        });
        const result = pretext.layoutWithLines(
          prepared,
          Math.max(1, width),
          resolvedLineH,
        );

        if (!cancelled) {
          setLines(result.lines.map((line) => line.text).filter((l) => l.trim()));
        }
      } catch {
        if (!cancelled) setLines([text]);
      }
    }

    runPretext();
    return () => { cancelled = true; };
  }, [text, font, width, lineHeight]);

  const renderedLines = useMemo(
    () => (lines.length > 0 ? lines : [text]),
    [lines, text],
  );

  return (
    <div
      ref={ref}
      className={className}
      aria-label={text}
      style={{ lineHeight: `${lineHeight}px` }}
    >
      {renderedLines.map((line, index) => (
        <motion.span
          key={`${line}-${index}`}
          className="block whitespace-normal"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 32,
            delay: index * 0.025,
          }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}
