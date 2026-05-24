import { FONTS } from './constants';

/**
 * Draws the customized jersey graphics onto an offscreen canvas
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} state - Customize panel settings
 * @param {Function} onUpdate - Callback to update Three.js texture
 */
export const drawJerseyTexture = (canvas, state, onUpdate) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Base/Body Color
  ctx.fillStyle = state.colors.body || '#1E3A8A';
  ctx.fillRect(0, 0, w, h);

  // 2. Draw Sleeve Areas (UV coordinate mapping representation)
  // Usually, a cylinder maps UV horizontally from 0 to 1.
  // We can add secondary styling accents (like side panels/stripes) to make the jersey look premium.
  ctx.fillStyle = state.colors.sleeves || '#BE123C';
  // Side panel stripes on left and right edges (which wrap to the sides/back)
  ctx.fillRect(0, 0, w * 0.08, h);
  ctx.fillRect(w * 0.92, 0, w * 0.08, h);

  // 3. Draw Selected Pattern Overlay
  ctx.fillStyle = state.colors.collar || '#F59E0B';
  const accentColor = state.colors.collar || '#F59E0B';

  if (state.pattern === 'vertical-stripes') {
    ctx.fillStyle = accentColor + '44'; // Add transparency to blend
    const stripeWidth = w / 20;
    for (let i = 0; i < 20; i += 2) {
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
    }
  } else if (state.pattern === 'horizontal-stripes') {
    ctx.fillStyle = accentColor + '44';
    const stripeHeight = h / 20;
    for (let i = 0; i < 20; i += 2) {
      ctx.fillRect(0, i * stripeHeight, w, stripeHeight);
    }
  } else if (state.pattern === 'chevron') {
    ctx.strokeStyle = accentColor + '66';
    ctx.lineWidth = 20;
    ctx.lineJoin = 'round';
    const numChevrons = 6;
    for (let i = 0; i < numChevrons; i++) {
      const y = (h / numChevrons) * i + 100;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, y);
      ctx.lineTo(w * 0.5, y + 120);
      ctx.lineTo(w * 0.9, y);
      ctx.stroke();
    }
  } else if (state.pattern === 'camo') {
    // Subdued digital camo blocks
    ctx.fillStyle = accentColor + '22';
    for (let i = 0; i < 150; i++) {
      const blockW = Math.random() * 60 + 20;
      const blockH = Math.random() * 60 + 20;
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, blockW, blockH);
    }
    // Add a third color block for camo depth
    ctx.fillStyle = (state.colors.sleeves || '#BE123C') + '22';
    for (let i = 0; i < 100; i++) {
      const blockW = Math.random() * 50 + 20;
      const blockH = Math.random() * 50 + 20;
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, blockW, blockH);
    }
  }

  // 4. Draw Custom Text (Team Name) on the BACK of the shirt
  // The back center wraps around at u = 0.0 / u = 1.0. We draw twice to wrap seams seamlessly.
  if (state.customText) {
    const activeFont = FONTS.find(f => f.id === state.textFont) || FONTS[0];
    ctx.save();
    
    // Position text: centered at back (x = 0 / w), y is upper back offset
    const textX = 0 + (state.textPosition.x * w);
    const textY = h * 0.28 - (state.textPosition.y * h); 
    
    const size = Math.floor(w * state.textScale * 0.8);
    ctx.font = `bold ${size}px ${activeFont.family}`;
    ctx.fillStyle = state.textColor || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Varsity font outline effect for premium athletic look
    ctx.strokeStyle = state.colors.collar || '#000000';
    ctx.lineWidth = size * 0.12;
    
    // Draw at left edge boundary
    ctx.strokeText(state.customText.toUpperCase(), textX, textY);
    ctx.fillText(state.customText.toUpperCase(), textX, textY);
    
    // Draw at right edge boundary
    ctx.strokeText(state.customText.toUpperCase(), textX + w, textY);
    ctx.fillText(state.customText.toUpperCase(), textX + w, textY);
    
    ctx.restore();
  }

  // 5. Draw Custom Player Number on the BACK of the shirt (below the name)
  if (state.textNumber) {
    const activeFont = FONTS.find(f => f.id === state.textFont) || FONTS[0];
    ctx.save();
    
    // Position number: centered on the back, vertically aligned lower than the name
    const numX = 0 + (state.textPosition.x * w);
    const numY = h * 0.48 - (state.textPosition.y * h);
    
    const size = Math.floor(w * state.textScale * 1.3); // Number is typically larger
    ctx.font = `bold ${size}px ${activeFont.family}`;
    ctx.fillStyle = state.textColor || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.strokeStyle = state.colors.collar || '#000000';
    ctx.lineWidth = size * 0.12;
    
    // Draw at left edge boundary
    ctx.strokeText(state.textNumber, numX, numY);
    ctx.fillText(state.textNumber, numX, numY);
    
    // Draw at right edge boundary
    ctx.strokeText(state.textNumber, numX + w, numY);
    ctx.fillText(state.textNumber, numX + w, numY);
    
    ctx.restore();
  }

  // 6. Draw Uploaded Logo Image on the wearer's left front chest
  if (state.logoUrl) {
    const img = new Image();
    // Allow cross-origin logo images (e.g. from Cloudinary)
    img.crossOrigin = 'anonymous';
    img.src = state.logoUrl;
    img.onload = () => {
      ctx.save();
      const logoW = w * state.logoScale;
      // Maintain aspect ratio
      const logoH = logoW * (img.height / img.width);
      
      // Placed on front left chest (centered at w * 0.62 in horizontal UV coordinate)
      const logoX = (w * 0.62) + (state.logoPosition.x * w) - (logoW / 2);
      const logoY = (h * 0.25) - (state.logoPosition.y * h) - (logoH / 2); 
      
      ctx.drawImage(img, logoX, logoY, logoW, logoH);
      ctx.restore();
      // Notify Three.js that texture canvas changed
      if (onUpdate) onUpdate();
    };
    img.onerror = () => {
      console.warn('Failed to load jersey logo image, updating canvas texture anyway.');
      if (onUpdate) onUpdate();
    };
  } else {
    // If no logo, execute immediate update
    if (onUpdate) onUpdate();
  }
};

