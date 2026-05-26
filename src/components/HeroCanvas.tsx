import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const NAME_FONT_SCALE   = 0.12;
const NAME_FONT_MIN     = 72;
const NAME_FONT_MAX     = 192;
const NAME_LINE_RATIO   = 0.92;
const NAME_TOP_PAD      = 24;
const NAME_WRAP_INSET   = 48;

const HL_BREAKPOINT     = 768;
const HL_FONT_MD        = 36;
const HL_FONT_SM        = 24;
const HL_LINE_RATIO     = 1.4;
const HL_WRAP_RATIO     = 0.72;
const HL_GAP_RATIO      = 0.2;
const HL_GAP_PX         = 28;

const NAME_FALL_CURVE   = 0.55;
const NAME_BOTTOM_BUF   = 28;
const NAME_LAND_LIFT    = 100;
const NAME_X_DRIFT      = 0.03;
const NAME_Z_DEPTH      = 60;
const NAME_ROT_RANGE    = 1.1;

const Z_BOTTOM_BUF      = 6;
const Z_LAND_LIFT       = 100;

const HL_FALL_CURVE     = 0.55;
const HL_BOTTOM_BUF     = 28;
const HL_X_DRIFT        = 0.35;
const HL_Z_DEPTH        = 40;
const HL_ROT_RANGE      = 0.7;

const SPRING_STIFF      = 0.06;
const SPRING_DAMP       = 0.86;

const COLOR_NAME        = "#111111";
const COLOR_Z           = "#009fee";
const COLOR_HEADLINE    = "#6f7357";
// ─────────────────────────────────────────────────────────────────────────────

interface Sprite {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  homeX: number;
  homeY: number;
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  rotScatter: number;
  vx: number;
  vy: number;
  vz: number;
  vr: number;
  fadeOut: boolean;
}

function srand(n: number) {
  return Math.abs(Math.sin(n * 127.1 + 1.9) * 43758.5453) % 1;
}

function makeSprite(
  char: string,
  cssFont: string,
  color: string,
): { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; advance: number } | null {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;
  probe.font = cssFont;
  const m       = probe.measureText(char);
  const ascent  = m.fontBoundingBoxAscent  ?? m.actualBoundingBoxAscent;
  const descent = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
  const advance = Math.ceil(m.width);
  const tw = advance + 4;
  const th = Math.ceil(ascent + descent) + 2;

  const c = document.createElement("canvas");
  c.width = tw;
  c.height = th;
  const ctx = c.getContext("2d")!;
  ctx.font = cssFont;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(char, 2, ascent + 1);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;

  const geo = new THREE.PlaneGeometry(tw, th);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
  return { mesh: new THREE.Mesh(geo, mat), advance };
}

function toThreeX(cssX: number, W: number) { return cssX - W / 2; }
function toThreeY(cssY: number, H: number) { return H / 2 - cssY; }

