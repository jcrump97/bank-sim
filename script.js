let gameState = {
    funds: 1000000,
    satisfaction: 75,
    efficiency: 80,
    staff: [],
    events: [],
    currentMonth: 1
};

function updateStats() {
    document.getElementById('funds').innerText = gameState.funds.toLocaleString();
    document.getElementById('satisfaction').innerText = gameState.satisfaction;
    document.getElementById('efficiency').innerText = gameState.efficiency;
    document.getElementById('current-month').innerText = gameState.currentMonth;
}

window.onload = updateStats;

// User Actions
function openHiringMenu() {
    let cost = 50000;
    if (gameState.funds >= cost) {
        gameState.funds -= cost;
        gameState.efficiency += 5;
        gameState.staff.push({ name: 'New Employee', efficiency: 5 });
        addEvent('Hired a new staff member.');
        updateStats();
    } else {
        addEvent('Not enough funds to hire new staff.');
    }
}

function upgradeFacilities() {
    let cost = 200000;
    if (gameState.funds >= cost) {
        gameState.funds -= cost;
        gameState.satisfaction += 10;
        addEvent('Upgraded branch facilities.');
        updateStats();
    } else {
        addEvent('Not enough funds to upgrade facilities.');
    }
}

function launchMarketingCampaign() {
    let cost = 150000;
    if (gameState.funds >= cost) {
        gameState.funds -= cost;
        gameState.satisfaction += 15;
        addEvent('Launched a marketing campaign.');
        updateStats();
    } else {
        addEvent('Not enough funds for a marketing campaign.');
    }
}

function nextTurn() {
    gameState.currentMonth++;

    // Monthly expenses
    let expenses = gameState.staff.length * 5000;
    gameState.funds -= expenses;

    // Monthly income based on efficiency
    let income = gameState.efficiency * 1000;
    gameState.funds += income;

    // Random Event Trigger
    randomEvent();

    // Customer Feedback
    customerFeedback();

    // Cap satisfaction and efficiency between 0 and 100
    gameState.satisfaction = Math.min(100, Math.max(0, gameState.satisfaction));
    gameState.efficiency = Math.min(100, Math.max(0, gameState.efficiency));

    updateStats();
    addEvent(`Month ${gameState.currentMonth}: Monthly update processed.`);
}

// Event Management
function addEvent(message) {
    gameState.events.push(message);
    let eventList = document.getElementById('event-list');
    let eventItem = document.createElement('li');
    eventItem.textContent = message;
    eventList.insertBefore(eventItem, eventList.firstChild);
}

// Random Events
function randomEvent() {
    let eventChance = Math.random();
    if (eventChance < 0.3) {
        // Negative Event
        gameState.funds -= 100000;
        gameState.satisfaction -= 10;
        addEvent('A competitor opened a branch nearby, reducing customer satisfaction.');
    } else if (eventChance < 0.6) {
        // Positive Event
        gameState.funds += 150000;
        gameState.satisfaction += 5;
        addEvent('Received a government grant for excellent service.');
    } else {
        // Neutral Event
        addEvent('A regular day at the bank.');
    }
    updateStats();
}

// Customer Feedback
function customerFeedback() {
    let feedbackChance = Math.random();
    if (feedbackChance < 0.5) {
        gameState.satisfaction += 2;
        addEvent('Positive customer feedback received.');
    } else {
        gameState.satisfaction -= 2;
        addEvent('Negative customer feedback received.');
    }
    updateStats();
}

// Data Persistence
function saveGame() {
    localStorage.setItem('bankGameState', JSON.stringify(gameState));
    addEvent('Game saved.');
}

function loadGame() {
    let savedState = localStorage.getItem('bankGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateStats();
        addEvent('Game loaded.');
    } else {
        addEvent('No saved game found.');
    }
}

// Initial Random Events and Feedback Loops
setInterval(randomEvent, 60000);       // Every 60 seconds
setInterval(customerFeedback, 30000);  // Every 30 seconds
