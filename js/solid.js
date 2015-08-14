//@requires drawable.js
//@requires point.js
//@requires size.js

function Solid(options) {
    options = options || Object.create(null);
    this.position = options.position || new Point(0, 0);
    this.size = options.size || new Size(1, 1);
    this.color = options.color || '#000000';
    this.isHookable = options.isHookable == null ? false : options.isHookable;
    this.isCollidable = options.isCollidable == null ? false : options.isCollidable;
}

Solid.prototype = Object.create(Drawable.prototype);

Solid.prototype.draw = function (context) {
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.stroke();
    context.fill();
};

Solid.prototype.lineSegments = function () {
    return [
        [new Point(this.position.x, this.position.y), new Point(this.position.x + this.size.width, this.position.y)],
        [new Point(this.position.x + this.size.width, this.position.y), new Point(this.position.x + this.size.width, this.position.y + this.size.height)],
        [new Point(this.position.x, this.position.y + this.size.height), new Point(this.position.x + this.size.width, this.position.y + this.size.height)],
        [new Point(this.position.x, this.position.y), new Point(this.position.x, this.position.y + this.size.height)]
    ];
};
