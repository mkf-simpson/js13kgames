function Scene (ctx, input) {
  this.ctx = ctx;
  this.children = [];
  this.input = input;
}

Scene.prototype.add = function (child) {
  this.children.push(child);
  if (isFunction(child.init)) {
    child.init()
  }
};

Scene.prototype.draw = function () {
  this.clearContext();
  this.children.forEach(function (child) {
    if (isFunction(child.draw)) {
      child.draw(this.ctx)
    }
  }.bind(this))
};

Scene.prototype.clearContext = function () {
  this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
};

Scene.prototype.update = function (dt) {
  this.children.forEach(function (child) {
    if (isFunction(child.update)) {
      child.update(dt)
    }
  })
};