/**
 * Shadow and lighting system for isometric rendering
 */

/**
 * Draw isometric shadow for an object
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center X position
 * @param {number} y - Center Y position (bottom)
 * @param {number} width - Shadow width
 * @param {number} height - Shadow height
 * @param {number} opacity - Shadow opacity (0-1)
 */
export function drawIsometricShadow(ctx, x, y, width, height, opacity = 0.3) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#000000';

  // Elliptical shadow
  ctx.beginPath();
  ctx.ellipse(
    x,
    y + 2,
    width / 2,
    height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

/**
 * Draw soft shadow with gradient
 */
export function drawSoftShadow(ctx, x, y, width, height, intensity = 0.4) {
  ctx.save();

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, width / 2);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
  gradient.addColorStop(0.5, `rgba(0, 0, 0, ${intensity * 0.5})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw ambient occlusion for tile corners
 */
export function drawAmbientOcclusion(ctx, x, y, tileWidth, tileHeight) {
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#000000';

  // Darken corners slightly
  const cornerSize = 8;

  // Top corner
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - cornerSize, y + cornerSize / 2);
  ctx.lineTo(x + cornerSize, y + cornerSize / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Calculate shadow offset based on object height
 */
export function calculateShadowOffset(objectHeight) {
  return {
    offsetX: objectHeight * 0.3,
    offsetY: objectHeight * 0.15,
    blur: objectHeight * 0.2,
  };
}

/**
 * Draw directional shadow (for lighting from specific angle)
 */
export function drawDirectionalShadow(ctx, x, y, width, height, angle = 45, length = 20, opacity = 0.25) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#000000';

  const angleRad = (angle * Math.PI) / 180;
  const offsetX = Math.cos(angleRad) * length;
  const offsetY = Math.sin(angleRad) * length;

  ctx.beginPath();
  ctx.ellipse(
    x + offsetX,
    y + offsetY + 2,
    width / 2,
    height / 2,
    angleRad,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

/**
 * Apply ambient lighting to the scene
 */
export function applyAmbientLight(ctx, canvasWidth, canvasHeight, timeOfDay = 'day') {
  ctx.save();

  const lightingPresets = {
    morning: { color: '#fff4e6', alpha: 0.05 },
    day: { color: '#ffffff', alpha: 0 },
    evening: { color: '#ff8c42', alpha: 0.08 },
    night: { color: '#1a1a2e', alpha: 0.15 },
  };

  const preset = lightingPresets[timeOfDay] || lightingPresets.day;

  if (preset.alpha > 0) {
    ctx.globalAlpha = preset.alpha;
    ctx.fillStyle = preset.color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  ctx.restore();
}

/**
 * Draw floor shadow grid for depth
 */
export function drawFloorShadowGrid(ctx, tiles, tileWidth, tileHeight, isoToScreen) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

  tiles.forEach((tile) => {
    const { x, y } = isoToScreen(tile.x, tile.y, tileWidth, tileHeight);

    // Subtle grid lines for depth
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2);
    ctx.stroke();
  });

  ctx.restore();
}
