import { useGame } from '../../state/context/GameContext';
import './LeftPanel.css';

const PANELS = [
  { id: 'office', icon: '🏢', label: 'Office' },
  { id: 'employees', icon: '👥', label: 'Employees' },
  { id: 'projects', icon: '📊', label: 'Projects' },
  { id: 'clients', icon: '🤝', label: 'Clients' },
  { id: 'research', icon: '🔬', label: 'Research' },
  { id: 'market', icon: '📈', label: 'Market' },
];

const LeftPanel = () => {
  const { state, dispatch } = useGame();

  const handlePanelChange = (panelId) => {
    dispatch({ type: 'CHANGE_PANEL', payload: panelId });
  };

  return (
    <div className="left-panel">
      <div className="panel-title">
        <h2>SEO Tycoon</h2>
      </div>
      <nav className="navigation">
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            className={`nav-btn ${state.ui.activePanel === panel.id ? 'active' : ''}`}
            onClick={() => handlePanelChange(panel.id)}
          >
            <span className="nav-icon">{panel.icon}</span>
            <span className="nav-label">{panel.label}</span>
          </button>
        ))}
      </nav>
      <div className="panel-footer">
        <div className="quick-stats">
          <div className="quick-stat">
            <span className="stat-icon">👨‍💻</span>
            <span className="stat-text">{state.agency.employees.length}</span>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">📋</span>
            <span className="stat-text">{state.agency.projects.filter(p => p.status === 'active').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
