export const initialGameState = {
  // Global game state
  gameTime: 0, // Ticks since start
  gameDay: 1,
  gameHour: 9, // Start at 9 AM
  gameMinute: 0,
  isPaused: false,
  gameSpeed: 1, // 1x, 2x, 4x

  // Difficulty
  difficulty: 'normal',
  difficultyModifiers: [],

  // Player progress
  money: 10000, // Starting capital (Normal difficulty)
  prestigePoints: 0,
  prestigeLevel: 0,
  permanentUnlocks: [],
  achievements: [],

  // Single agency for MVP (multi-agency later)
  agency: {
    id: 'main-agency',
    name: 'My SEO Agency',
    location: {
      city: 'Warsaw',
      country: 'Poland',
      continent: 'Europe',
      timezone: 1,
      rentCost: 500,
    },
    gridSize: 8, // 8x8 grid for MVP
    isActive: true,

    // Office layout - initialize empty grid
    tiles: Array.from({ length: 8 * 8 }, (_, index) => ({
      x: index % 8,
      y: Math.floor(index / 8),
      type: 'floor', // floor, empty
      buildingType: null, // desk_basic, desk_premium, coffee, meeting, etc.
      occupied: false,
      metadata: {},
    })),

    // Employees (start with one example for demo)
    employees: [
      {
        id: 'emp-001',
        name: 'Anna',
        surname: 'Kowalska',
        avatar: '👩‍💻',
        type: 'junior',
        specialization: 'content',
        skills: {
          content: 5,
          technical: 2,
          linkBuilding: 3,
          keywords: 4,
          analytics: 2,
        },
        energy: 100,
        happiness: 80,
        loyalty: 70,
        experience: 0,
        salary: 800,
        deskId: null,
        assignedProjectId: null,
        assignedTaskId: null,
        traits: [],
        workPreferences: {
          preferredHours: 'morning',
          needsCoffee: true,
          prefersRemote: false,
          teamPlayer: true,
        },
        hireDate: 1,
        performanceHistory: [],
        completedProjects: 0,
      },
    ],

    // Projects
    projects: [],

    // Reputation (multi-dimensional)
    reputation: {
      public: 100,
      industry: 100,
      clientSatisfaction: 100,
      underground: 0,
      international: 0,
    },

    // Amenities
    amenities: [],

    // Financial tracking
    monthlyUpkeep: 500, // Starting with just rent
    monthlyRevenue: 0,
    profitHistory: [],
  },

  // Competitors (AI agencies)
  competitors: [
    {
      id: 'quickrank',
      name: 'QuickRank SEO',
      location: 'Warsaw',
      strength: 3,
      specialization: 'Local SEO',
      strategy: 'aggressive',
      marketShare: 25,
      reputation: 300,
      canBeAcquired: false,
      acquisitionPrice: 0,
      actions: [],
    },
    {
      id: 'seo-masters',
      name: 'SEO Masters Ltd',
      location: 'Warsaw',
      strength: 5,
      specialization: 'Enterprise',
      strategy: 'premium',
      marketShare: 40,
      reputation: 800,
      canBeAcquired: false,
      acquisitionPrice: 0,
      actions: [],
    },
  ],

  // Job applications (empty for now)
  jobApplications: [],

  // Available clients (market)
  availableClients: [
    {
      id: 'client-001',
      name: 'Local Bakery',
      type: 'local_business',
      budget: 1500,
      requirements: {
        content: 2,
        technical: 1,
        linkBuilding: 1,
      },
      deadline: null,
      requiredReputation: 0,
      expiresAt: null,
    },
  ],

  // Events system
  activeEvents: [],

  // Research & unlocks
  research: {
    availableResearch: [
      {
        id: 'ai-writing',
        name: 'AI Writing Assistant',
        cost: 5000,
        duration: 7,
        department: 'content',
        unlocks: ['ai_content_generation'],
      },
    ],
    completedResearch: [],
    activeResearch: {
      id: null,
      progress: 0,
      completionTime: 0,
    },
  },

  // Market data
  market: {
    currentCity: 'Warsaw',
    marketShare: {
      'My SEO Agency': 15,
      'QuickRank SEO': 25,
      'SEO Masters Ltd': 40,
      'LinkBuilders Pro': 10,
      Others: 10,
    },
    trends: [],
    demandByType: {},
    averagePrices: {},
  },

  // Save system
  saveData: {
    lastSave: Date.now(),
    saveSlot: 1,
    cloudSyncEnabled: false,
  },

  // UI state
  ui: {
    selectedTile: null,
    selectedEmployee: null,
    selectedProject: null,
    activePanel: 'office', // dashboard, office, projects, employees, clients, research, market, worldmap
    notifications: [],
    showModal: null,
  },
};
