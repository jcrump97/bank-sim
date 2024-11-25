// Constants for configuration
const STAFF_COST = 5000; // Monthly cost per staff member
const STAFF_HIRE_COST = 50000;
const FACILITY_UPGRADE_COST = 200000;
const MARKETING_COST = 150000;
const FED_INTEREST_RATE = 0.02;
const LOAN_INTEREST_RATE = 0.01;
const RESERVE_REQUIREMENT_RATIO = 0.1; // 10%

let gameState = {
    funds: 1000000,
    cashReserves: 100000,
    customerDeposits: 500000,
    loansOutstanding: 0,
    satisfaction: 75,
    efficiency: 80,
    staff: [],
    events: [],
    currentMonth: 1,
    fedBorrowing: 0
};

// Update all stats in the UI
function updateStats() {
    const fields = [
        'funds',
        'cashReserves',
        'customerDeposits',
        'loansOutstanding',
        'satisfaction',
        'efficiency',
        'currentMonth'
    ];
    fields.forEach((field) => {
        document.getElementById(field).innerText = gameState[field].toLocaleString();
    });
}

// Add a new event to the event log
function addEvent(message) {
    gameState.events.push(message);
    const eventList = document.getElementById('event-list');
    const eventItem = document.createElement('li');
    eventItem.textContent = message;
    eventList.insertBefore(eventItem, eventList.firstChild);
}

// Action: Hire a new staff member
function openHiringMenu() {
    if (adjustFunds(-STAFF_HIRE_COST)) {
        const newStaff = { name: `Employee #${gameState.staff.length + 1}`, efficiency: 5 };
        gameState.staff.push(newStaff);
        gameState.efficiency = Math.min(100, gameState.efficiency + 5);
        addEvent('Hired a new staff member.');
    } else {
        addEvent('Not enough funds to hire new staff.');
    }
    updateStats();
}

// Action: Upgrade facilities
function upgradeFacilities() {
    if (adjustFunds(-FACILITY_UPGRADE_COST)) {
        gameState.satisfaction = Math.min(100, gameState.satisfaction + 10);
        addEvent('Upgraded branch facilities.');
    } else {
        addEvent('Not enough funds to upgrade facilities.');
    }
    updateStats();
}

// Action: Launch a marketing campaign
function launchMarketingCampaign() {
    if (adjustFunds(-MARKETING_COST)) {
        gameState.satisfaction = Math.min(100, gameState.satisfaction + 15);
        addEvent('Launched a marketing campaign.');
    } else {
        addEvent('Not enough funds for a marketing campaign.');
    }
    updateStats();
}

// Generic function to adjust funds with error checking
function adjustFunds(amount) {
    if (gameState.funds + amount >= 0) {
        gameState.funds += amount;
        return true;
    }
    return false;
}

// Manage cash reserves
function manageCash() {
    const amount = parseInt(prompt('Enter amount to adjust cash reserves (positive to increase, negative to decrease):'));
    if (!isNaN(amount)) {
        if (amount > 0 && adjustFunds(-amount)) {
            gameState.cashReserves += amount;
            addEvent(`Added $${amount.toLocaleString()} to cash reserves.`);
        } else if (amount < 0 && gameState.cashReserves >= Math.abs(amount)) {
            gameState.cashReserves += amount; // Subtract the absolute value
            adjustFunds(-amount); // Increase funds
            addEvent(`Removed $${Math.abs(amount).toLocaleString()} from cash reserves.`);
        } else {
            addEvent('Invalid amount or insufficient funds.');
        }
    } else {
        addEvent('Invalid input for cash management.');
    }
    updateStats();
}

// Interact with the Federal Reserve
function interactWithFed() {
    const action = prompt('Choose an action:\n1. Borrow from Fed\n2. Repay Fed Loan\n3. Check Reserve Requirement');
    if (action === '1') {
        const amount = parseInt(prompt('Enter amount to borrow from the Fed:'));
        if (!isNaN(amount) && amount > 0) {
            gameState.funds += amount;
            gameState.fedBorrowing += amount;
            addEvent(`Borrowed $${amount.toLocaleString()} from the Fed.`);
        } else {
            addEvent('Invalid amount for borrowing.');
        }
    } else if (action === '2') {
        const amount = parseInt(prompt(`Enter amount to repay to the Fed (You owe $${gameState.fedBorrowing.toLocaleString()}):`));
        if (!isNaN(amount) && amount > 0 && gameState.funds >= amount && amount <= gameState.fedBorrowing) {
            gameState.funds -= amount;
            gameState.fedBorrowing -= amount;
            addEvent(`Repaid $${amount.toLocaleString()} to the Fed.`);
        } else {
            addEvent('Invalid amount for repayment.');
        }
    } else if (action === '3') {
        const requiredReserves = gameState.customerDeposits * RESERVE_REQUIREMENT_RATIO;
        addEvent(`Current reserve requirement: $${requiredReserves.toLocaleString()}.`);
    } else {
        addEvent('Invalid action with the Fed.');
    }
    updateStats();
}

