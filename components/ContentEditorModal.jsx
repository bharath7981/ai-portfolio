// components/ContentEditorModal.jsx
"use client";
import { useState } from "react";
import { X, Save, RotateCcw, Copy, Check, User, Briefcase, Code, Layers, FileText } from "lucide-react";

export default function ContentEditorModal({ isOpen, onClose, data, onSave, onReset }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState(data);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const handleAboutChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value },
    }));
  };

  const handleProjectChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.projects];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleProjectTagsChange = (idx, tagsStr) => {
    const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    handleProjectChange(idx, "tags", tagsArr);
  };

  const handleSkillChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.skills];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, skills: updated };
    });
  };

  const handleSkillItemsChange = (idx, skillsStr) => {
    const skillsArr = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
    handleSkillChange(idx, "skills", skillsArr);
  };

  const handleExperienceChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.experience];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    if (confirm("Reset all details to default original values?")) {
      onReset();
      onClose();
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-ink-deep border border-line/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-line/40 flex items-center justify-between bg-ink/90">
          <div className="flex items-center gap-2 font-mono text-sm uppercase text-paper font-semibold">
            <span className="text-signal">⚙️</span>
            <span>PORTFOLIO DETAILS EDITOR</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 font-mono text-xs border border-line/60 rounded-lg text-fog hover:text-paper hover:border-signal transition-colors flex items-center gap-1.5"
              title="Copy structured JSON config"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? "COPIED" : "EXPORT JSON"}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 font-mono text-xs border border-line/60 rounded-lg text-fog hover:text-wire hover:border-wire transition-colors flex items-center gap-1.5"
              title="Reset defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-fog hover:text-paper rounded-lg hover:bg-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-line/40 bg-ink/50 overflow-x-auto font-mono text-xs text-fog">
          {[
            { id: "personal", label: "PERSONAL & HERO", icon: User },
            { id: "about", label: "ABOUT & BIO", icon: FileText },
            { id: "projects", label: "PROJECTS", icon: Briefcase },
            { id: "skills", label: "CAPABILITIES", icon: Code },
            { id: "experience", label: "EXPERIENCE", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 font-medium ${
                  activeTab === tab.id
                    ? "border-signal text-signal bg-ink-deep"
                    : "border-transparent text-fog hover:text-paper"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 font-sans text-sm text-paper">
          {/* TAB 1: PERSONAL & HERO */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-fog uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.personal.name}
                    onChange={(e) => handlePersonalChange("name", e.target.value)}
                    className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper font-semibold focus:outline-none focus:border-signal"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-fog uppercase mb-1">Title / Role Tag</label>
                  <input
                    type="text"
                    value={formData.personal.title}
                    onChange={(e) => handlePersonalChange("title", e.target.value)}
                    className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper font-semibold focus:outline-none focus:border-signal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-fog uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.personal.location}
                    onChange={(e) => handlePersonalChange("location", e.target.value)}
                    className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-fog uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-fog uppercase mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={formData.personal.tagline}
                  onChange={(e) => handlePersonalChange("tagline", e.target.value)}
                  className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-fog uppercase mb-1">Hero Subtagline</label>
                <textarea
                  rows={2}
                  value={formData.personal.subtagline}
                  onChange={(e) => handlePersonalChange("subtagline", e.target.value)}
                  className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line/40">
                <div>
                  <label className="block font-mono text-xs text-fog uppercase mb-1">GitHub Link</label>
                  <input
                    type="text"
                    value={formData.personal.github}
                    onChange={(e) => handlePersonalChange("github", e.target.value)}
                    className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-fog uppercase mb-1">LinkedIn Link</label>
                  <input
                    type="text"
                    value={formData.personal.linkedin}
                    onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                    className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT & BIO */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-fog uppercase mb-1">Bio Lead Sentence</label>
                <textarea
                  rows={2}
                  value={formData.about.bioLead}
                  onChange={(e) => handleAboutChange("bioLead", e.target.value)}
                  className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-fog uppercase mb-1">Paragraph 1</label>
                <textarea
                  rows={3}
                  value={formData.about.bioPara1}
                  onChange={(e) => handleAboutChange("bioPara1", e.target.value)}
                  className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-fog uppercase mb-1">Paragraph 2</label>
                <textarea
                  rows={3}
                  value={formData.about.bioPara2}
                  onChange={(e) => handleAboutChange("bioPara2", e.target.value)}
                  className="w-full p-2.5 bg-ink border border-line/60 rounded-xl text-paper focus:outline-none focus:border-signal"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {formData.projects.map((proj, idx) => (
                <div key={proj.id} className="p-4 bg-ink/70 border border-line/50 rounded-xl space-y-3">
                  <div className="font-mono text-xs text-signal font-semibold uppercase">
                    PROJECT #{proj.id}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-fog uppercase mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => handleProjectChange(idx, "name", e.target.value)}
                        className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper font-semibold focus:outline-none focus:border-signal"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-fog uppercase mb-1">Highlight Label</label>
                      <input
                        type="text"
                        value={proj.highlight}
                        onChange={(e) => handleProjectChange(idx, "highlight", e.target.value)}
                        className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-fog uppercase mb-1">Description Blurb</label>
                    <textarea
                      rows={2}
                      value={proj.blurb}
                      onChange={(e) => handleProjectChange(idx, "blurb", e.target.value)}
                      className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-fog uppercase mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={proj.tags ? proj.tags.join(", ") : ""}
                      onChange={(e) => handleProjectTagsChange(idx, e.target.value)}
                      className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              {formData.skills.map((cat, idx) => (
                <div key={cat.num} className="p-4 bg-ink/70 border border-line/50 rounded-xl space-y-3">
                  <div className="font-mono text-xs text-signal font-semibold uppercase">
                    CATEGORY {cat.num}
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-fog uppercase mb-1">Category Title</label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => handleSkillChange(idx, "title", e.target.value)}
                      className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper font-semibold focus:outline-none focus:border-signal"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-fog uppercase mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={cat.subtitle}
                      onChange={(e) => handleSkillChange(idx, "subtitle", e.target.value)}
                      className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-fog uppercase mb-1">Skills List (Comma-separated)</label>
                    <input
                      type="text"
                      value={cat.skills ? cat.skills.join(", ") : ""}
                      onChange={(e) => handleSkillItemsChange(idx, e.target.value)}
                      className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              {formData.experience.map((exp, idx) => (
                <div key={exp.year} className="p-4 bg-ink/70 border border-line/50 rounded-xl space-y-3">
                  <div className="font-mono text-xs text-signal font-semibold uppercase">
                    MILESTONE 0{idx + 1}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-fog uppercase mb-1">Time Period / Year</label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => handleExperienceChange(idx, "year", e.target.value)}
                        className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-fog uppercase mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                        className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper font-semibold focus:outline-none focus:border-signal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-fog uppercase mb-1">Organization</label>
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => handleExperienceChange(idx, "organization", e.target.value)}
                        className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-fog uppercase mb-1">Metric Badge</label>
                      <input
                        type="text"
                        value={exp.metric}
                        onChange={(e) => handleExperienceChange(idx, "metric", e.target.value)}
                        className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-fog uppercase mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(idx, "description", e.target.value)}
                      className="w-full p-2 bg-ink border border-line/60 rounded-lg text-paper focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-line/40 bg-ink/90 flex items-center justify-between">
          <span className="font-mono text-xs text-fog">Live preview updates automatically</span>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-signal text-ink font-mono text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-wire transition-colors flex items-center gap-2 shadow-lg shadow-signal/20"
          >
            <Save className="w-4 h-4" />
            <span>SAVE & APPLY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
