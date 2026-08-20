// components/Header.jsx
"use client";
import { useEffect, useState } from "react";
import { Edit3 } from "lucide-react";

const NAV_ITEMS = [
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "GALLERY", href: "#gallery" },
  { label: "SKILLS", href: "#skills" },
  { label: "EXP", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

const THEMES = [
  { id: "white-light", name: "WHITE LIGHT", color: "#0F172A" },
  { id: "default", name: "NAVY BLUEPRINT", color: "#F5A623" },
  { id: "cyber-emerald", name: "CYBER EMERALD", color: "#10B981" },
  { id: "violet-obsidian", name: "VIOLET OBSIDIAN", color: "#8B5CF6" },
  { id: "monochrome-titanium", name: "MONOCHROME SKY", color: "#38BDF8" },
];

export default function Header({ onOpenEditor }) {
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("white-light");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio_theme") || "white-light";
    setCurrentTheme(savedTheme);
    if (savedTheme !== "default") {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    setThemeDropdownOpen(false);
    localStorage.setItem("portfolio_theme", themeId);
    if (themeId === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      setProgress(height > 0 ? scrollTop / height : 0);
      setScrolled(scrollTop > 40);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["hero", "about", "projects", "gallery", "skills", "experience", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top - 100) {
            setActive(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    if (targetId === "hero") {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      if (window.lenis) {
        window.lenis.scrollTo(targetEl, { offset: -60 });
      } else {
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - 60;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-md border-b border-line/40 py-3 shadow-lg shadow-black/10"
          : "bg-transparent py-5"
      }`}
    >
      {/* Scroll progress bar at very top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-line/30">
        <div
          className="h-full bg-gradient-to-r from-wire to-signal transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10">
        {/* High-End Glassmorphic Brand Logo Badge */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, "#hero")}
          className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-ink-deep/80 border border-line/70 hover:border-signal/80 backdrop-blur-md transition-all duration-300 shadow-md shadow-black/20 hover:shadow-signal/10"
        >
          {/* Glowing Emblem Monogram */}
          <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-signal/10 border border-signal/40 flex items-center justify-center font-display font-bold text-[9px] sm:text-[10px] text-signal group-hover:scale-110 group-hover:bg-signal group-hover:text-ink transition-all duration-300">
            BR
          </span>

          {/* Dual-Tone Stylized Typography */}
          <div className="flex items-center gap-1 sm:gap-1.5 font-display text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.22em]">
            <span className="font-bold text-paper group-hover:text-wire transition-colors">
              BHARATH
            </span>
            <span className="font-extrabold bg-gradient-to-r from-wire via-paper to-signal bg-clip-text text-transparent">
              RASALAPU
            </span>
          </div>

          {/* Live System Indicator Badge */}
          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] text-wire/90 bg-wire/10 px-2 py-0.5 rounded-full border border-wire/30 ml-1">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
            SYS.01
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-all relative py-1 ${
                  isActive ? "text-signal font-semibold" : "text-fog hover:text-paper"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-signal rounded-full" />
                )}
              </a>
            );
          })}

          {/* Live Content Editor Trigger Button */}
          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-signal/60 text-paper hover:text-signal hover:border-signal rounded-xl transition-colors flex items-center gap-1.5 bg-ink-deep/80 shadow-sm"
              title="Edit website details anytime"
            >
              <Edit3 className="w-3 h-3 text-signal" />
              <span>EDIT</span>
            </button>
          )}

          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="font-mono text-[11px] uppercase tracking-widest px-3.5 py-1.5 border border-signal/60 text-signal rounded-xl hover:bg-signal hover:text-ink transition-colors duration-300"
          >
            LET&apos;S TALK ↗
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-line/70 bg-ink-deep/80 backdrop-blur-md text-paper hover:text-signal hover:border-signal transition-colors flex items-center gap-1.5 shadow-sm"
          aria-label="Toggle menu"
        >
          <span className="text-signal">{mobileMenuOpen ? "✕" : "☰"}</span>
          <span>{mobileMenuOpen ? "CLOSE" : "MENU"}</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink-deep/95 backdrop-blur-xl border-b border-line/40 px-6 py-6 space-y-3.5 shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="block font-mono text-xs uppercase tracking-widest text-fog hover:text-signal py-1.5 border-b border-line/20"
            >
              {item.label}
            </a>
          ))}

          {/* Mobile Editor Trigger */}
          {onOpenEditor && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEditor();
                }}
                className="w-full py-2.5 bg-signal text-ink font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span>EDIT DETAILS ⚙️</span>
              </button>
            </div>
          )}

          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="block text-center font-mono text-xs uppercase tracking-widest px-4 py-2.5 border border-signal text-signal rounded-xl hover:bg-signal hover:text-ink transition-colors mt-2"
          >
            LET&apos;S TALK ↗
          </a>
        </div>
      )}
    </header>
  );
}
