import React, { useState, useRef } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { PRESET_COLORS, FONTS, PATTERNS, PRODUCTS } from '../utils/constants';
import { Shirt, Cpu, Type, Upload, Save, FolderOpen, ArrowRight, Loader } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function CustomizePanel() {
  const store = useCustomizerStore();
  const [activeTab, setActiveTab] = useState('product'); // 'product', 'colors', 'patterns', 'text', 'logo'
  const [designName, setDesignName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef();

  const activeProductConfig = PRODUCTS[store.activeProduct];

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds the 2MB limit.');
      return;
    }

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Upload to backend upload service (Cloudinary)
      const res = await axios.post(`${API_URL}/uploads`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // 2. Set uploaded logo URL in store
      store.setLogo(res.data.url);
      alert('Logo uploaded and applied successfully!');
    } catch (err) {
      console.warn('API upload failed, reading locally as Base64...');
      // Fallback: Read file locally as DataURL if server is offline or fails
      const reader = new FileReader();
      reader.onload = (event) => {
        store.setLogo(event.target.result);
        alert('Applied logo locally (Offline mode)!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveDesign = async (e) => {
    e.preventDefault();
    if (!designName.trim()) {
      alert('Please enter a name for your design.');
      return;
    }
    await store.saveDesign(designName);
    setShowSaveDialog(false);
    setDesignName('');
  };

  return (
    <div className="flex flex-col h-full bg-brand-card/30 border-r border-brand-border/60">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-brand-border/60 bg-brand-dark/20 text-xs font-semibold uppercase tracking-wider">
        {[
          { id: 'product', label: 'Style', icon: Shirt },
          { id: 'colors', label: 'Colors', icon: Cpu },
          { id: 'patterns', label: 'Pattern', icon: Shirt },
          { id: 'text', label: 'Text', icon: Type },
          { id: 'logo', label: 'Logo', icon: Upload }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 hover:bg-brand-border/20 transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-brand-primary text-brand-primary bg-brand-card/40' 
                  : 'border-transparent text-brand-text/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-grow p-5 overflow-y-auto scrollbar-thin space-y-6">
        
        {/* Style selection */}
        {activeTab === 'product' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">Select Base Garment</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(PRODUCTS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => store.setProduct(p.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    store.activeProduct === p.id 
                      ? 'border-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/10 text-white' 
                      : 'border-brand-border bg-brand-dark/30 text-brand-text/75 hover:bg-brand-border/45'
                  }`}
                >
                  <span className="font-bold text-sm tracking-wide">{p.name}</span>
                  <span className="text-[10px] text-brand-text/50 mt-1 uppercase">Base Price: ${p.basePrice}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-border/40">
              <h4 className="text-xs font-bold text-brand-text/75 uppercase mb-3">Saved Designs</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => store.setView('dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-brand-border/60 hover:bg-brand-border border border-brand-border/80 text-brand-text rounded-lg text-xs font-semibold transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Browse Saved Designs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Color picker per zone */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">Customize Material Zones</h3>
            
            {activeProductConfig.zones.map((zone) => (
              <div key={zone.id} className="space-y-2 border-b border-brand-border/30 pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-brand-text/90 tracking-wide">{zone.name}</span>
                  <div className="flex items-center gap-1">
                    {/* Custom HTML Color Picker */}
                    <input
                      type="color"
                      value={store.colors[zone.id] || '#FFFFFF'}
                      onChange={(e) => store.setColor(zone.id, e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border border-brand-border/80 bg-transparent p-0 overflow-hidden"
                    />
                    <span className="text-[10px] font-mono text-brand-text/50 uppercase">{store.colors[zone.id]}</span>
                  </div>
                </div>

                {/* Preset Palettes */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => store.setColor(zone.id, color.hex)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        store.colors[zone.id] === color.hex 
                          ? 'border-white scale-110 shadow-md shadow-black/40 ring-1 ring-brand-primary' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pattern customization */}
        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">Fabric Graphic Sublimation</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => store.setPattern(pattern.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    store.pattern === pattern.id 
                      ? 'border-brand-primary bg-brand-primary/5 text-white' 
                      : 'border-brand-border bg-brand-dark/30 text-brand-text/75 hover:bg-brand-border/30'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide">{pattern.name}</span>
                  {store.pattern === pattern.id && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Text/Numbers editor */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">Team Text Customizer</h3>
            
            {/* Inputs */}
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50">Team Title</label>
                <input
                  type="text"
                  value={store.customText}
                  onChange={(e) => store.setCustomText(e.target.value)}
                  className="glass-input text-sm uppercase"
                  placeholder="e.g. TIGERS"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50">Preview Number</label>
                <input
                  type="text"
                  value={store.textNumber}
                  onChange={(e) => store.setTextNumber(e.target.value)}
                  className="glass-input text-sm"
                  placeholder="e.g. 99"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50">Font Family</label>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => store.setTextFont(font.id)}
                    className={`py-2 rounded border text-center transition-all ${
                      store.textFont === font.id 
                        ? 'border-brand-primary bg-brand-primary/10 text-white' 
                        : 'border-brand-border bg-brand-dark/30 text-brand-text/70 hover:bg-brand-border/30'
                    }`}
                    style={{ fontFamily: font.family }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50">Text Fill Color</label>
                <input
                  type="color"
                  value={store.textColor}
                  onChange={(e) => store.setTextColor(e.target.value)}
                  className="w-4 h-4 rounded cursor-pointer border border-brand-border/60 bg-transparent p-0 overflow-hidden"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => store.setTextColor(color.hex)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      store.textColor === color.hex ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Range Sliders */}
            <div className="space-y-3.5 pt-3 border-t border-brand-border/30">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
                  <span>Scale / Size</span>
                  <span className="font-mono text-brand-primary">{Math.round(store.textScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.01"
                  value={store.textScale}
                  onChange={(e) => store.setTextScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
                  <span>Vertical Align</span>
                  <span className="font-mono text-brand-primary">{store.textPosition.y}</span>
                </div>
                <input
                  type="range"
                  min="-0.2"
                  max="0.2"
                  step="0.01"
                  value={store.textPosition.y}
                  onChange={(e) => store.setTextPosition({ ...store.textPosition, y: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Logo settings */}
        {activeTab === 'logo' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">Team Logo Overlay</h3>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50 block">Upload Logo (PNG/JPG, Max 2MB)</label>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadingLogo}
                  className="glass-btn-secondary text-xs py-2 w-full flex items-center justify-center gap-2"
                >
                  {uploadingLogo ? (
                    <Loader className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {uploadingLogo ? 'UPLOADING...' : 'CHOOSE LOGO FILE'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {store.logoUrl && (
                <div className="relative p-2 rounded border border-brand-border bg-brand-dark/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={store.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded border border-brand-border bg-white" />
                    <span className="text-[10px] truncate text-brand-text/70 uppercase">Active_Logo.png</span>
                  </div>
                  <button 
                    onClick={() => store.setLogo(null)}
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wide"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Draggable sliders if logo exists */}
            {store.logoUrl && (
              <div className="space-y-3.5 pt-3 border-t border-brand-border/30">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
                    <span>Logo Scale</span>
                    <span className="font-mono text-brand-primary">{Math.round(store.logoScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.01"
                    value={store.logoScale}
                    onChange={(e) => store.setLogoScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
                    <span>Horizontal Offset</span>
                    <span className="font-mono text-brand-primary">{store.logoPosition.x}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.2"
                    max="0.2"
                    step="0.01"
                    value={store.logoPosition.x}
                    onChange={(e) => store.setLogoPosition({ ...store.logoPosition, x: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
                    <span>Vertical Offset</span>
                    <span className="font-mono text-brand-primary">{store.logoPosition.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.2"
                    max="0.2"
                    step="0.01"
                    value={store.logoPosition.y}
                    onChange={(e) => store.setLogoPosition({ ...store.logoPosition, y: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Save design triggers */}
      <div className="p-4 border-t border-brand-border/60 bg-brand-dark/15 flex gap-2">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex-grow glass-btn-primary py-2.5 text-xs tracking-wider flex justify-center items-center gap-1.5 shadow"
        >
          <Save className="w-4 h-4" />
          SAVE DESIGN CONFIG
        </button>
      </div>

      {/* Save Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveDesign} className="glass-panel w-full max-w-sm p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold tracking-wider text-brand-primary uppercase">Save Your Design</h3>
            <p className="text-xs text-brand-text/60">
              Save your current 3D configurator parameters. You can restore this design state at any time from the dashboard!
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-brand-text/50 font-bold">Design Name</label>
              <input
                type="text"
                required
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="e.g. Tigers Jersey Home 2026"
                className="glass-input text-xs"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="glass-btn-secondary px-3 py-1.5 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-btn-primary px-3 py-1.5 text-xs uppercase flex items-center gap-1"
              >
                Save
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
