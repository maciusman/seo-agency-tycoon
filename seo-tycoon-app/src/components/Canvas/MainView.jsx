import { useGame } from '../../state/context/GameContext';
import OfficeCanvas from './OfficeCanvas';
import EmployeesPanel from '../Game/EmployeesPanel';
import ProjectsPanel from '../Game/ProjectsPanel';
import ClientsPanel from '../Game/ClientsPanel';
import './MainView.css';

const MainView = () => {
  const { state } = useGame();

  const renderPanel = () => {
    switch (state.ui.activePanel) {
      case 'office':
        return <OfficeCanvas />;
      case 'employees':
        return <EmployeesPanel />;
      case 'projects':
        return <ProjectsPanel />;
      case 'clients':
        return <ClientsPanel />;
      case 'research':
        return (
          <div className="placeholder-panel">
            <h2>🔬 Research</h2>
            <p>Research & Development system coming soon!</p>
          </div>
        );
      case 'market':
        return (
          <div className="placeholder-panel">
            <h2>📈 Market Analysis</h2>
            <p>Market analysis and competition view coming soon!</p>
          </div>
        );
      default:
        return <OfficeCanvas />;
    }
  };

  return <div className="main-view">{renderPanel()}</div>;
};

export default MainView;
