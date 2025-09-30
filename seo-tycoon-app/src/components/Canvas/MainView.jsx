import { useGame } from '../../state/context/GameContext';
import OfficeCanvas from './OfficeCanvas';
import EmployeesPanel from '../Game/EmployeesPanel';
import ProjectsPanel from '../Game/ProjectsPanel';
import ClientsPanel from '../Game/ClientsPanel';
import ResearchPanel from '../Game/ResearchPanel';
import MarketPanel from '../Game/MarketPanel';
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
        return <MarketPanel />;
      default:
        return <OfficeCanvas />;
    }
  };

  return <div className="main-view">{renderPanel()}</div>;
};

export default MainView;
