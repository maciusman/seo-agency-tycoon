import { saveGameToStorage, loadGameFromStorage } from '../../utils/helpers/saveSystem';

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'TICK': {
      // Update game time
      const newGameTime = state.gameTime + 1;
      let newMinute = state.gameMinute + 1;
      let newHour = state.gameHour;
      let newDay = state.gameDay;

      // Time progression: 1 tick = 1 minute
      if (newMinute >= 60) {
        newMinute = 0;
        newHour += 1;
      }

      if (newHour >= 24) {
        newHour = 0;
        newDay += 1;
      }

      const newState = {
        ...state,
        gameTime: newGameTime,
        gameMinute: newMinute,
        gameHour: newHour,
        gameDay: newDay,
      };

      // Process game logic
      return processGameTick(newState);
    }

    case 'PAUSE': {
      return {
        ...state,
        isPaused: !state.isPaused,
      };
    }

    case 'SET_SPEED': {
      return {
        ...state,
        gameSpeed: action.payload,
      };
    }

    case 'SELECT_TILE': {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedTile: action.payload,
          selectedEmployee: null,
        },
      };
    }

    case 'SELECT_EMPLOYEE': {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedEmployee: action.payload,
          selectedTile: null,
        },
      };
    }

    case 'BUILD_ON_TILE': {
      const { tileIndex, buildingType, cost } = action.payload;

      if (state.money < cost) {
        return addNotification(state, 'Not enough money!', 'error');
      }

      const newTiles = [...state.agency.tiles];
      newTiles[tileIndex] = {
        ...newTiles[tileIndex],
        buildingType,
        occupied: true,
      };

      return {
        ...state,
        money: state.money - cost,
        agency: {
          ...state.agency,
          tiles: newTiles,
        },
        ui: {
          ...state.ui,
          selectedTile: null,
        },
      };
    }

    case 'HIRE_EMPLOYEE': {
      const { employee, hireCost } = action.payload;

      if (state.money < hireCost) {
        return addNotification(state, 'Not enough money to hire!', 'error');
      }

      const newEmployee = {
        ...employee,
        id: `emp-${Date.now()}`,
        hireDate: state.gameDay,
      };

      return {
        ...state,
        money: state.money - hireCost,
        agency: {
          ...state.agency,
          employees: [...state.agency.employees, newEmployee],
        },
      };
    }

    case 'ASSIGN_EMPLOYEE_TO_DESK': {
      const { employeeId, deskTileIndex } = action.payload;

      const newEmployees = state.agency.employees.map((emp) =>
        emp.id === employeeId ? { ...emp, deskId: deskTileIndex } : emp
      );

      return {
        ...state,
        agency: {
          ...state.agency,
          employees: newEmployees,
        },
      };
    }

    case 'ACCEPT_PROJECT': {
      const { project } = action.payload;

      const newProject = {
        ...project,
        id: `proj-${Date.now()}`,
        acceptedDate: state.gameDay,
        status: 'active',
        overallProgress: 0,
        tasks: generateProjectTasks(project.type),
      };

      return {
        ...state,
        agency: {
          ...state.agency,
          projects: [...state.agency.projects, newProject],
        },
        availableClients: state.availableClients.filter((c) => c.id !== project.id),
      };
    }

    case 'ASSIGN_EMPLOYEE_TO_TASK': {
      const { projectId, taskId, employeeId } = action.payload;

      const newProjects = state.agency.projects.map((proj) => {
        if (proj.id === projectId) {
          const newTasks = proj.tasks.map((task) =>
            task.id === taskId ? { ...task, assignedEmployeeId: employeeId, status: 'in_progress' } : task
          );
          return { ...proj, tasks: newTasks };
        }
        return proj;
      });

      const newEmployees = state.agency.employees.map((emp) =>
        emp.id === employeeId ? { ...emp, assignedProjectId: projectId, assignedTaskId: taskId } : emp
      );

      return {
        ...state,
        agency: {
          ...state.agency,
          projects: newProjects,
          employees: newEmployees,
        },
      };
    }

    case 'SAVE_GAME': {
      saveGameToStorage(state);
      return {
        ...state,
        saveData: {
          ...state.saveData,
          lastSave: Date.now(),
        },
      };
    }

    case 'AUTO_SAVE': {
      saveGameToStorage(state);
      return {
        ...state,
        saveData: {
          ...state.saveData,
          lastSave: Date.now(),
        },
      };
    }

    case 'LOAD_GAME': {
      const loadedState = loadGameFromStorage();
      return loadedState || state;
    }

    case 'ADD_NOTIFICATION': {
      return addNotification(state, action.payload.message, action.payload.type);
    }

    case 'CLEAR_NOTIFICATION': {
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter((n) => n.id !== action.payload),
        },
      };
    }

    case 'CHANGE_PANEL': {
      return {
        ...state,
        ui: {
          ...state.ui,
          activePanel: action.payload,
        },
      };
    }

    default:
      return state;
  }
};

