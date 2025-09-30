import { useGame } from '../../state/context/GameContext';
import './TopBar.css';

const TopBar = () => {
  const { state, dispatch } = useGame();

  const handlePause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const handleSpeedChange = (speed) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  };

  const handleSave = () => {
    dispatch({ type: 'SAVE_GAME' });
  };

  const formatMoney = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatTime = () => {
    const hour = String(state.gameHour).padStart(2, '0');
    const minute = String(state.gameMinute).padStart(2, '0');
    return `Day ${state.gameDay}, ${hour}:${minute}`;
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="stat-box">
          <span className="stat-label">Money:</span>
          <span className={`stat-value ${state.money < 0 ? 'negative' : 'positive'}`}>
            {formatMoney(state.money)}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Reputation:</span>
          <span className="stat-value">{state.agency.reputation.public}</span>
        </div>
      </div>

      <div className="top-bar-center">
        <div className="time-display">{formatTime()}</div>
      </div>

      <div className="top-bar-right">
        <div className="time-controls">
          <button
            className={`btn-control ${state.isPaused ? 'active' : ''}`}
            onClick={handlePause}
            title={state.isPaused ? 'Resume' : 'Pause'}
          >
            {state.isPaused ? '▶' : '⏸'}
          </button>
          <button
            className={`btn-control ${state.gameSpeed === 1 ? 'active' : ''}`}
            onClick={() => handleSpeedChange(1)}
            title="Normal Speed"
          >
            1x
          </button>
          <button
            className={`btn-control ${state.gameSpeed === 2 ? 'active' : ''}`}
            onClick={() => handleSpeedChange(2)}
            title="Double Speed"
          >
            2x
          </button>
          <button
            className={`btn-control ${state.gameSpeed === 4 ? 'active' : ''}`}
            onClick={() => handleSpeedChange(4)}
            title="Quadruple Speed"
          >
            4x
          </button>
        </div>
        <button className="btn-save" onClick={handleSave} title="Save Game">
          💾 Save
        </button>
      </div>
    </div>
  );
};

export default TopBar;
