//@requires vector.js

function Force(vector, strength) {
    this.unit = vector;
    this.strength = strength;

    this.vector = function () {
        var z = Math.sqrt(Math.pow(this.strength, 2) / (Math.pow(this.unit.x, 2) + Math.pow(this.unit.y, 2)));
        return new Vector(this.unit.x * z, this.unit.y * z);
    };
}
