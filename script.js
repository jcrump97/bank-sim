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
    fedBorrowing: 0,
    reserveRequirementRatio: 0.1 // 10% reserve requirement
};

function updateStats() {
    document.getElementById('funds').innerText = gameState.funds.toLocaleString();
    document.getElementById('cash-reserves').innerText = gameState.cashReserves.toLocaleString();
    document.getElementById('customer-deposits').innerText = gameState.customerDeposits.toLocaleString();
    document.getElementById('loans-outstanding').innerText = gameState.loansOutstanding.toLocaleString();
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

function manageCash() {
    let amount = parseInt(prompt('Enter amount to adjust cash reserves (positive to increase, negative to decrease):'));
    if (!isNaN(amount)) {
        if (amount > 0 && gameState.funds >= amount) {
            gameState.funds -= amount;
            gameState.cashReserves += amount;
            addEvent(`Added $${amount.toLocaleString()} to cash reserves.`);
        } else if (amount < 0 && gameState.cashReserves >= Math.abs(amount)) {
            gameState.funds += Math.abs(amount);
            gameState.cashReserves -= Math.abs(amount);
            addEvent(`Removed $${Math.abs(amount).toLocaleString()} from cash reserves.`);
        } else {
            addEvent('Invalid amount or insufficient funds.');
        }
        updateStats();
    } else {
        addEvent('Invalid input for cash management.');
    }
}

function interactWithFed() {
    let action = prompt('Choose an action:\n1. Borrow from Fed\n2. Repay Fed Loan\n3. Check Reserve Requirement');
    if (action === '1') {
        let amount = parseInt(prompt('Enter amount to borrow from the Fed:'));
        if (!isNaN(amount) && amount > 0) {
            gameState.funds += amount;
            gameState.fedBorrowing += amount;
            addEvent(`Borrowed $${amount.toLocaleString()} from the Fed.`);
            updateStats();
        } else {
            addEvent('Invalid amount for borrowing.');
        }
    } else if (action === '2') {
        let amount = parseInt(prompt(`Enter amount to repay to the Fed (You owe $${gameState.fedBorrowing.toLocaleString()}):`));
        if (!isNaN(amount) && amount > 0 && gameState.funds >= amount && amount <= gameState.fedBorrowing) {
            gameState.funds -= amount;
            gameState.fedBorrowing -= amount;
            addEvent(`Repaid $${amount.toLocaleString()} to the Fed.`);
            updateStats();
        } else {
            addEvent('Invalid amount for repayment.');
        }
    } else if (action === '3') {
        let requiredReserves = gameState.customerDeposits * gameState.reserveRequirementRatio;
        addEvent(`Current reserve requirement: $${requiredReserves.toLocaleString()}.`);
    } else {
        addEvent('Invalid action with the Fed.');
    }
}

function nextTurn() {
    gameState.currentMonth++;

    // Monthly expenses
    let staffExpenses = gameState.staff.length * 5000;
    gameState.funds -= staffExpenses;
    addEvent(`Paid $${staffExpenses.toLocaleString()} in staff salaries.`);

    // Interest on Fed borrowing
    let fedInterestRate = 0.02; // 2% monthly interest rate
    let fedInterest = gameState.fedBorrowing * fedInterestRate;
    gameState.funds -= fedInterest;
    addEvent(`Paid $${fedInterest.toLocaleString()} in interest to the Fed.`);

    // Customer deposits and withdrawals
    customerTransactions();

    // Loans interest income
    let loanInterestRate = 0.01; // 1% monthly interest income
    let loanIncome = gameState.loansOutstanding * loanInterestRate;
    gameState.funds += loanIncome;
    addEvent(`Received $${loanIncome.toLocaleString()} in loan interest income.`);

    // Random Event Trigger
    randomEvent();

    // Customer Feedback
    customerFeedback();

    // Check Reserve Requirement
    checkReserveRequirement();

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

// Customer Transactions
function customerTransactions() {
    // Simulate customer deposits and withdrawals
    let depositChance = Math.random();
    let transactionAmount = Math.floor(Math.random() * 100000) + 50000; // Between 50,000 and 150,000
    if (depositChance < 0.5) {
        // Customer Deposits
        gameState.customerDeposits += transactionAmount;
        gameState.cashReserves += transactionAmount;
        addEvent(`Customers deposited $${transactionAmount.toLocaleString()}.`);
    } else {
        // Customer Withdrawals
        if (gameState.cashReserves >= transactionAmount) {
            gameState.customerDeposits -= transactionAmount;
            gameState.cashReserves -= transactionAmount;
            addEvent(`Customers withdrew $${transactionAmount.toLocaleString()}.`);
        } else {
            addEvent('Not enough cash reserves to cover customer withdrawals!');
            // Possible penalty or negative effect
            gameState.satisfaction -= 10;
        }
    }
    updateStats();
}

// Check Reserve Requirement
function checkReserveRequirement() {
    let requiredReserves = gameState.customerDeposits * gameState.reserveRequirementRatio;
    if (gameState.cashReserves < requiredReserves) {
        addEvent('Cash reserves below required minimum! Penalty applied.');
        // Apply a penalty for not meeting reserve requirements
        let penalty = 50000;
        gameState.funds -= penalty;
        gameState.satisfaction -= 5;
    }
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
