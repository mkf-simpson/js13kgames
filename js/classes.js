function Rectangle (config) {
  var config = config || {};
  this.width = config.width || 20;
  this.height = config.height || 20;
  this.x = config.x || 0;
  this.y = config.y || 0;
  this.color = config.color || 'red';
}

Rectangle.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
};
