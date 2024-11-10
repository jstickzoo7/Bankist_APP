'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-10-24T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-10-23T23:36:17.929Z',
    '2024-10-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-09-24T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-09-23T23:36:17.929Z',
    '2024-09-24T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// create username
const userName = function (acc) {
  const name = acc.owner.toLowerCase().split(' ');
  const username = [];
  name.forEach(el => username.push(el[0]));
  acc.username = username.join('');
};
accounts.forEach(el => userName(el));

let currentAccount, sorted, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  labelDate.textContent = new Intl.DateTimeFormat(navigator.locale, {
    day: "2-digit",
    month: '2-digit',
    year:'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date()) ;

  currentAccount = accounts.find(
    acc => inputLoginUsername.value === acc.username
  );
  // console.log(currentAccount);

  if (currentAccount.pin === +inputLoginPin.value) {
    //Display username
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;

    // Dsiplay login
    containerApp.style.opacity = 100;

    // set/Reset  Time
    if (timer) clearInterval(timer);
    timer = startLogoutFeature();

    DisplayUI(currentAccount);

    //clear input text
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

//Sort Movements
sorted = false;
btnSort.addEventListener('click', function (movs) {
  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});

// Subtract Date
const dateDiff = function (date1, date2) {
  return Math.abs(Math.trunc((date1 - date2) / (1000 * 86400)));
};

// Display Time
const displayDate = function (locale, timestamp) {
  const time = new Date(timestamp);
  // const year = time.getFullYear() ;
  // const month = time.getMonth() ;
  // const day = time.getDay() ;

  const fDate = new Intl.DateTimeFormat(locale).format(time);

  const rDay = dateDiff(new Date(), time);
  switch (rDay) {
    case 0:
      return `Today`;

    case 1:
      return `Yesterday`;

    case 2:
      return `2 Day ago`;

    case 3:
      return `3 Days ago`;

    case 4:
      return `4 Days ago`;

    case 5:
      return `5 Days ago`;

    default:
      return `${fDate}`;
  }
};
// const tTime = new Date();
// const Ttest = tTime - new Date('2024-10-25T21:31:17.178Z');
// console.log(Ttest / (1000 * 86400),tTime.toISOString());

/////////////////////////////////////////////////

//display UI
const DisplayUI = function (acc) {
  //Display Movement
  displayMovements(acc);

  // Display Summary
  // console.log(acc.movements);
  displayBalance(acc);

  //Display Summary
  displaySummary(acc);
};

// Display Movement

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate(
            acc.locale,
            acc.movementsDates[i]
          )}</div>
          <div class="movements__value">${mov}</div>
          `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const initialValue = 0 ;

// calculate Balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance);
};

const displaySummary = function (acc) {
  // create deposit Label
  const calculateDeposit = acc.movements
    .filter(val => val > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(calculateDeposit);

  // Create Withdrawal Label
  const calculateWithdrawal = acc.movements
    .filter(val => val < 0)
    .reduce((acc, mov) => acc + mov);

  labelSumOut.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(Math.abs(calculateWithdrawal));

  //create Interest Label
  const calculateInterest = acc.movements
    .map(cur => (cur * acc.interestRate) / 100)
    .filter((mov, _, i) => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(calculateInterest);
};

// Business Logic

//Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const trfAmount = +inputTransferAmount.value;
  // console.log(sendTo);

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    trfAmount > 0 &&
    recieverAcc &&
    recieverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= trfAmount
  ) {
    // perform Transaction
    currentAccount.movements.push(-trfAmount);
    recieverAcc.movements.push(trfAmount);

    // create transfrer Date and time
    const trfDate = new Date().toISOString();
    currentAccount.movementsDates.push(trfDate);
    recieverAcc.movementsDates.push(trfDate);

    // show new transaction on page
    DisplayUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    startLogoutFeature();
  }
});

//Take a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmt = +inputLoanAmount.value;
  const eligible = currentAccount.movements.some(mov => loanAmt > mov * 0.1);

  if (eligible && loanAmt > 0) {
    //Add movements
    currentAccount.movements.push(loanAmt);

    // loan Date
    const trfDate = new Date().toISOString();
    currentAccount.movementsDates.push(trfDate);

    //display UI
    DisplayUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    startLogoutFeature();
  }
  inputLoanAmount.value = '';
});

//close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const index = accounts.findIndex(
    acc => acc.username === currentAccount.username
  );

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // Delete Account
    accounts.splice(index, 1);

    // Mimick Logout
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Login to get Started`;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

// Security feature

const startLogoutFeature = function () {
  const tick = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);

    // update the time in the UI
    labelTimer.textContent = `${minute}:${second}`;
    // if time equals zero, stop timer
    if (time === 0) {
      labelWelcome.textContent = `Login to get started.`;

      // Dsiplay login
      containerApp.style.opacity = 0;
    }
    //Reduce time by 1
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
