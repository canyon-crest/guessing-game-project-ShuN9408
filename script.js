// global variables
var level, answer, score, startTime, endTime;
var totalTime = 0;
var totalGames = 0;
var fastest = null;
var levelArr = document.getElementsByName("level");
var scoreArr = [];
var winsCount = 0

var playBtn, guessBtn, giveUpBtn, setNameBtn, playerName, guess, msg, dateP, clockP, wins, avgScore, avgTime, fastestP, lb;

window.onload = function () { // load event
    playBtn = document.getElementById("playBtn");
    guessBtn = document.getElementById("guessBtn");
    giveUpBtn = document.getElementById("giveUp");
    setNameBtn = document.getElementById("setName");
    playerName = document.getElementById("playerName");
    guess = document.getElementById("guess");
    msg = document.getElementById("msg");
    dateP = document.getElementById("date");
    clockP = document.getElementById("clock");
    wins = document.getElementById("wins");
    avgScore = document.getElementById("avgScore");
    avgTime = document.getElementById("avgTime");
    fastestP = document.getElementById("fastest");
    lb = document.getElementsByName("leaderboard");


    updateDate();
    updateClock();
    setInterval(updateClock, 1000);


    // add event listeners
    playBtn.addEventListener("click", play);
    guessBtn.addEventListener("click", makeGuess);
    setNameBtn.addEventListener("click", setPlayer);
    giveUpBtn.addEventListener("click", giveUpGame);


    // This allows the player to use the Enter Key to submit the guess. Used AI for this part
    guess.addEventListener("keydown", function(e){
        if(e.keyCode === 13 && !guessBtn.disabled){
            makeGuess();

        }
    });
}

function setPlayer(){
    let nameInput = playerName.value.trim(); // Remove whitespace from both ends.
    if (nameInput == ""){
        msg.textContent = "Please enter your name!";
        return;
    }
    var cased = nameInput.charAt(0).toUpperCase() + nameInput.substring(1).toLowerCase();
    playerName.value = cased;
    msg.textContent = "Welcome, " + cased + "! Choose a level and press Play.";
    playBtn.disabled = false;
}

function play(){
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUp.disabled = false;

    giveUpBtn.disabled = false;


    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }

    msg.textContent = "Guess a number from 1-" + level + ", " + playerName.value + "!";
    answer = Math.floor(Math.random()*level)+1;
    startTime = new Date().getTime();
}

function makeGuess(){
    let userGuess = parseInt(guess.value, 10);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID # 1-" + level + ", " + playerName.value + ".";
        return;
    }
    score++; // valid guess add 1 to score

    let diff = Math.abs(answer - userGuess);
    let hint = "";
    if (diff === 0) hint = "Correct!";
    else if (diff >= level / 2) hint = "Cold";
    else if (diff >= level / 4) hint = "Warm ";
    else if (diff >= level / 10) hint = "Hot";
    else hint = "Very Hot";

    if(userGuess < answer){
        msg.textContent = "Too low - " + hint + ".";
    }
    else if(userGuess > answer){
        msg.textContent = "Too high - " + hint + ".";
    }
    else{
        endTime = new Date().getTime();
        let roundTime = (endTime - startTime) / 1000;
        totalTime += roundTime;
        totalGames++;
        winsCount ++;

        if(fastest === null || roundTime < fastest){
            fastest = roundTime
        }

        msg.textContent = playerName.value + ", you got it in " + score + " tries (" + roundTime.toFixed(1) + "s).";
        rateScore(score);
        recordScore(score);
        updateScore();
        reset();
    }

    guess.value = ""; // clear input
    guess.focus();

}

function giveUpGame(){
    score = level;
    endTime = new Date().getTime();
    var roundTime = (endTime - startTime) / 1000;
    totalTime += roundTime;
    totalGames++;
    msg.textContent = "You gave up, " + playerName.value + ". The number was " + answer + ". Score set to " + score + ".";
    rateScore(score);
    recordScore(score);
    updateScore();
    resetRound();
}

function rateScore(s){
    var rating = "";
    if (s <= Math.ceil(level / 5)) {
        rating = " Great Job! ";
    }
    else if (s <= Math.ceil(level / 2)) {
       rating = " Not bad! ";
    }
    else{
        rating = "You can do better next time! ";
    }
    msg.textContent += rating;
}

function recordScore(s){
    scoreArr.push(s);
    scoreArr.sort((a,b) => a - b);
}


function updateScore() {
  wins.textContent = "Total wins: " + winsCount;

  let sum = 0;
  for (let i = 0; i < scoreArr.length; i++) {
    sum += scoreArr[i];
    if (i < lb.length) lb[i].textContent = scoreArr[i];
  }

  let avg = scoreArr.length > 0 ? sum / scoreArr.length : 0;
  avgScore.textContent = "Average Score: " + avg.toFixed(2);

  let avgT = totalGames > 0 ? totalTime / totalGames : 0;
  avgTime.textContent = "Average Time: " + avgT.toFixed(1) + " s";

  fastestP.textContent =
    fastest === null
      ? "Fastest Game: N/A"
      : "Fastest Game: " + fastest.toFixed(1) + " s";
}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    giveUp.disabled = true;
    playBtn.disabled = false;
    for(var i=0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateDate(){
    let d = new Date();
    let day = d.getDate();
    let suffix = "th";
    if (day == 1 || day == 21 || day == 31) suffix = "st";
    else if (day == 2 || day == 22) suffix = "nd";
    else if (day == 3 || day == 23) suffix = "rd";

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dateP.textContent = monthNames[d.getMonth()] + " " + day + suffix + ", " + d.getFullYear();
}

function twoDigits(n){
    if (n < 10) return "0" + n;
    return "" + n;
}

function updateClock(){
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    clockP.textContent = twoDigits(h) + ":" + twoDigits(m) + ":" + twoDigits(s);
}
