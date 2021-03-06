
 // Splash screen
$("#SplashScreen").click(function () {
    $("#SplashScreen").hide();
    $("#canvas").show();
	init();
	gameLoop();
});

 // Kill screen
$("#KillScreen").click(function () {
    $("#KillScreen").hide();
    $("#canvas").show();
	zombieLasers=[];
	lasers=[];
	zombiespeed=1;
	lives = 3;
 	level = 1;
        score = 0;
	NCOLS = 11;
	init();
	gameLoop();
});

// --Canvas Variables--//

c=document.getElementById("canvas");
ctx=c.getContext("2d");
WIDTH = c.width;
HEIGHT = c.height;

// --STATUS VARIABLES--//

var gLoop;             // variable used for setTimeout()
var offense;		   // variable used for setInterval()
var level = 1;		   // your current level

// --KEYBOARD PRESSES--//

rightDown = false;
leftDown = false;
var score = 0;
var gamePaused = false;

// --ZOMBIE VARIABLES-- //

var seeCamper = false; // true if the  camper is currently on the screen
var camperx;		   // current x position of camper (y position is fixed)
var zombies;    		   // A 2D array of zombies with elements 
					   // [type, xpos, ypos, height, width]



var	NROWS = 5;         // number of rows and columns of zombies
var	NCOLS = 11;
var ZOMBIEWIDTH = 39; 
var ZOMBIEHEIGHT = 39;  // specfic to zombie.png 
var PADDING = 10;



var survivors;         // number of zombies left alive
var zombiedx = 1;       // used when the zombies 'bounce'
var zombieAnimate = 'UP';
					   // can be either 'UP' or 'DOWN', used in animate()
var zombieSpeed = 1     // zombies move faster when they bounce off the walls
var zombieLasers = [];  // an array of zombie lasers [xpos, ypos, height, width]

// ----- LASERS -----  //

var laserTotal = 0;    // max amount of lasers + 1
var lasers =[];        // array of lasers, with elements [xpos, ypos, height, width]

// ------ PLAYER ------- //
var lives = 3;	       // number of lives you have
var sheilds = [];	   // A double array of three sheilds, with [strength, xpos, ypos]
					   // the 'strength' of each sheild is: 5 = full strength,
					   // 4 = hit, 2 = failing, 0 = destroyed
SHEILDHEIGHT = 100
SHEILDWIDTH = 74
playerx = WIDTH / 2;     // player starts in the middle of the field
playerh = 10;
playerw = 45; 
var playerHit;		   // captain! We've been hit!

/*
 * Initialize Images
 */
// player

var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () { playerReady = true; };
playerImage.src = "images/playerb.png"; // live player, used for lives
var livePlayerReady = false;
var livePlayerImage = new Image();
livePlayerImage.onload = function () { livePlayerReady = true; };
livePlayerImage.src = "images/liveplayer.png";

// zombie 1

var zombie1Ready = false;

var zombie1Image = new Image();

zombie1Image.onload = function () { zombie1Ready = true; };

zombie1Image.src = "images/camper1b.png";



// zombie 2

var zombie2Ready = false;

var zombie2Image = new Image();

zombie2Image.onload = function () { zombie2Ready = true; };

zombie2Image.src = "images/camper2b.png";



// zombie 3

var zombie3Ready = false;

var zombie3Image = new Image();

zombie3Image.onload = function () { zombie3Ready = true; };

zombie3Image.src = "images/camper3b.png";







/*

 *  Sheild Images

 *    5 = full strength, 1 = failing

 */

// sheild 5

var sheild5Ready = false;

var sheild5Image = new Image();

sheild5Image.onload = function () { sheild5Ready = true; };

sheild5Image.src = "images/sheild5.ico";



// sheild 4

var sheild4Ready = false;

var sheild4Image = new Image();

sheild4Image.onload = function () { sheild4Ready = true; };

sheild4Image.src = "images/sheild4.ico";



// sheild 3

var sheild3Ready = false;

var sheild3Image = new Image();

sheild3Image.onload = function () { sheild3Ready = true; };

sheild3Image.src = "images/sheild3.ico";



// sheild 2

var sheild2Ready = false;

var sheild2Image = new Image();

sheild2Image.onload = function () { sheild2Ready = true; };

sheild2Image.src = "images/sheild2.ico";



// sheild 1

var sheild1Ready = false;

var sheild1Image = new Image();

