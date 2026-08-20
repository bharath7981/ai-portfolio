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

    // Track cursor and touch coordinates
    const pointer = { x: -1000, y: -1000, touchVanishRadius: 42, maxConnectRadius: 130, active: false };

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

    // Responsive minimalist constellation config
    const isMobile = width < 768;
    const NUM_PARTICLES = isMobile
      ? Math.min(22, Math.floor((width * height) / 32000))
      : Math.min(48, Math.max(26, Math.floor((width * height) / 24000)));
    const MAX_LINE_DIST = isMobile ? 80 : 115;
    const MAX_LINE_DIST_SQ = MAX_LINE_DIST * MAX_LINE_DIST;
    const POINTER_LINE_DIST_SQ = pointer.maxConnectRadius * pointer.maxConnectRadius;

    const particles = [];
    const fogWisps = []; // Dispersed fog mist particles

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 15;
        this.baseRadius = Math.random() * 1.5 + 1.2; // Small 1.2px - 2.7px clean dots
        this.radius = this.baseRadius;
        this.vx = (Math.random() - 0.5) * 0.28; // Subtle drift
        this.vy = -(Math.random() * 0.38 + 0.16); // Gentle upward float
        this.baseAlpha = Math.random() * 0.4 + 0.45; // 0.45 - 0.85 opacity
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
          if (this.respawnTimer > 85) { // Respawn after ~1.4s
            this.reset(false);
          }
          return;
        }

        // Ambient floating drift
        this.pulse += this.pulseSpeed;
        this.x += this.vx + Math.sin(this.pulse) * 0.18;
        this.y += this.vy;

        // Fade in when newly spawned
        if (this.alpha < this.targetAlpha) {
          this.alpha = Math.min(this.targetAlpha, this.alpha + 0.02);
        }

        // Boundary wrap
        if (this.y < -20) this.reset(false);
        if (this.x < -20) this.x = width + 10;
        if (this.x > width + 20) this.x = -10;

        // Touch & Cursor interaction
        if (pointer.active) {
          const dx = this.x - pointer.x;
          const dy = this.y - pointer.y;
          const distSq = dx * dx + dy * dy;

          // Direct Touch / Proximity: Vanish into clean expanding fog mist
          if (distSq < pointer.touchVanishRadius * pointer.touchVanishRadius) {
            const dist = Math.sqrt(distSq);
            this.vanished = true;
            this.respawnTimer = 0;

            // 6-8 micro fog wisps
            const wispCount = Math.floor(Math.random() * 3) + 6;
            for (let i = 0; i < wispCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 1.6 + 0.5;
              fogWisps.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed + (dx / (dist || 1)) * 0.7,
                vy: Math.sin(angle) * speed + (dy / (dist || 1)) * 0.7,
                radius: Math.random() * 2.5 + 2,
                maxRadius: Math.random() * 14 + 10,
                alpha: this.alpha * 0.75,
                decay: Math.random() * 0.024 + 0.016,
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

        // Glowing #22D3EE cyan halo
        context.shadowColor = "#22D3EE";
        context.shadowBlur = 6;
        context.fillStyle = `rgba(34, 211, 238, ${this.alpha})`;
        context.fill();

        // Bright white-cyan core
        context.beginPath();
        context.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
        context.fillStyle = `rgba(240, 254, 255, ${this.alpha * 0.95})`;
        context.shadowBlur = 2;
        context.fill();
        context.restore();
      }
    }

    // Populate particle cloud with generous spacing
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle());
    }

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Track connection counts per particle to prevent clumsy spiderweb clusters
      const connectionCounts = new Uint8Array(particles.length);

      // 1. Draw Clean Neural Constellation Lines between nearby dots (Max 2 connections per dot)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.vanished || p1.alpha <= 0.08) continue;
        if (connectionCounts[i] >= 2) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.vanished || p2.alpha <= 0.08) continue;
          if (connectionCounts[j] >= 2) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_LINE_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineOpacity = (1 - dist / MAX_LINE_DIST) * Math.min(p1.alpha, p2.alpha) * 0.45;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${lineOpacity})`;
            ctx.lineWidth = 0.9;
            ctx.shadowColor = "#22D3EE";
            ctx.shadowBlur = 3;
            ctx.stroke();
            ctx.restore();

            connectionCounts[i]++;
            connectionCounts[j]++;
            if (connectionCounts[i] >= 2) break;
          }
        }
      }

      // 2. Draw Interactive Pointer Constellation Lines (Max 2 closest particles)
      if (pointer.active) {
        let pointerLinks = 0;
        for (let i = 0; i < particles.length && pointerLinks < 2; i++) {
          const p = particles[i];
          if (p.vanished || p.alpha <= 0.1) continue;

          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < POINTER_LINE_DIST_SQ && distSq >= pointer.touchVanishRadius * pointer.touchVanishRadius) {
            const dist = Math.sqrt(distSq);
            const pointerOpacity = (1 - dist / pointer.maxConnectRadius) * p.alpha * 0.55;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);

            const grad = ctx.createLinearGradient(pointer.x, pointer.y, p.x, p.y);
            grad.addColorStop(0, `rgba(168, 85, 247, ${pointerOpacity * 1.1})`);
            grad.addColorStop(1, `rgba(34, 211, 238, ${pointerOpacity * 0.85})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.0;
            ctx.shadowColor = "#A855F7";
            ctx.shadowBlur = 4;
            ctx.stroke();
            ctx.restore();

            pointerLinks++;
          }
        }
      }

      // 3. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      // 4. Update & Draw Dispersing Fog Wisps
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
