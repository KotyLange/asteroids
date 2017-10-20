
import Ship from './ship.js';
import Asteroid from './asteroid.js';
import Projectile from './projectile.js';


/** @function Math.randomBetween()
  * Math prototype function built to easily create ranom floats
  * @param float min - the lowest number you want
  * @param float max - the highest number you want (I beleive it is non-inclusive)
  * @returns random float between the parameters
  */
Math.randomBetween = function (min, max) {
  return Math.random() * (max - min) + min;
};

/** @function Math.randomBetween()
  * Math prototype function built to easily create ranom integers
  * @param float min - the lowest number you want
  * @param float max - the highest number you want (I beleive it is non-inclusive)
  * @returns random integer between the parameters
  */
Math.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/** @class Game
  * Game object that controls the interactions between all other Objects
  */
export default class Game {
  /** @constructor
    * Game object constructor, no arguement, sets up all the necessities.
    */
  constructor() {
    this.screenSide = 1000;
    //Num Objects
    this.numAsteroids = 10;
    //Objects/Arrays
    this.ship = new Ship();
    //Vars to help with respawning the player
    this.respawning = false;
    this.respawnTimer = 300;
    this.projectiles = [];
    //Vars to help control player projectiles
    this.rateOfFire = 50;
    this.reloading = false;
    this.asteroids = [];
    this.createAsteroids();
    //HUD Variables
    this.score = 0;
    this.lives = 3;
    this.level = 1;

    //Over Loop Controllers
    this.gameOver = false;;
    this.paused = false;

    this.explosion = new Audio('./destoryed.wav');
    this.laser = new Audio('./laser.wav');
    this.collide = new Audio('./collide.wav');

    //Input Map
    this.keyMap = {32: false, 37: false, 38: false, 39: false, 65: false, 68: false, 87: false, 88: false};

    //HUD
    this.HUDcanvas = document.getElementById('ui');
    this.HUDcanvas.width = this.screenSide;
    this.HUDcanvas.height = 100;
    this.HUDcontext = this.HUDcanvas.getContext('2d');
    document.body.appendChild(this.HUDcanvas);

    //Back Buffer
    this.backBufferCanvas = document.getElementById("canvas");
    this.backBufferCanvas.width = this.screenSide;
    this.backBufferCanvas.height = this.screenSide;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');

    //Canvas that actually gets put on the screen
    this.screenBufferCanvas = document.getElementById("canvas");
    this.screenBufferCanvas.width = this.screenSide;
    this.screenBufferCanvas.height = this.screenSide;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

    //Binders
    this.loop = this.loop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;

    this.interval = setInterval(this.loop, 10);
  }

  /** @function handleKeyDown()
    * function to handle key presses
    */
  handleKeyDown(event)
  {
    event.preventDefault();
    //Update the keyMap
    this.keyMap[event.keyCode] = true;
    //Handle the Pause seperately, to control the loop function
  }

  /** @function
    * function to handle the keys being lifted up
    */
  handleKeyUp(event) {
    event.preventDefault();
    //Update the key map
    this.keyMap[event.keyCode] = false;
  }

  /** @function
    * function to create a Projectile from the player's ship
    */
  createProjectile() {
    //Get the coordinates of the tip of the ship, The 1.2 is so you can't run into your own shot immediately
    var x = this.ship.x + Math.sin(this.ship.velocity.dir)* this.ship.radius * 1.2;
    var y = this.ship.y - Math.cos(this.ship.velocity.dir)* this.ship.radius * 1.2;
    this.projectiles.push(new Projectile(x, y, this.ship.velocity.dir, this.ship.color));
  }

  

  /** @function
    * function to create as many asteroids as needed
    */
  createAsteroids() {
    while(this.asteroids.length < this.numAsteroids) {
      this.addAsteroid(-1.0);
    }
  }

  /** @function addAsteroid()
    * Function to add new asteroid to the list while making sure it is not spawned where a object already is
    * @param float direction - determines the inital direction of the asteroid if it has exploded, -1.0 if spawning in otherwise
    */
  addAsteroid(direction) {
    //Variables to establish the particle
    var x;
    var y;
    var radius;
    var mass;
    //Var to control the while loop
    var currLength = this.asteroids.length;
    //Loop that generates random values for the particle and makes sure the space is not already occupied
    while (currLength === this.asteroids.length) {
      //Var to determine if it would have spawned inside something
      var collision = false;
      var spawnSide = Math.randomInt(1, 5);
      mass = Math.randomBetween(10, 75);
      radius = mass;
      //Top
      if(spawnSide === 1) {
        x = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
        y = - 2 * radius;
      }
      //Right
      else if(spawnSide === 2) {
        x = this.screenSide + 2 * radius;
        y = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
      }
      //Bottom
      else if(spawnSide === 3) {
        x = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
        y = this.screenSide + 2 * radius;
      }
      //Left
      else {
        x = - 2 * radius;
        y = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
      }
      //Checks if the position is occupied by another asteroid
      this.asteroids.forEach(asteroid => {
        if(asteroid.collisionDetection(x, y, radius)) {
          collision = true;
        }
      });
      if(!collision) {
        this.asteroids.push(new Asteroid(x, y, mass, direction));
      }
    }
  }

