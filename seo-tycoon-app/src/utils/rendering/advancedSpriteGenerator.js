/**
 * Advanced Pixel Art Sprite Generator
 * Creates detailed isometric sprites similar to professional pixel art
 */

/**
 * Create a canvas sprite with pixel-perfect rendering
 */
function createPixelCanvas(width, height, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.imageSmoothingEnabled = false;
  drawFn(ctx, width, height);
  return canvas;
}

/**
 * Draw pixel-perfect line
 */
function drawPixelLine(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(Math.floor(x1), Math.floor(y1));
  ctx.lineTo(Math.floor(x2), Math.floor(y2));
  ctx.stroke();
}

/**
 * Fill pixel rect
 */
function fillPixelRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

/**
 * Draw isometric cube face
 */
function drawIsoCubeFace(ctx, x, y, size, color, shade = 0) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const nr = Math.max(0, Math.min(255, r + shade));
  const ng = Math.max(0, Math.min(255, g + shade));
  const nb = Math.max(0, Math.min(255, b + shade));

  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

/**
 * Generate detailed isometric floor tile with wood texture
 */
export function generateWoodenFloorTile() {
  return createPixelCanvas(64, 32, (ctx, w, h) => {
    // Base floor color - wood
    const baseColor = '#c19a6b';
    const darkWood = '#a0826d';
    const lightWood = '#d4a574';

    // Draw isometric diamond
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
    ctx.fill();

    // Wood grain texture (horizontal planks)
    ctx.strokeStyle = darkWood;
    ctx.lineWidth = 1;
    for (let i = 4; i < h; i += 4) {
      const offset = (i % 8 === 0) ? 2 : 0;
      ctx.beginPath();
      ctx.moveTo(w / 2 - i, h / 2 - i / 2 + offset);
      ctx.lineTo(w / 2 + i, h / 2 - i / 2 + offset);
      ctx.stroke();
    }

    // Highlight lines
    ctx.strokeStyle = lightWood;
    ctx.lineWidth = 1;
    for (let i = 6; i < h; i += 8) {
      ctx.beginPath();
      ctx.moveTo(w / 2 - i + 2, h / 2 - i / 2 + 1);
      ctx.lineTo(w / 2 + i - 2, h / 2 - i / 2 + 1);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
    ctx.stroke();
  });
}

/**
 * Generate carpet floor tile
 */
export function generateCarpetFloorTile() {
  return createPixelCanvas(64, 32, (ctx, w, h) => {
    const baseColor = '#5a8c7e';
    const darkColor = '#4a7c6e';

    // Base
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
    ctx.fill();

    // Carpet texture (dotted pattern)
    ctx.fillStyle = darkColor;
    for (let y = 2; y < h - 2; y += 3) {
      for (let x = 2; x < w - 2; x += 3) {
        if ((x + y) % 6 === 0) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
    ctx.stroke();
  });
}

/**
 * Generate detailed office desk with computer
 */
export function generateOfficeDesk(isPremium = false) {
  return createPixelCanvas(64, 72, (ctx, w, h) => {
    const deskColor = isPremium ? '#8b5a3c' : '#6b4423';
    const deskLight = isPremium ? '#a67c52' : '#7e5436';
    const deskDark = isPremium ? '#6b4423' : '#5a3619';

    // Desk base (isometric cube)
    const deskTop = h - 24;
    const deskHeight = 20;

    // Top face
    ctx.fillStyle = deskLight;
    ctx.beginPath();
    ctx.moveTo(w / 2, deskTop - deskHeight);
    ctx.lineTo(w / 2 + 20, deskTop - deskHeight + 10);
    ctx.lineTo(w / 2 + 20, deskTop + 10);
    ctx.lineTo(w / 2, deskTop);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = deskColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, deskTop - deskHeight);
    ctx.lineTo(w / 2 - 20, deskTop - deskHeight + 10);
    ctx.lineTo(w / 2 - 20, deskTop + 10);
    ctx.lineTo(w / 2, deskTop);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = deskDark;
    ctx.beginPath();
    ctx.moveTo(w / 2, deskTop);
    ctx.lineTo(w / 2 + 20, deskTop + 10);
    ctx.lineTo(w / 2 + 20, deskTop + 20);
    ctx.lineTo(w / 2, deskTop + 10);
    ctx.closePath();
    ctx.fill();

    // Monitor
    const monitorX = w / 2 - 8;
    const monitorY = deskTop - deskHeight - 18;

    // Monitor stand
    ctx.fillStyle = '#2c2c2c';
    fillPixelRect(ctx, w / 2 - 2, deskTop - deskHeight - 4, 4, 4, '#2c2c2c');

    // Monitor screen
    ctx.fillStyle = '#1a1a1a';
    fillPixelRect(ctx, monitorX, monitorY, 16, 14, '#1a1a1a');

    // Screen glow
    ctx.fillStyle = '#4a9eff';
    fillPixelRect(ctx, monitorX + 2, monitorY + 2, 12, 10, '#4a9eff');

    // Screen details (fake UI)
    ctx.fillStyle = '#ffffff';
    fillPixelRect(ctx, monitorX + 3, monitorY + 3, 10, 2, '#ffffff');
    fillPixelRect(ctx, monitorX + 3, monitorY + 6, 6, 1, '#cccccc');
    fillPixelRect(ctx, monitorX + 3, monitorY + 8, 8, 1, '#cccccc');

    // Keyboard
    ctx.fillStyle = '#3c3c3c';
    fillPixelRect(ctx, w / 2 - 10, deskTop - deskHeight + 2, 20, 6, '#3c3c3c');

    // Keys
    ctx.fillStyle = '#2c2c2c';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        fillPixelRect(ctx, w / 2 - 8 + i * 4, deskTop - deskHeight + 3 + j * 2, 3, 1, '#2c2c2c');
      }
    }

    // Mouse
    ctx.fillStyle = '#4c4c4c';
    fillPixelRect(ctx, w / 2 + 12, deskTop - deskHeight + 4, 3, 4, '#4c4c4c');

    // Coffee cup
    if (isPremium) {
      ctx.fillStyle = '#8b4513';
      fillPixelRect(ctx, w / 2 - 16, deskTop - deskHeight + 2, 4, 4, '#8b4513');
      ctx.fillStyle = '#6b3410';
      fillPixelRect(ctx, w / 2 - 15, deskTop - deskHeight + 3, 2, 2, '#3c1f08');

      // Steam
      ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
      fillPixelRect(ctx, w / 2 - 15, deskTop - deskHeight - 2, 1, 2, 'rgba(200, 200, 200, 0.4)');
      fillPixelRect(ctx, w / 2 - 14, deskTop - deskHeight - 4, 1, 2, 'rgba(200, 200, 200, 0.3)');
    }
  });
}

