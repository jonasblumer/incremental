// Game elements
const clickButton = document.getElementById("click-button");
const gameDisplay = document.getElementById("game-display");
const buildingButtons = document.getElementById("building-buttons");

// Resources
const resources = {
    wood: { count: 0, production: 0, isEnabled: false },
    stone: { count: 0, production: 0, isEnabled: false },
    gold: { count: 0, production: 0, isEnabled: false },
    food: { count: 0, production: 0, isEnabled: false },
    iron: { count: 0, production: 0, isEnabled: false },
  };

const buildings = [
    {
      count: 0,
      isEnabled: false,
      id: "woodcutter-hut",
      name: "Woodcutter's Hut",
      cost: { wood: 25 },
      graphic: "🌲",
      production: { wood: 1 },
      description: "Produces 1 wood per second",
    },
  {
    count: 0,
    isEnabled: false,
    id: "house",
    name: "House",
    cost: { wood: 50 },
    graphic: "🏠",
    production: { wood: -1, stone: 1 },
    description: "Produces 1 stone per second",
  },
  {
    count: 0,
    isEnabled: false,
    id: "mine",
    name: "Mine",
    cost: { wood: 100, stone: 50 },
    graphic: "⛏️",
    production: { stone: 2 },
    description: "Produces 2 stone per second",
  },
  {
    count: 0,
    isEnabled: false,
    id: "farm",
    name: "Farm",
    cost: { wood: 150, stone: 75 },
    graphic: "🌾",
    production: { food: 2 },
    description: "Produces 2 food per second",
  },
  {
    count: 0,
    isEnabled: false,
    id: "quarry",
    name: "Quarry",
    cost: { wood: 200, stone: 100 },
    graphic: "🏞️",
    production: { stone: 3 },
    description: "Produces 3 stone per second",
  },
  {
    count: 0,
    isEnabled: false,
    id: "smithy",
    name: "Smithy",
    cost: { wood: 250, stone: 125 },
    graphic: "🔨",
    production: { iron: 2 },
    description: "Produces 2 iron per second",
  },
  {
    count: 0,
    isEnabled: false,
    id: "marketplace",
    name: "Marketplace",
    cost: { wood: 300, stone: 150 },
    graphic: "🏪",
    production: { gold: 2 },
    description: "Produces 2 gold per second",
  },
];

// Formatting function for displaying resource cost
function formatCost(cost) {
  return Object.entries(cost)
    .map(([resource, value]) => `${resource}: ${value}`)
    .join(", ");
}

// Update the game display
function updateGameDisplay() {
    // Clear previous display
    gameDisplay.innerHTML = "";
    
    const resourcesTitle = document.createElement('h2');
    resourcesTitle.textContent = "Resources";
    gameDisplay.appendChild(resourcesTitle);
    // Display resource counts and production per second
    Object.entries(resources).forEach(([resource, { count, production, isEnabled }]) => {
        if (!isEnabled) {
            if (count > 0) {
                const resourceDisplay = document.createElement("div");
                const emoji = getEmoji(resource);
                resourceDisplay.textContent = `${emoji} - ${resource}: ${count.toFixed(2)} (${production.toFixed(2)} per second)`;
                resourceDisplay.id = `resource-${resource}`;
                gameDisplay.appendChild(resourceDisplay);
            }}
    });

    const buildingsTitle = document.createElement('h2');
    buildingsTitle.textContent = "Buildings";
    gameDisplay.appendChild(buildingsTitle);
  
    // Display buildings
    buildings.forEach(building => {
      const buildingDisplay = document.createElement("div");
      const emoji = getEmoji(building.id);
      buildingDisplay.textContent = `${emoji} - ${building.name} (${building.count}) - ${building.description}`;
      buildingDisplay.id = `building-${building.id}`;
      if(!building.isEnabled) {
          buildingDisplay.style.display = 'none';
      }
      gameDisplay.appendChild(buildingDisplay);
    });
  
    // Update building button states
    buildings.forEach((building, index) => {
        const button = buildingButtons.children[index];
        if(checkResourceAvailability(building.cost)) {
            building.isEnabled = true;
            button.style.display = 'block';
            document.getElementById(`building-${building.id}`).style.display = 'block';
        }
        button.textContent = `Build ${building.name} - Cost: ${formatCost(building.cost)}`;
        button.disabled = !checkResourceAvailability(building.cost);
    });
  }  

  function calculateResourceProductionPerSecond(resource) {
    let production = 0;
  
    for (let building of buildings) {
      if (building.count > 0 && building.production[resource]) {
        production += building.production[resource] * building.count;
      }
    }

    buildings.forEach((building) => {
        if (checkResourceAvailability(building.cost)) {
            building.isEnabled = true;
        }
    });

  
    return production;
  }
  
