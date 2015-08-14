//@requires configuration.js
//@requires utils.js
//@requires classes.js
//@requires scene.js
//@requires rectangle.js
//@requires solid.js

var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    scene = new Scene(context),
    lastTime = Date.now();

canvas.width = Configuration.width;
canvas.height = Configuration.height;

var solids = [
    new Solid({
        position: new Point(100, 20),
        size: new Size(40, 40),
        isHookable: true,
        isCollidable: true,
        color: 'blue'
    }),
    new Solid({
        position: new Point(360, 20),
        size: new Size(40, 40),
        isHookable: true,
        isCollidable: false
    }),
    new Solid({
        position: new Point(230, 80),
        size: new Size(40, 40),
        isHookable: false,
        isCollidable: true,
        color: 'grey'
    })
];

var rectangle = new Rectangle({
    position: new Point(250, 140),
    size: new Size(15, 15),
    mass: 2,
    restitution: -0.6,
    friction: 0.8
});
rectangle.setForce(new Force(DOWN, 9.8), 'gravity');
scene.add(rectangle);

var loopTimer,
    hook = null,
    play = true,
    positions = [],
    hookPositions = [],
    positionCounter = 0,
    slowMo = false;

var frameRate = 1 / 60,
    frameRateSlow = 1 / 240,
    frameDelay = frameRate * 1000;

var WORLD = {
    rho: 1.22,
    hookStrength: 20
};

function mainLoop () {
    if (hook) {
        rectangle.setForce(new Force(Vector.fromPoints(rectangle.position, hook.position), WORLD.hookStrength), 'hook');
    }

    var Fx = -0.5 * rectangle.square() * WORLD.rho * Math.pow(rectangle.velocity.x, 3) / Math.abs(rectangle.velocity.x);
    var Fy = -0.5 * rectangle.square() * WORLD.rho * Math.pow(rectangle.velocity.y, 3) / Math.abs(rectangle.velocity.y);

    Fx = isNaN(Fx) ? 0 : Fx;
    Fy = isNaN(Fy) ? 0 : Fy;

    var currentFrameRate = slowMo ? frameRateSlow : frameRate;

    var ax = rectangle.forceVector().x + (Fx / rectangle.mass);
    var ay = rectangle.forceVector().y + (Fy / rectangle.mass);

    rectangle.velocity.x += ax / WORLD.rho * frameRate;
    rectangle.velocity.y += ay / WORLD.rho * frameRate;

    // if (rectangle.position.x > canvas.width * 0.6) {
    //     worldOffset.x -= rectangle.position.x + worldOffset.x - canvas.width * 0.6;
    // }

    rectangle.position.x += rectangle.velocity.x * currentFrameRate*100;
    rectangle.position.y += rectangle.velocity.y * currentFrameRate*100;

    var restitution = rectangle.restitution,
        friction = rectangle.friction;

    if (rectangle.position.y >= canvas.height - rectangle.size.height) {
        rectangle.velocity.y *= restitution;
        rectangle.velocity.x *= friction;
        rectangle.position.y = canvas.height - rectangle.size.height;
    }
    if (rectangle.position.x >= canvas.width - rectangle.size.width) {
        rectangle.velocity.x *= restitution;
        rectangle.velocity.y *= friction;
        rectangle.position.x = canvas.width - rectangle.size.width;
    }
    if (rectangle.position.x <= rectangle.size.width)  {
        rectangle.velocity.x *= restitution;
        rectangle.velocity.y *= friction;
        rectangle.position.x = rectangle.size.width;
    }
    if (rectangle.position.y <= rectangle.size.height) {
        rectangle.velocity.y *= restitution;
        rectangle.velocity.x *= friction;
        rectangle.position.y = rectangle.size.height;
    }

    var referencePoints = rectangle.referencePoints();

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0, len = solids.length; i < len; i++) {
        solids[i].draw(context);

        if (!solids[i].isCollidable) {
            continue;
        }
        if (context.isPointInPath(referencePoints.top.x, referencePoints.top.y)) {
            rectangle.velocity.y *= restitution;
            rectangle.velocity.x *= friction;
            rectangle.position.y = solids[i].position.y + solids[i].size.height + rectangle.size.width;
        }
        if (context.isPointInPath(referencePoints.bottom.x, referencePoints.bottom.y)) {
            rectangle.velocity.y *= restitution;
            rectangle.velocity.x *= friction;
            rectangle.position.y = solids[i].position.y - rectangle.size.width;
        }
        if (context.isPointInPath(referencePoints.right.x, referencePoints.right.y)) {
            rectangle.velocity.x *= restitution;
            rectangle.velocity.y *= friction;
            rectangle.position.x = solids[i].position.x - rectangle.size.width - 1;
        }
        if (context.isPointInPath(referencePoints.left.x, referencePoints.left.y)) {
            rectangle.velocity.x *= restitution;
            rectangle.velocity.y *= friction;
            rectangle.position.x = solids[i].position.x + solids[i].size.width + rectangle.size.width + 1;
        }
    }
    if (hook !== null) {
        hook.draw(context, rectangle);
    }

    var trail;
    if (slowMo) {
        for (i = 0; i < positions.length; i++) {
            trail = new Rectangle({
                position: positions[i],
                color: 'rgba(255, 0, 0, ' + i / 10 + ')',
                size: rectangle.size
            });
            trail.draw(context);
        }
        if (positions.length == 5) {
            positions.shift();
        }
        positions.push(new Point(rectangle.position.x, rectangle.position.y));
        if (hook) {
            for (i = 0; i < hookPositions.length; i++) {
                trail = new Hook({
                    position: hookPositions[i],
                    color: 'rgba(0, 0, 0, ' + i / 10 + ')'
                });
                trail.draw(context, {position: positions[i]});
            }
            if (hookPositions.length == 5) {
                hookPositions.shift();
            }
            hookPositions.push({position: new Point(hook.position.x, hook.position.y)});
        }
    }

    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    // scene.update(dt);
    scene.draw(context);

    lastTime = now;
    window.requestAnimationFrame(mainLoop.bind(this));
}

mainLoop();

var mouseDownEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown';
document.addEventListener(mouseDownEvent, function (event) {
    event.preventDefault();
    var coordinates = mouseDownEvent === 'touchstart' ? event.touches[0] : event;
    console.log(canvas.width, canvas.height);
    hook = new Hook({
        to: new Point(Math.min(coordinates.pageX - canvas.offsetLeft, canvas.width), Math.min(coordinates.pageY - canvas.offsetTop, canvas.height)),
        from: rectangle.position
    });
    console.log(hook);
});

var mouseUpEvent = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';
document.addEventListener(mouseUpEvent, function (event) {
    hook = null;
    rectangle.removeForce('hook');
});
