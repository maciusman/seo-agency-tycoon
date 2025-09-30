# 🎮 Prompt Startowy dla Claude Code (Cursor)

```markdown
# SEO Agency Tycoon - Development Task

You are tasked with building **SEO Agency Tycoon**, a pixel-art isometric tycoon game where players manage and scale SEO agencies globally. This is a complex, strategic management game with deep mechanics.

## 📚 Documentation Available

You have access to two critical documents:
1. **Full conversation context** - Contains detailed discussion of all game mechanics, systems, and design decisions
2. **PRD.md** - Complete Product Requirements Document with technical specifications

**IMPORTANT**: Read both documents thoroughly before starting. They contain:
- Complete state management structure
- All game systems and their interactions
- UI/UX requirements
- Asset specifications
- Balancing guidelines
- Implementation priorities

## 🎯 Your Mission

Build this game step-by-step, following the implementation phases outlined in the PRD. Start with Phase 1 (Core MVP) and progressively add features.

## 🏗️ Technical Stack

- **Framework**: React (functional components, hooks)
- **Rendering**: HTML5 Canvas for isometric office view, CSS/React for UI panels
- **State Management**: React Context + useReducer for global game state
- **Storage**: LocalStorage for saves (IndexedDB as stretch goal)
- **Assets**: Pixel art sprites (64x32px isometric tiles, 32x64px characters)
- **No external game engines** - Build from scratch with React

## 📁 Project Structure (Recommended)

```
/src
  /components
    /UI           # React UI components (panels, modals, buttons)
    /Canvas       # Canvas rendering components
    /Game         # Game logic components
  /systems
    /time         # Time management system
    /employees    # Employee management
    /projects     # Project & task system
    /competitors  # AI competitor logic
    /events       # Random events system
    /research     # R&D tree
  /state
    /context      # React context
    /reducers     # State reducers
    /actions      # Action creators
  /utils
    /rendering    # Isometric math, sprite rendering
    /pathfinding  # A* for employee movement
    /helpers      # General utilities
  /assets
    /sprites      # Sprite sheets (temporary placeholders OK initially)
    /data         # JSON data (employees types, events, research)
  /data
    /employees.json    # Employee type definitions
    /projects.json     # Project templates
    /events.json       # Event definitions
    /research.json     # Research tree data
    /locations.json    # City/location data
```

## 🚀 Phase 1: Core MVP - Start Here

### Step 1: Setup & State Foundation
1. Create React app structure
2. Implement global state management with Context + useReducer
3. Define core state shape (refer to PRD Technical Architecture section)
4. Implement time system (real-time with pause, 1x/2x/4x speed)
5. Create basic save/load to LocalStorage

### Step 2: Isometric Rendering Engine
1. Setup Canvas component for main viewport
2. Implement isometric math (screen to iso, iso to screen)
3. Create grid rendering (4x4 to start)
4. Implement tile highlighting on hover/click
5. Add basic z-index sorting for proper layering

### Step 3: Office Building System
1. Implement tile selection
2. Create building menu (bottom panel)
3. Add desk placement logic
4. Basic collision detection
5. Visual feedback for valid/invalid placement

### Step 4: Employee System (Simplified)
1. Create employee data structure
2. Implement hiring (simplified - instant hire, no CV review yet)
3. Employee rendering on canvas (simple sprites/emojis as placeholder)
4. Assign employee to desk
5. Basic stats display (energy, happiness)

### Step 5: Simple Project System
1. One project type (e.g., "Local Business SEO")
2. Auto-generate 3-5 tasks
3. Manual task assignment (drag employee to task or click-based)
4. Progress calculation based on employee skill
5. Project completion → payment

### Step 6: Basic UI
1. Top status bar (money, day counter, time controls)
2. Left navigation panel
3. Right notifications panel
4. Bottom context panel (dynamic based on selection)

**Deliverable**: Playable MVP where you can:
- Build desks
- Hire employees
- Accept a project
- Assign employees to tasks
- Watch progress
- Complete project and earn money
- Save/load game

---

## 🎨 Asset Guidelines

### For Phase 1 MVP:
- **Placeholders are fine**: Use colored rectangles, emoji, or simple SVG
- Focus on functionality over visuals
- Suggested placeholders:
  - Tiles: Colored divs with CSS transform for isometric effect
  - Employees: Emoji (👨‍💻, 👩‍💼, etc.)
  - Buildings: Unicode symbols (🖥️, ☕, 🪑)

### For Later Phases:
- Real pixel art sprites (64x32px tiles, 32x64px characters)
- Can use Kenney.nl assets (free), or create custom
- Sprite sheet format with coordinate mapping

---

## ⚠️ Critical Implementation Notes

### State Management
- **Use immutable updates** - Always spread/copy objects
- **Avoid direct mutations** - Will cause render bugs
- **Use useReducer for complex state** - Easier to debug than many useStates
- **Separate game logic from UI** - Systems should be pure functions

### Isometric Math
```javascript
// Screen to Isometric
function screenToIso(screenX, screenY) {
  const tileWidth = 64;
  const tileHeight = 32;
  const isoX = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2;
  const isoY = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2;
  return { x: Math.floor(isoX), y: Math.floor(isoY) };
}

