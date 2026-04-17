import React, { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// Design tokens  (mirrors the HTML source)
// ─────────────────────────────────────────────
export const tokens = {
  colorBg1: "#1a0a2e",
  colorBg2: "#0d0d1a",
  colorAccent: "#ff6b5b",
  colorAccentDim: "rgba(255,100,80,0.3)",
  colorLabel: "rgba(255,200,180,0.7)",
  colorHint: "rgba(255,200,180,0.45)",
  colorGlow: "rgba(255,60,40,0.6)",
  colorCombo: "#ff9f43",
  colorScore: "#ffe066",
  cardBg: "rgba(255,255,255,0.06)",
  fontFamily: "'Segoe UI', sans-serif",
  borderRadius: 12,
  hudGap: 32,
} as const;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface HudCardProps {
  label: string;
  value: number;
}

export interface TomatoSvgProps {
  size?: number;
}

export interface ScorePopupProps {
  points: number;
  x: number;
  y: number;
  onDone: () => void;
}

export interface ComboTagProps {
  combo: number;
  visible: boolean;
}

export interface HintProps {
  text?: string;
}

export interface TomatoExplosionProps {
  /** Initial score (useful in Storybook / Figma plugin preview) */
  initialScore?: number;
  /** Box width in px (default 640) */
  width?: number;
  /** Box height in px (default 480) */
  height?: number;
}

// ─────────────────────────────────────────────
// HudCard — Figma component: "Card / HUD"
// ─────────────────────────────────────────────
export const HudCard: React.FC<HudCardProps> = ({ label, value }) => (
  <div
    style={{
      background: tokens.cardBg,
      border: `1px solid ${tokens.colorAccentDim}`,
      borderRadius: tokens.borderRadius,
      padding: "8px 22px",
      textAlign: "center",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      minWidth: 96,
    }}
  >
    <div
      style={{
        fontSize: 11,
        color: tokens.colorLabel,
        letterSpacing: 2,
        textTransform: "uppercase",
        fontFamily: tokens.fontFamily,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 700,
        color: tokens.colorAccent,
        lineHeight: 1.2,
        fontFamily: tokens.fontFamily,
      }}
    >
      {value}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// HudBar — Figma component: "HUD / Bar"
// ─────────────────────────────────────────────
export const HudBar: React.FC<{
  explosions: number;
  score: number;
  maxCombo: number;
}> = ({ explosions, score, maxCombo }) => (
  <div
    style={{
      display: "flex",
      gap: tokens.hudGap,
      fontFamily: tokens.fontFamily,
    }}
  >
    <HudCard label="爆炸次数" value={explosions} />
    <HudCard label="总分" value={score} />
    <HudCard label="最大连击" value={maxCombo} />
  </div>
);

// ─────────────────────────────────────────────
// TomatoSvg — Figma component: "Tomato / Illustration"
// ─────────────────────────────────────────────
export const TomatoSvg: React.FC<TomatoSvgProps> = ({ size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="番茄"
  >
    <defs>
      <radialGradient id="tg" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#ff8c6a" />
        <stop offset="40%" stopColor="#e8321a" />
        <stop offset="100%" stopColor="#8b1000" />
      </radialGradient>
      <radialGradient id="shine" cx="35%" cy="28%" r="30%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      <filter id="soft">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
    </defs>
    {/* Shadow */}
    <ellipse cx="100" cy="178" rx="52" ry="10" fill="rgba(0,0,0,0.3)" filter="url(#soft)" />
    {/* Body */}
    <circle cx="100" cy="108" r="75" fill="url(#tg)" />
    {/* Highlight */}
    <ellipse cx="78" cy="80" rx="28" ry="20" fill="url(#shine)" />
    <circle cx="68" cy="74" r="7" fill="rgba(255,255,255,0.25)" />
    {/* Bottom indent */}
    <ellipse cx="100" cy="178" rx="18" ry="6" fill="rgba(80,0,0,0.25)" />
    {/* Stem */}
    <path d="M100 36 C98 28 90 18 84 14" stroke="#2d7a1f" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Leaves */}
    <path d="M100 36 C112 22 126 24 128 32 C118 30 108 38 100 36Z" fill="#3dba28" />
    <path d="M100 36 C88 20 72 22 70 32  C80 30 92 38 100 36Z" fill="#4dd634" />
    <path d="M100 36 C105 18 118 12 124 18 C114 20 106 32 100 36Z" fill="#2ea01e" />
    <path d="M100 36 C95 16 82 10 76 16  C86 18 96 32 100 36Z" fill="#57e040" />
    <path d="M100 36 C102 24 112 20 116 24 C110 26 103 33 100 36Z" fill="#5af048" />
    {/* Leaf highlight */}
    <path d="M100 36 C114 23 125 25 126 30" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Surface veins */}
    <path d="M100 108 C100 60 100 60 100 40" stroke="rgba(80,0,0,0.12)" strokeWidth="2" fill="none" />
    <path d="M100 108 C130 75 140 70 140 55" stroke="rgba(80,0,0,0.1)" strokeWidth="1.5" fill="none" />
    <path d="M100 108 C70 75 60 70 60 55"   stroke="rgba(80,0,0,0.1)" strokeWidth="1.5" fill="none" />
  </svg>
);

// ─────────────────────────────────────────────
// ScorePopup — Figma component: "Popup / Score"
// ─────────────────────────────────────────────
export const ScorePopup: React.FC<ScorePopupProps> = ({ points, x, y, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - 20,
        top: y - 30,
        fontSize: 28,
        fontWeight: 900,
        color: tokens.colorScore,
        textShadow: `0 0 12px #ff9900, 0 2px 2px rgba(0,0,0,0.6)`,
        pointerEvents: "none",
        zIndex: 200,
        fontFamily: tokens.fontFamily,
        animation: "popUp 0.9s ease-out forwards",
      }}
    >
      +{points}
    </div>
  );
};

