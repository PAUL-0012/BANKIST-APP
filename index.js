'use strict';



// BANKIST APP

// Data
const account1 = {
  owner: 'Paul  Orori',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

const displayMovements = function(movements, sort = false){

     containerMovements.innerHTML = ' ';
     
     const movs = sort? movements.slice().sort((a,b) => a-b) : movements;
      movs.forEach(function(mov, i){
     const type = mov > 0 ? 'deposit' : 'withdrawal'
     const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov} €</div>
        </div>`;
        containerMovements.insertAdjacentHTML
        ('Afterbegin', html);
})
}
 
const CalcDisplayBalance = function(acc){
   acc.balance = acc.movements.reduce(
    (acc,mov) => acc + mov,0);
   labelBalance.textContent = `${acc.balance}  €`;
};


const calcDisplaySummaryIn = function(acc){
  const income = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov)=> acc + mov);
  labelSumIn.textContent = `${income}  €`;

  const expense =  acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent = `${Math.abs(expense)} € `;

  const interest = acc.movements.filter(deposit => deposit > 0)
  .map(deposit => (deposit* acc.interestRate)/100)
  .filter(interest => interest >= 1)
  .reduce((acc,interest) => acc + interest,0);
  labelSumInterest.textContent = `${interest} €`;
};


const createUsernames = function(acc){
  acc.forEach(function(acc){
    acc.username = acc.owner
  .toLowerCase()
  .split(' ')
  .map(name=>name[0])
  .join('');
  })
}
createUsernames(accounts)

const updateUI = function(acc){
  //Display Movements
    displayMovements(acc.movements);
    //Display balance
    CalcDisplayBalance(currentAccount);
    //Display Summary
    calcDisplaySummaryIn(currentAccount);
};


// Event handler
 let currentAccount;

 btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    //Dispaly UI and Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split( ' ')[0]}`;
    containerApp.style.opacity = 100;
    //Clear field
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);

  };
 });


 btnTransfer.addEventListener('click' , function(e){
  e.preventDefault ();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value);

    //Helps to clear the inputs
   inputTransferAmount.value = inputTransferTo.value = '';

    if(amount >0 &&
      recieverAcc && 
      currentAccount.balance >= amount && 
      recieverAcc?.username !== currentAccount.username){

        console.log(`Transfer Valid`)
        //Doing the transfer
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount);

        //update UI
        updateUI(currentAccount);
      };
 });


 btnLoan.addEventListener('click', function(e){
  e.preventDefault();

   const amount = Number(inputLoanAmount.value);
   if(amount > 0 && currentAccount.movements.some( mov=> mov >= amount * 0.1)){
       //Add A positive movements to the current account

       currentAccount.movements.push(amount);

       //Update the UI

       updateUI(currentAccount);
   };
   inputLoanAmount.value = '';
 });

 btnClose.addEventListener(`click`, function(e){
  e.preventDefault();

  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value )=== currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    console.log(index);

    //Delete account
    accounts.splice(index,1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
 });
 let sorted = false;
 btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
 });





