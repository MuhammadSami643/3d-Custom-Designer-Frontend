import React from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Palette, FolderGit } from 'lucide-react';

export default function Landing() {
  const store = useCustomizerStore();

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-semibold text-brand-primary tracking-wide uppercase animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          The Future of Uniform Customization
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-tight">
          ENGINEER YOUR TEAM UNIFORMS IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">REAL-TIME 3D</span>
        </h1>
        
        <p className="text-sm md:text-md text-brand-text/60 max-w-2xl mx-auto leading-relaxed">
          Replicate professional sublimate printing options. Choose your colors, overlay custom text, upload your official logo, size your team, and receive an instant quote in our fully immersive 3D studio.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            onClick={() => {
              store.setProduct('jersey');
              store.setView('customizer');
            }}
            className="glass-btn-primary px-8 py-3.5 text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          >
            LAUNCH CUSTOMIZER STUDIO
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </button>
          
          <button
            onClick={() => store.setView('dashboard')}
            className="glass-btn-secondary px-8 py-3.5 text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          >
            <FolderGit className="w-4 h-4" />
            BROWSE SAVED WORK
          </button>
        </div>
      </section>

      {/* Product Categories */}
      <section className="px-6 py-10 max-w-5xl mx-auto w-full space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary text-center">Available Base Garments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Jersey Card */}
          <div className="glass-panel p-6 rounded-2xl group hover:border-brand-primary/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider bg-brand-accent/10 px-2 py-0.5 rounded">JUICE Sublimation</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-[#F3F4F6]">Custom Athletic Jersey</h3>
              <p className="text-xs text-brand-text/60">
                Premium multi-zone jerseys with side panel details, customizable body stripes, chest fonts, and dynamic logo mapping.
              </p>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-mono text-brand-text/40 uppercase">Starting at $59.99 / unit</span>
              <button
                onClick={() => {
                  store.setProduct('jersey');
                  store.setView('customizer');
                }}
                className="text-xs font-bold text-brand-primary group-hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                Customize 3D Jersey
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cap Card */}
          <div className="glass-panel p-6 rounded-2xl group hover:border-brand-primary/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider bg-brand-secondary/10 px-2 py-0.5 rounded">Pro Embroidery</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-[#F3F4F6]">Pro Baseball Cap</h3>
              <p className="text-xs text-brand-text/60">
                Custom cap featuring multi-panel coloring, top button, and eyelet stitching configurations. Fully adjustable in 3D.
              </p>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-mono text-brand-text/40 uppercase">Starting at $24.99 / unit</span>
              <button
                onClick={() => {
                  store.setProduct('cap');
                  store.setView('customizer');
                }}
                className="text-xs font-bold text-brand-primary group-hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                Customize 3D Cap
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-brand-dark/20 border-t border-brand-border/40 py-16 px-6 mt-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="p-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-brand-primary">
              <Palette className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-[#F3F4F6]">Infinite Palettes</h4>
            <p className="text-xs text-brand-text/60 leading-relaxed">
              Design with standard color swatches or dial in exact custom hexadecimal hues to match your organization's style guide.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="p-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-brand-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-[#F3F4F6]">Sublimated Patterns</h4>
            <p className="text-xs text-brand-text/60 leading-relaxed">
              Overlay custom graphic textures, such as camo prints or retro chevrons, directly into the uniform's fabric layers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="p-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-brand-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-[#F3F4F6]">Roster Blueprinting</h4>
            <p className="text-xs text-brand-text/60 leading-relaxed">
              Input player names, jersey numbers, and custom sizes (Youth to Adult 3XL) directly inside our spreadsheet editor.
            </p>
          </div>

        </div>
          <div className="p-4 bg-brand-dark/20 border-t border-brand-border/40 text-center text-[10px] text-brand-text/40 print:hidden">
          Designed By Muhammad Sami
        </div>
      </section>
    </div>
  );
}
