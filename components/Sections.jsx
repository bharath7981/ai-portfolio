// components/Sections.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CornerFrame from "./CornerFrame";
import JellyCard from "./JellyCard";
import {
  ExternalLink,
  Github,
  ArrowRight,
  Sparkles,
  Mail,
  Linkedin,
  Code,
  Cpu,
  Database,
  Terminal,
  Check,
  Copy,
  Zap,
  Activity,
  Layers,
  GitBranch,
  ShieldCheck,
  Upload,
  Plus,
  Trash2,
  ZoomIn,
  X,
} from "lucide-react";

// Framer Motion entrance variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const dropFromTop = {
  hidden: { opacity: 0, y: -70, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -350, y: -20, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 350, y: 20, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Text Scramble Hook ───────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function useScramble(text, trigger, duration = 900) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i / text.length < progress) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [trigger, text, duration]);
  return display;
}

// ── Scroll-Triggered CountUp Hook ────────────────────────────────────────────
function useCountUp(target, inView, duration = 1200) {
  const [count, setCount] = useState(0);
  const triggered = useRef(false);
  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) return;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numeric));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(numeric);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  const prefix = target.startsWith("<") ? "<" : "";
  const suffix = target.replace(/[^a-zA-Z+%]/g, "");
  return `${prefix}${count}${suffix}`;
}


// Shared Section Header Label
function SectionHeader({ index, label, subtitle }) {
  return (
    <motion.div variants={fadeInUp} className="mb-8">
      <div className="flex items-center gap-3 text-fog/80 mb-2">
        <span className="shimmer-text font-mono text-xs uppercase tracking-[0.25em] font-semibold">
          {label}
        </span>
        <span className="h-px flex-1 bg-line/40 hidden sm:block" />
      </div>
      {subtitle && (
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-paper mt-3">
          {subtitle}
        </h2>
      )}
    </motion.div>
  );
}

// ── ScrambleWord Component ───────────────────────────────────────────────────
function ScrambleWord({ word, delay = 0, className = "" }) {
  const [triggered, setTriggered] = useState(false);
  const display = useScramble(word, triggered, 900);
  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return <span className={className}>{display}</span>;
}

// ── CountUpCard Component ────────────────────────────────────────────────────
function CountUpCard({ metric }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const Icon = metric.icon;
  const displayValue = useCountUp(metric.value, inView);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <JellyCard className="p-5 bg-ink-deep/70 border border-line/50 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <Icon className={`w-5 h-5 ${metric.color}`} />
          <span className="font-mono text-[10px] text-fog/60 uppercase">METRIC</span>
        </div>
        <div className={`font-display text-3xl font-bold tabular-nums ${metric.color}`}>
          {displayValue}
        </div>
        <div className="font-display text-sm font-semibold text-paper">{metric.label}</div>
        <div className="font-mono text-[11px] text-fog/70">{metric.sub}</div>
      </JellyCard>
    </div>
  );
}

