// A* Pathfinding implementation for isometric grid

class Node {
  constructor(x, y, walkable = true) {
    this.x = x;
    this.y = y;
    this.walkable = walkable;
    this.g = 0; // Cost from start
    this.h = 0; // Heuristic cost to end
    this.f = 0; // Total cost (g + h)
    this.parent = null;
  }
}

// Calculate Manhattan distance heuristic
function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

// Get neighbors of a node
function getNeighbors(node, grid, gridSize) {
  const neighbors = [];
  const directions = [
    { x: 0, y: -1 }, // North
    { x: 1, y: 0 },  // East
    { x: 0, y: 1 },  // South
    { x: -1, y: 0 }, // West
  ];

  for (const dir of directions) {
    const newX = node.x + dir.x;
    const newY = node.y + dir.y;

    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
      const neighborNode = grid[newY][newX];
      if (neighborNode.walkable) {
        neighbors.push(neighborNode);
      }
    }
  }

  return neighbors;
}

// Find path using A* algorithm
export function findPath(startX, startY, endX, endY, tiles, gridSize) {
  // Create grid of nodes
  const grid = [];
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      const tile = tiles.find((t) => t.x === x && t.y === y);
      const walkable = tile && !tile.occupied;
      grid[y][x] = new Node(x, y, walkable);
    }
  }

  const startNode = grid[startY][startX];
  const endNode = grid[endY][endX];

  // Make end node walkable so we can reach it
  endNode.walkable = true;

  const openList = [];
  const closedList = [];

  openList.push(startNode);

  while (openList.length > 0) {
    // Find node with lowest f cost
    let currentNode = openList[0];
    let currentIndex = 0;

    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < currentNode.f) {
        currentNode = openList[i];
        currentIndex = i;
      }
    }

    // Move current node from open to closed list
    openList.splice(currentIndex, 1);
    closedList.push(currentNode);

    // Found the path
    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      const path = [];
      let current = currentNode;

      while (current) {
        path.push({ x: current.x, y: current.y });
        current = current.parent;
      }

      return path.reverse();
    }

    // Check neighbors
    const neighbors = getNeighbors(currentNode, grid, gridSize);

    for (const neighbor of neighbors) {
      // Skip if already evaluated
      if (closedList.find((n) => n.x === neighbor.x && n.y === neighbor.y)) {
        continue;
      }

      const gScore = currentNode.g + 1;
      let gScoreIsBest = false;

      if (!openList.find((n) => n.x === neighbor.x && n.y === neighbor.y)) {
        gScoreIsBest = true;
        neighbor.h = heuristic(neighbor, endNode);
        openList.push(neighbor);
      } else if (gScore < neighbor.g) {
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        neighbor.parent = currentNode;
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }

  // No path found
  return [];
}

// Smooth path by removing unnecessary waypoints
export function smoothPath(path) {
  if (path.length <= 2) return path;

  const smoothed = [path[0]];
  let current = 0;

  while (current < path.length - 1) {
    let farthest = current + 1;

    // Try to find the farthest visible point
    for (let i = current + 2; i < path.length; i++) {
      if (isLineOfSight(path[current], path[i])) {
        farthest = i;
      }
    }

    smoothed.push(path[farthest]);
    current = farthest;
  }

  return smoothed;
}

// Check if there's line of sight between two points
function isLineOfSight(pointA, pointB) {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 2) return true;

  // Simple check - can be improved
  return Math.abs(dx) <= 1 || Math.abs(dy) <= 1;
}
