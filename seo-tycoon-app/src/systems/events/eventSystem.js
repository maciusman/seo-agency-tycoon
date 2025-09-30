import eventsData from '../../data/events.json';

// Track triggered events to respect cooldowns and max occurrences
const triggeredEvents = {};

export function checkAndTriggerEvents(state) {
  // Random chance to trigger event (5% per day)
  const eventChance = 0.05 * getDifficultyMultiplier(state.difficulty);

  if (Math.random() > eventChance) {
    return null;
  }

  // Get available events
  const availableEvents = eventsData.filter((event) => {
    // Check if event can trigger
    if (!canTriggerEvent(event, state)) {
      return false;
    }

    return true;
  });

  if (availableEvents.length === 0) {
    return null;
  }

  // Pick random event weighted by severity
  const weights = {
    low: 3,
    medium: 2,
    high: 1,
  };

  const weightedEvents = [];
  availableEvents.forEach((event) => {
    const weight = weights[event.severity] || 1;
    for (let i = 0; i < weight; i++) {
      weightedEvents.push(event);
    }
  });

  const randomEvent = weightedEvents[Math.floor(Math.random() * weightedEvents.length)];

  // Mark as triggered
  if (!triggeredEvents[randomEvent.id]) {
    triggeredEvents[randomEvent.id] = {
      count: 0,
      lastTriggered: 0,
    };
  }

  triggeredEvents[randomEvent.id].count++;
  triggeredEvents[randomEvent.id].lastTriggered = state.gameDay;

  return {
    ...randomEvent,
    triggeredDay: state.gameDay,
    endDay: state.gameDay + (randomEvent.duration || 0),
    selectedChoice: null,
  };
}

function canTriggerEvent(event, state) {
  const conditions = event.triggerConditions;

  // Check minimum day
  if (conditions.minGameDay && state.gameDay < conditions.minGameDay) {
    return false;
  }

  // Check max occurrences
  if (conditions.maxOccurrences) {
    const eventHistory = triggeredEvents[event.id];
    if (eventHistory && eventHistory.count >= conditions.maxOccurrences) {
      return false;
    }
  }

  // Check cooldown
  if (conditions.cooldown) {
    const eventHistory = triggeredEvents[event.id];
    if (eventHistory) {
      const daysSinceLastTrigger = state.gameDay - eventHistory.lastTriggered;
      if (daysSinceLastTrigger < conditions.cooldown) {
        return false;
      }
    }
  }

  // Check minimum completed projects
  if (conditions.minCompletedProjects) {
    const completedCount = state.agency.projects.filter((p) => p.status === 'completed').length;
    if (completedCount < conditions.minCompletedProjects) {
      return false;
    }
  }

  // Check minimum failed projects
  if (conditions.minFailedProjects) {
    const failedCount = state.agency.projects.filter((p) => p.status === 'failed').length;
    if (failedCount < conditions.minFailedProjects) {
      return false;
    }
  }

  // Check average employee energy
  if (conditions.avgEmployeeEnergy) {
    if (state.agency.employees.length === 0) return false;

    const avgEnergy =
      state.agency.employees.reduce((sum, e) => sum + e.energy, 0) / state.agency.employees.length;

    if (avgEnergy > conditions.avgEmployeeEnergy) {
      return false;
    }
  }

  // Check minimum reputation
  if (conditions.minReputation && state.agency.reputation.public < conditions.minReputation) {
    return false;
  }

  return true;
}

export function applyEventChoice(state, event, choice) {
  let newState = { ...state };

  // Check if player can afford
  if (choice.cost && newState.money < choice.cost) {
    return {
      ...newState,
      ui: {
        ...newState.ui,
        notifications: [
          ...newState.ui.notifications,
          {
            id: Date.now(),
            message: 'Not enough money for this choice!',
            type: 'error',
            timestamp: state.gameTime,
          },
        ],
      },
    };
  }

  // Deduct cost
  if (choice.cost) {
    newState.money -= choice.cost;
  }

  // Apply immediate effects
  newState = applyEffects(newState, choice.effects);

  // Handle success/failure chances
  if (choice.successChance) {
    const success = Math.random() < choice.successChance;
    if (success && choice.successEffects) {
      newState = applyEffects(newState, choice.successEffects);
      newState = addNotification(
        newState,
        `Success! ${choice.label} worked out!`,
        'success'
      );
    } else if (!success && choice.failureEffects) {
      newState = applyEffects(newState, choice.failureEffects);
      newState = addNotification(
        newState,
        `Failed! ${choice.label} didn't work out...`,
        'error'
      );
    }
  }

  // Update event as resolved
  newState.activeEvents = newState.activeEvents.map((e) =>
    e.id === event.id ? { ...e, selectedChoice: choice.id, resolved: true } : e
  );

  return newState;
}

function applyEffects(state, effects) {
  let newState = { ...state };

  // Money effects
  if (effects.money) {
    newState.money += effects.money;
  }

  // Reputation effects
  if (effects.reputation) {
    newState.agency.reputation.public += effects.reputation;
  }

  // All projects productivity
  if (effects.allProjectsProductivity !== undefined) {
    // Store as modifier to be applied during tick
    newState.modifiers = newState.modifiers || {};
    newState.modifiers.projectsProductivity =
      (newState.modifiers.projectsProductivity || 0) + effects.allProjectsProductivity;
  }

  // All employees effects
  if (effects.allEmployeesEnergy) {
    newState.agency.employees = newState.agency.employees.map((emp) => ({
      ...emp,
      energy: Math.min(100, emp.energy + effects.allEmployeesEnergy),
    }));
  }

  if (effects.allEmployeesHappiness) {
    newState.agency.employees = newState.agency.employees.map((emp) => ({
      ...emp,
      happiness: Math.min(100, emp.happiness + effects.allEmployeesHappiness),
    }));
  }

  if (effects.allEmployeesLoyalty) {
    newState.agency.employees = newState.agency.employees.map((emp) => ({
      ...emp,
      loyalty: Math.min(100, emp.loyalty + effects.allEmployeesLoyalty),
    }));
  }

  if (effects.allEmployeesExperience) {
    newState.agency.employees = newState.agency.employees.map((emp) => ({
      ...emp,
      experience: emp.experience + effects.allEmployeesExperience,
    }));
  }

  // Pause all projects
  if (effects.pauseAllProjects) {
    newState.agency.projects = newState.agency.projects.map((proj) => ({
      ...proj,
      paused: true,
    }));
  }

  // New clients
  if (effects.newClients) {
    // Generate new clients
    for (let i = 0; i < effects.newClients; i++) {
      newState.availableClients.push(generateRandomClient(newState.gameDay));
    }
  }

  return newState;
}

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
    id: `client-event-${day}-${Date.now()}`,
    name: `${type.replace('_', ' ').toUpperCase()} Client`,
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

function addNotification(state, message, type = 'info') {
  return {
    ...state,
    ui: {
      ...state.ui,
      notifications: [
        ...state.ui.notifications,
        {
          id: Date.now(),
          message,
          type,
          timestamp: state.gameTime,
        },
      ],
    },
  };
}

function getDifficultyMultiplier(difficulty) {
  const multipliers = {
    casual: 0.5,
    normal: 1.0,
    hard: 1.5,
    nightmare: 2.0,
  };

  return multipliers[difficulty] || 1.0;
}