sheild1Image.onload = function () { sheild1Ready = true; };

sheild1Image.src = "images/sheild1.ico";



// Camper

var camperReady = false;

var camperImage = new Image();

camperImage.onload = function () { camperReady = true; };

camperImage.src = "images/mysteryb.png";


var background = new Image;
background.src = "images/background.jpg";

var background1 = new Image;
background1.src = "images/background.jpg";

function drawBg () {

	ctx.drawImage(background, 0, 0, 800, 580);

}


/* 

 * Initialize Audio

 *    first initializes an array of audio channels for overlapping sounds

 *    function playSound() is called for audio handling

 *    thanks to http://www.storiesinflight.com/html5/audio.html for base

 */

var channel_max = 10;								// number of channels

audiochannels = new Array();

for (a=0;a<channel_max;a++) {					// prepare the channels

	audiochannels[a] = new Array();

	audiochannels[a]['channel'] = new Audio();	// create a new audio object

	audiochannels[a]['finished'] = -1;			// expected end time for this channel, init to -1

}

 

 function playSound(s) {

		for (a=0; a<audiochannels.length; a++) {

			thistime = new Date();

			if (s == undefined) break; // audio channel might not be playing anything

			if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?

				audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;

				audiochannels[a]['channel'].src = document.getElementById(s).src;

				audiochannels[a]['channel'].load();

				audiochannels[a]['channel'].play();

				break;

			}

		}

	}
 var howManyLines = 20, lines = [];

 

 function initSpace(){

 for (var i = 0; i < howManyLines; i++)  

	// lines elements consist of [xposition, yposition, length of trail, see-throughness]

	lines.push([Math.random() * WIDTH, Math.random() * HEIGHT, Math.random()*100, Math.random() / 2]); 

    

 }

  function drawLines(){  

  for (var i = 0; i < howManyLines; i++) {  

    ctx.fillStyle = 'rgba(255, 255, 255, ' + lines[i][3] + ')';  

//white color with transparency in rgba  

    ctx.beginPath();  

    ctx.rect(lines[i][0], lines[i][1], 2, lines[i][2]);  

    ctx.closePath();  

    ctx.fill();  

  }  

} 



/*

 * Keypress Handling

 *      uses jQuery to log keypresses, then sets global

 *      variables rightDown and leftDown to true if presssed.

 *      If key was spacebar (32), adds a laser to laser array.

 *      Unsets rightDown, leftDown when key is released.

 *      'p' pauses the game.

 */

 

// JQuery 

$(document).keydown(keyDown);

$(document).keyup(keyUp);

  

// Key is Pressed

function keyDown(evt) {

  if (evt.keyCode == 39) rightDown = true;

  else if (evt.keyCode == 37) leftDown = true;

  if (evt.keyCode == 32 && lasers.length <= laserTotal) {

    playSound('shoot');

	lasers.push([playerx + 20, HEIGHT - playerh, 4, 10]); }

  if (evt.keyCode == 80) pauseGame();



}

// Key is Unset

function keyUp(evt) {

  if (evt.keyCode == 39) rightDown = false;

  else if (evt.keyCode == 37) leftDown = false;

}



function pauseGame(){
	if (!gamePaused) {
		gamePaused = true;
		clearTimeout(game);
		offense = clearInterval(offense);
	} 
	else if (gamePaused) {
		gamePaused = false;
		game = setTimeout(gameLoop, 1000 / 30);
		//offense = setInterval(zombieOffensive, 1000);  
	}
}





/*

 *  Sheilds

 *      initSheilds() initalizes the array of sheilds with [strength, xpos, ypos]

 *      drawSheilds() draws the sheilds

 *      Sheilds are stored in var sheilds, an array, and tested in hitTest()


 */

 function initSheilds(){

	y = HEIGHT - 100;

	x = 75;

	dx = 300;

	for (i = 0; i < 3; i++){

		sheilds[i] = [5, x, y]; // 5 = starting strength

		x += dx;

	}

 }

 

 function drawSheilds(){
	for (i = 0; i < sheilds.length; i++){
		if (sheilds[i][0] == 5 && sheild5Ready == true){
			ctx.drawImage(sheild5Image, sheilds[i][1], sheilds[i][2], SHEILDHEIGHT, SHEILDWIDTH);
		}
		if (sheilds[i][0] == 4 && sheild4Ready == true){
			ctx.drawImage(sheild4Image, sheilds[i][1], sheilds[i][2], SHEILDHEIGHT, SHEILDWIDTH);
		}
		if (sheilds[i][0] == 3 && sheild3Ready == true){
			ctx.drawImage(sheild3Image, sheilds[i][1], sheilds[i][2], SHEILDHEIGHT, SHEILDWIDTH);
		}
		if (sheilds[i][0] == 2 && sheild2Ready == true){
			ctx.drawImage(sheild2Image, sheilds[i][1], sheilds[i][2], SHEILDHEIGHT, SHEILDWIDTH);
		}
		if (sheilds[i][0] == 1 && sheild1Ready == true){
			ctx.drawImage(sheild1Image, sheilds[i][1], sheilds[i][2], SHEILDHEIGHT, SHEILDWIDTH);
		}
		
		// delete sheild from array if its down
		if (sheilds[i][0] == 0){
			sheilds.splice(i, 1);
		}
	}
 }

 
