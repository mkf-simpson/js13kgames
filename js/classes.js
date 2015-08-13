function Rectangle (options) {
  options = options || {};
  this.position = options.position || new Point(0, 0);
  this.velocity = options.velocity || new Vector(0, 0);
  this.size = options.size || new Size(20, 20);
  this.color = options.color || 'red';
}

Rectangle.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
};

Rectangle.prototype.square = function () {
  return this.size.width * this.size.height / 10000;
};


function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Size(width, height) {
  this.width = width;
  this.height = height;
}

function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  };

  this.unit = function () {
    var divisor = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return new Vector(this.x / divisor, this.y / divisor);
  }
}

function Force(vector, strength) {
  this.unit = vector;
  this.strength = strength;

  this.vector = function () {
    var z = Math.sqrt(Math.pow(this.strength, 2) / (Math.pow(this.unit.x, 2) + Math.pow(this.unit.y, 2)));
    return new Vector(this.unit.x * z, this.unit.y * z);
  }
}