// components/FogParticles.jsx
"use client";
import { useEffect, useRef } from "react";

// Parse a CSS color (hex or rgb) into { r, g, b } [0–255]
function parseColor(cssColor) {
  if (!cssColor) return { r: 34, g: 211, b: 238 }; // fallback cyan
  const el = document.createElement("div");
  el.style.color = cssColor;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);

  const match = computed.match(/\d+/g);
  if (match && match.length >= 3) {
    return { r: +match[0], g: +match[1], b: +match[2] };
  }
  return { r: 34, g: 211, b: 238 };
}

function getThemeParticleColor() {
  const style = getComputedStyle(document.documentElement);
  const wireColor = style.getPropertyValue("--color-wire").trim();
  return parseColor(wireColor);
}

export default function FogParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Active particle color (updated on theme change)
    let pColor = getThemeParticleColor();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Listen for theme changes
    const themeObserver = new MutationObserver(() => {
      pColor = getThemeParticleColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Subtle pointer tracking for touch/hover dissolve
    const pointer = { x: -1000, y: -1000, touchVanishRadius: 38, active: false };

    const handlePointerMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    // Highly limited, subtle ambient particles
    const isMobile = width < 768;
    const NUM_PARTICLES = isMobile ? 6 : 14;
    const MAX_LINE_DIST = 85;
    const MAX_LINE_DIST_SQ = MAX_LINE_DIST * MAX_LINE_DIST;

    const particles = [];
    const fogWisps = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 15;
        this.baseRadius = Math.random() * 0.8 + 1.0;
        this.radius = this.baseRadius;
        this.vx = (Math.random() - 0.5) * 0.18;
        this.vy = -(Math.random() * 0.25 + 0.12);
        this.baseAlpha = Math.random() * 0.25 + 0.3;
        this.alpha = initial ? this.baseAlpha : 0;
        this.targetAlpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.015 + 0.008;
        this.pulse = Math.random() * Math.PI * 2;
        this.vanished = false;
        this.respawnTimer = 0;
      }

      update() {
        if (this.vanished) {
          this.respawnTimer++;
          if (this.respawnTimer > 100) {
            this.reset(false);
          }
          return;
        }

        this.pulse += this.pulseSpeed;
        this.x += this.vx + Math.sin(this.pulse) * 0.12;
        this.y += this.vy;

        if (this.alpha < this.targetAlpha) {
          this.alpha = Math.min(this.targetAlpha, this.alpha + 0.015);
        }

        if (this.y < -20) this.reset(false);
        if (this.x < -20) this.x = width + 10;
        if (this.x > width + 20) this.x = -10;

        // Touch vanish
        if (pointer.active) {
          const dx = this.x - pointer.x;
          const dy = this.y - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < pointer.touchVanishRadius * pointer.touchVanishRadius) {
            const dist = Math.sqrt(distSq);
            this.vanished = true;
            this.respawnTimer = 0;

            const wispCount = 4;
            for (let i = 0; i < wispCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 1.2 + 0.4;
              fogWisps.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed + (dx / (dist || 1)) * 0.5,
                vy: Math.sin(angle) * speed + (dy / (dist || 1)) * 0.5,
                radius: Math.random() * 2 + 1.5,
                maxRadius: Math.random() * 10 + 8,
                alpha: this.alpha * 0.6,
                decay: 0.02,
              });
            }
          }
        }
      }

      draw(context) {
        if (this.vanished || this.alpha <= 0) return;
        const { r, g, b } = pColor;

        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        context.shadowColor = `rgb(${r}, ${g}, ${b})`;
        context.shadowBlur = 4;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
        context.fill();

        // Bright core
        context.beginPath();
        context.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 20)}, ${this.alpha * 0.9})`;
        context.shadowBlur = 1;
        context.fill();
        context.restore();
      }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle());
    }

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const { r, g, b } = pColor;

      // 1. Subtle, Rare Connecting Lines
      const linked = new Uint8Array(particles.length);
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.vanished || p1.alpha <= 0.1 || linked[i]) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.vanished || p2.alpha <= 0.1 || linked[j]) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_LINE_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineOpacity = (1 - dist / MAX_LINE_DIST) * Math.min(p1.alpha, p2.alpha) * 0.25;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            ctx.restore();

            linked[i] = 1;
            linked[j] = 1;
            break;
          }
        }
      }

      // 2. Draw Floating Dots
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      // 3. Draw Dispersing Fog
      for (let i = fogWisps.length - 1; i >= 0; i--) {
        const wisp = fogWisps[i];
        wisp.x += wisp.vx;
        wisp.y += wisp.vy;
        wisp.vx *= 0.94;
        wisp.vy *= 0.94;
        wisp.radius += (wisp.maxRadius - wisp.radius) * 0.08;
        wisp.alpha -= wisp.decay;

        if (wisp.alpha <= 0) {
          fogWisps.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          wisp.x, wisp.y, 0,
          wisp.x, wisp.y, wisp.radius
        );
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wisp.alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${wisp.alpha * 0.18})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[15]"
      aria-hidden="true"
    />
  );
}
