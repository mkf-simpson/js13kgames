function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.add = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };

    this.unit = function () {
        var divisor = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        return new Vector(this.x / divisor, this.y / divisor);
    };
}

Vector.fromPoints = function (pointFrom, pointTo) {
    return new Vector(pointTo.x - pointFrom.x, pointTo.y - pointFrom.y);
};

var UP = new Vector(0, -1),
    DOWN = new Vector(0, 1),
    LEFT = new Vector(-1, 0),
    RIGHT = new Vector(1, 0);