/**
 * Generate detailed plant with pot
 */
export function generateOfficePlant() {
  return createPixelCanvas(48, 64, (ctx, w, h) => {
    // Pot (isometric)
    const potColor = '#8b4513';
    const potLight = '#a0522d';
    const potDark = '#6b3410';

    const potY = h - 20;

    // Pot top
    ctx.fillStyle = potLight;
    ctx.beginPath();
    ctx.moveTo(w / 2, potY);
    ctx.lineTo(w / 2 + 12, potY + 6);
    ctx.lineTo(w / 2 + 10, potY + 14);
    ctx.lineTo(w / 2 - 10, potY + 14);
    ctx.lineTo(w / 2 - 12, potY + 6);
    ctx.closePath();
    ctx.fill();

    // Pot left
    ctx.fillStyle = potColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, potY);
    ctx.lineTo(w / 2 - 12, potY + 6);
    ctx.lineTo(w / 2 - 10, potY + 14);
    ctx.lineTo(w / 2 + 10, potY + 14);
    ctx.closePath();
    ctx.fill();

    // Soil
    ctx.fillStyle = '#3c2410';
    fillPixelRect(ctx, w / 2 - 8, potY + 2, 16, 3, '#3c2410');

    // Leaves (monstera-style)
    const leafGreen = '#2d5016';
    const leafLight = '#4a7c2f';

    // Back leaves
    ctx.fillStyle = leafGreen;
    // Leaf 1
    ctx.beginPath();
    ctx.moveTo(w / 2 - 4, potY - 8);
    ctx.lineTo(w / 2 - 16, potY - 20);
    ctx.lineTo(w / 2 - 14, potY - 24);
    ctx.lineTo(w / 2 - 2, potY - 12);
    ctx.closePath();
    ctx.fill();

    // Leaf 2
    ctx.beginPath();
    ctx.moveTo(w / 2 + 4, potY - 8);
    ctx.lineTo(w / 2 + 16, potY - 22);
    ctx.lineTo(w / 2 + 14, potY - 26);
    ctx.lineTo(w / 2 + 2, potY - 12);
    ctx.closePath();
    ctx.fill();

    // Front leaves (lighter)
    ctx.fillStyle = leafLight;
    // Leaf 3
    ctx.beginPath();
    ctx.moveTo(w / 2, potY - 10);
    ctx.lineTo(w / 2 - 12, potY - 28);
    ctx.lineTo(w / 2 - 10, potY - 32);
    ctx.lineTo(w / 2 + 2, potY - 14);
    ctx.closePath();
    ctx.fill();

    // Leaf 4
    ctx.beginPath();
    ctx.moveTo(w / 2, potY - 10);
    ctx.lineTo(w / 2 + 12, potY - 26);
    ctx.lineTo(w / 2 + 10, potY - 30);
    ctx.lineTo(w / 2 - 2, potY - 14);
    ctx.closePath();
    ctx.fill();

    // Stems
    ctx.strokeStyle = '#2d4016';
    ctx.lineWidth = 2;
    drawPixelLine(ctx, w / 2, potY, w / 2 - 12, potY - 28, '#2d4016');
    drawPixelLine(ctx, w / 2, potY, w / 2 + 12, potY - 26, '#2d4016');

    // Leaf veins
    ctx.strokeStyle = '#1d3008';
    ctx.lineWidth = 1;
    drawPixelLine(ctx, w / 2 - 12, potY - 28, w / 2 - 14, potY - 24, '#1d3008');
    drawPixelLine(ctx, w / 2 + 12, potY - 26, w / 2 + 14, potY - 22, '#1d3008');
  });
}

