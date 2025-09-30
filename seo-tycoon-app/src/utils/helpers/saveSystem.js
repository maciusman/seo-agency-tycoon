const SAVE_KEY = 'seo-tycoon-save';

export const saveGameToStorage = (gameState) => {
  try {
    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      gameState,
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('Game saved successfully');
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
};

export const loadGameFromStorage = () => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);

    if (!savedData) {
      console.log('No saved game found');
      return null;
    }

    const parsedData = JSON.parse(savedData);
    console.log('Game loaded successfully');
    return parsedData.gameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

export const deleteSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    console.log('Save deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete save:', error);
    return false;
  }
};

export const hasSavedGame = () => {
  return localStorage.getItem(SAVE_KEY) !== null;
};
