function Point(x, y) {
    this.x = x;
    this.y = y;

    this.add = function (point) {
        return new Point(this.x + point.x, this.y + point.y);
    };
}
