import React, { useState, useRef } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import {
  PRESET_COLORS,
  FONTS,
  PATTERNS,
  PRODUCTS
} from '../utils/constants';

import {
  Shirt,
  Cpu,
  Type,
  Upload,
  Save,
  FolderOpen,
  ArrowRight,
  Loader,
  Menu,
  X
} from 'lucide-react';

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function CustomizePanel() {
  const store = useCustomizerStore();

  const [activeTab, setActiveTab] = useState('product');
  const [designName, setDesignName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fileInputRef = useRef();

  const activeProductConfig = PRODUCTS[store.activeProduct];

  /* ================================
      LOGO UPLOAD
  ================================= */
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit');
      return;
    }

    setUploadingLogo(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(
        `${API_URL}/uploads`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      store.setLogo(res.data.url);

      alert('Logo uploaded successfully!');
    } catch (err) {
      console.warn('Upload failed. Using offline mode.');

      const reader = new FileReader();

      reader.onload = (event) => {
        store.setLogo(event.target.result);
      };

      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  };

  /* ================================
      SAVE DESIGN
  ================================= */
  const handleSaveDesign = async (e) => {
    e.preventDefault();

    if (!designName.trim()) {
      alert('Please enter design name');
      return;
    }

    await store.saveDesign(designName);

    setShowSaveDialog(false);
    setDesignName('');
  };

  const tabs = [
    {
      id: 'product',
      label: 'Style',
      icon: Shirt
    },
    {
      id: 'colors',
      label: 'Colors',
      icon: Cpu
    },
    {
      id: 'patterns',
      label: 'Pattern',
      icon: Shirt
    },
    {
      id: 'text',
      label: 'Text',
      icon: Type
    },
    {
      id: 'logo',
      label: 'Logo',
      icon: Upload
    }
  ];

  return (
    <div className="w-full h-full bg-brand-card/30 border-r border-brand-border/60 flex flex-col overflow-hidden">

      {/* =========================================
          MOBILE TOP BAR
      ========================================== */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-brand-border/60 bg-[#0B1220] sticky top-0 z-40">

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Design Studio
          </h2>

          <p className="text-[10px] text-brand-text/50 uppercase">
            Customize Products
          </p>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* =========================================
          MOBILE TABS
      ========================================== */}
      <div
        className={`
          lg:hidden
          transition-all
          duration-300
          overflow-hidden
          bg-[#0F172A]
          border-b border-brand-border/60
          ${
            mobileMenuOpen
              ? 'max-h-[500px] opacity-100'
              : 'max-h-0 opacity-0'
          }
        `}
      >
        <div className="grid grid-cols-3 gap-2 p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  flex flex-col items-center justify-center
                  gap-1.5
                  py-3
                  rounded-xl
                  border
                  transition-all
                  ${
                    activeTab === tab.id
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-dark/40 border-brand-border/50 text-brand-text/60'
                  }
                `}
              >
                <Icon className="w-4 h-4" />

                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================
          DESKTOP TABS
      ========================================== */}
      <div className="hidden lg:flex border-b border-brand-border/60 bg-brand-dark/20 text-xs font-semibold uppercase tracking-wider">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1
                flex
                flex-col
                items-center
                gap-1.5
                py-3
                hover:bg-brand-border/20
                transition-all
                border-b-2
                ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary bg-brand-card/40'
                    : 'border-transparent text-brand-text/60'
                }
              `}
            >
              <Icon className="w-4 h-4" />

              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================
          CONTENT
      ========================================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">

        {/* PRODUCT */}
        {activeTab === 'product' && (
          <div className="space-y-5">

            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">
              Select Base Garment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {Object.values(PRODUCTS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => store.setProduct(p.id)}
                  className={`
                    p-4
                    rounded-2xl
                    border
                    text-left
                    transition-all
                    ${
                      store.activeProduct === p.id
                        ? 'border-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/10'
                        : 'border-brand-border bg-brand-dark/30'
                    }
                  `}
                >
                  <div className="text-sm font-bold text-white uppercase">
                    {p.name}
                  </div>

                  <div className="text-[10px] text-brand-text/50 uppercase mt-1">
                    Base Price: ${p.basePrice}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-5 border-t border-brand-border/40">

              <button
                onClick={() => store.setView('dashboard')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-border/60 bg-brand-dark/30 hover:bg-brand-border/20 text-xs text-white font-semibold transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                Browse Saved Designs
              </button>

            </div>

          </div>
        )}

        {/* COLORS */}
        {activeTab === 'colors' && (
          <div className="space-y-5">

            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">
              Customize Material Zones
            </h3>

            {activeProductConfig.zones.map((zone) => (
              <div
                key={zone.id}
                className="p-4 rounded-2xl border border-brand-border/50 bg-brand-dark/20 space-y-4"
              >

                <div className="flex items-center justify-between gap-3">

                  <span className="text-xs font-bold uppercase text-white">
                    {zone.name}
                  </span>

                  <div className="flex items-center gap-2">

                    <input
                      type="color"
                      value={store.colors[zone.id] || '#ffffff'}
                      onChange={(e) =>
                        store.setColor(zone.id, e.target.value)
                      }
                      className="w-6 h-6 rounded cursor-pointer"
                    />

                    <span className="text-[10px] text-brand-text/50 font-mono uppercase">
                      {store.colors[zone.id]}
                    </span>

                  </div>

                </div>

                <div className="flex flex-wrap gap-2">

                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() =>
                        store.setColor(zone.id, color.hex)
                      }
                      className={`
                        w-7 h-7 rounded-full border transition-all
                        ${
                          store.colors[zone.id] === color.hex
                            ? 'border-white scale-110 ring-2 ring-brand-primary'
                            : 'border-transparent'
                        }
                      `}
                      style={{
                        backgroundColor: color.hex
                      }}
                    />
                  ))}

                </div>

              </div>
            ))}

          </div>
        )}

        {/* PATTERNS */}
        {activeTab === 'patterns' && (
          <div className="space-y-4">

            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">
              Fabric Graphic Sublimation
            </h3>

            <div className="space-y-3">

              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => store.setPattern(pattern.id)}
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    border
                    transition-all
                    ${
                      store.pattern === pattern.id
                        ? 'border-brand-primary bg-brand-primary/10 text-white'
                        : 'border-brand-border bg-brand-dark/30 text-brand-text/70'
                    }
                  `}
                >
                  <span className="text-xs font-bold uppercase">
                    {pattern.name}
                  </span>

                  {store.pattern === pattern.id && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  )}
                </button>
              ))}

            </div>

          </div>
        )}

        {/* TEXT */}
        {activeTab === 'text' && (
          <div className="space-y-5">

            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">
              Team Text Customizer
            </h3>

            <div className="space-y-4">

              <div>
                <label className="text-[10px] uppercase text-brand-text/50 font-bold">
                  Team Title
                </label>

                <input
                  type="text"
                  value={store.customText}
                  onChange={(e) =>
                    store.setCustomText(e.target.value)
                  }
                  placeholder="TIGERS"
                  className="glass-input mt-1 text-sm uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-brand-text/50 font-bold">
                  Preview Number
                </label>

                <input
                  type="text"
                  value={store.textNumber}
                  onChange={(e) =>
                    store.setTextNumber(e.target.value)
                  }
                  placeholder="99"
                  maxLength={3}
                  className="glass-input mt-1 text-sm"
                />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-2">

              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => store.setTextFont(font.id)}
                  className={`
                    py-3
                    rounded-xl
                    border
                    text-sm
                    transition-all
                    ${
                      store.textFont === font.id
                        ? 'border-brand-primary bg-brand-primary/10 text-white'
                        : 'border-brand-border bg-brand-dark/30 text-brand-text/70'
                    }
                  `}
                  style={{
                    fontFamily: font.family
                  }}
                >
                  {font.name}
                </button>
              ))}

            </div>

          </div>
        )}

        {/* LOGO */}
        {activeTab === 'logo' && (
          <div className="space-y-5">

            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">
              Team Logo Overlay
            </h3>

            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingLogo}
              className="w-full py-3 rounded-2xl border border-brand-border/60 bg-brand-dark/30 hover:bg-brand-border/20 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase text-white"
            >
              {uploadingLogo ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}

              {uploadingLogo
                ? 'Uploading...'
                : 'Choose Logo'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {store.logoUrl && (
              <div className="p-4 rounded-2xl border border-brand-border/50 bg-brand-dark/20">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3 overflow-hidden">

                    <img
                      src={store.logoUrl}
                      alt="logo"
                      className="w-10 h-10 object-contain rounded bg-white"
                    />

                    <span className="text-xs text-white truncate">
                      Active Logo
                    </span>

                  </div>

                  <button
                    onClick={() => store.setLogo(null)}
                    className="text-red-400 text-[10px] uppercase font-bold"
                  >
                    Remove
                  </button>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* =========================================
          FOOTER
      ========================================== */}
      <div className="p-4 border-t border-brand-border/60 bg-[#0B1220]">

        <button
          onClick={() => setShowSaveDialog(true)}
          className="w-full py-3 rounded-2xl bg-brand-primary hover:opacity-90 transition-all text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          Save Design Config
        </button>

      </div>

      {/* =========================================
          SAVE MODAL
      ========================================== */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

          <form
            onSubmit={handleSaveDesign}
            className="w-full max-w-md rounded-3xl border border-brand-border/60 bg-[#111827] p-6 space-y-5 shadow-2xl"
          >

            <div>

              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Save Your Design
              </h3>

              <p className="text-xs text-brand-text/60 mt-2">
                Save your current design configuration.
              </p>

            </div>

            <div>

              <label className="text-[10px] uppercase text-brand-text/50 font-bold">
                Design Name
              </label>

              <input
                type="text"
                required
                value={designName}
                onChange={(e) =>
                  setDesignName(e.target.value)
                }
                placeholder="Tigers Jersey 2026"
                className="glass-input mt-2 text-sm"
              />

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowSaveDialog(false)
                }
                className="flex-1 py-3 rounded-xl border border-brand-border/60 bg-brand-dark/30 text-white text-xs font-bold uppercase"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold uppercase flex items-center justify-center gap-2"
              >
                Save
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}