// Isometric to Screen
function isoToScreen(isoX, isoY) {
  const tileWidth = 64;
  const tileHeight = 32;
  const screenX = (isoX - isoY) * (tileWidth / 2);
  const screenY = (isoX + isoY) * (tileHeight / 2);
  return { x: screenX, y: screenY };
}

// Z-index for layering
function calculateZIndex(isoX, isoY) {
  return isoX + isoY;
}
```

### Time System
```javascript
// Core game loop
useEffect(() => {
  if (isPaused) return;
  
  const interval = setInterval(() => {
    dispatch({ type: 'TICK' });
    // Process all time-based logic in reducer
  }, 100 / gameSpeed); // 100ms base, adjusted by speed
  
  return () => clearInterval(interval);
}, [isPaused, gameSpeed]);
```

### Canvas Rendering
```javascript
// Efficient rendering pattern
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Render in layers
  renderFloor(ctx, tiles);
  renderBuildings(ctx, buildings);
  renderEmployees(ctx, employees);
  renderEffects(ctx, effects);
  
}, [tiles, buildings, employees, effects]);
```

---

## 🧪 Testing & Validation

For each feature, test:
1. **Happy path**: Normal usage works
2. **Edge cases**: What if player has no money? No employees? Grid is full?
3. **State consistency**: Save/load preserves game state exactly
4. **Performance**: 60 FPS with 50 employees, 100 tiles
5. **UI feedback**: Every action has clear visual response

---

## 📊 Success Metrics for MVP

- [ ] Can build 4x4 office with desks
- [ ] Can hire at least 2 employees
- [ ] Can accept and complete 1 project
- [ ] Money increases on project completion
- [ ] Time passes in real-time with pause
- [ ] Can save and reload game
- [ ] Game runs at 60 FPS
- [ ] No console errors during normal play
- [ ] Game state remains consistent after save/load

---

## 🎯 Development Approach

### Recommended Workflow:
1. **Read all documentation first** - Understand the full scope
2. **Build systems incrementally** - One at a time, fully functional
3. **Test frequently** - After each major feature
4. **Commit often** - Small, logical commits
5. **Placeholder first, polish later** - Function over form initially
6. **Ask for clarification** - If PRD is unclear, flag it

### Don't Do:
- ❌ Skip reading the PRD
- ❌ Build everything at once
- ❌ Optimize prematurely
- ❌ Add features not in PRD (yet)
- ❌ Use external libraries unless necessary

### Do Do:
- ✅ Follow PRD specifications exactly
- ✅ Keep code modular and organized
- ✅ Comment complex logic
- ✅ Use meaningful variable names
- ✅ Think about performance (but don't over-optimize)

---

## 🚨 Common Pitfalls to Avoid

1. **Isometric rendering is hard** - Start simple, test each piece
2. **State management complexity** - Keep reducer functions pure
3. **Canvas performance** - Don't re-render unnecessarily, use layers
4. **Time-based logic** - Be careful with intervals, cleanup properly
5. **Deep object updates** - Use proper immutable patterns
6. **Over-engineering** - Build what's needed now, not what might be needed

---

## 📞 Communication

As you work:
- **Ask questions** if requirements are unclear
- **Propose alternatives** if you see a better approach
- **Flag issues** in the PRD if you find contradictions
- **Share progress** at each phase completion
- **Request feedback** before moving to next phase

---

## 🏁 Starting Point

Begin with:
```bash
# Setup
npx create-react-app seo-agency-tycoon
cd seo-agency-tycoon

# First task: Implement global state management
# Refer to PRD "Technical Architecture Requirements" section
# Create GameContext with initial state shape
```

Your first concrete task:
1. Create `/src/state/GameContext.js` with initial state structure from PRD
2. Create `/src/state/gameReducer.js` with basic actions (TICK, PAUSE, SET_SPEED)
3. Wrap App in GameProvider
4. Create simple UI showing money and day counter that updates with TICK

**Good luck! Build something amazing! 🚀**
```

---

Ten prompt możesz skopiować i wkleić jako pierwszy message do Claude Code w Cursor. Zawiera:

✅ Jasne wskazówki co i jak budować  
✅ Odniesienia do PRD  
✅ Konkretną strukturę projektu  
✅ Przykłady kodu dla trudnych części  
✅ Listę rzeczy do unikania  
✅ Konkretny punkt startowy (pierwsze zadanie)  
✅ Metryki sukcesu dla MVP  

Claude Code będzie wiedział dokładnie od czego zacząć i jak podejść do implementacji! 🎮