// Check if there are enough resources to build
function checkResourceAvailability(cost) {
  if (!cost) {
    return false;
  }
  return Object.entries(cost).every(([resource, value]) => resources[resource].count >= value);
}

function buildBuilding(index) {
    const building = buildings[index];
    if (checkResourceAvailability(building.cost)) {
      Object.entries(building.cost).forEach(([resource, cost]) => {
        resources[resource].count -= cost;
      });
  
      // Increase the building count for the specific type
      building.count++;
  
      increaseBuildingCost(building);
      updateResourceProduction(0); // Update resource production immediately
      updateGameDisplay(); // Update the game display
    }
  }
  

function increaseBuildingCost(building) {
  Object.entries(building.cost).forEach(([resource, cost]) => {
    building.cost[resource] = Math.ceil(cost * 1.2); // Increase cost by 20%
  });
}

// Start resource production interval
const productionInterval = 1000; // 1 second
let lastUpdateTime = Date.now();

const productionIntervalId = setInterval(() => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;
  updateResourceProduction(elapsedTime);
  updateGameDisplay();
}, productionInterval);


  function updateResourceProduction(elapsedTime) {
    buildings.forEach((building) => {
      Object.entries(building.production).forEach(([resource, production]) => {
        const resourceCosts = Object.entries(building.cost);
        const canProduce = true;
  
        if (canProduce && building.count > 0) {
          resources[resource].count += production * building.count * (elapsedTime / 1000);
        }
      });
    });
  
    // Update the per-second production for each resource
    Object.entries(resources).forEach(([resource, value]) => {
      if (value.production !== undefined) {
        value.production = calculateResourceProductionPerSecond(resource);
      }
    });
  }
  
  
  


// Click button event listener
clickButton.addEventListener("click", () => {
    resources.wood.count++; // Increment wood count
    updateResourceProduction(0); // Update resource production immediately
    updateGameDisplay(); // Update the game display
  });

// Create building buttons
buildings.forEach((building, index) => {
  const button = document.createElement("button");
  button.textContent = `Build ${building.name} - Cost: ${formatCost(building.cost)}`;
  button.addEventListener("click", () => {
    buildBuilding(index);
  });
  button.style.display = 'none';
  buildingButtons.appendChild(button);

  increaseBuildingCost(building); // Update the initial cost
});

function getEmoji(id) {
    switch (id) {
      case "wood":
        return "\u{1F332}"; // Unicode representation for 🌲
      case "stone":
        return "\u{1F5FF}"; // Unicode representation for 🗿
      case "gold":
        return "\u{1F4B0}"; // Unicode representation for 💰
      case "food":
        return "\u{1F35E}"; // Unicode representation for 🍞
      case "iron":
        return "\u{2699}\u{FE0F}"; // Unicode representation for ⚙️
      case "house":
        return "\u{1F3E0}"; // Unicode representation for 🏠
      case "woodcutter-hut":
        return "\u{1F331}"; // Unicode representation for 🌳
      case "mine":
        return "\u{26CF}"; // Unicode representation for ⛏️
      case "farm":
        return "\u{1F33E}"; // Unicode representation for 🌾
      case "quarry":
        return "\u{1F3DE}"; // Unicode representation for 🏞️
      case "smithy":
        return "\u{1F528}"; // Unicode representation for 🔨
      case "marketplace":
        return "\u{1F3EA}"; // Unicode representation for 🏪
      default:
        return "";
    }
  }

// Initial game display update
updateGameDisplay();