/*
 * Fun With Zombies
 * initzombies(), moveZombies(), drawZombies() 
 * zombieOffensive() will be used to make zombies randomly change direction
 *   and shoot zombie lasers
 */
 

 function initzombies(){
 // creates an array of zombies
 	zombies = new Array(NCOLS);
	
	zombie_x = PADDING;   // starting (x, y) position of first zombie
	
	for (c = 0; c < NCOLS; c++){
		zombies[c] = new Array(NROWS);
		zombie_y = PADDING*8;
		for ( r=0; r<NROWS; r++){	
			// sets zombie type based on row
			if (r == 0) zombies[c][r] = new Array(3, zombie_x, zombie_y, ZOMBIEHEIGHT, ZOMBIEWIDTH);
			else if (r == 1 || r == 2) zombies[c][r] = new Array(1, zombie_x, zombie_y, ZOMBIEHEIGHT, ZOMBIEWIDTH);
			else zombies[c][r] = new Array(2, zombie_x, zombie_y, ZOMBIEHEIGHT, ZOMBIEWIDTH);
			zombie_y += ZOMBIEHEIGHT + PADDING;
		}
		zombie_x += ZOMBIEWIDTH + PADDING; 
	}
	survivors = NROWS*NCOLS; // all of the zombies are alive... currently 		
}

// moveZombies() is responsible for zombie's back-and-forth movements, including wall hits
// and creeping forward. It also removes a column if the column is empty
function moveZombies(){
	forward = 0; // whether we should creep forward
	for (c = 0; c < NCOLS; c++) {	
		isEmpty = true; // first, we assume that a col of zombies is empty
		for (r = 0; r < NROWS; r++) {
		    // go right
			if (zombies[NCOLS-1][NROWS-1][1] < WIDTH - ZOMBIEWIDTH && zombiedx > 0) zombies[c][r][1] += zombieSpeed; 
			
			// or go left
			else if (0 < zombies[0][0][1] && zombiedx < 0) zombies[c][r][1] -= zombieSpeed;
			
			// or bounce off wall
			else  {
				zombiedx = zombiedx * -1; 
				forward = 1;
				if (zombieSpeed < 4.0) zombieSpeed += 0.10;
			}
			
			// we've seen an zombie in this column
			if (zombies[c][r][0] != 0) isEmpty = false; 
			
			// if an zombie hits the bottom, you automatically lose
			if (zombies[c][r][2] > HEIGHT - playerh - ZOMBIEHEIGHT) {
				lives -= 3;
			}
		}

		// remove column from zombies if it's empty
		if (isEmpty){
			zombies.splice(c, 1); 
			NCOLS -= 1;
		}
	}
	
	if (forward == 1) {
		onwardZombie();
		forward = 0;
	}	
}

// makes the zombies creep forward by increasing their y-position
// in the zombies array [type, xpos, ypos, icon height, icon width]
function onwardZombie(){
	for (col = 0; col < NCOLS; col++) {	
		for (row = 0; row < NROWS; row++) {
			zombies[col][row][2] += 10*(0.5*level);
		}
	}
}

function zombieOffensive(){	
	
    // drawZombies() to ascertain which image to use
	
	// small chance of rare runing camper if one isn't already present
	if (0.85 < Math.random() && seeCamper == false){
		seeCamper = true;
		camperx = 0;
	}
	// zombies shoot at you (if there are any left)
	if (NCOLS > 0){
		shooter = zombies[Math.floor(Math.random() * NCOLS)][Math.floor(Math.random() * NROWS)];
		
		if (shooter[0] != 0){ // if the zombie isn't dead
			zombieLasers.push([shooter[1] + ZOMBIEWIDTH/2, shooter[2] + ZOMBIEHEIGHT, 4, 10]);
		}	
	}
}


