// The overall deck for the game
let deck = [];

// The 12 cards dealt to the player
let hand = [];

// Current selection of user
let selected = [];

// Player array to store names and scores
let players = [];

//Sets up form with # of input texts = # of players
function getInfo(){
    let form1 = document.getElementById("form1");
    let playerCount = form1.numOfPlayers.value;
    let output = document.getElementById("playerInfo");

    //check user input is a valid number
    if(playerCount > 0 && !isNaN(playerCount)) {
        playerCount = parseInt(playerCount);
        output.innerHTML = "<p>Enter Player Names Here:</p>";
        let frm = document.createElement("form");
        frm.id = "namesList";
        output.appendChild(frm);

        //Add user name input space
        for(let i = 1; i <= playerCount; i++){
            frm.innerHTML += "<p>Player " + i + "'s Name: </p>";
            let input = document.createElement("input");
            input.name = "player";
            frm.appendChild(input);
            frm.innerHTML += "<br>";
        }

        let playButton = document.createElement("button");
        playButton.onclick = getNames;
        playButton.innerText = "Play Now!";
        output.appendChild(playButton);
    }else{

        //invalid input
        output.innerHTML = "<p>Please Enter An Integer Value Above 0!</p>";
    }

}

//For each name, a player object is created and added to players array
function populatePlayers(namesSet){
    for(let i = 0; i<namesSet.length;i++){
        players.push(new Players(namesSet[i]));
    }
}

// Checks to make sure all names are valid and unique
function getNames(){
    let input = document.getElementById("namesList");
    let correctInput = true;
    let namesSet = [];

    //check whether the player number is 1 or greater than 1
    if(input.player.length === undefined){
        playerName = input.player.value;
        if(playerName.length === 0){
            correctInput = false;
        }
        namesSet.push(playerName);
    }else{

        //get all player info
        for(let i=0; i<input.player.length; i++){
            playerName = input.player[i].value;
            if(playerName.length === 0){
                correctInput = false;
                break;
            }else{
                if(namesSet.includes(playerName)){
                    correctInput = false;
                }
            }
            namesSet.push(playerName);
        }
    }

    // error messages if invalid
    if(!correctInput && !(!!document.getElementById("incorrectMes"))){
        alert("ERROR: Make sure each name is UNIQUE and ALL entries are entered!");
    }else if(correctInput){ //pass the player info to game page
        populatePlayers(namesSet);
        sessionStorage.setItem("players", JSON.stringify(players));
        window.location = "./game.html";
    }

}

//Selects the clicked player button
function selectPlayer(){
    // Get all the player buttons
    let playerbtns =  document.getElementsByClassName("playerbutton");

    // Remove current player from any other player buttons
    for(let i = 0; i < playerbtns.length; i++){
        playerbtns[i].classList.remove("currentplayer");
    }

    //Add currentplayer class to clicked button to select it
    this.classList.add("currentplayer");
    
}

//Updates the current player's score based on flag
// True for add, false for subtract
function updatePlayerScore(flag){
    
    //Get the current player
    let playerbutton = document.getElementsByClassName("currentplayer")[0];

    let player;

    // Increment his score in the player array
    for(let i = 0; i < players.length; i++){
        if(players[i].name === playerbutton.id){
            if(flag){
                players[i].score = players[i].score + 1;
            }else{
                players[i].score = players[i].score - 1;
            }   
            player = players[i];
            break;
        }
    }

    //Display player's new score on screen
    playerbutton.innerText = playerbutton.id + ": " + player.score;
}

//create buttons for each player
function dispPlayerButtons(){
    let location = document.getElementById("players");
    players = JSON.parse(sessionStorage.getItem("players"));

    //append as the child to the players part
    for(let i = 0; i<players.length;i++){
        let button = document.createElement("button");
        button.onclick = selectPlayer;
        button.innerText = players[i].name + ": " + players[i].score;
        button.classList.add("playerbutton");
        button.id = players[i].name;
        location.appendChild(button);
    }
}

// Card class to keep track of card's attributes
function Card(color, shading, shape, number, id) {
    this.number = number;
    this.shape = shape;
    this.shading = shading;
    this.color = color;
    this.id = id;
}

// Player class to keep track of player information
function Players(name){
    this.name = name;
    this.score = 0;
}

// Fill the deck with cards and map each card with and id to the image of that card
function fillDeck() {
    let colors = ["Red", "Green", "Purple"];
    let shading = ["Open", "Striped", "Solid"];
    let shapes = ["Diamond", "Oval", "Squiggle"];
    let numbers = ["1", "2", "3"];
    let id = 0;

    //fill in 81 cards
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < shading.length; j++) {
            for (let k = 0; k < shapes.length; k++) {
                for (let m = 0; m < numbers.length; m++) {
                    deck.push(new Card(colors[i], shading[j], shapes[k], numbers[m], id));
                    id++;
                }
            }
        }
    }
}

// Shuffle the deck
function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
}

// Fills cards from deck into hand
function fillHand(){


    //fill in cards to hand
    while(hand.length < 12 && deck.length >= 0){
        hand.push(deck.shift());
    }

    //check the game end condition
    if(deck.length === 0){
        let message = document.createElement("h2");
        message.className = "title";
        message.innerText = "GAME OVER! \n Check who won on the left and when you are ready click END GAME!";
        let cardLocation = document.getElementById("cards");
        cardLocation.innerHTML = "";
        cardLocation.appendChild(message);
    }

}