// ─────────────────────────────────────────────
// ComboTag — Figma component: "Tag / Combo"
// ─────────────────────────────────────────────
export const ComboTag: React.FC<ComboTagProps> = ({ combo, visible }) => (
  <div
    style={{
      fontSize: Math.min(40, 22 + combo * 2),
      fontWeight: 800,
      color: tokens.colorCombo,
      textShadow: `0 0 16px #ff6b35`,
      pointerEvents: "none",
      opacity: visible && combo >= 2 ? 1 : 0,
      transition: "opacity 0.3s",
      letterSpacing: 2,
      fontFamily: tokens.fontFamily,
    }}
  >
    {combo}x COMBO 🔥
  </div>
);

// ─────────────────────────────────────────────
// HintBar — Figma component: "Text / Hint"
// ─────────────────────────────────────────────
export const HintBar: React.FC<HintProps> = ({
  text = "点击番茄 · 快速连击可获得连击奖励",
}) => (
  <div
    style={{
      color: tokens.colorHint,
      fontSize: 13,
      letterSpacing: 1,
      pointerEvents: "none",
      fontFamily: tokens.fontFamily,
    }}
  >
    {text}
  </div>
);

// ─────────────────────────────────────────────
// Background — Figma component: "Layout / Background"
// ─────────────────────────────────────────────
export const Background = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ width: number; height: number }>
>(({ children, width, height }, ref) => (
  <div
    ref={ref}
    style={{
      width,
      height,
      overflow: "hidden",
      borderRadius: 20,
      boxShadow: "0 8px 48px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,100,80,0.18)",
      background: `radial-gradient(ellipse at center, ${tokens.colorBg1} 0%, ${tokens.colorBg2} 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: tokens.fontFamily,
      userSelect: "none",
      position: "relative",
    }}
  >
    {children}
  </div>
));

// ─────────────────────────────────────────────
// Particle canvas hook (runtime only — not a Figma visual)
// ─────────────────────────────────────────────
function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const particlesRef = useRef<any[]>([]);
  const shockwavesRef = useRef<any[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    let W = (canvas.width = parent.offsetWidth);
    let H = (canvas.height = parent.offsetHeight);

    const ro = new ResizeObserver(() => {
      W = canvas.width = parent.offsetWidth;
      H = canvas.height = parent.offsetHeight;
    });
    ro.observe(parent);

    class Particle {
      x: number; y: number; type: string;
      vx: number; vy: number; gravity: number;
      life: number; decay: number;
      rotation: number; rotSpeed: number;
      color: string; size: number; trail: { x: number; y: number }[];

      constructor(x: number, y: number, type: string) {
        this.x = x; this.y = y; this.type = type;
        const speed =
          type === "spark" ? 6 + Math.random() * 14 :
          type === "juice" ? 3 + Math.random() * 8 :
          2 + Math.random() * 7;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (type === "spark" ? 4 : 2);
        this.gravity = type === "spark" ? 0.25 : 0.35;
        this.life = 1;
        const decayMap: Record<string, number> = { chunk: 0.018, juice: 0.025, seed: 0.022, spark: 0.03 };
        this.decay = decayMap[type] + Math.random() * 0.012;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
        this.trail = [];

        if (type === "chunk") {
          const r = ["#e8321a","#c42010","#ff5533","#ff8060","#d62815","#a01008","#ff4422"];
          this.color = r[Math.floor(Math.random() * r.length)];
          this.size = 8 + Math.random() * 14;
        } else if (type === "juice") {
          this.color = `hsla(${4 + Math.random() * 16}, 90%, ${45 + Math.random() * 25}%, `;
          this.size = 3 + Math.random() * 6;
        } else if (type === "seed") {
          this.color = "#f0d070";
          this.size = 4 + Math.random() * 4;
        } else {
          const hue = Math.random() < 0.5 ? 30 + Math.random() * 30 : Math.random() * 20;
          this.color = `hsl(${hue}, 100%, 75%)`;
          this.size = 2 + Math.random() * 4;
        }
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 6) this.trail.shift();
        this.vx *= 0.97;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        this.life -= this.decay;
        if (this.y > H - 20 && this.vy > 0) {
          this.vy *= -0.35; this.vx *= 0.7;
          this.y = H - 20; this.decay += 0.04;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = Math.max(0, this.life);
        if (this.type === "spark") {
          if (this.trail.length > 1) {
            c.beginPath();
            c.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) c.lineTo(this.trail[i].x, this.trail[i].y);
            c.lineTo(this.x, this.y);
            c.strokeStyle = this.color;
            c.lineWidth = this.size * 0.6 * this.life;
            c.lineCap = "round";
            c.stroke();
          }
          c.beginPath();
          c.arc(this.x, this.y, Math.max(0, this.size * 0.5 * this.life), 0, Math.PI * 2);
          c.fillStyle = "#fff";
          c.fill();
        } else if (this.type === "juice") {
          c.translate(this.x, this.y);
          c.rotate(Math.atan2(this.vy, this.vx));
          c.beginPath();
          c.ellipse(0, 0, this.size * 0.55, this.size * 1.1, 0, 0, Math.PI * 2);
          c.fillStyle = this.color + (this.life * 0.85) + ")";
          c.fill();
        } else if (this.type === "seed") {
          c.translate(this.x, this.y);
          c.rotate(this.rotation);
          c.beginPath();
          c.ellipse(0, 0, this.size * 0.4, this.size * 0.9, 0, 0, Math.PI * 2);
          c.fillStyle = this.color;
          c.fill();
        } else {
          c.translate(this.x, this.y);
          c.rotate(this.rotation);
          c.beginPath();
          const sides = 5 + Math.floor(Math.random() * 3);
          const jitter = this.size * 0.35;
          for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2;
            const r = this.size * (0.7 + Math.random() * 0.3);
            const px = Math.cos(a) * r + (Math.random() - 0.5) * jitter;
            const py = Math.sin(a) * r + (Math.random() - 0.5) * jitter;
            i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
          }
          c.closePath();
          c.fillStyle = this.color;
          c.fill();
          c.beginPath();
          c.arc(-this.size * 0.2, -this.size * 0.2, this.size * 0.3, 0, Math.PI * 2);
          c.fillStyle = "rgba(255,255,255,0.18)";
          c.fill();
        }
        c.restore();
      }
    }

    class ShockWave {
      x: number; y: number; r: number; life: number;
      constructor(x: number, y: number) { this.x = x; this.y = y; this.r = 10; this.life = 1; }
      update() { this.r += 18; this.life -= 0.055; }
      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = Math.max(0, this.life * 0.7);
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.strokeStyle = `hsl(15, 100%, 70%)`;
        c.lineWidth = 4 * this.life;
        c.stroke();
        if (this.r > 50) {
          c.globalAlpha = Math.max(0, (this.life - 0.3) * 0.4);
          c.beginPath();
          c.arc(this.x, this.y, this.r * 0.6, 0, Math.PI * 2);
          c.strokeStyle = "#ff9966";
          c.lineWidth = 2 * this.life;
          c.stroke();
        }
        c.restore();
      }
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particlesRef.current = particlesRef.current.filter((p: any) => {
        p.update(); p.draw(ctx); return p.life > 0;
      });
      shockwavesRef.current = shockwavesRef.current.filter((s: any) => {
        s.update(); s.draw(ctx); return s.life > 0;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    // Expose factories for the explode function
    (canvas as any).__Particle = Particle;
    (canvas as any).__ShockWave = ShockWave;

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [canvasRef]);

  const explode = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current as any;
    if (!canvas) return;
    const P = canvas.__Particle;
    const SW = canvas.__ShockWave;
    for (let i = 0; i < 28; i++) particlesRef.current.push(new P(cx, cy, "chunk"));
    for (let i = 0; i < 40; i++) particlesRef.current.push(new P(cx, cy, "juice"));
    for (let i = 0; i < 14; i++) particlesRef.current.push(new P(cx, cy, "seed"));
    for (let i = 0; i < 50; i++) particlesRef.current.push(new P(cx, cy, "spark"));
    shockwavesRef.current.push(new SW(cx, cy));
  }, [canvasRef]);

  const splatter = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current as any;
    if (!canvas) return;
    const P = canvas.__Particle;
    for (let i = 0; i < 12; i++) particlesRef.current.push(new P(cx, cy, "spark"));
    for (let i = 0; i < 6; i++) particlesRef.current.push(new P(cx, cy, "juice"));
  }, [canvasRef]);

  return { explode, splatter };
}

// ─────────────────────────────────────────────
// TomatoExplosion — root page component
// ─────────────────────────────────────────────
export const TomatoExplosion: React.FC<TomatoExplosionProps> = ({
  initialScore = 0,
  width = 640,
  height = 480,
}) => {
  const [explosions, setExplosions] = useState(0);
  const [score, setScore] = useState(initialScore);
  const [maxCombo, setMaxCombo] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboVisible, setComboVisible] = useState(false);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; pts: number }[]>([]);
  const [shaking, setShaking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const comboRef = useRef(0);
  const popupId = useRef(0);

  const { explode, splatter } = useParticleCanvas(canvasRef);

  const handleCombo = useCallback(() => {
    comboRef.current += 1;
    const next = comboRef.current;
    setCombo(next);
    setComboVisible(true);
    setMaxCombo((m) => Math.max(m, next));
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => {
      comboRef.current = 0;
      setCombo(0);
      setComboVisible(false);
    }, 1500);
    return next;
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  // Convert client coords to container-relative coords
  const toLocal = (clientX: number, clientY: number) => {
    const r = containerRef.current?.getBoundingClientRect();
    return r ? { x: clientX - r.left, y: clientY - r.top } : { x: clientX, y: clientY };
  };

  const handleTomatoClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const local = toLocal(cx, cy);

      explode(local.x, local.y);
      const currentCombo = handleCombo();
      const pts = 10 * currentCombo;

      setExplosions((n) => n + 1);
      setScore((s) => s + pts);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);

      const id = ++popupId.current;
      const clickLocal = toLocal(e.clientX, e.clientY);
      setPopups((p) => [...p, { id, x: clickLocal.x, y: clickLocal.y, pts }]);
    },
    [explode, handleCombo]
  );

  const handleBgClick = useCallback(
    (e: React.MouseEvent) => {
      const local = toLocal(e.clientX, e.clientY);
      splatter(local.x, local.y);
    },
    [splatter]
  );

  const removePopup = useCallback((id: number) => {
    setPopups((p) => p.filter((x) => x.id !== id));
  }, []);

  return (
    <>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes popUp {
          0%   { opacity:1; transform:translateY(0) scale(1); }
          70%  { opacity:1; transform:translateY(-60px) scale(1.2); }
          100% { opacity:0; transform:translateY(-90px) scale(0.8); }
        }
        @keyframes screenShake {
          0%,100% { transform:translate(0,0); }
          15% { transform:translate(-8px,-5px); }
          30% { transform:translate(8px,5px); }
          45% { transform:translate(-6px,4px); }
          60% { transform:translate(6px,-4px); }
          75% { transform:translate(-4px,3px); }
        }
      `}</style>

      <Background width={width} height={height} ref={containerRef}>
        {/* Screen shake wrapper */}
        <div
          onClick={handleBgClick}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: shaking ? "screenShake 0.4s ease" : "none",
          }}
        >
          {/* HUD */}
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
            <HudBar explosions={explosions} score={score} maxCombo={maxCombo} />
          </div>

          {/* Combo tag */}
          <div style={{ position: "absolute", top: 100, left: "50%", transform: "translateX(-50%)" }}>
            <ComboTag combo={combo} visible={comboVisible} />
          </div>

          {/* Tomato */}
          <div
            onClick={handleTomatoClick}
            style={{
              cursor: "pointer",
              filter: `drop-shadow(0 0 30px ${tokens.colorGlow})`,
              animation: "float 3s ease-in-out infinite",
              transition: "filter 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter =
                "drop-shadow(0 0 50px rgba(255,80,50,0.95))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter =
                `drop-shadow(0 0 30px ${tokens.colorGlow})`;
            }}
          >
            <TomatoSvg size={160} />
          </div>

          {/* Hint */}
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}>
            <HintBar />
          </div>
        </div>

        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}
        />

        {/* Score popups */}
        {popups.map((p) => (
          <ScorePopup
            key={p.id}
            points={p.pts}
            x={p.x}
            y={p.y}
            onDone={() => removePopup(p.id)}
          />
        ))}
      </Background>
    </>
  );
};

export default TomatoExplosion;
