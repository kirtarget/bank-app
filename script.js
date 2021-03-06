"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2022-05-01T14:11:59.604Z",
    "2022-05-07T17:01:17.194Z",
    "2022-05-12T23:36:17.929Z",
    "2022-05-13T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// ???????????????????? ????????????????????
let currentAccount, timer;
//???????????????? ??????????
// currentAccount = account1;

// containerApp.style.opacity = 100;

const currencyFormatter = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value.toFixed(2));
};

// ???????????????? ????????????
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

// ?????????????????? ????????

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "??????????????";
  if (daysPassed === 1) return "??????????";
  if (daysPassed <= 7) return `${daysPassed} ???????? ??????????`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// ?????????????????????? ??????????????
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = currencyFormatter(
    acc.balance,
    acc.locale,
    acc.currency
  );
  // `${acc.balance.toFixed(1)}???`;
};

// ?????????????????????? ?????????????? (?????????? ????????????)
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int);

  labelSumInterest.textContent = currencyFormatter(
    interest,
    acc.locale,
    acc.currency
  );
  labelSumIn.textContent = currencyFormatter(incomes, acc.locale, acc.currency);
  labelSumOut.textContent = currencyFormatter(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );
};

// ???????????? ??????????????
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

// ?????????????????????? ????????????????
const displayMovements = function (acc, sort = false) {
  // ?????????????? ????????????????????
  containerMovements.innerHTML = "";

  // ??????????????????????
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // ?????????????????????? ????????
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  // ???????????????????????????? ???? ??????
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(
    now
  );

  //???????????????????? ???????????? ?? ???????????????????? ?? HTML

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formatCur = currencyFormatter(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCur}</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const updateUI = () => {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  calcDisplayBalance(currentAccount);
};

const startLogoutTimer = function () {
  let time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      currentAccount = "";
      labelWelcome.textContent = "??????????????, ?????????? ????????????";
      containerApp.style.opacity = 0;
    }
    time--;
  };

  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

// ??????????
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `?????????? ????????????????????, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI();
  }
});

// ????????????????
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(timer);
  timer = startLogoutTimer();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  inputLoginPin.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date());
    currentAccount.movements.push(amount * -1);

    currentAccount.movementsDates.push(new Date());

    updateUI();
  }
});

// ???????????????? ????????????????
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "??????????????, ?????????? ????????????";
  }
});

// ?????????? ?? ???????? ?? ??????????
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(timer);
  timer = startLogoutTimer();
  const amount = inputLoanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(Math.floor(+amount));
      currentAccount.movementsDates.push(new Date());
      updateUI();
    }, 3000);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// ???????????????????? ????????????????
let state = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !state);
  state = !state;
});