function drawZombies(){
	for (c=0; c < NCOLS; c++) {
		for (r=0; r < NROWS; r++) {
			if (zombies[c][r][0] == 1 && zombie1Ready == true) {
				ctx.drawImage(zombie1Image, zombies[c][r][1], zombies[c][r][2], ZOMBIEHEIGHT, ZOMBIEWIDTH);				
			}
			if (zombies[c][r][0] == 2 && zombie2Ready == true) {
				ctx.drawImage(zombie2Image, zombies[c][r][1], zombies[c][r][2], ZOMBIEHEIGHT, ZOMBIEWIDTH); 
			}
			if (zombies[c][r][0] == 3 && zombie3Ready == true){
				ctx.drawImage(zombie3Image, zombies[c][r][1], zombies[c][r][2], ZOMBIEHEIGHT, ZOMBIEWIDTH);
			}
		}
	}	  
}

/*
 * Mystery Camper!
 *    drawCamper() and moveCamper(), which are each called when 
 *     the Camper is visible: seeCamper == true.
 *     These set seeCamper = false when the camper hits the right side of the screen
 */

 function drawCamper(){
	if (camperReady == true) ctx.drawImage(camperImage, camperx, 30, ZOMBIEHEIGHT, ZOMBIEWIDTH);
 }
 
 function moveCamper(){
	camperx += 4;
	if (camperx >= WIDTH) seeCamper = false; 
 }
 
/*
 * Fun With Lasers
 *   drawLaser(), moveLaser(), hitTest()
 *   lasers are initialized in keypress handling
 */ 
	  
function drawLaser() {
  if (lasers.length)
    for (var i = 0; i < lasers.length; i++) {
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
    }
	if (zombieLasers.length){
		for (var i = 0; i < zombieLasers.length; i++) {
			ctx.fillStyle = "#FF0033";
			ctx.fillRect(zombieLasers[i][0],zombieLasers[i][1],zombieLasers[i][2],zombieLasers[i][3])
   }
}
}


function moveLaser() {
  // move player lasers
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i][1] > -11) {
      lasers[i][1] -= 13; // laser speed
    } else if (lasers[i][1] < -10) {
      lasers.splice(i, 1);
    }
  }
  // move zombie lasers
  for (var i = 0; i < zombieLasers.length; i++) {
    if (zombieLasers[i][1] < HEIGHT) {
      zombieLasers[i][1] += 10;
    } else if (zombieLasers[i][1] > HEIGHT) {
      zombieLasers.splice(i, 1);
    }
  }
}

