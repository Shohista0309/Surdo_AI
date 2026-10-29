import React, { useState } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Undo2,
  Redo2,
  FolderOpen,
  Save,
  Plus,
  Compass,
  Link,
  MousePointer,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  FileCode2,
  Camera,
  CameraOff,
  Video,
  Scissors,
  Keyboard
} from 'lucide-react';
import { SimulationStatus, LabInteractionMode, CameraStatus } from '../types';

interface TopNavigationBarProps {
  projectName: string;
  onRenameProject: (name: string) => void;
  onNewProject: () => void;
  onOpenProjectModal: () => void;
  onOpenSchematic: () => void;
  onSaveProject: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  activeMode: LabInteractionMode;
  onChangeMode: (mode: LabInteractionMode) => void;
  wireColor: string;
  onChangeWireColor: (color: string) => void;
  simulationStatus: SimulationStatus;
  onRunSimulation: () => void;
  onResetView: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  cameraStatus: CameraStatus;
  onToggleCamera: () => void;
}

const WIRE_COLORS = [
  { hex: '#ef4444', label: 'Qizil (+ VCC)' },
  { hex: '#1e293b', label: 'Qora (GND)' },
  { hex: '#0ea5e9', label: 'Moviy (Signal)' },
  { hex: '#f59e0b', label: 'Sariq' },
  { hex: '#10b981', label: 'Yashil' },
  { hex: '#f8fafc', label: 'Oq' }
];

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  projectName,
  onRenameProject,
  onNewProject,
  onOpenProjectModal,
  onOpenSchematic,
  onSaveProject,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  activeMode,
  onChangeMode,
  wireColor,
  onChangeWireColor,
  simulationStatus,
  onRunSimulation,
  onResetView,
  isMuted,
  onToggleMute,
  cameraStatus,
  onToggleCamera
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleFinishRename = () => {
    setIsEditingName(false);
    if (tempName.trim()) {
      onRenameProject(tempName.trim());
    }
  };

  return (
    <header className="h-16 px-4 bg-[#070d19]/95 border-b border-[#1e325c] flex items-center justify-between text-slate-200 select-none z-30 shadow-lg">
      
      {/* Left: Brand & Project Name */}
      <div className="flex items-center gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-neon-cyan">
            <Zap className="w-5 h-5 fill-black text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-wide text-sm sm:text-base">ElectroHand</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LAB 3D
              </span>
            </div>
          </div>
        </div>

        {/* Project Name Editor */}
        <div className="hidden md:flex items-center ml-2 pl-3 border-l border-slate-700/60">
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={handleFinishRename}
              onKeyDown={e => e.key === 'Enter' && handleFinishRename()}
              autoFocus
              className="px-2 py-1 rounded bg-[#0b1328] border border-cyan-500 text-xs text-white focus:outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setTempName(projectName);
                setIsEditingName(true);
              }}
              title="Loyiha nomini o‘zgartirish"
              className="text-xs font-semibold text-slate-300 hover:text-cyan-300 px-2 py-1 rounded hover:bg-slate-800/60 transition-colors"
            >
              {projectName} ✎
            </button>
          )}
        </div>

        {/* Project Action Buttons */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2">
          <button
            onClick={onNewProject}
            title="Yangi loyiha"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Yangi
          </button>
          <button
            onClick={onSaveProject}
            title="Loyihani saqlash"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Saqlash
          </button>
          <button
            onClick={onOpenProjectModal}
            title="Namunalar va saqlangan loyihalar"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 text-xs font-medium text-cyan-300 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" /> Namunalar
          </button>
          <button
            onClick={onOpenSchematic}
            title="2D Sxematik ko‘rinishni ochish"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/60 text-xs font-medium text-indigo-300 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" /> 2D Sxema
          </button>
        </div>
      </div>

      {/* Center: Tools (Select/Wire/Multimeter mode, Undo/Redo, Wire Color) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Undo / Redo */}
        <div className="flex items-center rounded-xl bg-[#0b1328] border border-[#1e325c] p-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Orqaga (Undo)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Oldinga (Redo)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher: Select vs Wire vs Multimeter */}
        <div className="flex items-center rounded-xl bg-[#0b1328] border border-[#1e325c] p-1">
          <button
            onClick={() => onChangeMode('select')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'select'
                ? 'bg-cyan-500 text-black shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ushlash & Siljitish</span>
          </button>

          <button
            onClick={() => onChangeMode('wire')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'wire'
                ? 'bg-cyan-500 text-black shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sim Ulash</span>
          </button>

          <button
            onClick={() => onChangeMode('multimeter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'multimeter'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Multimetr Prob</span>
          </button>

          <button
            onClick={() => onChangeMode('delete_wire')}
            title="Simni o'chirish rejimi — simni bosib o'chirib tashlang"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'delete_wire'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simni O'chirish</span>
          </button>
        </div>

        {/* Wire Color Picker (if Wire Mode active) */}
        {activeMode === 'wire' && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#0b1328] border border-[#1e325c]">
            {WIRE_COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => onChangeWireColor(c.hex)}
                title={c.label}
                className={`w-4 h-4 rounded-full transition-transform ${
                  wireColor === c.hex ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Simulation Check Button, View Reset, Audio */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Big Simulation Check Button */}
        <button
          onClick={onRunSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all transform active:scale-95 ${
            simulationStatus === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-black shadow-neon-green'
              : simulationStatus === 'error'
              ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-neon-red'
              : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 text-black shadow-neon-cyan hover:shadow-cyan-400/50'
          }`}
        >
          {simulationStatus === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : simulationStatus === 'error' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 fill-black" />
          )}
          <span>
            {simulationStatus === 'success'
              ? 'Zanjir To‘g‘ri'
              : simulationStatus === 'error'
              ? 'Xatolik Bor'
              : 'Simulyatsiya / Tekshirish'}
          </span>
        </button>

        {/* Camera Toggle Button */}
        <button
          onClick={onToggleCamera}
          title={cameraStatus === 'active' ? "Veb-kamerani o‘chirish" : "Veb-kamerani yoqish (Qo‘l nazorati)"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            cameraStatus === 'active'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/20'
              : cameraStatus === 'starting'
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          {cameraStatus === 'active' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Kamera Faol</span>
            </>
          ) : cameraStatus === 'starting' ? (
            <>
              <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Yuklanmoqda...</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Kamera (Qo‘l)</span>
            </>
          )}
        </button>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          title="Kamera ko‘rinishini tiklash"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

    </header>
  );
};
