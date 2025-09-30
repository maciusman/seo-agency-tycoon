/**
 * Generate simple pixel art sprites programmatically as fallback
 * This creates basic sprites if external assets aren't available
 */

/**
 * Create a canvas-based sprite
 * @param {number} width - Width of the sprite
 * @param {number} height - Height of the sprite
 * @param {Function} drawFn - Function that draws on the canvas
 * @returns {HTMLCanvasElement}
 */
function createSprite(width, height, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, width, height);
  return canvas;
}

/**
 * Generate floor tile sprite
 */
export function generateFloorTile() {
  return createSprite(64, 32, (ctx, w, h) => {
    // Isometric diamond shape
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#9fbc9f');
    gradient.addColorStop(1, '#7fa07f');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Texture lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(w / 2, 4);
    ctx.lineTo(w - 4, h / 2);
    ctx.moveTo(4, h / 2);
    ctx.lineTo(w / 2, h - 4);
    ctx.stroke();
  });
}

/**
 * Generate desk sprite
 */
export function generateDesk(isPremium = false) {
  return createSprite(48, 56, (ctx, w, h) => {
    const deskHeight = 24;
    const legHeight = 16;

    // Desk top (isometric)
    const topGradient = ctx.createLinearGradient(0, 0, w, 0);
    topGradient.addColorStop(0, isPremium ? '#cd853f' : '#8b4513');
    topGradient.addColorStop(1, isPremium ? '#daa520' : '#a0522d');

    ctx.fillStyle = topGradient;
    ctx.beginPath();
    ctx.moveTo(w / 2, h - deskHeight - legHeight);
    ctx.lineTo(w - 4, h - deskHeight - legHeight + 8);
    ctx.lineTo(w - 4, h - legHeight + 8);
    ctx.lineTo(w / 2, h - legHeight);
    ctx.closePath();
    ctx.fill();

    // Desk front face
    ctx.fillStyle = isPremium ? '#b8860b' : '#654321';
    ctx.beginPath();
    ctx.moveTo(w / 2, h - legHeight);
    ctx.lineTo(w - 4, h - legHeight + 8);
    ctx.lineTo(w - 4, h + 4);
    ctx.lineTo(w / 2, h - 4);
    ctx.closePath();
    ctx.fill();

    // Desk left face
    ctx.fillStyle = isPremium ? '#8b6914' : '#4a2511';
    ctx.beginPath();
    ctx.moveTo(w / 2, h - legHeight);
    ctx.lineTo(4, h - legHeight + 8);
    ctx.lineTo(4, h + 4);
    ctx.lineTo(w / 2, h - 4);
    ctx.closePath();
    ctx.fill();

    // Computer monitor on desk
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(w / 2 - 6, h - deskHeight - legHeight - 12, 12, 10);

    // Screen
    ctx.fillStyle = '#3498db';
    ctx.fillRect(w / 2 - 5, h - deskHeight - legHeight - 11, 10, 8);
  });
}

/**
 * Generate coffee machine sprite
 */
export function generateCoffeeMachine() {
  return createSprite(32, 48, (ctx, w, h) => {
    // Machine body
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#8b7355');
    gradient.addColorStop(1, '#6f4e37');

    ctx.fillStyle = gradient;
    ctx.fillRect(w / 2 - 12, h - 32, 24, 28);

    // Machine top
    ctx.fillStyle = '#4a3728';
    ctx.fillRect(w / 2 - 10, h - 34, 20, 4);

    // Coffee pot
    ctx.fillStyle = '#2c1810';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 10, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Steam effect (light gray)
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.fillRect(w / 2 - 2, h - 40, 2, 8);
    ctx.fillRect(w / 2 + 1, h - 42, 2, 8);
  });
}

/**
 * Generate plant sprite
 */
