import { GameProvider } from './state/context/GameContext';
import TopBar from './components/UI/TopBar';
import LeftPanel from './components/UI/LeftPanel';
import RightPanel from './components/UI/RightPanel';
import MainView from './components/Canvas/MainView';
import BottomPanel from './components/UI/BottomPanel';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app">
        <TopBar />
        <div className="main-content">
          <LeftPanel />
          <MainView />
          <RightPanel />
        </div>
        <BottomPanel />
      </div>
    </GameProvider>
  );
}

export default App;