// hitTest() checks to see if lasers have hit an zombie, sheild, or player.
// If so, removes the laser and 'kills' the zombie, docks one from sheild strength, 
// or calls hit(), respectively 
 function hitTest(){

	/* PLAYER LASERS */

	var remove = false; // whether a laser has already hit something

	for (l = 0; l < lasers.length; l++){

		// checks whether player laser has hit an zombie

		for (c = 0; c < NCOLS; c++){

			for(r =0; r < NROWS; r++){

			
				if (lasers[l][1] >= zombies[c][r][2] &&

					lasers[l][1] <= zombies[c][r][2] + zombies[c][r][3]

					&& lasers[l][0] >=  zombies[c][r][1] && 

					lasers[l][0] <= (zombies[c][r][1] + zombies[c][r][4])

					&& zombies[c][r][0] != 0 && !remove){

					

				if (zombies[c][r][0] == 1) score += 10;

				if (zombies[c][r][0] == 2) score += 20;

				if (zombies[c][r][0] == 3) score += 30;

				remove = true;

				zombies[c][r][0] = 0; // stop displaying zombie

				playSound('killed');

				survivors -= 1; 	 // one less zombie to kill!

					}

				}

			}

			

		// checks whether player laser has hit flying camper

		if (lasers[l][1] >= 30 &&

			lasers[l][1] <= 30 + ZOMBIEHEIGHT

			&& lasers[l][0] >=  camperx && 

			lasers[l][0] <= camperx + ZOMBIEWIDTH

			&& seeCamper && !remove){

		

		score += 100;

		seeCamper = false;

		remove = true;

		}

		

		// checks whether player laser has hit a sheild

		for (i = 0; i<sheilds.length; i++)

			if (lasers[l][1] <= sheilds[i][2] + SHEILDWIDTH

				&& lasers[l][0] >=  sheilds[i][1] && 

				lasers[l][0] <= (sheilds[i][1] + SHEILDHEIGHT)

				&& sheilds[i][0] != 0 && !remove){
				playSound('explosion');

				remove = true;

				sheilds[i][0] -= 1;

			}
	

	if (remove == true){

		lasers.splice(l, 1);

		remove = false;}

	}

	

	/* ZOMBIE LASERS */

	var aremove = false; // whether on zombie laser has hit something

					 // prevents one-hit-kills

	for (l = 0; l < zombieLasers.length; l++){



		// checks whether zombie lasers have hit the player

		if ( (playerx < zombieLasers[l][0]) && zombieLasers[l][0] < (playerx + playerw)

          && zombieLasers[l][1] < HEIGHT && zombieLasers[l][1] > (HEIGHT - playerh )) {

			playerHit = true;

			//break;

		}


		// checks whether zombie lasers have hit a sheild

		for (j = 0; j < sheilds.length; j++)

			if (zombieLasers[l][1] >= sheilds[j][2] &&

				zombieLasers[l][1] <= sheilds[j][2] + SHEILDWIDTH

				&& zombieLasers[l][0] >=  sheilds[j][1] && 

				zombieLasers[l][0] <= (sheilds[j][1] + SHEILDHEIGHT)

				&& sheilds[j][0] != 0 && !aremove ){

				playSound('explosion');

				sheilds[j][0] -= 1;

				aremove = true;

			}

	

		if (aremove){

			zombieLasers.splice(l, 1);

			remove = false;

		}		

	}

 }

 

/*

 *  Main Game Loop Functions

 *    clear() clears all of the elements on canvas for re-drawing

 *    gameLoop() is called by setTimeout() in init() every 50 milliseconds

 */

 

function clear() {

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#000000"; // soothing black of space

  ctx.rect(0,0,WIDTH, HEIGHT);

  ctx.fill()

}

 

// draws the status bar (score, lives left)
function drawStatus(){

	ctx.font = "14pt Calibri";

	ctx.fillStyle = "#00FF00";
	ctx.fillText("Score:" + score, 10, 30);
	ypos = 0;
	xpos = WIDTH-200;
	for (l = 0; l < lives; l++){
		xpos += playerw;
		if (livePlayerReady == true){
			ctx.drawImage(livePlayerImage, xpos, ypos, playerw, playerw);
		}
	}

	// displays current level
	ctx.fillText("Level: ", WIDTH/2, 30);
	ctx.fillText(level, WIDTH/2 + 60, 30);
}

function gameLoop() {

	clear();
	drawBg ();
	//move the player if left or right is currently pressed
	if (rightDown && playerx < WIDTH-playerw) playerx += 5;
	else if (leftDown && playerx > 0) playerx -= 5;
	if (playerReady) ctx.drawImage(playerImage, playerx, HEIGHT-3*playerh);

	hitTest();

	if (seeCamper) moveCamper();
	
	moveZombies();
	moveLaser();
	
    drawLines();
	drawCamper();
	drawStatus();
	drawZombies();
	drawSheilds();
	drawLaser();
	

	if (survivors == 0) nextLevel();

	if (lives == 0 || lives < 0) {
		game = clearTimeout(game);
		offense = clearInterval(offense);
		$("#canvas").hide();
		$("#KillScreen").show();
		return;
	};
	
	if (playerHit) hit();
	game = setTimeout(gameLoop, 1000/50);
}
	


// hit is called when a laser hits the player. Calculates how many lives
function hit(){
	playerHit = false;
	game = clearTimeout(game);
	playSound('explosion');
	lives -= 1; 
}

function nextLevel(){
	// clear any running game and zombie callbacks
	game = clearTimeout(game);
	offense = clearInterval(offense);
	level += 1;

	// reset level-specific globals that might have been changed
	NCOLS = 11;
	lasers = [];
	zombieSpeed = 1;
	sheilds = [3,3,3];
	init();
}

/*
 * Where the Magic Happens
 */

 function init(){
	offense = setInterval(zombieOffensive, 1000*(1/level)); 
	zombieLasers = [];
	initSpace();
	initzombies();
	initSheilds();
 }