// 1. HERO SECTION
export function HeroSection({ data = {} }) {
  const name = data.name || "BHARATH RASALAPU";
  const title = data.title || "FREELANCE AI ENGINEER & FULL STACK ARCHITECT";
  const location = data.location || "INDIA • AVAILABLE WORLDWIDE";
  const tagline = data.tagline || "Freelance AI Solutions • Agentic Workflows • Open to Work";
  const subtagline = data.subtagline || "Freelance AI Engineer & Architect open for freelance contracts, custom LLM systems, autonomous agent workflows, production backends, and full-stack applications.";
  const role = data.specRole || "Freelance AI Engineer";
  const focus = data.specFocus || "Open to Work & Freelance Contracts";
  const frontend = data.specFrontend || "Next.js / React / Three.js";
  const backend = data.specBackend || "Python / FastAPI / LangGraph";

  const firstName = name.split(" ")[0] || "BHARATH";
  const lastName = name.split(" ").slice(1).join(" ") || "RASALAPU";

  return (
    <section
      id="hero"
      className="portfolio-section min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-20 flex flex-col justify-between px-4 sm:px-8 md:px-12 max-w-7xl mx-auto relative z-10 scroll-mt-24 overflow-hidden"
    >
      {/* Top Metadata Bar */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
        className="w-full flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.25em] text-fog/80 border-b border-line/40 pb-3 sm:pb-4"
      >
        <motion.span variants={dropFromTop} className="flex items-center gap-1.5 sm:gap-2">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-signal animate-ping" />
          INTRO
        </motion.span>
        <motion.span variants={dropFromTop} className="hidden md:inline text-wire font-medium">
          {title}
        </motion.span>
        <motion.span variants={dropFromTop} className="text-fog/60 text-[9px] sm:text-xs">
          {location}
        </motion.span>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
        className="my-auto py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
      >
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <motion.div variants={slideFromLeft} className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-wire border border-wire/30 bg-wire/5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-wire shrink-0" />
            <span className="truncate">{tagline}</span>
          </motion.div>

          {/* Animated Headline Words with Text Scramble Effect */}
          <div className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight uppercase leading-[1.05] sm:leading-[0.95] overflow-hidden space-y-1 py-1">
            <div className="overflow-hidden">
              <ScrambleWord word={firstName} delay={800} className="text-paper block drop-shadow-md" />
            </div>
            <div className="overflow-hidden">
              <ScrambleWord word={lastName} delay={1100} className="bg-gradient-to-r from-paper via-fog to-signal bg-clip-text text-transparent block drop-shadow-md" />
            </div>
          </div>

          <motion.p
            variants={slideFromLeft}
            className="text-sm sm:text-lg md:text-xl text-fog font-light max-w-2xl leading-relaxed"
          >
            {subtagline}
          </motion.p>

          {/* Jelly Live Terminal Status Widget (Slide from Right) */}
          <motion.div variants={slideFromRight}>
            <JellyCard className="p-3.5 sm:p-4 bg-ink-deep/90 border border-line/60 font-mono text-xs text-fog max-w-2xl space-y-1.5 rounded-xl shadow-lg shadow-black/30 overflow-hidden">
              <div className="flex items-center justify-between border-b border-line/40 pb-2 text-[10px] text-fog/60">
                <span className="flex items-center gap-1.5 text-wire">
                  <Terminal className="w-3 h-3 shrink-0" /> SYS.STATUS // ACTIVE
                </span>
                <span className="text-signal font-medium">● 200 OK</span>
              </div>
              <div className="pt-1 space-y-1 text-[11px] sm:text-xs">
                <p className="text-paper flex items-start gap-1.5">
                  <span className="text-signal">&gt;</span> <span><span className="text-wire font-semibold">LANGGRAPH:</span> Multi-agent DAG execution pipeline initialized.</span>
                </p>
                <p className="text-paper flex items-start gap-1.5">
                  <span className="text-signal">&gt;</span> <span><span className="text-wire font-semibold font-mono">RETRIEVAL:</span> RAG vector index ready (ChromaDB + all-mpnet).</span>
                </p>
              </div>
            </JellyCard>
          </motion.div>

          {/* Hero Action CTAs (Alternating Left / Right) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 overflow-hidden">
            <motion.a
              variants={slideFromLeft}
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("projects");
                if (el) {
                  if (window.lenis) window.lenis.scrollTo(el, { offset: -60 });
                  else el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 bg-signal text-ink font-mono text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-wire transition-colors duration-300 shadow-lg shadow-signal/20 text-center"
            >
              <span>VIEW PROJECTS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              variants={slideFromRight}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("contact");
                if (el) {
                  if (window.lenis) window.lenis.scrollTo(el, { offset: -60 });
                  else el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 border border-line hover:border-paper text-paper font-mono text-xs uppercase tracking-widest rounded-xl transition-colors duration-300 bg-ink-deep/50 backdrop-blur-sm text-center"
            >
              <span>GET IN TOUCH</span>
              <span className="text-signal">↗</span>
            </motion.a>
          </div>
        </div>

        {/* Jelly Blueprint Spec Panel (Slide from Right) */}
        <motion.div variants={slideFromRight} className="lg:col-span-4 hidden lg:block">
          <JellyCard>
            <CornerFrame className="p-6 bg-ink-deep/80 backdrop-blur-md border border-line/60 space-y-4 rounded-2xl">
              <div className="flex items-center justify-between border-b border-line/40 pb-3 font-mono text-[11px] text-fog">
                <span className="text-signal">SYS.SPEC // 01</span>
                <span className="text-wire font-semibold">ACTIVE</span>
              </div>
              <div className="space-y-2.5 font-mono text-xs text-fog">
                <div className="flex justify-between">
                  <span className="text-fog/60">PRIMARY ROLE:</span>
                  <span className="text-paper">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog/60">CORE FOCUS:</span>
                  <span className="text-wire">{focus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog/60">FRONTEND:</span>
                  <span className="text-paper">{frontend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog/60">BACKEND:</span>
                  <span className="text-paper">{backend}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-line/40 font-mono text-[10px] text-fog/60 flex items-center justify-between">
                <span>SYSTEM READY</span>
                <span className="text-signal font-medium">● STATUS: ONLINE</span>
              </div>
            </CornerFrame>
          </JellyCard>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        variants={dropFromTop}
        className="w-full flex justify-between items-end pt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-fog/70 border-t border-line/30"
      >
        <span>SCROLL DOWN</span>
        <span className="text-signal animate-bounce">↓</span>
      </motion.div>
    </section>
  );
}

// 2. EDITORIAL ABOUT SECTION
export function AboutSection({ data = {} }) {
  const bioHeader = data.bioHeader || "WHO I AM //";
  const bioLead = data.bioLead || "I am an AI Engineer and Full Stack Developer focused on building autonomous LLM agents, high-throughput vector retrieval pipelines, and responsive web applications.";
  const bioPara1 = data.bioPara1 || "My work bridges theoretical machine learning with practical software engineering. From architecting multi-agent decision graphs using LangGraph to engineering high-frequency REST APIs with FastAPI and crafting interactive UI interfaces in Next.js.";
  const bioPara2 = data.bioPara2 || "I believe modern software should be intelligent by design — enabling applications to reason, retrieve context, execute complex actions, and communicate seamlessly with users.";

  const metrics = [
    { label: "PR Triage Automation", value: "100%", sub: "Autonomous Execution", icon: GitBranch, color: "text-signal" },
    { label: "Vector Search Embeddings", value: "50k+", sub: "Indexed & Searched", icon: Layers, color: "text-wire" },
    { label: "API Query Latency", value: "<120ms", sub: "FastAPI Benchmarks", icon: Zap, color: "text-signal" },
    { label: "System Availability", value: "99.9%", sub: "Resilient Microservices", icon: ShieldCheck, color: "text-wire" },
  ];

  return (
    <section
      id="about"
      className="portfolio-section min-h-screen pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-line/30 relative z-10 scroll-mt-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
      >
        <SectionHeader index="02" label="ABOUT" subtitle="Engineering Autonomous Systems & Digital Experiences" />

        {/* Jelly Pipeline Architecture Widget */}
        <motion.div variants={fadeInUp}>
          <JellyCard className="mt-8 p-6 bg-ink-deep/80 border border-line/60 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b border-line/40 pb-3 mb-6 font-mono text-xs text-fog">
              <span className="flex items-center gap-2 text-signal">
                <Activity className="w-4 h-4 text-signal" />
                <span>AGENTIC PIPELINE ARCHITECTURE GRAPH // DAG 01</span>
              </span>
              <span className="text-wire text-[11px]">END-TO-END FLOW</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-ink/70 border border-line/50 rounded-xl relative">
                <div className="font-mono text-[10px] text-wire uppercase mb-1">STEP 01 // INPUT</div>
                <div className="font-display font-semibold text-paper text-sm">User Query / CI Trigger</div>
                <div className="text-fog text-xs mt-1">Intent classification & payload parsing</div>
              </div>

              <div className="p-4 bg-ink/70 border border-line/50 rounded-xl relative">
                <div className="font-mono text-[10px] text-signal uppercase mb-1">STEP 02 // RETRIEVAL</div>
                <div className="font-display font-semibold text-paper text-sm">RAG & Vector Search</div>
                <div className="text-fog text-xs mt-1">Clause-level semantic context lookup</div>
              </div>

              <div className="p-4 bg-ink/70 border border-line/50 rounded-xl relative">
                <div className="font-mono text-[10px] text-wire uppercase mb-1">STEP 03 // REASONING</div>
                <div className="font-display font-semibold text-paper text-sm">LangGraph Decision Graph</div>
                <div className="text-fog text-xs mt-1">Multi-stage planning & tool calling</div>
              </div>

              <div className="p-4 bg-ink/70 border border-line/50 rounded-xl relative">
                <div className="font-mono text-[10px] text-signal uppercase mb-1">STEP 04 // ACTION</div>
                <div className="font-display font-semibold text-paper text-sm">Production Execution</div>
                <div className="text-fog text-xs mt-1">FastAPI REST response & PR dispatch</div>
              </div>
            </div>
          </JellyCard>
        </motion.div>

        {/* 4 Jelly Performance Metric Cards with CountUp */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {metrics.map((m) => (
            <CountUpCard key={m.label} metric={m} />
          ))}
        </motion.div>

        {/* Narrative Cards & Currently Building */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <motion.div variants={slideFromLeft} className="lg:col-span-7 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-semibold mb-2">
              WHO I AM //
            </h3>

            {/* Spec Card 1: Core Specialization */}
            <JellyCard>
              <div className="p-5 bg-ink-deep/80 border border-line/60 rounded-xl space-y-2.5 hover:border-signal/50 transition-colors shadow-lg">
                <div className="flex items-center justify-between font-mono text-xs text-signal font-semibold border-b border-line/40 pb-2">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-signal" />
                    <span>SPECIALIZATION // 01</span>
                  </span>
                  <span className="text-fog/60 text-[10px] uppercase">AUTONOMOUS AI</span>
                </div>
                <p className="text-paper text-sm sm:text-base font-medium leading-relaxed">
                  {bioLead}
                </p>
              </div>
            </JellyCard>

            {/* Spec Card 2: System Architecture */}
            <JellyCard>
              <div className="p-5 bg-ink-deep/80 border border-line/60 rounded-xl space-y-2.5 hover:border-wire/50 transition-colors shadow-lg">
                <div className="flex items-center justify-between font-mono text-xs text-wire font-semibold border-b border-line/40 pb-2">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-wire" />
                    <span>SYSTEM ARCHITECTURE // 02</span>
                  </span>
                  <span className="text-fog/60 text-[10px] uppercase">PRODUCTION PIPELINES</span>
                </div>
                <p className="text-fog text-xs sm:text-sm leading-relaxed">
                  {bioPara1}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="font-mono text-[10px] px-2.5 py-1 bg-ink/70 border border-line/40 text-wire rounded-md font-medium">
                    [LANGGRAPH]
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-1 bg-ink/70 border border-line/40 text-signal rounded-md font-medium">
                    [FASTAPI]
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-1 bg-ink/70 border border-line/40 text-paper rounded-md font-medium">
                    [NEXT.JS]
                  </span>
                </div>
              </div>
            </JellyCard>

            {/* Spec Card 3: Design Philosophy */}
            <JellyCard>
              <div className="p-5 bg-ink-deep/80 border border-line/60 rounded-xl space-y-2.5 hover:border-signal/50 transition-colors shadow-lg">
                <div className="flex items-center justify-between font-mono text-xs text-signal font-semibold border-b border-line/40 pb-2">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-signal" />
                    <span>DESIGN PHILOSOPHY // 03</span>
                  </span>
                  <span className="text-fog/60 text-[10px] uppercase">INTELLIGENT BY DESIGN</span>
                </div>
                <p className="text-fog text-xs sm:text-sm leading-relaxed">
                  {bioPara2}
                </p>
              </div>
            </JellyCard>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-6">
            <JellyCard>
              <CornerFrame className="p-8 bg-ink-deep/80 backdrop-blur-md border border-line/60 space-y-6 rounded-2xl">
                <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-semibold flex items-center justify-between">
                  <span>CURRENTLY BUILDING</span>
                  <span className="text-fog/60">2026</span>
                </h3>

                <ul className="space-y-4 font-mono text-xs text-fog">
                  <li className="flex items-start gap-3 p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <span className="text-signal font-bold">01</span>
                    <div>
                      <span className="text-paper font-semibold block">Autonomous Coding Agents</span>
                      <span className="text-fog/70 text-[11px]">Triaging test suites & PR automation</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <span className="text-wire font-bold">02</span>
                    <div>
                      <span className="text-paper font-semibold block">Enterprise RAG Pipelines</span>
                      <span className="text-fog/70 text-[11px]">Clause-level risk evaluation over contracts</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <span className="text-signal font-bold">03</span>
                    <div>
                      <span className="text-paper font-semibold block">Interactive 3D Data Interfaces</span>
                      <span className="text-fog/70 text-[11px]">Three.js visualization of neural traces</span>
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-line/40 flex flex-wrap gap-2">
                  {["AI ARCHITECTURES", "FULL STACK", "FASTAPI", "LANGGRAPH", "NEXT.JS"].map((badge) => (
                    <span
                      key={badge}
                      className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-line/60 text-paper bg-ink-deep rounded-md"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </CornerFrame>
            </JellyCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Curved 3D Jelly Perspective Tilt Project Card
function ProjectCard3D({ project, onSelect }) {
  const [glowStyle, setGlowStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlowStyle({
      opacity: 1,
      background: `radial-gradient(500px circle at ${x}px ${y}px, rgba(34, 211, 238, 0.15), transparent 75%)`,
    });
  };

  const handleMouseLeave = () => {
    setGlowStyle({ opacity: 0 });
  };

  const CardWrapper = project.useCorner ? CornerFrame : "div";

  return (
    <JellyCard className="group h-full cursor-pointer" onClick={() => onSelect && onSelect(project)}>
      <CardWrapper
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full p-8 bg-ink-deep/90 backdrop-blur-md border border-line/60 hover:border-signal/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden rounded-2xl shadow-xl shadow-black/30"
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0 rounded-2xl"
          style={glowStyle}
        />

        <div className="relative z-10 space-y-4" style={{ transform: "translateZ(24px)" }}>
          <div className="flex items-center justify-between font-mono text-[11px] text-fog/70">
            <span className="text-signal font-medium group-hover:text-wire transition-colors">
              SYS.{project.id} // {project.highlight}
            </span>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-paper transition-colors p-1"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-4 h-4 text-fog group-hover:text-paper" />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  className="hover:text-signal transition-colors p-1"
                  aria-label="Live Demo"
                >
                  <ExternalLink className="w-4 h-4 text-fog group-hover:text-signal" />
                </a>
              )}
            </div>
          </div>

          <h3
            className="font-display text-2xl sm:text-3xl font-semibold text-paper group-hover:text-signal transition-colors duration-300"
            style={{ transform: "translateZ(36px)" }}
          >
            {project.name}
          </h3>

          <p
            className="mt-4 text-fog text-sm sm:text-base leading-relaxed font-light"
            style={{ transform: "translateZ(18px)" }}
          >
            {project.blurb}
          </p>
        </div>

        <div
          className="relative z-10 mt-8 pt-6 border-t border-line/40 flex flex-wrap items-center justify-between gap-4"
          style={{ transform: "translateZ(28px)" }}
        >
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-line/60 text-fog bg-ink/50 rounded-md group-hover:border-signal/40 group-hover:text-paper transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="font-mono text-xs text-signal flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-all group-hover:translate-x-2 font-semibold">
            <span>EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </CardWrapper>
    </JellyCard>
  );
}

// ── Interactive Project Architecture & System Modal ─────────────────────────
function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-ink-deep border border-line/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-paper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-line/50 flex items-center justify-between bg-ink/90">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-signal uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-signal" />
              <span>SYS.{project.id} // {project.highlight}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper mt-1">
              {project.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-line/60 rounded-xl text-fog hover:text-paper hover:border-signal transition-colors bg-ink/60"
            aria-label="Close Project Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm font-light leading-relaxed">
          {/* Executive Blurb & Metrics */}
          <div className="p-4 bg-ink/60 border border-line/50 rounded-xl space-y-3">
            <p className="text-paper sm:text-base font-normal">{project.blurb}</p>
            {project.metric && (
              <div className="flex flex-wrap gap-3 pt-2 border-t border-line/30 font-mono text-xs">
                <span className="px-3 py-1 bg-signal/15 text-signal border border-signal/30 rounded-lg font-semibold">
                  🎯 {project.metric}
                </span>
                {project.accuracy && (
                  <span className="px-3 py-1 bg-wire/15 text-wire border border-wire/30 rounded-lg font-semibold">
                    ⚡ {project.accuracy} Accuracy
                  </span>
                )}
                {project.latency && (
                  <span className="px-3 py-1 bg-ink text-fog border border-line/60 rounded-lg">
                    ⏱️ {project.latency}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Specific Project Walkthrough Section for Autonomous DevOps Agent */}
          {project.id === "01" && (
            <div className="space-y-6">
              {/* Architecture Data Flow */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-wire font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-wire" />
                  <span>LANGGRAPH REFLEXIVE STATEGRAPH ARCHITECTURE</span>
                </h4>
                <div className="p-4 bg-ink border border-line/60 rounded-xl font-mono text-xs text-fog space-y-2.5 overflow-x-auto">
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">1. Observe (Watcher)</span>
                    <span className="text-fog/40">→</span>
                    <span>Docker SDK monitors crashes (Exit 1, 125, 127, 137) & captures last 100 log lines</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">2. Preprocess</span>
                    <span className="text-fog/40">→</span>
                    <span>Regex log classification & error categorization (missing_dependency, OOM, port_conflict)</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">3. Retrieve (RAG)</span>
                    <span className="text-fog/40">→</span>
                    <span>ChromaDB queries top-3 similar past incidents for persistent long-term cross-session memory</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">4. Reason (Analyst CoT)</span>
                    <span className="text-fog/40">→</span>
                    <span>Gemini 1.5 Pro (temp=0.0) Chain-of-Thought diagnosis + anti-loop hypothesis exclusion</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">5. Fix & Apply</span>
                    <span className="text-fog/40">→</span>
                    <span>Structured JSON fix plan & surgical patching of requirements.txt, Dockerfiles, and configs</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">6. Validate & Gate</span>
                    <span className="text-fog/40">→</span>
                    <span>docker-compose build validation (180s timeout) with automatic rollback on test failure</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">7. Submit PR + HITL</span>
                    <span className="text-fog/40">→</span>
                    <span>Execution pauses at interrupt_before=["submit_pr"] until human approval at /api/v1/hitl/approve</span>
                  </div>
                </div>
              </div>

              {/* Core System Components */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-signal font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-signal" />
                  <span>CORE SUBSYSTEMS & CAPABILITIES</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-wire font-semibold">LANGGRAPH STATEGRAPH</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Stateful Directed Graph</div>
                    <div className="text-fog text-[11px] mt-1">Multi-agent orchestrator with conditional retry loops and escalation paths.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-signal font-semibold">GEMINI 1.5 PRO (TEMP=0.0)</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Deterministic LLM Engine</div>
                    <div className="text-fog text-[11px] mt-1">Zero-hallucination Chain-of-Thought root cause reasoning & structured JSON plans.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-wire font-semibold">CHROMADB VECTOR MEMORY</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Persistent Incident RAG</div>
                    <div className="text-fog text-[11px] mt-1">Sentence-transformers embeddings of historical DevOps resolutions.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-signal font-semibold">HUMAN-IN-THE-LOOP (HITL)</div>
                    <div className="text-paper text-xs font-mono mt-0.5">interrupt_before=["submit_pr"]</div>
                    <div className="text-fog text-[11px] mt-1">Frozen graph state awaiting admin review before committing GitHub branches.</div>
                  </div>
                </div>
              </div>

              {/* Memory Model Table */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-wire font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-wire" />
                  <span>DUAL-TIER MEMORY & SRE SAFETY GATES</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-ink/80 border border-signal/60 rounded-xl">
                    <div className="font-mono text-[10px] text-signal font-bold uppercase">SHORT-TERM</div>
                    <div className="font-display text-base font-bold text-paper mt-1">AgentState Memory</div>
                    <div className="text-fog text-xs mt-1">Session-level attempt history preventing cyclic fix loops.</div>
                  </div>
                  <div className="p-4 bg-ink/80 border border-wire/60 rounded-xl">
                    <div className="font-mono text-[10px] text-wire font-bold uppercase">LONG-TERM</div>
                    <div className="font-display text-base font-bold text-paper mt-1">ChromaDB RAG</div>
                    <div className="text-fog text-xs mt-1">Cross-session vector memory learning from past incident solutions.</div>
                  </div>
                  <div className="p-4 bg-ink/80 border border-line/60 rounded-xl">
                    <div className="font-mono text-[10px] text-fog/70 font-bold uppercase">SAFETY GATE</div>
                    <div className="font-display text-base font-bold text-paper mt-1">Auto Rollback</div>
                    <div className="text-fog text-xs mt-1">Reverts modified files immediately if docker-compose build fails.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specific Project Walkthrough Section for AI Legal Due Diligence RAG */}
          {project.id === "02" && (
            <div className="space-y-6">
              {/* Architecture Data Flow */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-wire font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-wire" />
                  <span>TWO-STAGE RAG RETRIEVAL & RE-RANKING PIPELINE</span>
                </h4>
                <div className="p-4 bg-ink border border-line/60 rounded-xl font-mono text-xs text-fog space-y-2.5 overflow-x-auto">
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">1. Document Ingestion</span>
                    <span className="text-fog/40">→</span>
                    <span>PyPDFLoader extracts text + RecursiveCharacterTextSplitter (1000 chars, 200 overlap)</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">2. Embeddings & Storage</span>
                    <span className="text-fog/40">→</span>
                    <span>all-mpnet-base-v2 Sentence Transformers generate vectors stored in ChromaDB</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">3. Stage 1: Vector Search</span>
                    <span className="text-fog/40">→</span>
                    <span>Fast semantic candidate retrieval surfaces Top-10 relevant document chunks</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">4. Stage 2: CrossEncoder</span>
                    <span className="text-fog/40">→</span>
                    <span>ms-marco-MiniLM-L-6-v2 CrossEncoder neural re-ranking filters down to Top-3 chunks</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">5. Relevance Scoring</span>
                    <span className="text-fog/40">→</span>
                    <span>Cosine similarity calculates exact question-to-context relevance score</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">6. Grounded Generation</span>
                    <span className="text-fog/40">→</span>
                    <span>Gemini 2.0 Flash returns structured Risk Level (Low/Med/High/Unknown) + Evidence</span>
                  </div>
                </div>
              </div>

              {/* Core System Capabilities */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-signal font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-signal" />
                  <span>KEY TECHNICAL INNOVATIONS & METRICS</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-wire font-semibold">TWO-STAGE RETRIEVAL</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Bi-Encoder + CrossEncoder</div>
                    <div className="text-fog text-[11px] mt-1">High-speed candidate search + deep neural interaction reranking for top-3 precision.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-signal font-semibold">ZERO-HALLUCINATION GUARDRAILS</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Gemini 2.0 Flash Grounding</div>
                    <div className="text-fog text-[11px] mt-1">Enforces generation strictly from retrieved clauses with mandatory citations.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-wire font-semibold">MULTI-CONTRACT SUPPORT</div>
                    <div className="text-paper text-xs font-mono mt-0.5">NDAs, Leases, Employment</div>
                    <div className="text-fog text-[11px] mt-1">Clause-level segmentation tailored for complex multi-page legal agreements.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-signal font-semibold">STRUCTURED RISK TAXONOMY</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Low • Medium • High • Unknown</div>
                    <div className="text-fog text-[11px] mt-1">Instant risk classification with evidence citations and confidence metrics.</div>
                  </div>
                </div>
              </div>

              {/* Architecture Stack Grid */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-wire font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-wire" />
                  <span>ARCHITECTURE STACK TIERS</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-ink/80 border border-signal/60 rounded-xl">
                    <div className="font-mono text-[10px] text-signal font-bold uppercase">RETRIEVAL</div>
                    <div className="font-display text-base font-bold text-paper mt-1">ChromaDB + all-mpnet</div>
                    <div className="text-fog text-xs mt-1">Dense vector embedding store with rich document metadata index.</div>
                  </div>
                  <div className="p-4 bg-ink/80 border border-wire/60 rounded-xl">
                    <div className="font-mono text-[10px] text-wire font-bold uppercase">RE-RANKING</div>
                    <div className="font-display text-base font-bold text-paper mt-1">ms-marco CrossEncoder</div>
                    <div className="text-fog text-xs mt-1">Full cross-attention scoring between query and top-10 candidates.</div>
                  </div>
                  <div className="p-4 bg-ink/80 border border-line/60 rounded-xl">
                    <div className="font-mono text-[10px] text-fog/70 font-bold uppercase">APPLICATION</div>
                    <div className="font-display text-base font-bold text-paper mt-1">FastAPI + Streamlit</div>
                    <div className="text-fog text-xs mt-1">REST API backend with interactive legal intelligence frontend.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specific Project Walkthrough Section for Crop Stress Detection */}
          {project.id === "03" && (
            <div className="space-y-6">
              {/* Architecture Data Flow */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-wire font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-wire" />
                  <span>END-TO-END PIPELINE ARCHITECTURE</span>
                </h4>
                <div className="p-4 bg-ink border border-line/60 rounded-xl font-mono text-xs text-fog space-y-2.5 overflow-x-auto">
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">1. Data Generator</span>
                    <span className="text-fog/40">→</span>
                    <span>Kaggle Crop Sensor Data + Synthetic Augmentation & Agronomic Rules</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">2. Feature Pipeline</span>
                    <span className="text-fog/40">→</span>
                    <span>5 Domain Indices (Heat Stress, Moisture Deficit, NDVI Trend, Anomalies)</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">3. Preprocessing</span>
                    <span className="text-fog/40">→</span>
                    <span>IQR Outlier Removal, Mean Imputation, LabelEncoder & StandardScaler</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-wire font-bold">4. Model Training</span>
                    <span className="text-fog/40">→</span>
                    <span>XGBoost Classifier (100% Severe Recall, 98.9% Acc)</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper font-semibold">
                    <span className="text-signal font-bold">5. FastAPI REST API</span>
                    <span className="text-fog/40">→</span>
                    <span>Pydantic /predict & /health endpoints with cached pipeline artifacts</span>
                  </div>
                </div>
              </div>

              {/* Engineered Features Table */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-signal font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-signal" />
                  <span>5 DOMAIN-SPECIFIC ENGINEERED FEATURES (+15% BOOST)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-wire font-semibold">HEAT STRESS INDEX</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Temp × Humidity</div>
                    <div className="text-fog text-[11px] mt-1">Measures combined thermal humidity field stress.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-signal font-semibold">SOIL MOISTURE DEFICIT</div>
                    <div className="text-paper text-xs font-mono mt-0.5">90 - Soil_Moisture (min 0)</div>
                    <div className="text-fog text-[11px] mt-1">Calculates gap from optimal field capacity.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-wire font-semibold">TEMPERATURE ANOMALY</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Temp - dataset_mean_temp</div>
                    <div className="text-fog text-[11px] mt-1">Quantifies deviation from baseline crop norms.</div>
                  </div>
                  <div className="p-3 bg-ink/50 border border-line/40 rounded-xl">
                    <div className="font-mono text-[11px] text-signal font-semibold">RAINFALL 7-DAY AVERAGE</div>
                    <div className="text-paper text-xs font-mono mt-0.5">Rainfall / 7</div>
                    <div className="text-fog text-[11px] mt-1">Proxy for weekly cumulative precipitation intensity.</div>
                  </div>
                </div>
              </div>

              {/* Model Comparison Table */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-wire font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-wire" />
                  <span>MODEL BENCHMARKS & SELECTION CRITERION</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-ink/80 border border-signal/60 rounded-xl relative overflow-hidden">
                    <div className="font-mono text-[10px] text-signal font-bold uppercase">WINNER</div>
                    <div className="font-display text-lg font-bold text-paper mt-1">XGBoost</div>
                    <div className="text-signal font-bold text-base mt-1">98.9% Accuracy</div>
                    <div className="text-wire text-xs font-mono mt-0.5">100% Severe Recall</div>
                  </div>
                  <div className="p-4 bg-ink/40 border border-line/40 rounded-xl">
                    <div className="font-mono text-[10px] text-fog/60 uppercase">RUNNER UP</div>
                    <div className="font-display text-lg font-semibold text-paper mt-1">Random Forest</div>
                    <div className="text-paper text-sm mt-1">97.0% Accuracy</div>
                    <div className="text-fog text-xs font-mono mt-0.5">High Severe Recall</div>
                  </div>
                  <div className="p-4 bg-ink/40 border border-line/40 rounded-xl">
                    <div className="font-mono text-[10px] text-fog/60 uppercase">BASELINE</div>
                    <div className="font-display text-lg font-semibold text-paper mt-1">Logistic Regression</div>
                    <div className="text-paper text-sm mt-1">85.0% Accuracy</div>
                    <div className="text-fog text-xs font-mono mt-0.5">Lower Recall</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="pt-2 border-t border-line/30 flex flex-wrap gap-2">
            {project.tags && project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-3 py-1 bg-ink border border-line/60 rounded-lg text-fog"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-line/40 bg-ink/90 flex items-center justify-between font-mono text-xs">
          <span className="text-fog/70">ML PIPELINE // VERIFIED REPRODUCIBLE</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-signal text-ink font-semibold rounded-xl hover:bg-wire transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. PROJECTS SECTION
export function ProjectsSection({ data = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = data.length > 0 ? data : [
    {
      id: "01",
      name: "AutoFix Coding Agent",
      blurb: "An autonomous multi-agent coding system that analyzes failing repository CI test suites, plans fixes, and automatically opens clean pull requests.",
      tags: ["LangGraph", "Python", "FastAPI", "GitHub API"],
      span: "lg:col-span-7",
      highlight: "FEATURED SYSTEM",
      useCorner: true,
      github: "https://github.com",
      demo: "#",
    },
  ];

  return (
    <section
      id="projects"
      className="portfolio-section min-h-screen pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-line/30 relative z-10 scroll-mt-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
      >
        <SectionHeader index="03" label="PROJECTS" subtitle="Featured Intelligent Systems" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {projects.map((project) => (
            <motion.div key={project.id} variants={fadeInUp} className={project.span || "lg:col-span-6"}>
              <ProjectCard3D project={project} onSelect={setSelectedProject} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interactive Project Architecture Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

// 3.5. PROJECT GALLERY SECTION (WITH INTERACTIVE IMAGE UPLOAD)
export function ProjectGallerySection() {
  const defaultItems = [
    {
      id: "g1",
      title: "Autonomous Agent Dashboard UI",
      category: "LLM WORKFLOW",
      description: "Multi-agent execution graph visualization and live token telemetry dashboard.",
      image: null,
    },
    {
      id: "g2",
      title: "Enterprise RAG Contract Analyzer",
      category: "VECTOR SEARCH",
      description: "High-throughput vector search pipeline over complex financial & legal agreements.",
      image: null,
    },
    {
      id: "g3",
      title: "High-Frequency API Microservices",
      category: "FASTAPI BACKEND",
      description: "Asynchronous Python REST services with sub-120ms p99 query latency benchmarks.",
      image: null,
    },
  ];

  const [gallery, setGallery] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_gallery_items");
    if (saved) {
      try {
        setGallery(JSON.parse(saved));
      } catch (e) {
        setGallery(defaultItems);
      }
    } else {
      setGallery(defaultItems);
    }
  }, []);

  // Instant 0ms state update + non-blocking deferred storage save
  const saveGallery = (newGallery) => {
    setGallery(newGallery);
    setTimeout(() => {
      try {
        localStorage.setItem("portfolio_gallery_items", JSON.stringify(newGallery));
      } catch (e) {
        console.error("Storage save warning:", e);
      }
    }, 0);
  };

  // High-performance canvas image compression (reduces 8MB files to ~80KB WebP)
  const handleImageUpload = (id, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/webp", 0.78);
        const updated = gallery.map((item) => (item.id === id ? { ...item, image: compressedDataUrl } : item));
        saveGallery(updated);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (id) => {
    const updated = gallery.map((item) => (item.id === id ? { ...item, image: null } : item));
    saveGallery(updated);
  };

  const handleAddSlot = () => {
    const newId = `g_${Date.now()}`;
    const newSlot = {
      id: newId,
      title: `Project Showcase #${gallery.length + 1}`,
      category: "SYSTEM GRAPHIC",
      description: "Project screenshot, architectural diagram, or UI prototype preview.",
      image: null,
    };
    saveGallery([...gallery, newSlot]);
  };

  const handleDeleteSlot = (id) => {
    const updated = gallery.filter((item) => item.id !== id);
    saveGallery(updated);
  };

  return (
    <section
      id="gallery"
      className="portfolio-section min-h-screen pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-line/30 relative z-10 scroll-mt-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeader label="PROJECT GALLERY" subtitle="Visual System Showcase & Architecture Screenshots" />
          <motion.button
            variants={fadeInUp}
            onClick={handleAddSlot}
            className="mb-8 font-mono text-xs uppercase tracking-widest px-4 py-2.5 bg-signal text-ink hover:bg-wire font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-signal/20"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PROJECT SLOT</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
            >
              <JellyCard className="h-full">
                <CornerFrame className="p-6 bg-ink-deep/90 border border-line/60 rounded-2xl h-full flex flex-col justify-between space-y-4 hover:border-signal/70 transition-all shadow-xl">
                  {/* Card Top Label & Delete Slot Button */}
                  <div className="flex items-center justify-between font-mono text-xs text-fog/70 border-b border-line/40 pb-3">
                    <span className="text-signal font-semibold uppercase">{item.category}</span>
                    <button
                      onClick={() => handleDeleteSlot(item.id)}
                      className="text-fog/50 hover:text-red-400 p-1 transition-colors"
                      title="Delete slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image Display / Upload Box */}
                  <div className="relative aspect-video rounded-xl bg-ink/80 border border-line/50 overflow-hidden flex flex-col items-center justify-center group">
                    {item.image ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-ink-deep/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button
                            onClick={() => setLightboxImage(item.image)}
                            className="p-2 bg-signal text-ink rounded-lg font-mono text-xs flex items-center gap-1 font-semibold hover:bg-wire transition-colors"
                            title="View Lightbox"
                          >
                            <ZoomIn className="w-4 h-4" />
                            <span>VIEW</span>
                          </button>
                          <label className="p-2 bg-ink border border-line text-paper rounded-lg font-mono text-xs flex items-center gap-1 cursor-pointer hover:border-signal transition-colors">
                            <Upload className="w-4 h-4 text-wire" />
                            <span>CHANGE</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(item.id, e)}
                            />
                          </label>
                          <button
                            onClick={() => handleRemoveImage(item.id)}
                            className="p-2 bg-ink border border-line text-red-400 rounded-lg font-mono text-xs hover:border-red-400 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="w-full h-full p-6 flex flex-col items-center justify-center gap-3 cursor-pointer group/upload hover:bg-wire/5 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-signal/10 border border-signal/40 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-signal" />
                        </div>
                        <div className="text-center space-y-1">
                          <span className="font-mono text-xs uppercase font-semibold text-paper group-hover/upload:text-signal transition-colors block">
                            ➕ UPLOAD PROJECT IMAGE
                          </span>
                          <span className="font-mono text-[10px] text-fog/60 block">
                            Click to select PNG, JPG, or WebP screenshot
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(item.id, e)}
                        />
                      </label>
                    )}
                  </div>

                  {/* Card Title & Description */}
                  <div className="space-y-2 pt-2">
                    <h3 className="font-display text-xl font-semibold text-paper">
                      {item.title}
                    </h3>
                    <p className="text-fog text-xs font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CornerFrame>
              </JellyCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox Image Preview Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md p-6 flex items-center justify-center">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 bg-ink-deep border border-line text-paper hover:text-signal rounded-full font-mono text-xs flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span>CLOSE</span>
          </button>
          <img
            src={lightboxImage}
            alt="Project Preview"
            className="max-w-full max-h-[85vh] rounded-2xl border border-line/80 shadow-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
}

// 4. CAPABILITIES SKILLS SECTION
export function SkillsSection({ data = [] }) {
  const iconMap = { "01": Cpu, "02": Code, "03": Database, "04": Terminal };
  const skillCategories = data.length > 0 ? data : [
    {
      num: "01",
      title: "ARTIFICIAL INTELLIGENCE & AGENTS",
      subtitle: "Autonomous planning, tool calling, multi-agent graphs, and custom model workflows.",
      skills: ["LangGraph", "LangChain", "PyTorch", "FastAPI"],
      meter: "94%",
      meterVisual: "████████████████░░",
      color: "text-signal",
    },
  ];

  return (
    <section
      id="skills"
      className="portfolio-section min-h-screen pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-line/30 relative z-10 scroll-mt-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
      >
        <SectionHeader index="04" label="CAPABILITIES" subtitle="Technical Architecture & Stack" />

        <div className="mt-12 space-y-6">
          {skillCategories.map((cat) => {
            const Icon = iconMap[cat.num] || Code;
            return (
              <motion.div key={cat.num} variants={fadeInUp}>
                <JellyCard className="p-8 bg-ink-deep/70 backdrop-blur-md border border-line/60 hover:border-line/90 transition-colors duration-300 group rounded-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 flex items-start gap-4">
                      <span className={`font-mono text-3xl font-bold ${cat.color || "text-signal"}`}>
                        {cat.num}
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${cat.color || "text-signal"}`} />
                          <h3 className="font-display text-xl sm:text-2xl font-semibold text-paper group-hover:text-signal transition-colors">
                            {cat.title}
                          </h3>
                        </div>
                        <p className="text-fog text-xs font-mono leading-relaxed">
                          {cat.subtitle}
                        </p>

                        <div className="pt-2 font-mono text-[10px] text-fog/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>PROFICIENCY METER</span>
                            <span className={cat.color || "text-signal"}>{cat.meter || "90%"}</span>
                          </div>
                          <div className={`tracking-tight ${cat.color || "text-signal"}`}>{cat.meterVisual || "████████████████░░"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-8 flex flex-wrap gap-2.5 pt-2 lg:pt-0">
                      {cat.skills && cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 bg-ink/70 border border-line/60 text-paper hover:border-signal/50 hover:text-signal transition-colors rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </JellyCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// 5. EXPERIENCE TIMELINE SECTION
export function ExperienceSection({ data = [] }) {
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!lineRef.current || !containerRef.current) return;

    const anim = gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  const experiences = data.length > 0 ? data : [
    {
      year: "2025 — PRESENT",
      role: "AI Software Engineer / Researcher",
      organization: "Independent & Open Source",
      description: "Building autonomous multi-agent systems.",
      metric: "⚡ 12+ Workflows Deployed",
      highlights: ["LangGraph Multi-Agent Workflows"],
      useCorner: true,
    },
  ];

  return (
    <section
      id="experience"
      className="portfolio-section min-h-screen pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-line/30 relative z-10 scroll-mt-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
      >
        <SectionHeader index="05" label="EXPERIENCE" subtitle="Career Milestones & Technical Track" />

        <div ref={containerRef} className="relative mt-16 pl-6 sm:pl-10">
          <div
            ref={lineRef}
            className="absolute left-2 sm:left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-signal via-wire to-line origin-top"
          />

          <div className="space-y-12">
            {experiences.map((exp, idx) => {
              const CardWrapper = exp.useCorner ? CornerFrame : "div";
              return (
                <motion.div key={exp.year} variants={fadeInUp} className="relative group">
                  <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 h-4 w-4 rounded-full border-2 border-signal bg-ink flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                  </div>

                  <JellyCard>
                    <CardWrapper className="p-8 bg-ink-deep/70 backdrop-blur-md border border-line/60 group-hover:border-signal/60 transition-all duration-300 space-y-4 rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-signal font-medium">
                        <span>{exp.year}</span>
                        <span className="text-fog/60">MILESTONE 0{idx + 1}</span>
                      </div>

                      <div>
                        <h3 className="font-display text-2xl font-semibold text-paper group-hover:text-signal transition-colors">
                          {exp.role}
                        </h3>
                        <div className="font-mono text-xs text-wire mt-1 font-medium">
                          {exp.organization}
                        </div>
                      </div>

                      <p className="text-fog text-sm sm:text-base leading-relaxed font-light">
                        {exp.description}
                      </p>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink/70 border border-signal/40 text-signal font-mono text-xs rounded-lg">
                        <span>{exp.metric}</span>
                      </div>

                      <div className="pt-4 border-t border-line/40 flex flex-wrap gap-2">
                        {exp.highlights && exp.highlights.map((item) => (
                          <span
                            key={item}
                            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-ink border border-line/50 text-fog rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </CardWrapper>
                  </JellyCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 6. CONTACT SECTION
export function ContactSection({ data = {} }) {
  const [copied, setCopied] = useState(false);
  const email = data.email || "rasalapubharath@gmail.com";
  const github = data.github || "https://github.com";
  const linkedin = data.linkedin || "https://linkedin.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  return (
    <section
      id="contact"
      className="portfolio-section min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-line/30 relative z-10 scroll-mt-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        <motion.div variants={dropFromTop} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal border border-signal/40 bg-signal/10 px-4 py-2 rounded-full shadow-lg shadow-signal/10">
          <span className="h-2.5 w-2.5 rounded-full bg-signal animate-ping" />
          <span>OPEN TO WORK // ACCEPTING FREELANCE & CONTRACT PROJECTS</span>
        </motion.div>

        <motion.div variants={dropFromTop} className="font-mono text-xs uppercase tracking-[0.25em] text-fog/70 font-medium">
          CONTACT
        </motion.div>

        <div className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase leading-[0.95] overflow-hidden space-y-3 py-2">
          {/* Line 1: LET'S (Left) + BUILD (Right) */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 overflow-hidden">
            <motion.span
              variants={slideFromLeft}
              className="text-paper inline-block drop-shadow-md"
            >
              LET&apos;S
            </motion.span>
            <motion.span
              variants={slideFromRight}
              className="text-paper inline-block drop-shadow-md"
            >
              BUILD
            </motion.span>
          </div>

          {/* Line 2: SOMETHING (Left) + INTELLIGENT. (Right) */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 overflow-hidden">
            <motion.span
              variants={slideFromLeft}
              className="bg-gradient-to-r from-wire via-paper to-signal bg-clip-text text-transparent inline-block drop-shadow-md"
            >
              SOMETHING
            </motion.span>
            <motion.span
              variants={slideFromRight}
              className="bg-gradient-to-r from-wire via-paper to-signal bg-clip-text text-transparent inline-block drop-shadow-md"
            >
              INTELLIGENT.
            </motion.span>
          </div>
        </div>

        <motion.p variants={slideFromLeft} className="text-lg sm:text-xl text-fog font-light max-w-2xl mx-auto leading-relaxed">
          Looking for a Freelance AI Engineer, custom LLM integration, or full-stack contract developer? Let&apos;s talk.
        </motion.p>

        {/* Curved Copy Email Bar */}
        <motion.div variants={slideFromRight} className="pt-2 flex justify-center">
          <JellyCard className="inline-flex items-center gap-3 p-2 px-4 bg-ink-deep/90 border border-line/60 font-mono text-xs text-paper rounded-xl shadow-lg">
            <span className="text-fog/70">EMAIL:</span>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noreferrer"
              className="text-wire font-semibold hover:underline"
              title="Open in Gmail"
            >
              {email}
            </a>
            <button
              onClick={handleCopyEmail}
              className="p-1.5 bg-ink hover:bg-signal hover:text-ink border border-line text-signal transition-colors rounded-lg flex items-center gap-1.5"
              title="Copy Email"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-wire" />
                  <span className="text-[10px] text-wire uppercase font-semibold">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-semibold">COPY</span>
                </>
              )}
            </button>
          </JellyCard>
        </motion.div>

        {/* Curved Contact CTAs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 overflow-hidden">
          <motion.a
            variants={slideFromLeft}
            href={gmailUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-signal text-ink font-mono text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-wire transition-colors duration-300 shadow-xl shadow-signal/20"
          >
            <Mail className="w-4 h-4" />
            <span>START A CONVERSATION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>

          <motion.a
            variants={slideFromRight}
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 border border-line hover:border-paper text-paper font-mono text-xs uppercase tracking-widest rounded-xl transition-colors bg-ink-deep/60 backdrop-blur-sm"
          >
            <Github className="w-4 h-4" />
            <span>GITHUB</span>
            <span className="text-signal">↗</span>
          </motion.a>

          <motion.a
            variants={slideFromLeft}
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 border border-line hover:border-paper text-paper font-mono text-xs uppercase tracking-widest rounded-xl transition-colors bg-ink-deep/60 backdrop-blur-sm"
          >
            <Linkedin className="w-4 h-4" />
            <span>LINKEDIN</span>
            <span className="text-signal">↗</span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

// 7. FOOTER COMPONENT
export function Footer({ data = {} }) {
  const name = data.name || "BHARATH RASALAPU";
  return (
    <footer className="w-full border-t border-line/40 py-8 px-6 md:px-12 bg-ink-deep/90 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-fog/70">
        <div className="flex items-center gap-2">
          <span className="text-signal">✛</span>
          <span>© 2026 {name.toUpperCase()}. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>BUILT WITH NEXT.JS, GSAP & THREE.JS</span>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              if (window.lenis) window.lenis.scrollTo(0);
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-signal hover:underline font-medium"
          >
            BACK TO TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
