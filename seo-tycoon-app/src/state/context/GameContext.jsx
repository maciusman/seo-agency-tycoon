import { createContext, useContext, useReducer, useEffect } from 'react';
import { gameReducer } from '../reducers/gameReducer';
import { initialGameState } from '../initialState';

const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Game loop - tick every 100ms adjusted by speed
  useEffect(() => {
    if (state.isPaused) return;

    const tickInterval = 100 / state.gameSpeed;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, tickInterval);

    return () => clearInterval(interval);
  }, [state.isPaused, state.gameSpeed]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (!state.isPaused) {
        dispatch({ type: 'AUTO_SAVE' });
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [state.isPaused]);

  const value = {
    state,
    dispatch,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
