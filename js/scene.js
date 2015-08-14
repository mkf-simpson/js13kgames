function Scene (ctx) {
  this.ctx = ctx;
  this.children = [];

}

Scene.prototype.add = function (child) {
    if (!(child instanceof Drawable)) {
        throw new Error('Object for scene must be subclass of Drawable');
    }
    this.children.push(child);
};

Scene.prototype.draw = function () {
  // this.clearContext();
  this.children.forEach(function (child) {
      child.draw(this.ctx);
  }.bind(this));
};

Scene.prototype.clearContext = function () {
  this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
};

Scene.prototype.update = function (dt) {
  this.children.forEach(function (child) {
      child.update(dt);
  });
};
