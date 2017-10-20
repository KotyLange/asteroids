export default class Player {

    constructor(x, y)
    {

        this.x = x;
        this.y = y;
        this.angle = 0;
        this.fire = false;
        this.rotate = 'idle'
        this.thrust = false;
        this.lives = 3;
        this.fireCoolDown = 0;
        this.deathSound = new Audio('/destroyed.wav');


        // bind class methods
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.handleKeyDown = this.keyDown.bind(this);
        this.handleKeyUp = this.keyUp.bind(this);
        this.offScreen = this.offScreen.bind(this);
        window.onkeydown = this.handleKeyDown;
        window.onkeyup = this.handleKeyUp;

    }



    getPosition() {

        return { x: this.x, y: this.y, angle: this.angle }

    }



    levelUp()
    {
        this.lives++;
        this.x = 250;
        this.y = 250;
        this.angle = 0;      

    }






    handleKeyDown(event)
    {

        switch (event.key)
        {

            case 'ArrowUp':
            case 'w':
                this.thrust = true;
                break;

            case 'ArrowLeft':
            case 'a':
                this.rotate = 'left';
                break;

            case 'ArrowRight':
            case 'd':
                this.rotate = 'right';
                break;

            case ' ':
                this.fire = true;
                break;

            default:
                break;
        }
    }



    handleKeyUp(event)
    {
        switch (event.key)
        {
            case ' ':
                this.fire = false;
                break;
            case 'ArrowLeft':
                this.rotate = 'idle';
                break;
            case 'ArrowRight':
                this.rotate = 'idle';
                break;
            case 'ArrowUp':
                this.thrust = false;
                break;
        }

    }



    offScreen()
    {
        if (this.x <= -15)
        {
            this.x = 499;
        }
        else if (this.x >= 515)
        {
            this.x = 1;
        }

        if (this.y <= -15)
        {
            this.y = 499;
        }
        else if (this.y >= 515)
        {
            this.y = 1;

        }

    }



    update()
    {

        

    }



    render(ctx)
    {

        //draw ship
        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, 20);
        ctx.lineTo(-10, 20);
        ctx.closePath();
        ctx.fill();

        //display lives
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.font = "20px Arial";
        ctx.fillStyle = "cyan";
        ctx.fillText("Lives: " + this.lives, 5, 495);
        ctx.restore();
    }

}