import ship from './ship'

import laser from './laser'

import asteroid from './asteroid'


export default class Game
{

    constructor()
    {

        //create world
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.height = 500;
        this.canvas.width = 500;
        this.ctx = this.canvas.getContext('2d');


        this.over = false;
        this.score = 0;
        this.level = 1;
        this.lasersound = new Audio('/laser.wav');
        this.ship = new ship(250, 250);
        this.laser = [];
        this.asteroids = [];



        // Bind functions
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.loop = this.loop.bind(this);
        this.playerCollision = this.playerCollision.bind(this);
        this.rockCollision = this.rockCollision.bind(this);
        this.laserCollision = this.laserCollision.bind(this);

        //Start the game loop
        this.interval = setInterval(this.loop, 1);

    }



    //checks for collision between asteroids and bullets
    laserCollision()
    {
        

    }


    //checks for collisions between 2 asteroids
    rockCollision()
    {
        

    }



    playerCollision()
    {

        

    }



    levelUp()
    {
        if (this.asteroids.length === 0)
        {
            this.player.levelUp();
            this.spawnAsteroids();
            this.level++;

        }

    }





    update() {

        this.bulletCollision();
        this.playerCollision();
        this.rockCollision();

 

        //check for new level
        this.levelUp();

    }



    render()
    {


        //render the player


        //render the asteroids


        //display score and level


    }



    loop()
    {
        if (!this.over)
        {
            this.update();
            this.render();
        }

        else
        {
            this.ctx = "60px Arial";
            this.ctx = 'red';
            this.ctx.fillText("Game Over", 50, 300);
        }
    }
}