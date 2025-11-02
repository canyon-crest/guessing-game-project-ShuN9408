// global variables
let level, answer, score, startTime, endTime;
let totalTime = 0;
let totalGames = 0;
let fastest = 99999;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// date.textContent = time();

setInterval(updateClock, 1000);
updateDate();

// add event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
setName.addEventListener("click", setPlayer);
giveUp.addEventListener("click", giveUpGame);

function setPlayer(){
    let nameInput = playerName.value.trim();
    if (nameInput == ""){
        msg.textContent = "Please enter your name!";
        return;
    }
    playerName.value = nameInput.charAt(0).toUpperCase()+nameInput.slice(1); //slice() is used to extract a section of an array or string and return it as a new array or string, no modify
    msg.textContent = "Welcome, " + playerName.value + "! Choose a level and press Play.";
    playBtn.disabled = false;
}
function play(){
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUp.disabled = false;

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
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID #1-" + level;
        return;
    }
    score++; // valid guess add 1 to score
    let diff = Math.abs(answer - userGuess);
    let hint = "";
    if (diff >= level / 2) hint = "cold";
    else if (diff >= level / 4) hint = "Warm ";
    else if (diff >= level / 10) hint = "Hot";
    else hint = "Very Hot";

    if(userGuess < answer){
        msg.textContent = "Too low, try again.";
    }
    else if(userGuess > answer){
        msg.textContent = "Too high, try again.";
    }
    else{
        endTime = new Date().getTime();
        let roundTime = (endTime - startTime) / 1000;
        totalTime += roundTime;
        totalGames++;
        if (roundTime < fastest) fastest = roundTime;
        msg.textContent = playerName.value + ", you got it in " + score + "tries (" + roundTime.toFixed(1) + "s).";
        rateScore();
        updateScore();
        reset();
    }
}
function giveUpGame(){
    score = level;
    msg.textContent = "You gave up! The number was " + answer + ".";
    reset();
}
function rateScore(){
    if (score <= level / 5) {
        msg.textContent += " Great Job! ";
    }
    else if (score <= level / 2) {
        msg.textContent += " Not bad! ";
    }
    else{
        msg.textContent += "You can do better next time! ";
    }
}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    giveUp.disabled = true;
    playBtn.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b); // sort increasing order

    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins: " + scoreArr.length;

    let sum = 0;
    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i<lb.length) lb[i].textContent = scoreArr[i];
        }

    }

    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
    avgTime.textContent = "Average Time: " + (totalTime / totalGames).toFixed(1) + " s"; // toFixed() method converts a number to a string
    fastest.textContent = "Fastest Game: " + fastest.toFixed(1) + " s"

function time(){
    let d = new Date();
    // concatinate a string with all the data info...
    // d = d.getFullYear + " " + d.getTime();
    return d;
}