export default function HeroCanvas({
  name,
  headline,
  scatterMV,
}: {
  name: string;
  headline: string;
  scatterMV: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let alive = true;
    let rafId = 0;
    const sprites: Sprite[] = [];
    let renderer: THREE.WebGLRenderer | null = null;

    const prog = { value: 0 };
    const unsubScatter = scatterMV.on("change", (v) => {
      prog.value = Math.min(1, Math.max(0, v));
    });

    async function build() {
      await document.fonts.ready;
      if (!alive || !canvas) return;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W < 1 || H < 1) return;

      canvas.width  = Math.round(W * devicePixelRatio);
      canvas.height = Math.round(H * devicePixelRatio);

      const scene  = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 1000);
      camera.position.z = 500;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const probe = document.createElement("canvas").getContext("2d")!;

      // ── Name ─────────────────────────────────────────────────────────────
      const isMobile  = W < 600;
      const nameW     = isMobile ? Math.round(W * 0.48) : W;
      const namePx    = isMobile
        ? Math.round(Math.min(nameW * 0.14, 40))
        : Math.round(Math.min(Math.max(NAME_FONT_MIN, W * NAME_FONT_SCALE), NAME_FONT_MAX));
      const nameFont  = `${namePx}px "GFS Didot", Georgia, serif`;
      const nameLineH = namePx * NAME_LINE_RATIO;

      probe.font = nameFont;
      const nameAscent      = probe.measureText("H").fontBoundingBoxAscent ?? probe.measureText("H").actualBoundingBoxAscent;
      const nameBaselineCSS = NAME_TOP_PAD + nameAscent;

      const namePrepared  = prepareWithSegments(name, nameFont, { whiteSpace: "normal" });
      const nameResult    = layoutWithLines(namePrepared, isMobile ? nameW : W - NAME_WRAP_INSET, nameLineH) as { lines?: { text: string }[] };
      const nameLines     = nameResult.lines?.map((l) => l.text).filter(Boolean) ?? [name];

      const nearBottomName = -(H / 2 - NAME_BOTTOM_BUF);
      const nearBottomZ    = -(H / 2 - Z_BOTTOM_BUF);

      let origNameIdx = 0;
      for (let li = 0; li < nameLines.length; li++) {
        const line = nameLines[li];
        let nx = 0;

        for (const char of line) {
          if (char === " ") {
            probe.font = nameFont;
            nx += probe.measureText(" ").width;
            origNameIdx++;
            continue;
          }

          const i = origNameIdx++;
          probe.font = nameFont;
          const m           = probe.measureText(char);
          const charAscent  = m.fontBoundingBoxAscent  ?? m.actualBoundingBoxAscent;
          const charDescent = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
          const advance     = Math.ceil(m.width);
          const tw = advance + 4;
          const th = Math.ceil(charAscent + charDescent) + 2;

          const cssCx           = nx + advance / 2;
          const lineBaselineCSS = nameBaselineCSS + li * nameLineH;
          const cssCy           = lineBaselineCSS - charAscent + th / 2;
          const homeX = toThreeX(cssCx, W);
          const homeY = toThreeY(cssCy, H);

          const isZ          = char === "Z";
          const fallFraction = isZ ? 0 : 1 - Math.pow(srand(i * 3 + 4), NAME_FALL_CURVE);
          const nearBottom   = isZ ? nearBottomZ : nearBottomName;
          const availableFall = homeY - nearBottom;
          const scatterY  = isZ
            ? nearBottomZ + Z_LAND_LIFT
            : homeY - availableFall * fallFraction + NAME_LAND_LIFT;
          const scatterX  = homeX + (srand(i * 3 + 1) - 0.5) * W * NAME_X_DRIFT;
          const scatterZ  = (srand(i * 3 + 2) - 0.5) * NAME_Z_DEPTH;
          const rotScatter = (srand(i * 3 + 3) - 0.5) * NAME_ROT_RANGE;

          const sprite = makeSprite(char, nameFont, isZ ? COLOR_Z : COLOR_NAME);
          if (!sprite) { nx += advance; continue; }

          sprite.mesh.position.set(homeX, homeY, 0);
          scene.add(sprite.mesh);
          sprites.push({ mesh: sprite.mesh, homeX, homeY, scatterX, scatterY, scatterZ, rotScatter, vx: 0, vy: 0, vz: 0, vr: 0, fadeOut: false });

          nx += advance;
        }

        if (li < nameLines.length - 1) origNameIdx++;
      }

      // ── Headline ─────────────────────────────────────────────────────────
      const hlPx    = W >= HL_BREAKPOINT ? HL_FONT_MD : (isMobile ? 16 : HL_FONT_SM);
      const hlFont  = `${hlPx}px Inter, system-ui, sans-serif`;
      const hlLineH = hlPx * HL_LINE_RATIO;

      probe.font = hlFont;
      const hlSpaceW  = probe.measureText(" ").width;
      const hlAscent  = probe.measureText("A").fontBoundingBoxAscent  ?? probe.measureText("A").actualBoundingBoxAscent;
      const hlDescent = probe.measureText("A").fontBoundingBoxDescent ?? probe.measureText("A").actualBoundingBoxDescent;

      const hlBaselineCSS = nameBaselineCSS
        + (nameLines.length - 1) * nameLineH
        + namePx * HL_GAP_RATIO
        + hlPx
        + HL_GAP_PX;

      const hlPrepared = prepareWithSegments(headline, hlFont, { whiteSpace: "normal" });
      const hlResult   = layoutWithLines(hlPrepared, Math.max(1, isMobile ? nameW * 0.9 : W * HL_WRAP_RATIO), hlLineH) as { lines?: { text: string }[] };
      const hlLines    = hlResult.lines?.map((l) => l.text).filter(Boolean) ?? [headline];

      const nearBottomHL = -(H / 2 - HL_BOTTOM_BUF);

      let gi = 0;
      for (let li = 0; li < hlLines.length; li++) {
        const line = hlLines[li];
        let lx = 0;

        for (const char of line) {
          const i = gi++;
          if (char === " ") { lx += hlSpaceW; continue; }

          probe.font = hlFont;
          const advance   = Math.ceil(probe.measureText(char).width);
          const tw = advance + 4;
          const th = Math.ceil(hlAscent + hlDescent) + 2;

          const baselineCSS = hlBaselineCSS + li * hlLineH;
          const cssCx       = lx + advance / 2;
          const cssCy       = baselineCSS - hlAscent + th / 2;
          const homeX = toThreeX(cssCx, W);
          const homeY = toThreeY(cssCy, H);

          const fallFraction  = 1 - Math.pow(srand(i * 3 + 104), HL_FALL_CURVE);
          const availableFall = homeY - nearBottomHL;
          const scatterY      = homeY - availableFall * fallFraction;
          const scatterX      = homeX + (srand(i * 3 + 101) - 0.5) * W * HL_X_DRIFT;
          const scatterZ      = (srand(i * 3 + 102) - 0.5) * HL_Z_DEPTH;
          const rotScatter    = (srand(i * 3 + 103) - 0.5) * HL_ROT_RANGE;

          const sprite = makeSprite(char, hlFont, COLOR_HEADLINE);
          if (!sprite) { lx += advance; continue; }

          sprite.mesh.position.set(homeX, homeY, 0);
          scene.add(sprite.mesh);
          sprites.push({ mesh: sprite.mesh, homeX, homeY, scatterX, scatterY, scatterZ, rotScatter, vx: 0, vy: 0, vz: 0, vr: 0, fadeOut: true });

          lx += advance;
        }
      }

      // ── Animation loop ───────────────────────────────────────────────────
      function animate() {
        if (!alive) return;
        rafId = requestAnimationFrame(animate);

        const p       = prog.value;
        const hlAlpha = Math.max(0, 1 - p);

        for (const s of sprites) {
          const tx = s.homeX + (s.scatterX - s.homeX) * p;
          const ty = s.homeY + (s.scatterY - s.homeY) * p;
          const tz = s.scatterZ * p;
          const tr = s.rotScatter * p;

          s.vx = s.vx * SPRING_DAMP + (tx - s.mesh.position.x) * SPRING_STIFF;
          s.vy = s.vy * SPRING_DAMP + (ty - s.mesh.position.y) * SPRING_STIFF;
          s.vz = s.vz * SPRING_DAMP + (tz - s.mesh.position.z) * SPRING_STIFF;
          s.vr = s.vr * SPRING_DAMP + (tr - s.mesh.rotation.z) * SPRING_STIFF;

          s.mesh.position.x  += s.vx;
          s.mesh.position.y  += s.vy;
          s.mesh.position.z  += s.vz;
          s.mesh.rotation.z  += s.vr;
          s.mesh.material.opacity = s.fadeOut ? hlAlpha : 1.0;
        }

        renderer!.render(scene, camera);
      }

      animate();
    }

    build();

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      unsubScatter();
      for (const s of sprites) {
        s.mesh.geometry.dispose();
        s.mesh.material.map?.dispose();
        s.mesh.material.dispose();
      }
      renderer?.dispose();
    };
  }, [name, headline, scatterMV]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
