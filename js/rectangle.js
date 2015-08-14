//@requires drawable.js
//@requires point.js
//@requires vector.js
//@requires size.js

function Rectangle(options) {
    options = options || Object.create(null);
    this.position = options.position || new Point(0, 0);
    this.velocity = options.velocity || new Vector(0, 0);
    this.size = options.size || new Size(1, 1);
    this.mass = options.mass || 1;
    this.restitution = options.restitution || -1;
    this.friction = options.friction || 1;
    this.color = options.color || 'red';

    this._forces = Object.create(null);
}

Rectangle.prototype = Object.create(Drawable.prototype);

Rectangle.prototype.setForce = function (force, name) {
    this._forces[name] = force;
};

Rectangle.prototype.removeForce = function (name) {
    delete this._forces[name];
};

Rectangle.prototype.forceVector = function () {
    var vector = new Vector(0, 0);
    for (var key in this._forces) {
        var force = this._forces[key];
        vector = vector.add(force.vector());
    }
    return vector;
};

Rectangle.prototype.square = function () {
    return this.size.width * this.size.height / 10000;
};

Rectangle.prototype.draw = function (context) {
    context.save();

    context.translate(this.position.x, this.position.y);
    context.beginPath();
    context.arc(0, 0, this.size.width, 0, Math.PI*2, true);
    context.fillStyle = this.color;
    context.strokeStyle = 'black';

    context.fill();
    context.closePath();

    context.restore();
};

Rectangle.prototype.referencePoints = function () {
    return {
        top: new Point(this.position.x, this.position.y - this.size.width),
        right: new Point(this.position.x + this.size.width, this.position.y),
        left: new Point(this.position.x - this.size.width, this.position.y),
        bottom: new Point(this.position.x, this.position.y + this.size.width),

        topRight: new Point(this.position.x + Math.sqrt(Math.pow(this.size.width, 2) / 2), this.position.y - Math.sqrt(Math.pow(this.size.width, 2) / 2)),
        topLeft: new Point(this.position.x - Math.sqrt(Math.pow(this.size.width, 2) / 2), this.position.y - Math.sqrt(Math.pow(this.size.width, 2) / 2)),
        bottomRight: new Point(this.position.x + Math.sqrt(Math.pow(this.size.width, 2) / 2), this.position.y + Math.sqrt(Math.pow(this.size.width, 2) / 2)),
        bottomLedt: new Point(this.position.x - Math.sqrt(Math.pow(this.size.width, 2) / 2), this.position.y + Math.sqrt(Math.pow(this.size.width, 2) / 2))
    };
};
