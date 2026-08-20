// app/page.jsx
"use client";
import { useState, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import PortfolioFlow from "@/components/PortfolioFlow";
import ThreeBackground from "@/components/ThreeBackground";
import FogParticles from "@/components/FogParticles";
import Header from "@/components/Header";
import ContentEditorModal from "@/components/ContentEditorModal";
import { initialPortfolioData } from "@/data/portfolioData";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  ProjectGallerySection,
  SkillsSection,
  ExperienceSection,
  ContactSection,
  Footer,
  PageCurtain,
} from "@/components/Sections";
import { Edit3 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState(initialPortfolioData);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_user_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Seamlessly merge saved edits while keeping fresh project walkthroughs
        const mergedProjects = initialPortfolioData.projects.map((defProj) => {
          const found = parsed.projects?.find((p) => p.id === defProj.id);
          if (!found) return defProj;
          return {
            ...defProj,
            ...found,
            details: defProj.details || found.details,
          };
        });
        setData({
          ...initialPortfolioData,
          ...parsed,
          projects: mergedProjects,
        });
      }
    } catch (e) {
      console.error("Failed to load saved portfolio data", e);
    }
  }, []);

  const handleSaveData = (newData) => {
    setData(newData);
    try {
      localStorage.setItem("portfolio_user_data", JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save portfolio data", e);
    }
  };

  const handleResetData = () => {
    setData(initialPortfolioData);
    try {
      localStorage.removeItem("portfolio_user_data");
    } catch (e) {
      console.error("Failed to reset portfolio data", e);
    }
  };

  return (
    <SmoothScroll>
      <main className="relative bg-ink text-paper min-h-screen overflow-x-hidden">
        {/* Fixed Header navigation + scroll progress */}
        <Header onOpenEditor={() => setEditorOpen(true)} />

        {/* Page Load Curtain Reveal */}
        <PageCurtain />

        {/* 3D Canvas Layer with scroll synchronization */}
        <ThreeBackground />

        {/* Interactive Floating #22D3EE Cyan Fog Dots */}
        <FogParticles />

        {/* Normal document scroll flow with GSAP & Framer Motion reveal animations */}
        <div className="relative z-10 w-full">
          <PortfolioFlow>
            <HeroSection data={data.personal} />
            <AboutSection data={data.about} />
            <ProjectsSection data={data.projects} />
            <ProjectGallerySection />
            <SkillsSection data={data.skills} />
            <ExperienceSection data={data.experience} />
            <ContactSection data={data.personal} />
            <Footer data={data.personal} />
          </PortfolioFlow>
        </div>

        {/* Floating Edit Details Button */}
        <button
          onClick={() => setEditorOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-signal text-ink font-mono text-xs uppercase tracking-widest font-semibold rounded-2xl shadow-2xl hover:bg-wire transition-colors duration-300 flex items-center gap-2 border border-ink"
          title="Edit your website details anytime"
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">EDIT DETAILS</span>
        </button>

        {/* Live Content Editor Modal */}
        <ContentEditorModal
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          data={data}
          onSave={handleSaveData}
          onReset={handleResetData}
        />
      </main>
    </SmoothScroll>
  );
}
