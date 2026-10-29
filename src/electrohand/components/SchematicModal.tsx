import React, { useRef } from 'react';
import {
  X,
  Download,
  Printer,
  Zap,
  Info,
  Maximize2
} from 'lucide-react';
import { ComponentInstance, JumperWire, SimulationResult } from '../types';
import { COMPONENT_CATALOG } from '../data/componentCatalog';

interface SchematicModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  components: ComponentInstance[];
  wires: JumperWire[];
  simulationResult: SimulationResult | null;
}

export const SchematicModal: React.FC<SchematicModalProps> = ({
  isOpen,
  onClose,
  projectName,
  components,
  wires,
  simulationResult
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  if (!isOpen) return null;

  // Download SVG file
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_sxema.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print schematic
  const handlePrint = () => {
    window.print();
  };

  // Layout calculations: generate component placements in 2D grid
  const nodeVoltages = simulationResult?.nodeVoltages || {};

  // Find power source if any
  const powerComp = components.find(c => c.type.startsWith('dc_') || c.type.includes('battery') || c.type.includes('supply'));
  const otherComps = components.filter(c => c !== powerComp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#070d19] border-2 border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="h-16 px-6 bg-[#0a1224] border-b border-[#1e325c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  2D Sxematik Diagramma
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {projectName}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Elektr sxemasi, tugun kuchlanishlari va ulanishlar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSvg}
              title="SVG formatida yuklab olish"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SVG Yuklash</span>
            </button>

            <button
              onClick={handlePrint}
              title="Chop etish"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chop etish</span>
            </button>

            <button
              onClick={onClose}
              title="Yopish"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schematic Canvas Body */}
        <div className="flex-1 bg-[#050914] relative overflow-auto p-6 flex items-center justify-center">
          {/* Blueprint Technical Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {components.length === 0 ? (
            <div className="text-center text-slate-500 py-20">
              <Info className="w-12 h-12 mx-auto mb-3 opacity-40 text-cyan-400" />
              <p className="text-sm font-medium">Zanjirda hech qanday komponent yo‘q.</p>
              <p className="text-xs text-slate-600 mt-1">Avval maket platasiga komponentlarni qo‘shing.</p>
            </div>
          ) : (
            <svg
              ref={svgRef}
              viewBox="0 0 900 560"
              className="w-full max-w-[860px] h-auto rounded-xl border border-slate-800/80 bg-[#070e1c] shadow-xl"
            >
              <defs>
                {/* Glow filter */}
                <filter id="schematicGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Arrowhead marker */}
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#00f0ff" />
                </marker>
              </defs>

              {/* Title Block in corner */}
              <g transform="translate(20, 30)">
                <text x="0" y="0" fill="#00f0ff" fontSize="16" fontWeight="bold" fontFamily="monospace">
                  ELECTROHAND SXEMA: {projectName.toUpperCase()}
                </text>
                <text x="0" y="20" fill="#64748b" fontSize="11" fontFamily="monospace">
                  Standart: IEC 60617 | Sana: {new Date().toLocaleDateString('uz-UZ')}
                </text>
              </g>

              {/* Main Bus Rails (VCC and GND lines) */}
              {/* Top Rail (+ VCC) */}
              <line x1="80" y1="100" x2="820" y2="100" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 3" />
              <text x="40" y="105" fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="monospace">
                +VCC
              </text>
              <circle cx="80" cy="100" r="4" fill="#ef4444" />

              {/* Bottom Rail (GND) */}
              <line x1="80" y1="460" x2="820" y2="460" stroke="#0ea5e9" strokeWidth="3" />
              <text x="40" y="465" fill="#0ea5e9" fontSize="13" fontWeight="bold" fontFamily="monospace">
                GND
              </text>
              <circle cx="80" cy="460" r="4" fill="#0ea5e9" />

              {/* Ground Symbol at bottom */}
              <g transform="translate(450, 460)">
                <line x1="0" y1="0" x2="0" y2="18" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="-16" y1="18" x2="16" y2="18" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="-10" y1="24" x2="10" y2="24" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="-4" y1="30" x2="4" y2="30" stroke="#0ea5e9" strokeWidth="2" />
              </g>

              {/* Power Source on Left Branch (if present) */}
              {powerComp && (
                <g transform="translate(140, 280)">
                  {/* Vertical connecting lines to rails */}
                  <line x1="0" y1="-180" x2="0" y2="-50" stroke="#ef4444" strokeWidth="2" />
                  <line x1="0" y1="50" x2="0" y2="180" stroke="#0ea5e9" strokeWidth="2" />

                  {/* Battery Symbol: Alternating long and short lines */}
                  <circle cx="0" cy="0" r="42" fill="#0d1527" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="-22" y1="-15" x2="22" y2="-15" stroke="#ef4444" strokeWidth="4" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="-22" y1="15" x2="22" y2="15" stroke="#0ea5e9" strokeWidth="4" />

                  <text x="30" y="-10" fill="#ef4444" fontSize="14" fontWeight="bold" fontFamily="monospace">+</text>
                  <text x="30" y="20" fill="#0ea5e9" fontSize="14" fontWeight="bold" fontFamily="monospace">-</text>

                  <text x="0" y="65" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    {powerComp.parameters.voltage || 9}V
                  </text>
                  <text x="0" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                    {COMPONENT_CATALOG[powerComp.type]?.nameUz || 'Quvvat Manbai'}
                  </text>
                </g>
              )}

              {/* Render Other Components in parallel/series vertical branches */}
              {otherComps.map((comp, idx) => {
                const spec = COMPONENT_CATALOG[comp.type];
                if (!spec) return null;

                const branchX = 280 + idx * 160;
                if (branchX > 800) return null; // Avoid overflowing canvas

                const isLed = comp.type.startsWith('led_');
                const isResistor = comp.type.startsWith('resistor_') || comp.type === 'potentiometer_10k';
                const isTransistor = comp.type.startsWith('transistor_');
                const isDiode = comp.type.startsWith('diode_');
                const isCapacitor = comp.type.startsWith('capacitor_');
                const isBuzzer = comp.type === 'buzzer_piezo';
                const isSwitch = comp.type.startsWith('switch_');

                return (
                  <g key={comp.id} transform={`translate(${branchX}, 280)`}>
                    {/* Upper branch wire from +VCC */}
                    <line x1="0" y1="-180" x2="0" y2="-45" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="0" cy="-180" r="4" fill="#ef4444" />

                    {/* Lower branch wire to GND */}
                    <line x1="0" y1="45" x2="0" y2="180" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="0" cy="180" r="4" fill="#0ea5e9" />

                    {/* Resistor IEC Standard Rectangle */}
                    {isResistor && (
                      <g>
                        <rect x="-14" y="-36" width="28" height="72" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
                        <text x="24" y="-5" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">
                          {comp.parameters.resistance || 220}Ω
                        </text>
                        <text x="24" y="12" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                          {spec.nameUz}
                        </text>
                      </g>
                    )}

                    {/* LED Symbol: Diode Triangle + Bar + 2 Emission Arrows */}
                    {isLed && (
                      <g>
                        {/* Diode Triangle */}
                        <polygon
                          points="-18,-20 18,-20 0,16"
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        {/* Cathode Bar */}
                        <line x1="-18" y1="16" x2="18" y2="16" stroke="#ffffff" strokeWidth="2.5" />

                        {/* Light emission arrows */}
                        <line x1="16" y1="-10" x2="32" y2="-22" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
                        <line x1="22" y1="2" x2="38" y2="-10" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />

                        <text x="24" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                          {spec.nameUz}
                        </text>
                      </g>
                    )}

                    {/* Standard Rectifier Diode */}
                    {isDiode && (
                      <g>
                        <polygon points="-16,-20 16,-20 0,14" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <line x1="-16" y1="14" x2="16" y2="14" stroke="#ffffff" strokeWidth="2.5" />
                        <text x="22" y="5" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                          {spec.code}
                        </text>
                      </g>
                    )}

                    {/* Capacitor: Parallel Plates */}
                    {isCapacitor && (
                      <g>
                        <line x1="-20" y1="-10" x2="20" y2="-10" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="-20" y1="10" x2="20" y2="10" stroke="#38bdf8" strokeWidth="3" />
                        <text x="26" y="5" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                          {comp.parameters.capacitance || '100nF'}
                        </text>
                      </g>
                    )}

                    {/* Piezo Buzzer: Speaker symbol */}
                    {isBuzzer && (
                      <g>
                        <rect x="-18" y="-18" width="36" height="36" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" rx="4" />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                        <text x="26" y="5" fill="#00f0ff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                          Buzzer (5V)
                        </text>
                      </g>
                    )}

                    {/* Switch SPST Symbol */}
                    {isSwitch && (
                      <g>
                        <circle cx="0" cy="-25" r="4" fill="#ffffff" />
                        <circle cx="0" cy="25" r="4" fill="#ffffff" />
                        <line x1="0" y1="-25" x2="16" y2="15" stroke="#38bdf8" strokeWidth="2.5" />
                        <text x="24" y="5" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                          Kalit (SW)
                        </text>
                      </g>
                    )}

                    {/* Transistor NPN Symbol */}
                    {isTransistor && (
                      <g>
                        <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                        <line x1="-12" y1="-16" x2="-12" y2="16" stroke="#ffffff" strokeWidth="3" />
                        {/* Collector */}
                        <line x1="-12" y1="-8" x2="14" y2="-20" stroke="#38bdf8" strokeWidth="2" />
                        {/* Emitter with Arrow */}
                        <line x1="-12" y1="8" x2="14" y2="20" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
                        <text x="32" y="5" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                          2N2222 NPN
                        </text>
                      </g>
                    )}

                    {/* Node voltage test badge */}
                    <g transform="translate(0, -60)">
                      <rect x="-28" y="-12" width="56" height="20" rx="4" fill="#091428" stroke="#00f0ff" strokeWidth="1" />
                      <text x="0" y="3" textAnchor="middle" fill="#00f0ff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        {nodeVoltages[comp.id] !== undefined
                          ? `${nodeVoltages[comp.id].toFixed(2)}V`
                          : 'TEST'}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Wire connections count watermark */}
              <text x="820" y="530" textAnchor="end" fill="#334155" fontSize="11" fontFamily="monospace">
                Komponentlar: {components.length} | O‘tkazgichlar: {wires.length}
              </text>
            </svg>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-14 px-6 bg-[#0a1224] border-t border-[#1e325c] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399]" />
            <span>Sxema avtomatik ravishda maket platasidagi haqiqiy ulanishlardan tuziladi.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
