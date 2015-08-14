function Drawable() {

}

Drawable.prototype.draw = function () {
    throw new Error('You must override method `draw` in subclasses');
};

Drawable.prototype.update = function () {
    /* empty function */
};