/**
 * Generate coffee machine
 */
export function generateCoffeeMachine() {
  return createPixelCanvas(56, 72, (ctx, w, h) => {
    const machineColor = '#4a4a4a';
    const machineDark = '#2a2a2a';
    const machineLight = '#6a6a6a';

    const baseY = h - 20;

    // Machine body (isometric)
    // Top face
    ctx.fillStyle = machineLight;
    fillPixelRect(ctx, w / 2 - 14, baseY - 36, 28, 8, machineLight);

    // Front face
    ctx.fillStyle = machineColor;
    fillPixelRect(ctx, w / 2 - 14, baseY - 28, 28, 28, machineColor);

    // Side face
    ctx.fillStyle = machineDark;
    fillPixelRect(ctx, w / 2 + 14, baseY - 28, 4, 28, machineDark);

    // Display screen
    ctx.fillStyle = '#1a4d2e';
    fillPixelRect(ctx, w / 2 - 10, baseY - 24, 12, 6, '#1a4d2e');
    ctx.fillStyle = '#2ecc71';
    fillPixelRect(ctx, w / 2 - 9, baseY - 23, 10, 4, '#2ecc71');

    // Buttons
    const buttonColors = ['#e74c3c', '#f39c12', '#3498db'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = buttonColors[i];
      fillPixelRect(ctx, w / 2 - 8 + i * 6, baseY - 14, 4, 4, buttonColors[i]);
    }

    // Coffee dispenser
    ctx.fillStyle = '#1a1a1a';
    fillPixelRect(ctx, w / 2 - 6, baseY - 8, 12, 6, '#1a1a1a');

    // Cup (optional)
    ctx.fillStyle = '#ffffff';
    fillPixelRect(ctx, w / 2 - 3, baseY - 4, 6, 4, '#ffffff');
    ctx.fillStyle = '#6b4423';
    fillPixelRect(ctx, w / 2 - 2, baseY - 3, 4, 2, '#3c1f08');

    // Steam
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    fillPixelRect(ctx, w / 2 - 1, baseY - 8, 1, 4, 'rgba(200, 200, 200, 0.5)');
    fillPixelRect(ctx, w / 2 + 1, baseY - 10, 1, 4, 'rgba(200, 200, 200, 0.4)');

    // Brand name
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px monospace';
    ctx.fillText('BREW', w / 2 - 10, baseY - 30);
  });
}

/**
 * Generate meeting table with chairs
 */
