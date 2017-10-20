export default class Bullet {

    constructor(ship)
    {
        this.x = ship.x;
        this.y = ship.y;

    }




    hit()
    {

        //check if laser has hit edge
        if (this.x >= 500 || this.x <= 0 || this.y >= 500 || this.y <= 0)
        {

        }

        //check if laser has hit asteroid

    }


    update()
    {


    }



    render(ctx) {

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 1, 1);
        ctx.restore();

    }

}