// Helper function to process each game tick
function processGameTick(state) {
  let newState = { ...state };

  // Only process during working hours (9-18)
  if (state.gameHour >= 9 && state.gameHour < 18) {
    // Update employee energy and happiness every 10 ticks (10 minutes)
    if (state.gameTime % 10 === 0) {
      newState = updateEmployeeStats(newState);
    }

    // Update project progress every tick if employees are working
    newState = updateProjectProgress(newState);
  }

  // Daily events at midnight
  if (state.gameHour === 0 && state.gameMinute === 0) {
    newState = processDailyEvents(newState);
  }

  // Weekly events on Monday at midnight
  if (state.gameDay % 7 === 1 && state.gameHour === 0 && state.gameMinute === 0) {
    newState = processWeeklyEvents(newState);
  }

  // Monthly events on day 1 at midnight
  if (state.gameDay % 30 === 1 && state.gameHour === 0 && state.gameMinute === 0) {
    newState = processMonthlyEvents(newState);
  }

  return newState;
}

// Update employee energy and happiness
function updateEmployeeStats(state) {
  const newEmployees = state.agency.employees.map((emp) => {
    let energy = emp.energy;
    let happiness = emp.happiness;

    // Working drains energy
    if (emp.assignedTaskId) {
      energy = Math.max(0, energy - 1);
    } else {
      // Idle employees regenerate energy slowly
      energy = Math.min(100, energy + 0.5);
    }

    // Check for nearby amenities
    if (emp.deskId !== null) {
      const deskTile = state.agency.tiles[emp.deskId];
      const amenitiesNearby = checkAmenitiesNearDesk(state, deskTile);

      if (amenitiesNearby.coffee) {
        happiness = Math.min(100, happiness + 0.2);
      }
      if (amenitiesNearby.plant) {
        happiness = Math.min(100, happiness + 0.1);
      }
    }

    // Low energy reduces happiness
    if (energy < 20) {
      happiness = Math.max(0, happiness - 0.5);
    }

    return { ...emp, energy, happiness };
  });

  return {
    ...state,
    agency: {
      ...state.agency,
      employees: newEmployees,
    },
  };
}

// Update project progress
function updateProjectProgress(state) {
  const newProjects = state.agency.projects.map((project) => {
    if (project.status !== 'active') return project;

    const newTasks = project.tasks.map((task) => {
      if (task.status !== 'in_progress' || !task.assignedEmployeeId) return task;

      const employee = state.agency.employees.find((e) => e.id === task.assignedEmployeeId);
      if (!employee) return task;

      // Calculate progress based on employee skill and energy
      const skillLevel = employee.skills[task.requiredSkill] || 1;
      const energyMultiplier = employee.energy / 100;
      const progressPerTick = (skillLevel * energyMultiplier * 0.5) / 60; // Per minute

      const newProgress = Math.min(100, task.progress + progressPerTick);
      const newStatus = newProgress >= 100 ? 'completed' : 'in_progress';

      return { ...task, progress: newProgress, status: newStatus };
    });

    // Calculate overall project progress
    const totalProgress = newTasks.reduce((sum, task) => sum + task.progress, 0);
    const overallProgress = totalProgress / newTasks.length;

    const projectStatus = newTasks.every((t) => t.status === 'completed') ? 'completed' : 'active';

    return {
      ...project,
      tasks: newTasks,
      overallProgress,
      status: projectStatus,
    };
  });

  // Pay for completed projects
  let money = state.money;
  let newNotifications = [...state.ui.notifications];

  newProjects.forEach((project, index) => {
    const oldProject = state.agency.projects[index];
    if (oldProject && oldProject.status === 'active' && project.status === 'completed') {
      money += project.budget;
      newNotifications.push({
        id: Date.now() + index,
        message: `Project "${project.clientName}" completed! +$${project.budget}`,
        type: 'success',
        timestamp: state.gameTime,
      });
    }
  });

  return {
    ...state,
    money,
    agency: {
      ...state.agency,
      projects: newProjects,
    },
    ui: {
      ...state.ui,
      notifications: newNotifications,
    },
  };
}