// Prints the cards to screen
function printHand() {
    let cards = document.getElementById("cards");
    cards.innerHTML = "";

    //create card images 
    for (let i = 0; i < 12; i++) {
        let card = hand[i];
        let cardImage = document.createElement("img");
        cardImage.src = "lib/images/" + card.id + ".png";
        cardImage.id = card.id;
        cardImage.onclick = selectCard;
        cards.appendChild(cardImage);
    }
}

// Selects a card and updates the hand and selected array
function selectCard(){

    // Only select cards if player is selected
    if (document.getElementsByClassName("currentplayer").length > 0){

        //Try to find index of the card if present
        let present = selected.findIndex(card => card.id === parseInt(this.id));

        //This means card is present in selected array so remove/deselect it
        if(present >= 0){

            //Remove the border
            this.style.border = "none";

            //Remove this card from selected
            selected.splice(present, 1);
        
        // This means card isn't present so add it to selected only if its length < 3
        }else if(present < 0 && selected.length < 3){

            // Add the border
            this.style.border = "3px solid black";

            //Find the card in hand, push it to selected.
            let cardIndex = hand.findIndex((card) => card.id === parseInt(this.id));
            selected.push(hand[cardIndex]);
        }

        // If selected array is full, check for set validity
        if(selected.length === 3){
            validateSet();
        }
    }
}

// Reports whether attributes are all same
function allSame(attr1, attr2, attr3) {
    return attr1 === attr2 && attr2 === attr3 && attr1 === attr3;
}

// Reports whether attributes are all different
function allDifferent(attr1, attr2, attr3) {
    return attr1 !== attr2 && attr2 !== attr3 && attr1 !== attr3;
}

// Reports whether attributes are all same or all different
function allSameOrDifferent(attr1, attr2, attr3){
    return allSame(attr1, attr2, attr3) || allDifferent(attr1, attr2, attr3);
}

// Reports whether the given three cards are a set
function isSet(card1, card2, card3){
    let result = true;


    //conditions to check whether is a set
    if (!allSameOrDifferent(card1.number, card2.number, card3.number)) {
        result = false;
    }
    if (!allSameOrDifferent(card1.shape, card2.shape, card3.shape)) {
        result = false;
    }
    if (!allSameOrDifferent(card1.shading, card2.shading, card3.shading)) {
        result = false;
    }
    if (!allSameOrDifferent(card1.color, card2.color, card3.color)) {
        result = false;
    }

    return result;
}


//hint function show 2 of 3 cards in a set
function hint(){
    let set = findSet(hand);

    //show 2 cards with animation
    while(set.length>1){
        let hintCard  = set.shift();
        document.getElementById(hintCard.id).classList.add("animate");

        //remove animation after finished
        setTimeout(function(){
            document.getElementById(hintCard.id).classList.remove("animate");
        }, 1000);
    }
}

//Finds a set from the given array of cards
function findSet(cards){

    //loop through the deck to find the set
    for(let i = 0; i < cards.length; i++){
        for(let j = 0; j < cards.length; j++){
            for(let k = 0; k < cards.length; k++){
                if((i !== j) && (j !== k) && (i !== k)){
                    if(isSet(cards[i], cards[j], cards[k])){
                        return [cards[i], cards[j], cards[k]];
                    }
                }
            }
        }
    }
}

// Checks if given card array contains a set
// If not, it reshuffles the cards
function checkSetContains(){

    // Shuffle cards until we find a set
    while(findSet(hand) === undefined || !findSet(hand).length === 3){
        deck.push(...hand);
        hand.length = 0;
        shuffleDeck();
        fillHand();
    }
}


//Validates if the selected cards are a set and updates the hand and deck
function validateSet(){
    let location = document.getElementById("message");
    let message = document.createElement("h1");
    location.innerHTML = "";
    if(isSet(selected[0], selected[1], selected[2])){

        //Remove the seleted set cards from hand
        for(let i = 0; i < selected.length; i++){
            for(let j = 0; j < hand.length; j++){
                if(hand[j].id === selected[i].id){
                    hand.splice(j, 1);
                }
            }
        }

        // Remove the selected cards from display
        for(let i = 0; i < selected.length; i++){
            let card = document.getElementById(selected[i].id);
            card.remove();
        }

        //Fill hand from deck
        fillHand();

        //Check if hand contains set
        checkSetContains();

        // Print hand to display
        printHand();

        //Clear selected array
        selected.length = 0;
    
        //Display the cards in deck
        printCardsInDeck();

        //Updated the player score
        updatePlayerScore(true);


        message.innerText = "CORRECT! You get a point!";
        message.classList.add("correct");
        location.append(message);
    }else{
        message.innerText = "INCORRECT! You lose a point!";
        message.classList.add("incorrect");
        location.append(message);
        //They didnt get a set
        updatePlayerScore(false);
        
        // Remove selected cards' border
        for(let i = 0; i < selected.length; i++){
            let card = document.getElementById(selected[i].id);
            card.style.border = "none";
        }

        //Clear selected array
        selected.length = 0;
    }
    setTimeout(function(){location.innerHTML = "";},1000);  
}

// invoke when user want to quit the game
function quit(){
    window.location = "./homepage.html";
}

//show number of cards left
function printCardsInDeck(){
    document.getElementById("trackCards").innerText = "Cards in Deck: " + deck.length;
}

//where all functions runs
function startGame() {
    fillDeck();
    shuffleDeck();
    fillHand();
    dispPlayerButtons();
    checkSetContains();
    printHand();
    printCardsInDeck();
}

