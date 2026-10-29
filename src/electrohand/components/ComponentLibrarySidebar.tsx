import React, { useState, useMemo } from 'react';
import {
  COMPONENT_CATEGORIES,
  COMPONENT_CATALOG
} from '../data/componentCatalog';
import { ComponentType, ComponentCategory } from '../types';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Zap,
  Cpu,
  Battery,
  Activity,
  Layers,
  Box,
  GitMerge,
  RefreshCw,
  ToggleLeft,
  Volume2,
  ChevronLeft
} from 'lucide-react';

interface ComponentLibrarySidebarProps {
  onAddComponent: (type: ComponentType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  zap: Zap,
  cpu: Cpu,
  battery: Battery,
  activity: Activity,
  layers: Layers,
  box: Box,
  'git-merge': GitMerge,
  'refresh-cw': RefreshCw,
  'toggle-left': ToggleLeft,
  'volume-2': Volume2
};

export const ComponentLibrarySidebar: React.FC<ComponentLibrarySidebarProps> = ({
  onAddComponent,
  isCollapsed,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<ComponentCategory, boolean>>({
    diodes: true,
    transistors: true,
    power: true,
    resistors: true,
    capacitors: false,
    ics: false,
    opamps: false,
    transformers: false,
    switches: false,
    other: false
  });

  const toggleCategory = (cat: ComponentCategory) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter components by search query
  const filteredCatalog = useMemo(() => {
    const list = Object.values(COMPONENT_CATALOG);
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      c =>
        c.nameUz.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.descriptionUz.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group by category
  const componentsByCategory = useMemo(() => {
    const map: Record<ComponentCategory, typeof filteredCatalog> = {
      diodes: [],
      transistors: [],
      power: [],
      resistors: [],
      capacitors: [],
      ics: [],
      opamps: [],
      transformers: [],
      switches: [],
      other: []
    };

    filteredCatalog.forEach(comp => {
      if (map[comp.category]) {
        map[comp.category].push(comp);
      }
    });

    return map;
  }, [filteredCatalog]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#070d19]/95 border-r border-[#1e325c] flex flex-col items-center py-4 z-20">
        <button
          onClick={onToggleCollapse}
          title="Komponentlar kutubxonasini ochish"
          className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-72 sm:w-80 bg-[#070d19]/95 border-r border-[#1e325c] flex flex-col h-[calc(100vh-4rem)] z-20 select-none shadow-xl">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#1e325c]/80 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" />
            Komponentlar Kutubxonasi
          </h2>
          <p className="text-[11px] text-slate-400">
            Tanlang va ishchi stolga joylashtiring
          </p>
        </div>

        <button
          onClick={onToggleCollapse}
          title="Panelni yig‘ish"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-[#1e325c]/60">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Komponentlarni qidirish..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1328] border border-[#1e325c] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Categories & Components List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {COMPONENT_CATEGORIES.map(cat => {
          const comps = componentsByCategory[cat.id] || [];
          if (searchQuery.trim() && comps.length === 0) return null;

          const isExpanded = expandedCategories[cat.id] || !!searchQuery.trim();
          const IconComp = CATEGORY_ICONS[cat.icon] || Box;

          return (
            <div key={cat.id} className="rounded-xl border border-[#1e325c]/60 bg-[#0a1122]/70 overflow-hidden">
              {/* Category Header Accordion */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">{cat.nameUz}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {comps.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Component Cards */}
              {isExpanded && (
                <div className="p-2 space-y-1.5 border-t border-[#1e325c]/40 bg-[#080e1c]/80">
                  {comps.map(comp => (
                    <div
                      key={comp.type}
                      className="group p-2.5 rounded-lg border border-transparent hover:border-cyan-500/40 bg-[#0c162c] hover:bg-[#101d3b] transition-all flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                            {comp.code}
                          </span>
                          <span className="text-xs font-medium text-slate-100 truncate">
                            {comp.nameUz}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {comp.pins.length} ta pin • {comp.descriptionUz}
                        </p>
                      </div>

                      <button
                        onClick={() => onAddComponent(comp.type)}
                        title="Ishchi stolga joylashtirish"
                        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-black font-bold text-xs shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Qo‘shish</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </aside>
  );
};
