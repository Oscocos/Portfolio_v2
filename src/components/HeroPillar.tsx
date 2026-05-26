// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CROP_TOP_PX       = 5;
const CROP_LEFT_PX      = 100;
const BOTTOM_FADE_START = 0.6;
const LEFT_FADE_WIDTH   = 50;
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroPillar({
  src = "/pillar.png",
  extendLeft = 170,
  bleedRight = 40,
}: {
  src?: string;
  extendLeft?: number;
  bleedRight?: number;
}) {
  return (
    <div
      className="relative h-full"
      aria-hidden="true"
      style={{
        width: `calc(195% + ${bleedRight + extendLeft}px)`,
        marginLeft: `-${extendLeft}px`,
      }}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover select-none"
        style={{
          objectPosition: `-${CROP_LEFT_PX}px -${CROP_TOP_PX}px`,
        }}
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: `${LEFT_FADE_WIDTH}px`,
          background: `linear-gradient(to right, var(--marble), transparent)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: `${(1 - BOTTOM_FADE_START) * 100}%`,
          background: `linear-gradient(to bottom, transparent, var(--marble))`,
        }}
      />
    </div>
  );
}