// Daily events
function processDailyEvents(state) {
  // Add new client opportunities
  const newClient = generateRandomClient(state.gameDay);

  return {
    ...state,
    availableClients: [...state.availableClients, newClient],
  };
}

// Weekly events
function processWeeklyEvents(state) {
  // Pay salaries
  const totalSalaries = state.agency.employees.reduce((sum, emp) => sum + emp.salary, 0);
  const newMoney = state.money - totalSalaries;

  return {
    ...state,
    money: newMoney,
  };
}

// Monthly events
function processMonthlyEvents(state) {
  // Pay rent and upkeep
  const totalCosts = state.agency.monthlyUpkeep;
  const newMoney = state.money - totalCosts;

  return {
    ...state,
    money: newMoney,
  };
}

// Helper: Check amenities near desk
function checkAmenitiesNearDesk(state, deskTile) {
  const amenities = {
    coffee: false,
    plant: false,
    meeting: false,
  };

  // Check adjacent tiles for amenities
  const adjacentOffsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  adjacentOffsets.forEach(([dx, dy]) => {
    const x = deskTile.x + dx;
    const y = deskTile.y + dy;
    const tile = state.agency.tiles.find((t) => t.x === x && t.y === y);

    if (tile) {
      if (tile.buildingType === 'coffee') amenities.coffee = true;
      if (tile.buildingType === 'plant') amenities.plant = true;
      if (tile.buildingType === 'meeting') amenities.meeting = true;
    }
  });

  return amenities;
}

// Generate random client
function generateRandomClient(day) {
  const types = ['local_business', 'startup', 'b2b', 'ecommerce'];
  const type = types[Math.floor(Math.random() * types.length)];

  const budgets = {
    local_business: 1500,
    startup: 4000,
    b2b: 8000,
    ecommerce: 15000,
  };

  return {
    id: `client-${day}-${Date.now()}`,
    name: `Client ${day}`,
    type,
    budget: budgets[type],
    requirements: {
      content: Math.floor(Math.random() * 3) + 1,
      technical: Math.floor(Math.random() * 3) + 1,
      linkBuilding: Math.floor(Math.random() * 3) + 1,
    },
    deadline: null,
    requiredReputation: 0,
    expiresAt: day + 7,
  };
}

// Generate project tasks
function generateProjectTasks(projectType) {
  const baseTasks = [
    {
      id: 'task-1',
      name: 'Keyword Research',
      type: 'keyword_research',
      progress: 0,
      assignedEmployeeId: null,
      requiredSkill: 'keywords',
      estimatedTime: 10,
      status: 'pending',
    },
    {
      id: 'task-2',
      name: 'Content Creation',
      type: 'content_creation',
      progress: 0,
      assignedEmployeeId: null,
      requiredSkill: 'content',
      estimatedTime: 30,
      status: 'pending',
    },
    {
      id: 'task-3',
      name: 'Technical Audit',
      type: 'technical_audit',
      progress: 0,
      assignedEmployeeId: null,
      requiredSkill: 'technical',
      estimatedTime: 15,
      status: 'pending',
    },
    {
      id: 'task-4',
      name: 'Link Building',
      type: 'link_building',
      progress: 0,
      assignedEmployeeId: null,
      requiredSkill: 'linkBuilding',
      estimatedTime: 25,
      status: 'pending',
    },
  ];

  return baseTasks;
}

// Add notification
function addNotification(state, message, type = 'info') {
  const notification = {
    id: Date.now(),
    message,
    type,
    timestamp: state.gameTime,
  };

  return {
    ...state,
    ui: {
      ...state.ui,
      notifications: [...state.ui.notifications, notification],
    },
  };
}