export function generateMeetingTable() {
  return createPixelCanvas(96, 80, (ctx, w, h) => {
    const tableColor = '#5a4a3a';
    const tableDark = '#4a3a2a';
    const tableLight = '#6a5a4a';

    const tableY = h - 32;

    // Table top (isometric rectangle)
    ctx.fillStyle = tableLight;
    ctx.beginPath();
    ctx.moveTo(w / 2, tableY - 8);
    ctx.lineTo(w / 2 + 32, tableY + 8);
    ctx.lineTo(w / 2 + 32, tableY + 12);
    ctx.lineTo(w / 2, tableY - 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = tableColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, tableY - 8);
    ctx.lineTo(w / 2 - 32, tableY + 8);
    ctx.lineTo(w / 2 - 32, tableY + 12);
    ctx.lineTo(w / 2, tableY - 4);
    ctx.closePath();
    ctx.fill();

    // Wood grain
    ctx.strokeStyle = tableDark;
    for (let i = -30; i < 30; i += 6) {
      drawPixelLine(ctx, w / 2 + i, tableY - 6 + i / 4, w / 2 + i + 4, tableY - 5 + i / 4, tableDark);
    }

    // Chairs (simple isometric)
    const chairColor = '#3a3a3a';
    const chairBack = '#4a4a4a';

    // Chair positions
    const chairs = [
      { x: w / 2 - 24, y: tableY + 20 },
      { x: w / 2 - 12, y: tableY + 20 },
      { x: w / 2 + 12, y: tableY + 20 },
      { x: w / 2 + 24, y: tableY + 20 },
    ];

    chairs.forEach(chair => {
      // Seat
      ctx.fillStyle = chairColor;
      fillPixelRect(ctx, chair.x - 4, chair.y, 8, 4, chairColor);

      // Back
      ctx.fillStyle = chairBack;
      fillPixelRect(ctx, chair.x - 4, chair.y - 6, 8, 6, chairBack);
    });

    // Laptop on table
    ctx.fillStyle = '#2c2c2c';
    fillPixelRect(ctx, w / 2 - 8, tableY - 2, 12, 8, '#2c2c2c');
    ctx.fillStyle = '#4a9eff';
    fillPixelRect(ctx, w / 2 - 7, tableY - 1, 10, 6, '#1a4d6e');

    // Papers
    ctx.fillStyle = '#ffffff';
    fillPixelRect(ctx, w / 2 + 10, tableY, 6, 8, '#ffffff');
    ctx.fillStyle = '#f0f0f0';
    fillPixelRect(ctx, w / 2 + 12, tableY + 1, 6, 8, '#f0f0f0');
  });
}

/**
 * Generate server rack
 */
export function generateServerRack() {
  return createPixelCanvas(48, 80, (ctx, w, h) => {
    const rackColor = '#2c3e50';
    const rackDark = '#1a252f';
    const rackLight = '#34495e';

    const baseY = h - 8;

    // Rack body
    ctx.fillStyle = rackColor;
    fillPixelRect(ctx, w / 2 - 16, baseY - 64, 32, 64, rackColor);

    // Side panel
    ctx.fillStyle = rackDark;
    fillPixelRect(ctx, w / 2 + 16, baseY - 64, 4, 64, rackDark);

    // Server slots (4 servers)
    for (let i = 0; i < 4; i++) {
      const slotY = baseY - 60 + i * 14;

      // Server panel
      ctx.fillStyle = rackLight;
      fillPixelRect(ctx, w / 2 - 14, slotY, 28, 10, rackLight);

      // LED indicators
      const ledColors = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12'];
      for (let j = 0; j < 4; j++) {
        ctx.fillStyle = Math.random() > 0.5 ? ledColors[j] : '#1a1a1a';
        fillPixelRect(ctx, w / 2 - 12 + j * 3, slotY + 2, 2, 2, ctx.fillStyle);
      }

      // Ventilation slots
      ctx.strokeStyle = rackDark;
      for (let v = 0; v < 6; v++) {
        drawPixelLine(ctx, w / 2 + 2 + v * 2, slotY + 2, w / 2 + 2 + v * 2, slotY + 8, rackDark);
      }
    }

    // Power indicator
    ctx.fillStyle = '#2ecc71';
    fillPixelRect(ctx, w / 2 - 14, baseY - 8, 3, 3, '#2ecc71');

    // Brand/label
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px monospace';
    ctx.fillText('SRV', w / 2 - 6, baseY - 4);
  });
}