/**
 * Draws the customized cap graphics onto an offscreen canvas
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} state - Customize panel settings
 * @param {Function} onUpdate - Callback to update Three.js texture
 */
export const drawCapTexture = (canvas, state, onUpdate) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Base/Crown Color
  ctx.fillStyle = state.colors.crown || '#1E3A8A';
  ctx.fillRect(0, 0, w, h);

  // 2. Draw Selected Pattern Overlay
  // Accent color for cap patterns uses the visor color
  const accentColor = state.colors.visor || '#BE123C';

  if (state.pattern === 'vertical-stripes') {
    ctx.fillStyle = accentColor + '44'; // Add transparency to blend
    const stripeWidth = w / 20;
    for (let i = 0; i < 20; i += 2) {
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
    }
  } else if (state.pattern === 'horizontal-stripes') {
    ctx.fillStyle = accentColor + '44';
    const stripeHeight = h / 20;
    for (let i = 0; i < 20; i += 2) {
      ctx.fillRect(0, i * stripeHeight, w, stripeHeight);
    }
  } else if (state.pattern === 'chevron') {
    ctx.strokeStyle = accentColor + '66';
    ctx.lineWidth = 20;
    ctx.lineJoin = 'round';
    const numChevrons = 6;
    for (let i = 0; i < numChevrons; i++) {
      const y = (h / numChevrons) * i + 100;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, y);
      ctx.lineTo(w * 0.5, y + 120);
      ctx.lineTo(w * 0.9, y);
      ctx.stroke();
    }
  } else if (state.pattern === 'camo') {
    // Subdued digital camo blocks
    ctx.fillStyle = accentColor + '22';
    for (let i = 0; i < 150; i++) {
      const blockW = Math.random() * 60 + 20;
      const blockH = Math.random() * 60 + 20;
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, blockW, blockH);
    }
    // Add a third color block for camo depth
    ctx.fillStyle = (state.colors.eyelets || '#F59E0B') + '22';
    for (let i = 0; i < 100; i++) {
      const blockW = Math.random() * 50 + 20;
      const blockH = Math.random() * 50 + 20;
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, blockW, blockH);
    }
  }

  // 3. Draw Custom Text (Team Name)
  if (state.customText) {
    const activeFont = FONTS.find(f => f.id === state.textFont) || FONTS[0];
    ctx.save();
    
    const textX = w * 0.5 + (state.textPosition.x * w);
    const textY = h * 0.32 - (state.textPosition.y * h * 0.5); // Safe forehead center (below 0.5)
    
    const size = Math.floor(w * state.textScale * 0.8);
    ctx.font = `bold ${size}px ${activeFont.family}`;
    ctx.fillStyle = state.textColor || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Outline effect
    ctx.strokeStyle = state.colors.visor || '#000000';
    ctx.lineWidth = size * 0.12;
    ctx.strokeText(state.customText.toUpperCase(), textX, textY);
    ctx.fillText(state.customText.toUpperCase(), textX, textY);
    ctx.restore();
  }

  // 4. Draw Custom Player Number
  if (state.textNumber) {
    const activeFont = FONTS.find(f => f.id === state.textFont) || FONTS[0];
    ctx.save();
    
    const numX = w * 0.5 + (state.textPosition.x * w);
    const numY = h * 0.42 - (state.textPosition.y * h * 0.5); // Safe forehead lower region (above 0.5 rim line)
    
    const size = Math.floor(w * state.textScale * 1.2);
    ctx.font = `bold ${size}px ${activeFont.family}`;
    ctx.fillStyle = state.textColor || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.strokeStyle = state.colors.visor || '#000000';
    ctx.lineWidth = size * 0.12;
    ctx.strokeText(state.textNumber, numX, numY);
    ctx.fillText(state.textNumber, numX, numY);
    ctx.restore();
  }

  // 5. Draw Uploaded Logo Image
  if (state.logoUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = state.logoUrl;
    img.onload = () => {
      ctx.save();
      const logoW = w * state.logoScale * 0.9;
      const logoH = logoW * (img.height / img.width);
      
      const logoX = (w * 0.5) + (state.logoPosition.x * w) - (logoW / 2);
      const logoY = (h * 0.20) - (state.logoPosition.y * h * 0.5) - (logoH / 2); // Safe upper forehead center
      
      ctx.drawImage(img, logoX, logoY, logoW, logoH);
      ctx.restore();
      if (onUpdate) onUpdate();
    };
    img.onerror = () => {
      console.warn('Failed to load cap logo image, updating canvas texture anyway.');
      if (onUpdate) onUpdate();
    };
  } else {
    if (onUpdate) onUpdate();
  }
};
