//@requires configuration.js
//@requires utils.js
//@requires classes.js
//@requires scene.js
var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    scene = new Scene(context),
    lastTime = Date.now();

scene.add(new Rectangle());

canvas.width = Configuration.width;
canvas.height = Configuration.height;

function mainLoop () {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  scene.update(dt);
  scene.draw(context);

  lastTime = now;
  window.requestAnimationFrame(mainLoop.bind(this));
}

mainLoop();