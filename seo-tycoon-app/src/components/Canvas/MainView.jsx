import { useGame } from '../../state/context/GameContext';
import OfficeCanvas from './OfficeCanvas';
import EmployeesPanel from '../Game/EmployeesPanel';
import ProjectsPanel from '../Game/ProjectsPanel';
import ClientsPanel from '../Game/ClientsPanel';
import ResearchPanel from '../Game/ResearchPanel';
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
        return <ResearchPanel />;
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
