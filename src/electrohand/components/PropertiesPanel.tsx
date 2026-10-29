import React from 'react';
import { ComponentInstance, ComponentSpecification } from '../types';
import { COMPONENT_CATALOG } from '../data/componentCatalog';
import {
  RotateCw,
  Trash2,
  Sliders,
  Info,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: ComponentInstance | null;
  onUpdateParameters: (compId: string, params: Record<string, number | string>) => void;
  onRotateComponent: (compId: string) => void;
  onDeleteComponent: (compId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateParameters,
  onRotateComponent,
  onDeleteComponent
}) => {
  if (!selectedComponent) {
    return (
      <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full">
        <Cpu className="w-10 h-10 mb-3 opacity-40 text-cyan-400" />
        <p className="text-xs font-medium text-slate-300">Komponent tanlanmagan</p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
          Xususiyatlarini ko‘rish va sozlash uchun ishchi stoldagi istalgan komponentni bosing.
        </p>
      </div>
    );
  }

  const spec: ComponentSpecification = COMPONENT_CATALOG[selectedComponent.type];

  const handleParamChange = (key: string, val: number | string) => {
    onUpdateParameters(selectedComponent.id, {
      ...selectedComponent.parameters,
      [key]: val
    });
  };

  return (
    <div className="p-4 space-y-4 text-slate-200 select-none overflow-y-auto max-h-[calc(100vh-8rem)]">
      
      {/* Header: Title, Code, Actions */}
      <div className="pb-3 border-b border-[#1e325c]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
            {spec.code}
          </span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRotateComponent(selectedComponent.id)}
              title="Komponentni 90° ga burish"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteComponent(selectedComponent.id)}
              title="Komponentni o‘chirish"
              className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-600/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white mt-2">{spec.nameUz}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
          {spec.descriptionUz}
        </p>
      </div>

      {/* Parameter Editor Section */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Parametrlar
        </h4>

        <div className="space-y-2.5 bg-[#0b1328] p-3 rounded-xl border border-[#1e325c]">
          {/* Resistor resistance */}
          {'resistance' in selectedComponent.parameters && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Qarshilik (R):</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {selectedComponent.parameters.resistance} Ω
                </span>
              </div>
              <input
                type="number"
                min="1"
                max="1000000"
                value={selectedComponent.parameters.resistance as number}
                onChange={e => handleParamChange('resistance', parseFloat(e.target.value) || 220)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#070d19] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          )}

          {/* Voltage Source voltage */}
          {'voltage' in selectedComponent.parameters && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Kuchlanish (V):</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {selectedComponent.parameters.voltage} V
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                max="48"
                value={selectedComponent.parameters.voltage as number}
                onChange={e => handleParamChange('voltage', parseFloat(e.target.value) || 5.0)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#070d19] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          )}

          {/* Potentiometer Wiper Ratio */}
          {'wiper_ratio' in selectedComponent.parameters && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Reostat holati:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {Math.round(((selectedComponent.parameters.wiper_ratio as number) || 0.5) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
                value={(selectedComponent.parameters.wiper_ratio as number) || 0.5}
                onChange={e => handleParamChange('wiper_ratio', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {/* Orientation / Rotation */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Burilish burchagi:</span>
            <span className="font-mono font-bold text-slate-200">{selectedComponent.rotation}°</span>
          </div>
        </div>
      </div>

      {/* Pinout Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Oyoqlari (Pinout)
        </h4>

        <div className="rounded-xl border border-[#1e325c] bg-[#0b1328] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1a38] text-[10px] text-slate-400 uppercase font-mono border-b border-[#1e325c]">
              <tr>
                <th className="px-2.5 py-1.5">Pin</th>
                <th className="px-2.5 py-1.5">Vazifasi</th>
                <th className="px-2.5 py-1.5 text-right">Ulanish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {spec.pins.map(pin => {
                const holeConn = selectedComponent.pinConnections[pin.id];
                return (
                  <tr key={pin.id} className="hover:bg-slate-800/40">
                    <td className="px-2.5 py-1.5 font-bold text-cyan-300">{pin.label}</td>
                    <td className="px-2.5 py-1.5 text-slate-400 text-[10px]">{pin.descriptionUz}</td>
                    <td className="px-2.5 py-1.5 text-right">
                      {holeConn ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> {holeConn}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <XCircle className="w-3 h-3" /> Ulanmagan
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Datasheet Snippet */}
      <div className="p-3 rounded-xl bg-[#0e1a38]/80 border border-[#1e325c] text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Texnik Ma’lumotnoma (Datasheet):</span>
        </div>
        <p className="text-slate-400 leading-relaxed">{spec.datasheetSnippetUz}</p>
      </div>

    </div>
  );
};
