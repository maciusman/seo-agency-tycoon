# 🎮 SEO Agency Tycoon

A pixel-art isometric tycoon game where you build and manage your own SEO agency empire!

![Game Status](https://img.shields.io/badge/Status-MVP%20Phase%201-green)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%2B%20Vite-blue)

## 🎯 About The Game

**SEO Agency Tycoon** is a strategic management game where you:
- Build and design your office space
- Hire and manage SEO specialists
- Accept and complete client projects
- Grow from a small startup to a global agency empire

## ✨ Current Features (MVP Phase 1)

### 🏢 Office Management
- **Isometric Grid System**: 8x8 grid to design your office
- **Building Types**:
  - 🖥️ Basic Desk ($400)
  - 💻 Premium Desk ($1,200)
  - ☕ Coffee Station ($1,500) - Boosts happiness
  - 👥 Meeting Room ($3,000) - Team collaboration
  - 🌱 Plants ($200) - Small happiness boost
  - 🖥️ Server Room ($5,000) - For advanced projects

### 👥 Employee System
- **Hire Employees**: Junior, Mid, Senior levels
- **Specializations**: Content, Technical, Link Building, Keywords, Generalist
- **Stats Tracking**:
  - Energy (depletes while working)
  - Happiness (affected by office amenities)
  - Skills (5 categories: Content, Technical, Link Building, Keywords, Analytics)
- **Assignment**: Assign employees to desks and tasks

### 📊 Project Management
- **Accept Clients**: Multiple client types (Local Business, Startup, B2B, E-commerce)
- **Task System**: Each project breaks down into multiple tasks
  - Keyword Research
  - Content Creation
  - Technical Audit
  - Link Building
- **Progress Tracking**: Real-time progress bars for tasks and projects
- **Payments**: Earn money upon project completion

### ⏰ Time System
- **Real-time Gameplay**: 1 tick = 1 in-game minute
- **Time Controls**: Pause, 1x, 2x, 4x speed
- **Working Hours**: 9 AM - 6 PM (employees work during these hours)
- **Day/Week/Month Cycles**:
  - Daily: New clients appear
  - Weekly: Pay salaries
  - Monthly: Pay rent and upkeep

### 💾 Save/Load System
- Auto-save every 30 seconds
- Manual save button
- LocalStorage persistence

### 🎨 User Interface
- **Top Bar**: Money, Reputation, Time, Speed Controls
- **Left Navigation**: Switch between Office, Employees, Projects, Clients, Research, Market
- **Right Panel**: Notifications, Events, Quick Stats
- **Bottom Panel**: Context-sensitive controls (Building menu, Employee details)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/maciusman/seo-agency-tycoon.git

# Navigate to the app directory
cd seo-agency-tycoon/seo-tycoon-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

The game will be available at `http://localhost:5173`

## 🎮 How to Play

### Starting Out
1. **Build Desks**: Click on empty tiles in the Office view to build desks
2. **Hire Employees**: Go to Employees tab and click "Hire Employee"
3. **Assign to Desks**: Click "Assign to Desk" on employees without desks
4. **Accept Projects**: Go to Clients tab and accept available projects
5. **Assign Tasks**: In Projects tab, assign employees to specific tasks

### Growing Your Agency
- **Manage Energy**: Employees lose energy while working. Build coffee stations nearby to boost morale
- **Optimize Layout**: Place amenities strategically for maximum effect
- **Balance Workload**: Don't overwork employees - low energy reduces productivity
- **Expand**: As you earn money, hire more employees and build bigger offices

### Tips & Tricks
- 💡 Premium desks improve employee happiness
- ☕ Coffee stations should be within 3 tiles of desks
- 🌱 Plants provide small happiness boosts - place them everywhere!
- 💰 Complete projects to earn money and reputation
- ⏸️ Pause the game to plan your strategy
- 💾 Save regularly (though auto-save has your back!)

## 🎯 Gameplay Metrics

### Starting Resources
- **Money**: $10,000 (Normal difficulty)
- **Reputation**: 100
- **Employees**: 1 (Anna Kowalska - Junior Content Specialist)

### Costs
- **Salaries**: $800-$2,500/week (depending on level)
- **Rent**: $500/month
- **Buildings**: $200-$5,000 (one-time + upkeep)

### Revenue
- **Projects**: $1,500-$15,000 (depending on type)
- Local Business: $1,500
- Startup: $4,000
- B2B: $8,000
- E-commerce: $15,000

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **State Management**: React Context + useReducer
- **Rendering**: HTML5 Canvas (isometric view) + CSS/React (UI)
- **Storage**: LocalStorage (IndexedDB planned)
- **Styling**: CSS3 with custom pixel-art aesthetic

## 📅 Roadmap

### Phase 2 (In Progress)
- [ ] Enhanced employee AI and pathfinding
- [ ] Random events system (Google Updates, market changes)
- [ ] Research/Tech tree
- [ ] More building types
- [ ] Tutorial system

### Phase 3 (Planned)
- [ ] Advanced hiring (CV review, interviews)
- [ ] Competitor AI agencies
- [ ] Multi-location expansion
- [ ] Prestige system
- [ ] Achievements

### Phase 4 (Future)
- [ ] Advanced graphics and animations
- [ ] Sound effects and music
- [ ] Mobile responsive design
- [ ] Cloud saves
- [ ] Leaderboards

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📝 License

This project is currently unlicensed. All rights reserved.

## 🎨 Credits

- **Game Design & Development**: Built with Claude Code
- **Inspiration**: Game Dev Tycoon, Prison Architect, Stardew Valley, RimWorld

## 🐛 Known Issues

- Canvas rendering performance with 50+ employees needs optimization
- Some edge cases in task assignment need handling
- Mobile view not yet implemented

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/maciusman/seo-agency-tycoon/issues)
- **Documentation**: See `/Prompt Startowy dla Claude Code.md` and PRD

---

**Made with ❤️ and ☕ - Build your SEO empire today!**