export function generatePlant() {
  return createSprite(32, 48, (ctx, w, h) => {
    // Pot
    const potGradient = ctx.createLinearGradient(0, h - 16, 0, h);
    potGradient.addColorStop(0, '#a0522d');
    potGradient.addColorStop(1, '#8b4513');

    ctx.fillStyle = potGradient;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, h - 16);
    ctx.lineTo(w / 2 - 10, h);
    ctx.lineTo(w / 2 + 10, h);
    ctx.lineTo(w / 2 + 8, h - 16);
    ctx.closePath();
    ctx.fill();

    // Leaves
    ctx.fillStyle = '#228b22';
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const x = w / 2 + Math.cos(angle) * 8;
      const y = h - 24 + Math.sin(angle) * 6;

      ctx.beginPath();
      ctx.ellipse(x, y, 8, 12, angle, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center circle
    ctx.fillStyle = '#32cd32';
    ctx.beginPath();
    ctx.arc(w / 2, h - 24, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Generate meeting table sprite
 */
export function generateMeetingTable() {
  return createSprite(64, 64, (ctx, w, h) => {
    // Table top
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#5a4a3a');
    gradient.addColorStop(1, '#6a5a4a');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(w / 2, h - 48);
    ctx.lineTo(w - 8, h - 40);
    ctx.lineTo(w - 8, h - 20);
    ctx.lineTo(w / 2, h - 28);
    ctx.closePath();
    ctx.fill();

    // Table left side
    ctx.fillStyle = '#4a3a2a';
    ctx.beginPath();
    ctx.moveTo(w / 2, h - 48);
    ctx.lineTo(8, h - 40);
    ctx.lineTo(8, h - 20);
    ctx.lineTo(w / 2, h - 28);
    ctx.closePath();
    ctx.fill();

    // Chairs (simple rectangles)
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(w / 2 - 16, h - 16, 12, 8);
    ctx.fillRect(w / 2 + 4, h - 16, 12, 8);
  });
}

/**
 * Generate server rack sprite
 */
export function generateServerRack() {
  return createSprite(32, 56, (ctx, w, h) => {
    // Rack body
    ctx.fillStyle = '#34495e';
    ctx.fillRect(w / 2 - 12, h - 48, 24, 44);

    // Server slots
    ctx.fillStyle = '#2c3e50';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(w / 2 - 10, h - 44 + i * 10, 20, 8);

      // LED indicators
      ctx.fillStyle = i % 2 === 0 ? '#2ecc71' : '#e74c3c';
      ctx.fillRect(w / 2 - 8, h - 42 + i * 10, 2, 2);
      ctx.fillRect(w / 2 - 4, h - 42 + i * 10, 2, 2);
      ctx.fillStyle = '#2c3e50';
    }
  });
}

/**
 * Generate character sprite
 */
export function generateCharacter(variant = 1) {
  return createSprite(24, 32, (ctx, w, h) => {
    const colors = [
      { skin: '#ffdbac', shirt: '#3498db', hair: '#654321' },
      { skin: '#f4c2a0', shirt: '#e74c3c', hair: '#2c1810' },
      { skin: '#ffe0bd', shirt: '#2ecc71', hair: '#8b4513' },
      { skin: '#ffcc99', shirt: '#9b59b6', hair: '#4a2511' },
    ];

    const color = colors[(variant - 1) % colors.length];

    // Head
    ctx.fillStyle = color.skin;
    ctx.beginPath();
    ctx.arc(w / 2, h - 20, 6, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = color.hair;
    ctx.beginPath();
    ctx.arc(w / 2, h - 22, 6, Math.PI, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = color.shirt;
    ctx.fillRect(w / 2 - 5, h - 14, 10, 10);

    // Arms
    ctx.fillStyle = color.shirt;
    ctx.fillRect(w / 2 - 8, h - 12, 3, 8);
    ctx.fillRect(w / 2 + 5, h - 12, 3, 8);

    // Legs
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(w / 2 - 4, h - 4, 3, 4);
    ctx.fillRect(w / 2 + 1, h - 4, 3, 4);
  });
}

/**
 * Generate all sprites and return them as a map
 */
export async function generateAllSprites() {
  const sprites = new Map();

  sprites.set('floor_basic', generateFloorTile());
  sprites.set('desk_basic', generateDesk(false));
  sprites.set('desk_premium', generateDesk(true));
  sprites.set('coffee_machine', generateCoffeeMachine());
  sprites.set('plant', generatePlant());
  sprites.set('meeting_table', generateMeetingTable());
  sprites.set('server', generateServerRack());
  sprites.set('character_1', generateCharacter(1));
  sprites.set('character_2', generateCharacter(2));
  sprites.set('character_3', generateCharacter(3));
  sprites.set('character_4', generateCharacter(4));

  return sprites;
}
