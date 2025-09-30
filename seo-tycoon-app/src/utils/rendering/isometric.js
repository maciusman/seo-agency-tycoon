// Convert isometric coordinates to screen coordinates
export function isoToScreen(isoX, isoY, tileWidth = 64, tileHeight = 32) {
  const screenX = (isoX - isoY) * (tileWidth / 2);
  const screenY = (isoX + isoY) * (tileHeight / 2);
  return { x: screenX, y: screenY };
}

// Convert screen coordinates to isometric coordinates
export function screenToIso(screenX, screenY, tileWidth = 64, tileHeight = 32) {
  const isoX = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2;
  const isoY = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2;
  return { x: Math.floor(isoX), y: Math.floor(isoY) };
}

// Calculate z-index for layering (higher value = rendered on top)
export function calculateZIndex(isoX, isoY) {
  return isoX + isoY;
}

// Check if a point is inside an isometric tile
export function pointInIsometricTile(pointX, pointY, tileX, tileY, tileWidth = 64, tileHeight = 32) {
  const { x: screenX, y: screenY } = isoToScreen(tileX, tileY, tileWidth, tileHeight);

  // Transform point to tile-local coordinates
  const dx = pointX - screenX;
  const dy = pointY - screenY;

  // Check if point is within diamond shape
  const halfWidth = tileWidth / 2;
  const halfHeight = tileHeight / 2;

  return Math.abs(dx / halfWidth) + Math.abs(dy / halfHeight) <= 1;
}
