import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../state/context/GameContext';
import { isoToScreen, screenToIso } from '../../utils/rendering/isometric';
import { generateAllSprites } from '../../utils/rendering/spriteGenerator';
import './OfficeCanvas.css';

const OfficeCanvas = () => {
  const canvasRef = useRef(null);
  const { state, dispatch } = useGame();

  const TILE_WIDTH = 64;
  const TILE_HEIGHT = 32;
  const GRID_SIZE = state.agency.gridSize;

  // Camera/viewport state
  const [camera, setCamera] = useState({
    x: 400,
    y: 100,
    zoom: 1,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [sprites, setSprites] = useState(null);
  const [spritesLoaded, setSpritesLoaded] = useState(false);

  // Load sprites on mount
  useEffect(() => {
    const loadSprites = async () => {
      try {
        const generatedSprites = await generateAllSprites();
        setSprites(generatedSprites);
        setSpritesLoaded(true);
      } catch (error) {
        console.error('Failed to load sprites:', error);
        setSpritesLoaded(false);
      }
    };

    loadSprites();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spritesLoaded) return;

    const ctx = canvas.getContext('2d');
    renderOffice(ctx);
  }, [state.agency.tiles, state.agency.employees, state.ui.selectedTile, camera, spritesLoaded]);

  const renderOffice = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Apply camera transform
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Render tiles
    state.agency.tiles.forEach((tile, index) => {
      renderTile(ctx, tile, index);
    });

    // Render employees
    state.agency.employees.forEach((employee) => {
      if (employee.deskId !== null) {
        renderEmployee(ctx, employee);
      }
    });

    ctx.restore();
  };

  const renderTile = (ctx, tile, index) => {
    const { x, y } = isoToScreen(tile.x, tile.y, TILE_WIDTH, TILE_HEIGHT);

    // Check if selected
    const isSelected = state.ui.selectedTile === index;

    // Draw tile base using sprite or fallback
    if (sprites && sprites.has('floor_basic')) {
      const floorSprite = sprites.get('floor_basic');
      ctx.drawImage(floorSprite, x - TILE_WIDTH / 2, y, TILE_WIDTH, TILE_HEIGHT);

      // Highlight if selected
      if (isSelected) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        drawIsoDiamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);
      }
    } else {
      // Fallback rendering
      ctx.fillStyle = tile.type === 'floor' ? '#8fbc8f' : '#a0a0a0';
      if (isSelected) {
        ctx.fillStyle = '#ffd700';
      }
      drawIsoDiamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);
    }

    // Draw building if present
    if (tile.buildingType) {
      renderBuilding(ctx, x, y, tile.buildingType);
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
    ctx.lineTo(x, y + TILE_HEIGHT);
    ctx.lineTo(x - TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
    ctx.closePath();
    ctx.stroke();
  };

  const drawIsoDiamond = (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.closePath();
    ctx.fill();
  };

  const renderBuilding = (ctx, x, y, buildingType) => {
    const spriteMap = {
      desk_basic: 'desk_basic',
      desk_premium: 'desk_premium',
      coffee: 'coffee_machine',
      meeting: 'meeting_table',
      plant: 'plant',
      server: 'server',
    };

    const spriteName = spriteMap[buildingType];

    // Try to draw sprite first
    if (sprites && spriteName && sprites.has(spriteName)) {
      const sprite = sprites.get(spriteName);
      const offsetY = -sprite.height + 16; // Adjust to sit on tile
      ctx.drawImage(sprite, x - sprite.width / 2, y + offsetY, sprite.width, sprite.height);
      return;
    }

    // Fallback to colored boxes
    const buildingHeight = 40;
    const buildingColors = {
      desk_basic: '#8b4513',
      desk_premium: '#cd853f',
      coffee: '#6f4e37',
      meeting: '#4682b4',
      plant: '#228b22',
      server: '#708090',
    };

    const color = buildingColors[buildingType] || '#888888';

    // Draw simple 3D box for building
    // Top face
    ctx.fillStyle = color;
    drawIsoDiamond(ctx, x, y - buildingHeight, TILE_WIDTH * 0.8, TILE_HEIGHT * 0.8);

    // Left face
    ctx.fillStyle = shadeColor(color, -20);
    ctx.beginPath();
    ctx.moveTo(x - (TILE_WIDTH * 0.4), y - buildingHeight + (TILE_HEIGHT * 0.4));
    ctx.lineTo(x - (TILE_WIDTH * 0.4), y + (TILE_HEIGHT * 0.4));
    ctx.lineTo(x, y + TILE_HEIGHT * 0.8);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = shadeColor(color, -40);
    ctx.beginPath();
    ctx.moveTo(x + (TILE_WIDTH * 0.4), y - buildingHeight + (TILE_HEIGHT * 0.4));
    ctx.lineTo(x + (TILE_WIDTH * 0.4), y + (TILE_HEIGHT * 0.4));
    ctx.lineTo(x, y + TILE_HEIGHT * 0.8);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    // Add icon/text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = {
      desk_basic: '🖥️',
      desk_premium: '💻',
      coffee: '☕',
      meeting: '👥',
      plant: '🌱',
      server: '🖥️',
    };
    ctx.fillText(icons[buildingType] || '?', x, y - buildingHeight / 2);
  };

  const renderEmployee = (ctx, employee) => {
    const desk = state.agency.tiles[employee.deskId];
    if (!desk) return;

    const { x, y } = isoToScreen(desk.x, desk.y, TILE_WIDTH, TILE_HEIGHT);

    // Get character sprite variant based on employee ID
    const variantNumber = (parseInt(employee.id.replace(/\D/g, '')) % 4) + 1;
    const spriteName = `character_${variantNumber}`;

    // Try to draw sprite first
    if (sprites && sprites.has(spriteName)) {
      const sprite = sprites.get(spriteName);
      const offsetY = -sprite.height - 20; // Position above desk
      ctx.drawImage(sprite, x - sprite.width / 2, y + offsetY, sprite.width, sprite.height);
    } else {
      // Fallback to emoji
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👨‍💻', x, y - 50);
    }

    // Show status indicators
    ctx.font = '16px Arial';
    if (employee.energy < 30) {
      ctx.fillText('😴', x + 15, y - 60);
    }
    if (employee.happiness > 80) {
      ctx.fillText('😊', x + 15, y - 60);
    }
  };

  const handleCanvasClick = (e) => {
    // Don't select if we were dragging
    if (isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    // Adjust for camera transform
    const worldX = (canvasX - camera.x) / camera.zoom;
    const worldY = (canvasY - camera.y) / camera.zoom;

    const iso = screenToIso(worldX, worldY, TILE_WIDTH, TILE_HEIGHT);

    // Find tile at this position
    const tileIndex = state.agency.tiles.findIndex(
      (t) => t.x === iso.x && t.y === iso.y
    );

    if (tileIndex !== -1) {
      dispatch({ type: 'SELECT_TILE', payload: tileIndex });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) {
      // Left mouse button
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        setIsDragging(true);
        setCamera((prev) => ({
          ...prev,
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(2, camera.zoom * zoomFactor));

    setCamera((prev) => ({
      ...prev,
      zoom: newZoom,
    }));
  };

  return (
    <div className="office-canvas-container">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="office-canvas"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      <div className="canvas-controls">
        <button
          className="zoom-btn"
          onClick={() => setCamera((prev) => ({ ...prev, zoom: Math.min(2, prev.zoom * 1.2) }))}
          title="Zoom In"
        >
          +
        </button>
        <span className="zoom-level">{Math.round(camera.zoom * 100)}%</span>
        <button
          className="zoom-btn"
          onClick={() => setCamera((prev) => ({ ...prev, zoom: Math.max(0.5, prev.zoom / 1.2) }))}
          title="Zoom Out"
        >
          −
        </button>
        <button
          className="zoom-btn reset"
          onClick={() => setCamera({ x: 400, y: 100, zoom: 1 })}
          title="Reset View"
        >
          ⟲
        </button>
      </div>
    </div>
  );
};

// Helper function to shade colors
function shadeColor(color, percent) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export default OfficeCanvas;
