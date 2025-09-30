import { useEffect, useRef } from 'react';
import { useGame } from '../../state/context/GameContext';
import { isoToScreen, screenToIso } from '../../utils/rendering/isometric';
import './OfficeCanvas.css';

const OfficeCanvas = () => {
  const canvasRef = useRef(null);
  const { state, dispatch } = useGame();

  const TILE_WIDTH = 64;
  const TILE_HEIGHT = 32;
  const GRID_SIZE = state.agency.gridSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    renderOffice(ctx);
  }, [state.agency.tiles, state.agency.employees, state.ui.selectedTile]);

  const renderOffice = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Center the viewport
    ctx.save();
    ctx.translate(400, 100);

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

    // Draw tile base (floor)
    ctx.fillStyle = tile.type === 'floor' ? '#8fbc8f' : '#a0a0a0';
    if (isSelected) {
      ctx.fillStyle = '#ffd700';
    }

    drawIsoDiamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);

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

    // Draw simple character (placeholder)
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(x, y - 50, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw character icon
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👨‍💻', x, y - 50);

    // Show status indicators
    if (employee.energy < 30) {
      ctx.fillText('😴', x + 15, y - 60);
    }
    if (employee.happiness > 80) {
      ctx.fillText('😊', x + 15, y - 60);
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    // Adjust for translation
    const worldX = canvasX - 400;
    const worldY = canvasY - 100;

    const iso = screenToIso(worldX, worldY, TILE_WIDTH, TILE_HEIGHT);

    // Find tile at this position
    const tileIndex = state.agency.tiles.findIndex(
      (t) => t.x === iso.x && t.y === iso.y
    );

    if (tileIndex !== -1) {
      dispatch({ type: 'SELECT_TILE', payload: tileIndex });
    }
  };

  return (
    <div className="office-canvas-container">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        onClick={handleCanvasClick}
        className="office-canvas"
      />
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
