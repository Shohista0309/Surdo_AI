import React, { useState } from 'react';
import { ProjectData } from '../types';
import { SAMPLE_PROJECTS, ProjectManager } from '../state/ProjectManager';
import {
  X,
  FolderOpen,
  Sparkles,
  Save,
  Trash2,
  FileDown,
  FileUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: ProjectData) => void;
  currentProject: ProjectData;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  currentProject
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'saved' | 'import'>('samples');
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>(ProjectManager.getSavedProjects());
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const handleSelectSample = (sample: ProjectData) => {
    onLoadProject(sample);
    onClose();
  };

  const handleSelectSaved = (proj: ProjectData) => {
    onLoadProject(proj);
    onClose();
  };

  const handleDeleteSaved = (id: string) => {
    if (confirm("Ushbu loyihani o‘chirishni tasdiqlaysizmi?")) {
      ProjectManager.deleteProject(id);
      setSavedProjects(ProjectManager.getSavedProjects());
    }
  };

  const handleExportCurrent = () => {
    const jsonStr = ProjectManager.exportToJson(currentProject);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError('');
    const parsed = ProjectManager.importFromJson(importJsonText);
    if (parsed) {
      onLoadProject(parsed);
      onClose();
    } else {
      setImportError('Noto‘g‘ri JSON formati! Iltimos, fayl tarkibini tekshiring.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-[#0b1328] border border-[#1e325c] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e325c]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Loyihalar va Namunaviy Zanjirlar
              </h2>
              <p className="text-xs text-slate-400">
                Tayyor namunalarni yuklang yoki o‘z sxemalaringizni boshqaring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 border-b border-[#1e325c] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('samples')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'samples'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Namunaviy Zanjirlar ({SAMPLE_PROJECTS.length})
          </button>

          <button
            onClick={() => {
              setSavedProjects(ProjectManager.getSavedProjects());
              setActiveTab('saved');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            Saqlangan Loyihalarim ({savedProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            Fayldan Import / Eksport
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {/* Tab 1: Samples */}
          {activeTab === 'samples' && (
            <div className="space-y-2.5">
              {SAMPLE_PROJECTS.map(sample => (
                <div
                  key={sample.id}
                  className="p-3.5 rounded-2xl bg-[#0e1a38] border border-[#1e325c] hover:border-cyan-500/60 transition-all flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{sample.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{sample.notes}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-cyan-300">
                      <span>{sample.components.length} ta komponent</span>
                      <span>•</span>
                      <span>{sample.wires.length} ta sim</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectSample(sample)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-neon-cyan transition-colors"
                  >
                    Yuklash
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Saved Projects */}
          {activeTab === 'saved' && (
            <div className="space-y-2.5">
              {savedProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Hozircha saqlangan shaxsiy loyihalar yo‘q. Yuqori menyudagi <strong>“Saqlash”</strong> tugmasi orqali o‘z zanjiringizni saqlashingiz mumkin.
                </div>
              ) : (
                savedProjects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-2xl bg-[#0e1a38] border border-[#1e325c] hover:border-cyan-500/60 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{proj.components.length} ta komponent</span>
                        <span>•</span>
                        <span>{proj.wires.length} ta sim</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectSaved(proj)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs shadow-sm transition-colors"
                      >
                        Yuklash
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(proj.id)}
                        className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/60 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Import / Export */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* Export Button */}
              <div className="p-4 rounded-2xl bg-[#0e1a38] border border-[#1e325c] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Joriy loyihani yuklab olish</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sxemani <code>.json</code> fayl sifatida kompyuteringizga saqlang.
                  </p>
                </div>
                <button
                  onClick={handleExportCurrent}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  <FileDown className="w-4 h-4" /> JSON Fayl
                </button>
              </div>

              {/* Import Area */}
              <div className="p-4 rounded-2xl bg-[#0e1a38] border border-[#1e325c] space-y-2.5">
                <h4 className="text-xs font-bold text-white">Fayl yoki JSON matn orqali import</h4>
                <textarea
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder="Loyihaning JSON matnini bu yerga nusxalab qo‘ying..."
                  className="w-full h-28 p-2.5 rounded-xl bg-[#070d19] border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                {importError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> {importError}
                  </p>
                )}

                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs shadow-neon-cyan transition-colors"
                >
                  Zanjirni Tiklash va O‘rnatish
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
