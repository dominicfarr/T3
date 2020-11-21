// section where users select what times table to practice
const practiceNumberZone = document.getElementById("practiceNumberZone");
const practiceNumberInput = document.getElementById("practiceNumberInput");
// practiceNumberInput.focus();
const startBtn = document.getElementById("startBtn");

// section where users practice selected times table
const testingZone = document.getElementById("testingZone");
const answerInput = document.getElementById("answerInput");
const sum = document.getElementById("sum");
const result = document.getElementById("result");

// section where users see their results after practicing
const resultZone = document.getElementById("resultZone");
const practiceTimeResult = document.getElementById("practiceTimeResult");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const currentRecordTime = document.getElementById('currentRecordTime');

// global variable [refactor these out of final version]
let currentAnswer = 0;
let currentNumber = 0;
let count = 0;
let startTime = 0;

// add event listeners
practiceNumberInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    console.log("enter in number");
    event.preventDefault();
    startBtn.click();
  }
});

startBtn.addEventListener("click", function (event) {
  if (isNumber(practiceNumberInput.value) && parseInt(practiceNumberInput.value) >0 && parseInt(practiceNumberInput.value) <13) {
    count = 0;
    practiceNumberZone.style.display = "none";
    testingZone.style.display = "block";
    answerInput.style.visibility = 'visible';
    nextSum();
    answerInput.focus();
    startTime = new Date();
  } else {
    alert("Only numbers between 1 and 12 please");
    practiceNumberInput.value = "";
    practiceNumberInput.focus();
  }
});

answerInput.addEventListener("keyup", function (event) {
  console.log("keyup answer field");

  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    console.log("enter in answer field");
    // Cancel the default action, if needed
    event.preventDefault();
    if (event.target.value === `${currentAnswer}`) {
      result.className = "correct";
      result.innerText = "Correct";
      
      if(++count == 10) {
          showResultZone();
      } else {
        nextSum();
      }
    } else {
      result.className = "error";
      const word = ((parseInt(event.target.value) + 1) == currentAnswer || (parseInt(event.target.value) - 1) == currentAnswer) ? "Oooo so close" : "Opps";
      result.innerText = `${word}, try ${currentAnswer}`;
      event.target.value = '';
      event.target.focus();
    }
  }
});

tryAgainBtn.addEventListener("click", function (event) {
  resultZone.style.display = 'none';
  testingZone.style.display = 'none';
  practiceNumberZone.style.display = 'block';
  practiceNumberInput.value = '';
  practiceNumberInput.focus();
});

function showResultZone() {
  answerInput.style.visibility = 'hidden';
  sum.innerText = `${sum.innerText} ${answerInput.value}`;
  const speed = parseFloat(Math.abs((startTime - new Date()) / 1000)).toPrecision(3);
  practiceTimeResult.innerText = `${speed} seconds`;
  resultZone.style.display = 'block';
  let cookieRecordForNumber = parseFloat(getCookie(`${practiceNumberInput.value}-record`));
  if(cookieRecordForNumber == 0 || speed < cookieRecordForNumber) {
    currentRecordTime.innerText = 'NEW RECORD!!';
    document.cookie = `${practiceNumberInput.value}-record=${speed}`;
  } else {
    currentRecordTime.innerText 
      = `Current record for 10 questions of the ${practiceNumberInput.value} times table is ${cookieRecordForNumber} seconds`;
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return 0;
}

function randomNumber(min = 1, max = 12) {
  return Math.floor(Math.random() * (max - min) + min);
}

function nextSum() {
  currentNumber = randomNumber();
  currentAnswer = currentNumber * practiceNumberInput.value;
  sum.innerText = `${practiceNumberInput.value} * ${currentNumber} =`;
  answerInput.value = '';
  answerInput.focus();
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
