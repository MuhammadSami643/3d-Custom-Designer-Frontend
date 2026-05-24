import React, { useState } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { PRODUCTS } from '../utils/constants';
import { Info, Layers, Palette, Type, Image as ImageIcon, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export default function DesignSummary() {
  const store = useCustomizerStore();
  const [isOpen, setIsOpen] = useState(true);

  const activeProduct = PRODUCTS[store.activeProduct];
  
  if (!activeProduct) return null;

  return (
    <div 
      className={`absolute top-20 right-4 z-10 flex items-start transition-all duration-500 ease-out h-[calc(100%-120px)] ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-12px)]'
      }`}
    >
      {/* Slide Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-6 flex items-center justify-center w-8 h-12 rounded-l-xl bg-brand-card/90 hover:bg-brand-primary backdrop-blur-md border-y border-l border-brand-border/80 text-brand-text hover:text-white transition-all shadow-md shadow-black/30 group cursor-pointer focus:outline-none pointer-events-auto"
        title={isOpen ? "Collapse Summary" : "Expand Summary"}
      >
        {isOpen ? (
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        ) : (
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        )}
      </button>

      {/* Main Glass Panel */}
      <div className="w-72 h-full bg-brand-card/90 backdrop-blur-md border border-brand-border/80 rounded-r-2xl rounded-bl-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="px-4 py-3 bg-brand-dark/45 border-b border-brand-border/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-brand-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F3F4F6]">Design Blueprint</span>
          </div>
          <span className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono">
            LIVE
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow p-4 overflow-y-auto scrollbar-thin space-y-4 text-xs">
          {/* Style */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-brand-text/50">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Garment Style</span>
            </div>
            <div className="bg-brand-dark/30 border border-brand-border/40 p-2.5 rounded-xl space-y-0.5">
              <h4 className="font-bold text-[#F3F4F6] uppercase tracking-wide truncate">{activeProduct.name}</h4>
              <p className="text-[9px] text-brand-text/45 uppercase tracking-wide">Category: {activeProduct.category}</p>
            </div>
          </div>

          {/* Color Zones */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-brand-text/50">
              <Palette className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Custom Color Zones</span>
            </div>
            <div className="bg-brand-dark/30 border border-brand-border/40 p-2.5 rounded-xl space-y-2">
              {activeProduct.zones.map((zone) => {
                const hexColor = store.colors[zone.id] || '#FFFFFF';
                return (
                  <div key={zone.id} className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-brand-text/75 uppercase truncate">{zone.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: hexColor }}
                      />
                      <span className="font-mono text-[9px] text-brand-text/50 uppercase">{hexColor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preset Pattern (only for Jersey) */}
          {store.activeProduct === 'jersey' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-brand-text/50">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Fabric Sublimation</span>
              </div>
              <div className="bg-brand-dark/30 border border-brand-border/40 p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-medium text-brand-text/75 uppercase">Pattern Style</span>
                <span className="font-bold text-brand-primary uppercase text-[10px] bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">
                  {store.pattern}
                </span>
              </div>
            </div>
          )}

          {/* Text Overlays (Only for Jersey) */}
          {store.activeProduct === 'jersey' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-brand-text/50">
                <Type className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Dynamic Text Layers</span>
              </div>
              <div className="bg-brand-dark/30 border border-brand-border/40 p-2.5 rounded-xl space-y-2.5">
                <div>
                  <span className="text-[9px] text-brand-text/40 uppercase block mb-0.5">Team Name</span>
                  {store.customText ? (
                    <div className="font-bold text-brand-text text-sm uppercase truncate">
                      "{store.customText}"
                    </div>
                  ) : (
                    <span className="italic text-brand-text/30 text-[10px]">Not Specified</span>
                  )}
                </div>
                <div>
                  <span className="text-[9px] text-brand-text/40 uppercase block mb-0.5">Player Number</span>
                  {store.textNumber ? (
                    <span className="font-mono font-bold text-brand-text text-sm">
                      {store.textNumber}
                    </span>
                  ) : (
                    <span className="italic text-brand-text/30 text-[10px]">Not Specified</span>
                  )}
                </div>
                { (store.customText || store.textNumber) && (
                  <div className="pt-2 border-t border-brand-border/30 flex justify-between text-[9px] text-brand-text/45 uppercase tracking-wide">
                    <span>Font: {store.textFont}</span>
                    <div className="flex items-center gap-1">
                      <span>Color:</span>
                      <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: store.textColor }} />
                      <span className="font-mono">{store.textColor}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team Logo Overlay (Only for Jersey) */}
          {store.activeProduct === 'jersey' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-brand-text/50">
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Sublimated Logo</span>
              </div>
              <div className="bg-brand-dark/30 border border-brand-border/40 p-2.5 rounded-xl">
                {store.logoUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-brand-border/60 bg-white p-0.5 overflow-hidden flex-shrink-0 shadow-inner">
                      <img src={store.logoUrl} alt="Team Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-[#F3F4F6] text-[10px] block truncate uppercase">Custom_Logo.png</span>
                      <span className="text-[8px] text-brand-accent font-semibold uppercase tracking-wider">Applied Successfully</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 italic text-brand-text/30 text-[10px]">
                    No Team Logo Uploaded
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-brand-dark/25 border-t border-brand-border/50 flex items-start gap-1.5 text-[9px] text-brand-text/40">
          <Info className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
          <p className="leading-normal">
            Pricing estimate automatically computes setup fees and roster adjustments.
          </p>
        </div>
      </div>
    </div>
  );
}
