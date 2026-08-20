// components/FogParticles.jsx
"use client";
import { useEffect, useRef } from "react";

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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track cursor and touch points
    const pointer = { x: -1000, y: -1000, radius: 65, active: false };

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

    // Particle class for floating #22D3EE cyan dots
    const NUM_PARTICLES = Math.min(65, Math.floor((width * height) / 18000));
    const particles = [];
    const fogWisps = []; // Dispersed fog sub-particles

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 15;
        this.baseRadius = Math.random() * 1.8 + 1.2; // Small delicate dots (1.2px - 3.0px)
        this.radius = this.baseRadius;
        this.vx = (Math.random() - 0.5) * 0.35; // Gentle horizontal drift
        this.vy = -(Math.random() * 0.45 + 0.2); // Slow upward float
        this.baseAlpha = Math.random() * 0.5 + 0.35; // 0.35 - 0.85 opacity
        this.alpha = initial ? this.baseAlpha : 0;
        this.targetAlpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulse = Math.random() * Math.PI * 2;
        this.vanished = false;
        this.respawnTimer = 0;
      }

      update() {
        if (this.vanished) {
          this.respawnTimer++;
          if (this.respawnTimer > 90) { // Respawn after ~1.5s
            this.reset(false);
          }
          return;
        }

        // Ambient floating motion
        this.pulse += this.pulseSpeed;
        this.x += this.vx + Math.sin(this.pulse) * 0.25;
        this.y += this.vy;

        // Fade in when newly spawned
        if (this.alpha < this.targetAlpha) {
          this.alpha = Math.min(this.targetAlpha, this.alpha + 0.02);
        }

        // Screen boundary wrap
        if (this.y < -20) this.reset(false);
        if (this.x < -20) this.x = width + 10;
        if (this.x > width + 20) this.x = -10;

        // Check interaction with cursor/touch
        if (pointer.active) {
          const dx = this.x - pointer.x;
          const dy = this.y - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < pointer.radius) {
            // Touch trigger: Vanish and burst into fog wisps!
            this.vanished = true;
            this.respawnTimer = 0;

            // Spawn 6-9 subtle micro fog mist particles
            const wispCount = Math.floor(Math.random() * 4) + 6;
            for (let i = 0; i < wispCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 1.8 + 0.6;
              fogWisps.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed + (dx / (dist || 1)) * 0.8,
                vy: Math.sin(angle) * speed + (dy / (dist || 1)) * 0.8,
                radius: Math.random() * 3 + 2,
                maxRadius: Math.random() * 14 + 10,
                alpha: this.alpha * 0.8,
                decay: Math.random() * 0.025 + 0.018,
              });
            }
          }
        }
      }

      draw(context) {
        if (this.vanished || this.alpha <= 0) return;

        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Glowing #22D3EE cyan dot with soft halo
        context.shadowColor = "#22D3EE";
        context.shadowBlur = 8;
        context.fillStyle = `rgba(34, 211, 238, ${this.alpha})`;
        context.fill();

        // Inner bright white-cyan core for jewel-like quality
        context.beginPath();
        context.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
        context.fillStyle = `rgba(240, 254, 255, ${this.alpha * 0.9})`;
        context.shadowBlur = 2;
        context.fill();
        context.restore();
      }
    }

    // Populate particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle());
    }

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw floating cyan dots
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      // 2. Update and draw dispersing fog wisps
      for (let i = fogWisps.length - 1; i >= 0; i--) {
        const wisp = fogWisps[i];
        wisp.x += wisp.vx;
        wisp.y += wisp.vy;
        wisp.vx *= 0.94; // Air resistance deceleration
        wisp.vy *= 0.94;
        wisp.radius += (wisp.maxRadius - wisp.radius) * 0.08; // Expand like dissipating smoke/fog
        wisp.alpha -= wisp.decay;

        if (wisp.alpha <= 0) {
          fogWisps.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);

        // Soft radial fog gradient
        const grad = ctx.createRadialGradient(
          wisp.x,
          wisp.y,
          0,
          wisp.x,
          wisp.y,
          wisp.radius
        );
        grad.addColorStop(0, `rgba(34, 211, 238, ${wisp.alpha * 0.6})`);
        grad.addColorStop(0.5, `rgba(34, 211, 238, ${wisp.alpha * 0.25})`);
        grad.addColorStop(1, "rgba(34, 211, 238, 0)");

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