  /** @function rotate()
    * Function to change the velocities to make the collisions act like 1-dimensional collisions
    * @param velocity is the x and y velocities of the asteroid
    * @param float angle is the offset needed to adjust for
    * @returns vector of rotated velocities
    */
  rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
  }

  /** @function asteroidCollision()
    * Function to handle asteroid to asteroid collisions (treated like elastic particle collisions), I ripped this out of one my side projects
    * @param asteroid is the first asteroid in question
    * @param asteroid otherAsteroid is the other particle in question
    */
  asteroidCollision(asteroid, otherAsteroid) {
    //Vars to determine the differences in velocities
    var xVelocityDiff = asteroid.velocity.x - otherAsteroid.velocity.x;
    var yVelocityDiff = asteroid.velocity.y - otherAsteroid.velocity.y;
    //Vars to determine the distances between particles
    var xDist = otherAsteroid.x - asteroid.x;
    var yDist = otherAsteroid.y - asteroid.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding asteroids
        var angle = -Math.atan2(otherAsteroid.y - asteroid.y, otherAsteroid.x - asteroid.x);

        // Store mass in var for better readability in collision equation
        var m1 = asteroid.mass;
        var m2 = otherAsteroid.mass;

        // Velocity before equation
        var u1 = this.rotate(asteroid.velocity, angle);
        var u2 = this.rotate(otherAsteroid.velocity, angle);

        // Velocity after 1d collision equation
        var v1 = { x: (u1.x * (m1 - m2) + 2 * m2 * u2.x) / (m1 + m2), y: u1.y };
        var v2 = { x: (u2.x * (m2 - m1) + 2 * m1 * u1.x)/ (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        var vFinal1 = this.rotate(v1, -angle);
        var vFinal2 = this.rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        asteroid.velocity.x = vFinal1.x;
        asteroid.velocity.y = vFinal1.y;
        otherAsteroid.velocity.x = vFinal2.x;
        otherAsteroid.velocity.y = vFinal2.y;
    }
  }

  /** @function circleCollision()
    * function to determine if two circles are overlapping
    * @param floats x1, y1, r1 - position and radius of the first circle
    * @param floats x2, y2, r2 - position and radius of the second circle
    */
  circleCollision(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var distance = dx * dx + dy * dy;
    //check if ufo
    if(distance < Math.pow(r1 + r2, 2)) {
      return true;
    }
    return false;
  }

  /** @function handleAsteriodExplosion()
    * function to handles asteroids exploding from a projectile
    * @param int aID - index of the asteroid to be exploded
    */
  handleAsteriodExplosion(aID) {
    //Save the essentials
    var asteroid = this.asteroids[aID];
    var mass = asteroid.mass;
    var x = asteroid.x;
    var y = asteroid.y;
    //Get rid of the asteroid
    this.asteroids.splice(aID, 1);
    this.explosion.play();
    //Smaller asteroids are harder to hit, thus more score
    this.score += Math.floor(100 / mass);
    //If it isn't too small
    if(mass >= 15) {
      //random number of pieces the asteroid will break into
      var random = Math.randomInt(2, 4);
      //Update asteroid count
      this.numAsteroids += random - 1;
      mass /= random;
      //Random direction
      var direction = Math.randomBetween(0, 2 * Math.PI);
      //Uniform distribution
      var angleChange = 2 * Math.PI / random;
      for(var i = 0; i < random; i++) {
        //Since mass is also the radius
        var newX = x + Math.cos(direction) * mass;
        var newY = y - Math.sin(direction) * mass;
        //Create new asteroid
        this.asteroids.push(new Asteroid(newX, newY, mass, direction));
        direction += angleChange;
      }
    }
    else {
      this.numAsteroids--;
    }
  }

  /** @function detectShipCrash()
    * determines if a ship hits an asteroid / Handles UFO AI
    * @param Ship ship - ship object, coulde be player ship or ufo
    * @param Asteroid asteroid - asteroid object
    */
  detectShipCrash(ship, asteroid) {
    var dx = ship.x - asteroid.x;
    var dy = ship.y - asteroid.y;
    var distance = dx * dx + dy * dy;

    if(distance < Math.pow(asteroid.radius + ship.radius, 2)) {
      return true;
    }
    return false;
  }

  /** @function respawn()
    * function to handle the player's ship getting destroyed
    */
  respawn() {
    this.respawning = true;
    this.lives--;
    if(this.lives >= 0) {
      this.ship = new Ship();
    }
    else {
      this.gameOver = true;
    }
  }


  /** @function drawHUD()
    * function to draw the HUD at the bottom of the screen
    */
  drawHUD() {
    this.HUDcontext.fillStyle = 'gray';
    this.HUDcontext.fillRect(0, 0, this.screenSide, 100);
    this.HUDcontext.fillStyle = 'red';
    this.HUDcontext.font = '30px sans-serif';
    this.HUDcontext.fillText("LIVES: " + this.lives, 10, 50);
    this.HUDcontext.fillText("LEVEL: " + this.level, 400, 50);
    this.HUDcontext.fillText("SCORE: " + this.score, 800, 50);
  
    this.HUDcontext.font = '20px sans-serif';
    this.HUDcontext.fillText("CONTROLS: ", 10, 90);
    this.HUDcontext.fillText("W: Thurster     A: Rotate Left       D: Rotate Right       Space: Shoot", 150, 90);
  }

  /** @function update()
    * Handles updating all object and variables, comments laced throughout
    */
  update() {
    //Update Ship
    this.ship.update();
    //Update each asteroid
    this.asteroids.forEach(asteroid => {
      asteroid.update();
    });

    //Update Level if no more asteroids
    if(this.asteroids.length === 0) {
      this.level++;
      //You Will Probably Need These
      this.lives += this.level;
      this.numAsteroids = 10 + 2 * this.level;
      this.createAsteroids();
    }

    //Control respawning
    if(this.respawning) {
      this.respawnTimer--;
      if(this.respawnTimer <= 0) {
        //Done respawning, ship can now be destroyed again
        this.respawnTimer = 300;
        this.respawning = false;
      }
    }

    //Checks for collisions between asteroids
    for(var i = 0; i < this.asteroids.length; i++) {
      for(var j = 0; j < this.asteroids.length; j++) {
        if(i !== j) {
          if(this.asteroids[i].collisionDetection(this.asteroids[j].x, this.asteroids[j].y, this.asteroids[j].radius)) {
              this.asteroidCollision(this.asteroids[i], this.asteroids[j]);
              this.collide.play();
          }
        }
      }
    }

    //Checks for collisions between projectiles and asteroids
    for(var i = 0; i < this.projectiles.length; i++) {
      for(var j = 0; j < this.asteroids.length; j++) {
        if(this.circleCollision(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].radius, this.asteroids[j].x, this.asteroids[j].y, this.asteroids[j].radius)) {
          this.projectiles.splice(i, 1);
          this.handleAsteriodExplosion(j);
          break;
        }
      }
    }

    if(!this.respawning) {
      //Check for ship crashing
      for(var i = 0; i < this.asteroids.length; i++) {
        if(this.detectShipCrash(this.ship, this.asteroids[i])) {
          this.explosion.play();
          this.respawn();
        }
      }
    }


    //Input Map Applying
    //A or Left Arrow
    if(this.keyMap[65] || this.keyMap[37]){
      this.ship.velocity.dir -= 0.05;
      if(this.ship.velocity.dir <= -Math.PI * 2) {
        this.ship.velocity.dir = 0.0;
      }
    }
    //D or Right Arrow
    if(this.keyMap[68] || this.keyMap[39]) {
      this.ship.velocity.dir += 0.05;
      if(this.ship.velocity.dir >= Math.PI * 2) {
        this.ship.velocity.dir = 0.0;
      }
    }
    //W or Up Arrow
    if((this.keyMap[87] || this.keyMap[38]) && (this.respawnTimer <= 150 || !this.respawning)) {
      this.ship.velocity.mag = 0.1;
      this.ship.updateSpeed();
    }
    //Space
    if(this.keyMap[32] && this.rateOfFire === 50 && !this.respawning) {
      this.createProjectile();
      this.laser.play();
      this.reloading = true;
    }


    //Controlling the rate of fire
    if(this.reloading) {
      this.rateOfFire--;
      if(this.rateOfFire <= 0) {
        this.rateOfFire = 50;
        this.reloading = false;
      }
    }

    //Update projectiles, if there are any
    for(var i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].update();
      if(this.projectiles[i].edgeDetection()) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  /** @function render()
    * standard render function, calls all other render funcitons and drawHUD
    */
  render() {
    //Initial Setup
    this.backBufferContext.fillStyle = 'black';
    this.backBufferContext.strokeStyle = 'blue';
    this.backBufferContext.font = '50px Times New Roman';
    //Refresh canvas
    this.backBufferContext.fillRect(0,0, this.screenSide, this.screenSide);
    this.drawHUD();

    //Draw ship
    if(!this.respawning || this.respawnTimer <= 150) {
      this.ship.render(this.backBufferContext);
    }
    //Draw asteroids
    this.asteroids.forEach(asteroid => {
      asteroid.render(this.backBufferContext);
    });
    //draw projectiles
    this.projectiles.forEach(projectile => {
      projectile.render(this.backBufferContext);
    });

    //Bit blit the back buffer onto the screen
    this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
  }

  /** @function loop()
    * continuously loops the update and render function unless gameOver or paused
    */
  loop() {
    if(!this.paused && !this.gameOver) {
      this.update();
      this.render();
    }
  }
}
