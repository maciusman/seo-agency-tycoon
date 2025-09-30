// Sprite loading and caching system
class SpriteLoader {
  constructor() {
    this.sprites = new Map();
    this.loading = new Map();
  }

  /**
   * Load a sprite image
   * @param {string} name - Unique name for the sprite
   * @param {string} path - Path to the image file
   * @returns {Promise<HTMLImageElement>}
   */
  load(name, path) {
    // Return cached sprite if already loaded
    if (this.sprites.has(name)) {
      return Promise.resolve(this.sprites.get(name));
    }

    // Return existing promise if already loading
    if (this.loading.has(name)) {
      return this.loading.get(name);
    }

    // Create new loading promise
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.sprites.set(name, img);
        this.loading.delete(name);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(name);
        reject(new Error(`Failed to load sprite: ${path}`));
      };
      img.src = path;
    });

    this.loading.set(name, promise);
    return promise;
  }

  /**
   * Load multiple sprites at once
   * @param {Object} spriteMap - Object with name: path pairs
   * @returns {Promise<void>}
   */
  async loadBatch(spriteMap) {
    const promises = Object.entries(spriteMap).map(([name, path]) =>
      this.load(name, path)
    );
    await Promise.all(promises);
  }

  /**
   * Get a loaded sprite
   * @param {string} name - Name of the sprite
   * @returns {HTMLImageElement|null}
   */
  get(name) {
    return this.sprites.get(name) || null;
  }

  /**
   * Check if a sprite is loaded
   * @param {string} name - Name of the sprite
   * @returns {boolean}
   */
  has(name) {
    return this.sprites.has(name);
  }

  /**
   * Clear all cached sprites
   */
  clear() {
    this.sprites.clear();
    this.loading.clear();
  }

  /**
   * Get sprite dimensions
   * @param {string} name - Name of the sprite
   * @returns {{width: number, height: number}|null}
   */
  getDimensions(name) {
    const sprite = this.sprites.get(name);
    if (!sprite) return null;
    return {
      width: sprite.width,
      height: sprite.height,
    };
  }
}

// Singleton instance
export const spriteLoader = new SpriteLoader();

// Sprite definitions for the game
export const SPRITE_PATHS = {
  // Floor tiles
  floor_basic: '/assets/sprites/floor_basic.png',
  floor_carpet: '/assets/sprites/floor_carpet.png',

  // Buildings/Furniture
  desk_basic: '/assets/sprites/desk_basic.png',
  desk_premium: '/assets/sprites/desk_premium.png',
  coffee_machine: '/assets/sprites/coffee_machine.png',
  meeting_table: '/assets/sprites/meeting_table.png',
  plant: '/assets/sprites/plant.png',
  server: '/assets/sprites/server.png',

  // Characters
  character_1: '/assets/sprites/character_1.png',
  character_2: '/assets/sprites/character_2.png',
  character_3: '/assets/sprites/character_3.png',
  character_4: '/assets/sprites/character_4.png',

  // UI elements
  cursor: '/assets/sprites/cursor.png',
  selection: '/assets/sprites/selection.png',
};

/**
 * Initialize and preload all game sprites
 * @returns {Promise<void>}
 */
export async function preloadGameSprites() {
  try {
    await spriteLoader.loadBatch(SPRITE_PATHS);
    console.log('✅ All sprites loaded successfully');
  } catch (error) {
    console.warn('⚠️ Failed to load some sprites, using fallback rendering:', error);
  }
}

/**
 * Draw a sprite with isometric adjustments
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} spriteName - Name of the sprite to draw
 * @param {number} x - X position (center)
 * @param {number} y - Y position (bottom)
 * @param {Object} options - Drawing options
 */
export function drawSprite(ctx, spriteName, x, y, options = {}) {
  const sprite = spriteLoader.get(spriteName);
  if (!sprite) return false;

  const {
    width = sprite.width,
    height = sprite.height,
    offsetX = 0,
    offsetY = 0,
    alpha = 1,
    flipX = false,
  } = options;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Calculate draw position (centered horizontally, anchored to bottom)
  const drawX = x - width / 2 + offsetX;
  const drawY = y - height + offsetY;

  if (flipX) {
    ctx.translate(x, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(sprite, -width / 2 + offsetX, drawY, width, height);
  } else {
    ctx.drawImage(sprite, drawX, drawY, width, height);
  }

  ctx.restore();
  return true;
}

/**
 * Draw a sprite with shadow for depth
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} spriteName - Name of the sprite
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Object} options - Drawing options
 */
export function drawSpriteWithShadow(ctx, spriteName, x, y, options = {}) {
  // Draw shadow
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(x, y + 5, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Draw sprite
  return drawSprite(ctx, spriteName, x, y, options);
}