/**
 * Generate detailed pixel art character
 */
export function generatePixelCharacter(variant = 1) {
  return createPixelCanvas(32, 48, (ctx, w, h) => {
    const colors = [
      { skin: '#ffdbac', shirt: '#3498db', hair: '#654321', pants: '#2c3e50' },
      { skin: '#f4c2a0', shirt: '#e74c3c', hair: '#2c1810', pants: '#34495e' },
      { skin: '#ffe0bd', shirt: '#2ecc71', hair: '#8b4513', pants: '#7f8c8d' },
      { skin: '#ffcc99', shirt: '#9b59b6', hair: '#4a2511', pants: '#2c3e50' },
    ];

    const color = colors[(variant - 1) % colors.length];
    const baseY = h - 4;

    // Legs
    ctx.fillStyle = color.pants;
    fillPixelRect(ctx, w / 2 - 5, baseY - 12, 4, 12, color.pants);
    fillPixelRect(ctx, w / 2 + 1, baseY - 12, 4, 12, color.pants);

    // Shoes
    ctx.fillStyle = '#2c1810';
    fillPixelRect(ctx, w / 2 - 6, baseY - 2, 5, 2, '#2c1810');
    fillPixelRect(ctx, w / 2 + 1, baseY - 2, 5, 2, '#2c1810');

    // Body
    ctx.fillStyle = color.shirt;
    fillPixelRect(ctx, w / 2 - 6, baseY - 24, 12, 12, color.shirt);

    // Arms
    ctx.fillStyle = color.shirt;
    fillPixelRect(ctx, w / 2 - 9, baseY - 22, 3, 10, color.shirt);
    fillPixelRect(ctx, w / 2 + 6, baseY - 22, 3, 10, color.shirt);

    // Hands
    ctx.fillStyle = color.skin;
    fillPixelRect(ctx, w / 2 - 9, baseY - 14, 3, 3, color.skin);
    fillPixelRect(ctx, w / 2 + 6, baseY - 14, 3, 3, color.skin);

    // Neck
    ctx.fillStyle = color.skin;
    fillPixelRect(ctx, w / 2 - 2, baseY - 26, 4, 2, color.skin);

    // Head
    ctx.fillStyle = color.skin;
    fillPixelRect(ctx, w / 2 - 4, baseY - 34, 8, 8, color.skin);

    // Hair
    ctx.fillStyle = color.hair;
    fillPixelRect(ctx, w / 2 - 5, baseY - 36, 10, 4, color.hair);
    fillPixelRect(ctx, w / 2 - 5, baseY - 34, 2, 4, color.hair);
    fillPixelRect(ctx, w / 2 + 3, baseY - 34, 2, 4, color.hair);

    // Eyes
    ctx.fillStyle = '#000000';
    fillPixelRect(ctx, w / 2 - 2, baseY - 31, 1, 1, '#000000');
    fillPixelRect(ctx, w / 2 + 1, baseY - 31, 1, 1, '#000000');

    // Smile
    ctx.fillStyle = '#000000';
    fillPixelRect(ctx, w / 2 - 2, baseY - 28, 4, 1, '#000000');

    // Collar
    ctx.fillStyle = '#ffffff';
    fillPixelRect(ctx, w / 2 - 3, baseY - 25, 2, 2, '#ffffff');
    fillPixelRect(ctx, w / 2 + 1, baseY - 25, 2, 2, '#ffffff');
  });
}

/**
 * Generate all advanced sprites
 */
export async function generateAllAdvancedSprites() {
  const sprites = new Map();

  // Floors
  sprites.set('floor_wood', generateWoodenFloorTile());
  sprites.set('floor_carpet', generateCarpetFloorTile());

  // Furniture
  sprites.set('desk_basic', generateOfficeDesk(false));
  sprites.set('desk_premium', generateOfficeDesk(true));
  sprites.set('plant', generateOfficePlant());
  sprites.set('coffee_machine', generateCoffeeMachine());
  sprites.set('meeting_table', generateMeetingTable());
  sprites.set('server', generateServerRack());

  // Characters
  for (let i = 1; i <= 4; i++) {
    sprites.set(`character_${i}`, generatePixelCharacter(i));
  }

  console.log('✅ Generated', sprites.size, 'advanced pixel art sprites');

  return sprites;
}
