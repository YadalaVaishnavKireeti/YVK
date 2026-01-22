import { useEffect, useRef, useCallback } from 'react';

const COLORS = ["#ff595e", "#1982c4", "#6a4c93", "#8ac926", "#ffca3a"];
const TOTAL = 12;

interface Particle {
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  c: string;
  eaten: boolean;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vy: number;
  c: string;
}

interface Gear {
  x: number;
  y: number;
  a: number;
  d: number;
}

interface GameCanvasProps {
  gameStarted: boolean;
  onCollect: () => void;
  onHalfway: () => void;
  onComplete: () => void;
  eatenCount: number;
  halfShown: boolean;
  finished: boolean;
}

const GameCanvas = ({
  gameStarted,
  onCollect,
  onHalfway,
  onComplete,
  eatenCount,
  halfShown,
  finished,
}: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const gearsRef = useRef<Gear[]>([]);
  const areaRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const animationRef = useRef<number>();
  const eatenCountRef = useRef(0);
  const halfShownRef = useRef(false);
  const finishedRef = useRef(false);

  // Sync refs with props
  useEffect(() => {
    eatenCountRef.current = eatenCount;
  }, [eatenCount]);

  useEffect(() => {
    halfShownRef.current = halfShown;
  }, [halfShown]);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  const initParticles = useCallback(() => {
    const area = areaRef.current;
    particlesRef.current = Array.from({ length: TOTAL }, () => ({
      r: 6,
      x: area.x + Math.random() * area.w,
      y: area.y + Math.random() * area.h,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      eaten: false,
    }));
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const BORDER = Math.max(30, Math.min(60, W * 0.06));
    areaRef.current = { x: BORDER, y: BORDER, w: W - BORDER * 2, h: H - BORDER * 2 };

    mouseRef.current = { x: W / 2, y: H / 2 };

    if (particlesRef.current.length === 0) {
      initParticles();
    }
  }, [initParticles]);

  const spawnConfetti = useCallback(() => {
    const W = canvasRef.current?.width || window.innerWidth;
    confettiRef.current = [];
    for (let i = 0; i < 90; i++) {
      confettiRef.current.push({
        x: Math.random() * W,
        y: -20,
        vy: 2 + Math.random() * 3,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }, []);

  const initGears = useCallback(() => {
    const W = canvasRef.current?.width || window.innerWidth;
    const H = canvasRef.current?.height || window.innerHeight;
    gearsRef.current = [
      { x: W / 2 - 120, y: H / 2 - 90, a: 0, d: 0.03 },
      { x: W / 2 - 40, y: H / 2 - 90, a: 0, d: -0.03 },
      { x: W / 2 + 40, y: H / 2 - 90, a: 0, d: 0.03 },
      { x: W / 2 + 120, y: H / 2 - 90, a: 0, d: -0.03 },
    ];
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Game animation loop
  useEffect(() => {
    if (!gameStarted || finishedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawBorder = () => {
      const area = areaRef.current;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.strokeRect(area.x, area.y, area.w, area.h);
    };

    const drawPointer = () => {
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
    };

    const animate = () => {
      if (finishedRef.current) return;

      ctx.fillStyle = "rgba(255,255,255,.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBorder();

      const area = areaRef.current;
      particlesRef.current.forEach((p) => {
        if (p.eaten) return;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x - p.r < area.x || p.x + p.r > area.x + area.w) p.vx *= -1;
        if (p.y - p.r < area.y || p.y + p.r > area.y + area.h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      });

      drawPointer();

      particlesRef.current.forEach((p) => {
        if (!p.eaten && Math.hypot(mouseRef.current.x - p.x, mouseRef.current.y - p.y) < 14) {
          p.eaten = true;
          onCollect();
        }
      });

      if (!halfShownRef.current && eatenCountRef.current >= TOTAL / 2) {
        onHalfway();
      }

      if (eatenCountRef.current === TOTAL && !finishedRef.current) {
        onComplete();
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, onCollect, onHalfway, onComplete]);

  // Final screen animation
  useEffect(() => {
    if (!finished) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    spawnConfetti();
    initGears();

    const W = canvas.width;
    const H = canvas.height;
    const titleFont = Math.min(56, W * 0.08);
    const baseFont = Math.min(18, W * 0.035);

    const drawGear = (g: Gear) => {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.a);
      ctx.strokeStyle = "#000";
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 22);
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
      }
      ctx.restore();
      g.a += g.d;
    };

    const finalLoop = () => {
      ctx.clearRect(0, 0, W, H);

      confettiRef.current.forEach((c) => {
        ctx.fillStyle = c.c;
        ctx.fillRect(c.x, c.y, 6, 12);
        c.y += c.vy;
      });

      gearsRef.current.forEach(drawGear);

      ctx.textAlign = "center";
      ctx.fillStyle = "#000";
      ctx.font = `700 ${titleFont}px Poppins, sans-serif`;
      ctx.fillText("Y V K", W / 2, H / 2);

      ctx.font = `${baseFont}px Poppins, sans-serif`;
      ctx.fillText("Getting DIGITAL Soon!", W / 2, H / 2 + titleFont * 0.9);

      animationRef.current = requestAnimationFrame(finalLoop);
    };

    finalLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finished, spawnConfetti, initGears]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
    />
  );
};

export default GameCanvas;
