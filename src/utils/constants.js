// Preset colors for product customization
export const PRESET_COLORS = [
  { name: 'Crimson Red', hex: '#BE123C' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Varsity Gold', hex: '#F59E0B' },
  { name: 'Athletic Orange', hex: '#EA580C' },
  { name: 'Charcoal Grey', hex: '#374151' },
  { name: 'Classic Black', hex: '#111827' },
  { name: 'Clean White', hex: '#F9FAFB' },
  { name: 'Neon Lime', hex: '#84CC16' },
  { name: 'Bright Pink', hex: '#EC4899' }
];

// Product catalog metadata
export const PRODUCTS = {
  jersey: {
    id: 'jersey',
    name: 'JUICE Sublimated Jersey',
    category: 'jerseys',
    basePrice: 59.99,
    modelPath: '/shirt_baked.glb',
    zones: [
      { id: 'body', name: 'Body Panel' },
      { id: 'sleeves', name: 'Sleeves' },
      { id: 'collar', name: 'Collar & Trim' }
    ],
    defaultColors: {
      body: '#1E3A8A', // Navy
      sleeves: '#BE123C', // Crimson
      collar: '#F59E0B' // Gold
    }
  },
  cap: {
    id: 'cap',
    name: 'Pro-Stitch Baseball Cap',
    category: 'caps',
    basePrice: 24.99,
    modelPath: 'procedural', // Cap will be rendered procedurally
    zones: [
      { id: 'crown', name: 'Crown Panels' },
      { id: 'visor', name: 'Visor / Brim' },
      { id: 'button', name: 'Top Button' },
      { id: 'eyelets', name: 'Eyelets' }
    ],
    defaultColors: {
      crown: '#1E3A8A', // Navy
      visor: '#BE123C', // Crimson
      button: '#111827', // Black
      eyelets: '#F59E0B' // Gold
    }
  }
};

// Font styles for custom text
export const FONTS = [
  { id: 'varsity', name: 'Varsity Bold', family: 'Impact, Arial Black, sans-serif' },
  { id: 'sans', name: 'Sleek Sans', family: 'Outfit, Inter, sans-serif' },
  { id: 'serif', name: 'Classic Serif', family: 'Georgia, serif' },
  { id: 'script', name: 'Varsity Script', family: 'Brush Script MT, cursive' }
];

// Sublimation preset graphic patterns
export const PATTERNS = [
  { id: 'solid', name: 'Solid Color' },
  { id: 'vertical-stripes', name: 'Vertical Stripes' },
  { id: 'horizontal-stripes', name: 'Horizontal Stripes' },
  { id: 'chevron', name: 'Chevron V' },
  { id: 'camo', name: 'Digital Camo' }
];

// Available apparel sizes
export const SIZES = [
  'YXS', 'YS', 'YM', 'YL', 'YXL', // Youth sizes
  'S', 'M', 'L', 'XL', '2XL', '3XL' // Adult sizes
];
