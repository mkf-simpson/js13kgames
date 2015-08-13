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

Scene.prototype.remove = function (child) {
  var i = this.children.indexOf(child);
  if (i >= 0) {
    this.children.splice(i, 1);

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

Scene.prototype.clear = function () {
  this.children.length = 0;
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