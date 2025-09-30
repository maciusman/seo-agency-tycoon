import { useGame } from '../../state/context/GameContext';
import './BottomPanel.css';

const BUILDING_COSTS = {
  desk_basic: 400,
  desk_premium: 1200,
  coffee: 1500,
  meeting: 3000,
  plant: 200,
  server: 5000,
};

const BUILDING_NAMES = {
  desk_basic: 'Basic Desk',
  desk_premium: 'Premium Desk',
  coffee: 'Coffee Station',
  meeting: 'Meeting Room',
  plant: 'Plant',
  server: 'Server Room',
};

const BUILDING_DESCRIPTIONS = {
  desk_basic: 'A simple desk for employees to work at.',
  desk_premium: 'A comfortable desk that boosts productivity.',
  coffee: 'Coffee station nearby boosts happiness and energy.',
  meeting: 'Meeting room for collaboration. Boosts team projects.',
  plant: 'Decorative plant. Small happiness boost.',
  server: 'Server room for technical projects. Required for advanced work.',
};

const BottomPanel = () => {
  const { state, dispatch } = useGame();

  const selectedTile = state.ui.selectedTile !== null ? state.agency.tiles[state.ui.selectedTile] : null;
  const selectedEmployee = state.ui.selectedEmployee
    ? state.agency.employees.find((e) => e.id === state.ui.selectedEmployee)
    : null;

  const handleBuild = (buildingType) => {
    if (selectedTile && !selectedTile.occupied) {
      dispatch({
        type: 'BUILD_ON_TILE',
        payload: {
          tileIndex: state.ui.selectedTile,
          buildingType,
          cost: BUILDING_COSTS[buildingType],
        },
      });
    }
  };

  const canAfford = (buildingType) => {
    return state.money >= BUILDING_COSTS[buildingType];
  };

  if (selectedEmployee) {
    return (
      <div className="bottom-panel">
        <div className="panel-header">
          <h3>Employee: {selectedEmployee.name} {selectedEmployee.surname}</h3>
        </div>
        <div className="panel-content">
          <div className="employee-info">
            <div className="info-row">
              <span>Type:</span>
              <span className="value">{selectedEmployee.type}</span>
            </div>
            <div className="info-row">
              <span>Specialization:</span>
              <span className="value">{selectedEmployee.specialization}</span>
            </div>
            <div className="info-row">
              <span>Energy:</span>
              <div className="progress-bar">
                <div
                  className="progress-fill energy"
                  style={{ width: `${selectedEmployee.energy}%` }}
                />
                <span className="progress-text">{Math.round(selectedEmployee.energy)}%</span>
              </div>
            </div>
            <div className="info-row">
              <span>Happiness:</span>
              <div className="progress-bar">
                <div
                  className="progress-fill happiness"
                  style={{ width: `${selectedEmployee.happiness}%` }}
                />
                <span className="progress-text">{Math.round(selectedEmployee.happiness)}%</span>
              </div>
            </div>
            <div className="info-row">
              <span>Salary:</span>
              <span className="value">${selectedEmployee.salary}/week</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTile) {
    return (
      <div className="bottom-panel">
        <div className="panel-header">
          <h3>
            Tile ({selectedTile.x}, {selectedTile.y})
          </h3>
        </div>
        <div className="panel-content">
          {selectedTile.occupied ? (
            <div className="tile-info">
              <p>Building: {BUILDING_NAMES[selectedTile.buildingType]}</p>
              <p className="description">{BUILDING_DESCRIPTIONS[selectedTile.buildingType]}</p>
              <button className="btn-demolish">Demolish</button>
            </div>
          ) : (
            <div className="build-menu">
              <h4>Build:</h4>
              <div className="building-grid">
                {Object.keys(BUILDING_COSTS).map((buildingType) => (
                  <button
                    key={buildingType}
                    className={`building-btn ${!canAfford(buildingType) ? 'disabled' : ''}`}
                    onClick={() => handleBuild(buildingType)}
                    disabled={!canAfford(buildingType)}
                    title={BUILDING_DESCRIPTIONS[buildingType]}
                  >
                    <div className="building-name">{BUILDING_NAMES[buildingType]}</div>
                    <div className="building-cost">${BUILDING_COSTS[buildingType]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-panel">
      <div className="panel-header">
        <h3>Welcome to SEO Agency Tycoon</h3>
      </div>
      <div className="panel-content">
        <p>Click on a tile to build or select an employee to view their stats.</p>
      </div>
    </div>
  );
};

export default BottomPanel;
