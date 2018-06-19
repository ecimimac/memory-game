/*
 * Create a list that holds all of your cards
 */
const faces = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
               'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
               'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf',
               'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
const cardDeck = document.getElementsByClassName('deck')[0];
const modal = document.getElementById('winModal');
const moves = document.getElementsByClassName('moves')[0];
const rating = document.getElementsByClassName('stars')[0];
const timer = document.getElementsByClassName('timer')[0];
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const totalTime = document.getElementsByClassName('totalTime')[0];
const totalStars = document.getElementsByClassName('totalStars')[0];
const restart = document.querySelectorAll('.restart');
var cardsClicked = [];
var movesMade = 0;
var cardsMatched = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var stars = 3;
var startGame = true;
var gameEnd = false;
var time;

closeBtn.addEventListener('click', closeModal);

for (var j = 0; j < restart.length; j++) {
  restart[j].addEventListener('click', restartGame);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function initGame() {
  resetStars();
  //Shuffle the array containing the card faces
  var cards = shuffle(faces);

  //Initialize the card "deck"
  cardDeck.innerHTML = '';

  //Loop through the faces array so we can build our deck
  for (var i = 0; i < cards.length; i++) {
    var name = cards[i];

    //Create new child list item element for <ul>
    const newListItem = document.createElement('li');
    cardDeck.appendChild(newListItem).setAttribute('class', 'card');

    //Create new child icon element for <li>
    const newIcon = document.createElement('i');
    newListItem.appendChild(newIcon).setAttribute('class', 'fa '+name);

    //Create event listener for each card item
    newListItem.addEventListener('click', clickCard);
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function clickCard() {
  //If first click is made, start the timer
  if (startGame) {
    startGame = false;
    startTimer();
  }

  //If card clicked hasn't been matched yet, then proceed with the
  //matching process
  if (!this.classList.contains("match")) {
    if (cardsClicked.length === 0) {
      //This is the 1st  card clicked
      cardsClicked.push(this);
      this.classList.add("open", "show");
      
      //Increment move counter
      incrementMoves();
      
    } else {
      //This is the 2nd card clicked; check to make sure it's an unopened card first
      if (!this.classList.contains("open")) {
        
        //Increment move counter
        incrementMoves();
        
        cardsClicked.push(this);
        this.classList.add("open", "show");

        //Compare current card with previously opened card
        if (this.innerHTML === cardsClicked[0].innerHTML) {
          cardsMatched += 2;
          cardsClicked[0].classList.remove("animated", "shake");
          this.classList.remove("animated", "shake");
          cardsClicked[0].classList.add("match", "animated", "rubberBand");
          this.classList.add("match", "animated", "rubberBand");
          cardsClicked = [];
        } else {
          const prevCard = cardsClicked[0];
          const currCard = this;
          prevCard.classList.add("animated", "shake");
          currCard.classList.add("animated", "shake");
          setTimeout(() => {
            prevCard.classList.remove("open", "show");
            currCard.classList.remove("open", "show");
            prevCard.classList.remove("animated", "shake");
            currCard.classList.remove("animated", "shake");
          },1000);
          //Clear out the array that holds the 2 opened cards
          cardsClicked = [];
        }
      }
    }
  }
  //If all cards have been matched, declare game over
  gameOver();
}

function startTimer() {
  //Start the timer
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }
  //Show timer as game is being played
  timer.textContent = hours ? ( ( hours > 9 ? hours : "0" + hours ) + ":" + ( minutes > 9 ? minutes : "0" + minutes ) + ":" + ( seconds > 9 ? seconds : "0" + seconds ) ) : ( (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) );
  time = setTimeout(startTimer, 1000);
}

function resetStars() {
  //Reset to 3 full stars
  stars = 3;
  rating.innerHTML = '';
  for (var i = 0; i < 3; i++) {
    const newListItem = document.createElement('li');
    rating.appendChild(newListItem);
    const newIcon = document.createElement('i');
    newListItem.appendChild(newIcon).setAttribute('class', 'fa fa-star');
  }
}

function incrementMoves() {
  //As each click is made, increment the move counter and deduct
  //a star according to the rules
  movesMade++;
  moves.textContent = movesMade;
  if (movesMade === 15 || movesMade === 25) {
    stars--;
    removeStar();
  }
}

function removeStar() {
  //Replace opaque star
  let stars = document.getElementsByClassName('fa-star');
  stars.item(stars.length-1).classList.add("fa-star-o");
  stars[stars.length-1].classList.remove("fa-star");
}

function gameOver() {
  //If no. of cards matched equals total no. of cards, then declare  game over
  if (!gameEnd) {
    if (cardsMatched === faces.length) {
      gameEnd = true;
      //Stop the timer
      clearTimeout(time);
      showModal();
    }
  }
}

function showModal() {
  //Show pop-up modal detailing time spent and no. of stars remaining
  modal.style.display = 'block';
  if (hours !== 0) {
    totalTime.textContent = ( hours === 1 ? hours + " hour, " : hours + " hours, " ) + ( minutes === 1 ? minutes + " minute, and " : minutes + " minutes, and " ) + ( seconds === 1 ? seconds + " second" : seconds + " seconds" );
  } else {
    if (minutes !== 0) {
      totalTime.textContent =  ( minutes === 1 ? minutes + " minute and " : minutes + " minutes and " ) +  ( seconds === 1 ? seconds + " second" : seconds + " seconds" );
    } else {
      totalTime.textContent = seconds === 1 ? seconds + " second" : seconds + " seconds";
    }
  }
  totalStars.textContent = stars > 1 ? stars + " stars" : stars + " star";
}

function closeModal() {
  //Set pop-up modal to invisible initially
  modal.style.display = 'none';
}

function restartGame() {
  closeModal();
  clearTimeout(time);
  seconds = 0;
  minutes = 0;
  hours = 0;
  timer.textContent = hours ? ( ( hours > 9 ? hours : "0" + hours ) + ":" + ( minutes > 9 ? minutes : "0" + minutes ) + ":" + ( seconds > 9 ? seconds : "0" + seconds ) ) : ( (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) );
  movesMade = 0;
  cardsMatched = 0;
  startGame = true;
  gameEnd = false;
  moves.textContent = movesMade;
  cardsClicked = [];
  initGame();
}

initGame();
