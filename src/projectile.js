export default class Projectile
{
  constructor(x, y, direction, color) {
    this.x = x;
    this.y = y;
    this.radius = 3.5;
    this.color = color;
    this.velocity = {mag: 4.0, dir: direction};
    this.speed = {x: 0.0, y: 0.0};
    this.initSpeed();

    }

  /** @function initSpeed()
    * function to handle speed initialization
    */
  initSpeed() {
    this.speed.x = Math.sin(this.velocity.dir) * this.velocity.mag;
    this.speed.y = -Math.cos(this.velocity.dir) * this.velocity.mag;
  }

  /** @function edgeDetection()
    * function to handle edgeDetection of projectiles, projectiles are destroyed at the edge
    */
  edgeDetection() {
    if(this.x + this.radius >= 1000 || this.x - this.radius <= 0 ||
    this.y + this.radius >= 1000|| this.y - this.radius <= 0) {
      return true;
    }
    return false;
  }

  /** @function update()
    * typical update function, also updates its particle trail
    */
  update()
  {
    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  /** @function render()
    * standard render function
    * @param context ctx - backBufferContext from game.js
    */
  render(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
