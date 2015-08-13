function Player (options) {
  options = options || {};
  this.position = options.position || new Point(0, 0);
  this.velocity = options.velocity || new Vector(0, 0);
  this.size = options.size || new Size(20, 20);
  this.color = options.color || 'red';
  this.mass = options.mass || 1;
  this.forces = {};
}

Player.prototype = Object.create(Rectangle.prototype);

Player.prototype.update = function (dt) {
  var Fx = -0.5 * this.square()  * Math.pow(this.velocity.x, 3) / Math.abs(this.velocity.x);
  var Fy = -0.5 * this.square()  * Math.pow(this.velocity.y, 3) / Math.abs(this.velocity.y);

  Fx = isNaN(Fx) ? 0 : Fx;
  Fy = isNaN(Fy) ? 0 : Fy;

  var ax = this.forceVector().x + (Fx / this.mass);
  const ay = this.forceVector().y + (Fy / this.mass);

  this.velocity.x += ax * dt;
  this.velocity.y += ay * dt;

  this.position.x += this.velocity.x * dt * 100;
  this.position.y += this.velocity.y * dt * 100;
};

Player.prototype.setForce = function (force, name) {
  this.forces[name] = force;
};

Player.prototype.removeForce = function (name) {
  delete this.forces[name];
};

Player.prototype.forceVector = function () {
  var vector = new Vector(0, 0);
  for (var key in this.forces) {
    var force = this.forces[key];
    vector = vector.add(force.vector());
  }
  return vector;
};