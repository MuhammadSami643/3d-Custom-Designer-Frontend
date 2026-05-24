import { create } from 'zustand';
import axios from 'axios';
import { PRODUCTS } from '../utils/constants';

const API_URL = 'http://localhost:3000/api';

// Set up default axios auth header from localStorage token
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const useCustomizerStore = create((set, get) => ({
  // Navigation & User Auth State
  activeView: 'landing', // 'landing', 'customizer', 'dashboard', 'login', 'register'
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: token || null,
  authError: null,
  authLoading: false,

  // Product Catalog State
  products: [],
  productsLoading: false,

  // Customizer State
  activeProduct: 'jersey', // 'jersey' or 'cap'
  colors: { ...PRODUCTS.jersey.defaultColors },
  pattern: 'solid',
  logoUrl: null,
  logoScale: 0.15,
  logoPosition: { x: 0, y: 0.05 }, // Centered on chest
  
  customText: 'TEAM NAME',
  textNumber: '00',
  textColor: '#FFFFFF',
  textFont: 'varsity',
  textScale: 0.15,
  textPosition: { x: 0, y: -0.1 },

  // Roster state (spreadsheet)
  roster: [
    { id: 1, name: 'COACH', number: '00', size: 'L', quantity: 1 }
  ],

  // Load list of designs
  designs: [],
  designsLoading: false,
  activeDesignId: null,

  // Methods
  setView: (view) => set({ activeView: view }),

  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const res = await axios.get(`${API_URL}/products`);
      set({ products: res.data, productsLoading: false });
    } catch (err) {
      console.warn('API Products fetch failed. Falling back to local static catalog constants:', err);
      const localProducts = Object.values(PRODUCTS);
      set({ products: localProducts, productsLoading: false });
    }
  },
  
  setProduct: (productId) => set({
    activeProduct: productId,
    colors: { ...PRODUCTS[productId].defaultColors }
  }),

  setColor: (zoneId, hexColor) => set((state) => ({
    colors: { ...state.colors, [zoneId]: hexColor }
  })),

  setPattern: (patternId) => set({ pattern: patternId }),
  
  setLogo: (url) => set({ logoUrl: url }),
  setLogoScale: (scale) => set({ logoScale: scale }),
  setLogoPosition: (pos) => set({ logoPosition: pos }),

  setCustomText: (text) => set({ customText: text }),
  setTextNumber: (num) => set({ textNumber: num }),
  setTextColor: (color) => set({ textColor: color }),
  setTextFont: (fontId) => set({ textFont: fontId }),
  setTextScale: (scale) => set({ textScale: scale }),
  setTextPosition: (pos) => set({ textPosition: pos }),

  // Roster Actions
  updateRosterRow: (id, field, value) => set((state) => ({
    roster: state.roster.map((row) => 
      row.id === id ? { ...row, [field]: value } : row
    )
  })),

  addRosterRow: () => set((state) => {
    const nextId = state.roster.length > 0 ? Math.max(...state.roster.map(r => r.id)) + 1 : 1;
    return {
      roster: [...state.roster, { id: nextId, name: '', number: '', size: 'M', quantity: 1 }]
    };
  }),

  deleteRosterRow: (id) => set((state) => ({
    roster: state.roster.filter((row) => row.id !== id)
  })),

  clearRoster: () => set({
    roster: [{ id: 1, name: '', number: '', size: 'M', quantity: 1 }]
  }),

  // Auth Operations
  register: async (username, email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      const { user, token } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, activeView: 'customizer', authLoading: false });
    } catch (err) {
      set({ 
        authError: err.response?.data?.message || 'Registration failed. Try again.', 
        authLoading: false 
      });
    }
  },

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, activeView: 'customizer', authLoading: false });
      // Reload user designs
      get().fetchUserDesigns();
    } catch (err) {
      set({ 
        authError: err.response?.data?.message || 'Invalid email or password.', 
        authLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null, activeView: 'landing', designs: [], activeDesignId: null });
  },

  // Backend Design Operations (LocalStorage Fallback included)
  saveDesign: async (designName) => {
    const state = get();
    const designData = {
      name: designName || `${PRODUCTS[state.activeProduct].name} Custom`,
      productType: state.activeProduct,
      colors: state.colors,
      pattern: state.pattern,
      logoUrl: state.logoUrl,
      logoScale: state.logoScale,
      logoPosition: state.logoPosition,
      customText: state.customText,
      textNumber: state.textNumber,
      textColor: state.textColor,
      textFont: state.textFont,
      textScale: state.textScale,
      textPosition: state.textPosition,
      roster: state.roster
    };

    // 1. Try backend API if logged in
    if (state.token) {
      try {
        let res;
        if (state.activeDesignId) {
          res = await axios.put(`${API_URL}/designs/${state.activeDesignId}`, designData);
        } else {
          res = await axios.post(`${API_URL}/designs`, designData);
        }
        set({ activeDesignId: res.data._id });
        await get().fetchUserDesigns();
        alert('Design saved successfully to your cloud profile!');
        return;
      } catch (err) {
        console.warn('API Save failed, falling back to LocalStorage:', err);
      }
    }

    // 2. LocalStorage Fallback (if offline/not logged in/API fail)
    const localDesigns = JSON.parse(localStorage.getItem('local_designs')) || [];
    if (state.activeDesignId) {
      const idx = localDesigns.findIndex(d => d.id === state.activeDesignId);
      if (idx !== -1) {
        localDesigns[idx] = { ...designData, id: state.activeDesignId, updatedAt: new Date() };
      } else {
        localDesigns.push({ ...designData, id: state.activeDesignId, updatedAt: new Date() });
      }
    } else {
      const newLocalId = 'local_' + Math.random().toString(36).substr(2, 9);
      localDesigns.push({ ...designData, id: newLocalId, updatedAt: new Date() });
      set({ activeDesignId: newLocalId });
    }
    localStorage.setItem('local_designs', JSON.stringify(localDesigns));
    alert('Design saved locally on your device!');
  },

  fetchUserDesigns: async () => {
    const state = get();
    set({ designsLoading: true });
    
    // Read local designs
    const localDesigns = JSON.parse(localStorage.getItem('local_designs')) || [];
    let allDesigns = [...localDesigns.map(d => ({ ...d, _id: d.id, isLocal: true }))];

    if (state.token) {
      try {
        const res = await axios.get(`${API_URL}/designs`);
        const cloudDesigns = res.data;
        allDesigns = [...cloudDesigns, ...allDesigns];
      } catch (err) {
        console.warn('Could not fetch cloud designs. Offline mode.');
      }
    }

    set({ designs: allDesigns, designsLoading: false });
  },

  loadDesign: (design) => {
    set({
      activeDesignId: design._id || design.id,
      activeProduct: design.productType,
      colors: design.colors,
      pattern: design.pattern || 'solid',
      logoUrl: design.logoUrl,
      logoScale: design.logoScale || 0.15,
      logoPosition: design.logoPosition || { x: 0, y: 0.05 },
      customText: design.customText || '',
      textNumber: design.textNumber || '',
      textColor: design.textColor || '#FFFFFF',
      textFont: design.textFont || 'varsity',
      textScale: design.textScale || 0.15,
      textPosition: design.textPosition || { x: 0, y: -0.1 },
      roster: design.roster || [{ id: 1, name: '', number: '', size: 'M', quantity: 1 }],
      activeView: 'customizer'
    });
  },

  deleteDesign: async (designId) => {
    const state = get();
    
    // Check if local design
    if (String(designId).startsWith('local_')) {
      const localDesigns = JSON.parse(localStorage.getItem('local_designs')) || [];
      const filtered = localDesigns.filter(d => d.id !== designId);
      localStorage.setItem('local_designs', JSON.stringify(filtered));
      if (state.activeDesignId === designId) {
        set({ activeDesignId: null });
      }
      get().fetchUserDesigns();
      alert('Local design deleted.');
      return;
    }

    if (state.token) {
      try {
        await axios.delete(`${API_URL}/designs/${designId}`);
        if (state.activeDesignId === designId) {
          set({ activeDesignId: null });
        }
        await get().fetchUserDesigns();
        alert('Cloud design deleted successfully.');
      } catch (err) {
        alert('Could not delete cloud design.');
      }
    }
  },

  // Submit Quote Request
  submitQuote: async (contactDetails) => {
  const state = get();

  const payload = {
    designId: state.activeDesignId || "unsaved_design",
    contactDetails: {
      name: contactDetails?.name,
      email: contactDetails?.email,
      phone: contactDetails?.phone,
      teamName: contactDetails?.teamName,
      notes: contactDetails?.notes || ""
    },
    designDetails: {
      productType: state.activeProduct,
      colors: state.colors,
      pattern: state.pattern,
      logoUrl: state.logoUrl,
      customText: state.customText,
      textNumber: state.textNumber,
      textColor: state.textColor,
      textFont: state.textFont
    },
    roster: state.roster
  };

  // 🧠 DEBUG (VERY IMPORTANT)
  console.log("📦 SUBMIT QUOTE PAYLOAD:", payload);

  try {
    const res = await axios.post(`${API_URL}/orders`, payload);

    console.log("✅ ORDER SUCCESS:", res.data);

    alert("Your customization quote has been submitted!");
    return res.data;

  } catch (err) {
    console.error("❌ ORDER FAILED:", err.response?.data || err.message);

    // ❌ NO FAKE SUCCESS (REMOVE YOUR MOCK LOGIC)
    alert(
      err.response?.data?.message ||
      "Order submission failed. Check backend."
    );

    throw err;
  }
},
}));