// Handle monthly updates
function nextTurn() {
    gameState.currentMonth++;

    // Expenses and income
    processExpenses();
    processLoanIncome();
    customerTransactions();

    // Random event and feedback
    randomEvent();
    customerFeedback();

    // Enforce rules and penalties
    enforceReserveRequirement();

    // Update stats and log
    updateStats();
    addEvent(`Month ${gameState.currentMonth}: Monthly update processed.`);
}

// Helper functions for monthly updates
function processExpenses() {
    const staffExpenses = gameState.staff.length * STAFF_COST;
    adjustFunds(-staffExpenses);
    addEvent(`Paid $${staffExpenses.toLocaleString()} in staff salaries.`);
    const fedInterest = gameState.fedBorrowing * FED_INTEREST_RATE;
    adjustFunds(-fedInterest);
    addEvent(`Paid $${fedInterest.toLocaleString()} in interest to the Fed.`);
}

function processLoanIncome() {
    const loanIncome = gameState.loansOutstanding * LOAN_INTEREST_RATE;
    gameState.funds += loanIncome;
    addEvent(`Received $${loanIncome.toLocaleString()} in loan interest income.`);
}

// Simulate customer deposits and withdrawals
function customerTransactions() {
    const depositChance = Math.random();
    const transactionAmount = Math.floor(Math.random() * 100000) + 50000; // Between 50,000 and 150,000
    if (depositChance < 0.5) {
        gameState.customerDeposits += transactionAmount;
        gameState.cashReserves += transactionAmount;
        addEvent(`Customers deposited $${transactionAmount.toLocaleString()}.`);
    } else if (gameState.cashReserves >= transactionAmount) {
        gameState.customerDeposits -= transactionAmount;
        gameState.cashReserves -= transactionAmount;
        addEvent(`Customers withdrew $${transactionAmount.toLocaleString()}.`);
    } else {
        addEvent('Not enough cash reserves to cover withdrawals. Customer satisfaction decreased.');
        gameState.satisfaction = Math.max(0, gameState.satisfaction - 10);
    }
}

// Random events with potential effects
function randomEvent() {
    const eventChance = Math.random();
    if (eventChance < 0.3) {
        gameState.funds -= 100000;
        gameState.satisfaction -= 10;
        addEvent('A competitor opened a branch nearby, reducing customer satisfaction.');
    } else if (eventChance < 0.6) {
        gameState.funds += 150000;
        gameState.satisfaction += 5;
        addEvent('Received a government grant for excellent service.');
    } else {
        addEvent('A regular day at the bank.');
    }
}

// Customer feedback system
function customerFeedback() {
    const feedbackChance = Math.random();
    if (feedbackChance < 0.5) {
        gameState.satisfaction = Math.min(100, gameState.satisfaction + 2);
        addEvent('Positive customer feedback received.');
    } else {
        gameState.satisfaction = Math.max(0, gameState.satisfaction - 2);
        addEvent('Negative customer feedback received.');
    }
}

// Enforce reserve requirements
function enforceReserveRequirement() {
    const requiredReserves = gameState.customerDeposits * RESERVE_REQUIREMENT_RATIO;
    if (gameState.cashReserves < requiredReserves) {
        addEvent('Cash reserves below required minimum! Penalty applied.');
        gameState.funds -= 50000;
        gameState.satisfaction = Math.max(0, gameState.satisfaction - 5);
    }
}

// Save and load game data
function saveGame() {
    localStorage.setItem('bankGameState', JSON.stringify(gameState));
    addEvent('Game saved.');
}

function loadGame() {
    const savedState = localStorage.getItem('bankGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateStats();
        addEvent('Game loaded.');
    } else {
        addEvent('No saved game found.');
    }
}

// Initial event setup
window.onload = updateStats;
