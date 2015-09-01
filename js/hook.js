//@requires drawable.js
//@requires point.js
//@requires configuration.js
//@requires world.js

function Hook(options) {
    options = options || Object.create(null);

    var from = options.from || new Point(0, 0),
        to = options.to || new Point(1, 1);

    this.position = options.position;
    this.color = options.color || 'black';
    this.solids = options.solids || [];

    this.isValid = true;

    if (this.position == null) {
        var xWhenYis0 = (0 - from.y) / (to.y - from.y) * (to.x - from.x) + from.x;
        var yWhenXis0 = (-WORLD.offset.x - from.x) / (to.x - from.x) * (to.y - from.y) + from.y;
        var xWhenYisHeight = (Configuration.height - from.y) / (to.y - from.y) * (to.x - from.x) + from.x;
        var yWhenXisWidth = (Configuration.width - WORLD.offset.x - from.x) / (to.x - from.x) * (to.y - from.y) + from.y;

        this.position = new Point(0, 0);
        // top
        if (xWhenYis0 >= -WORLD.offset.x && xWhenYis0 <= Configuration.width - WORLD.offset.x && from.y > to.y) {
            this.position = new Point(xWhenYis0, 0);
        }
        // bottom
        if (xWhenYisHeight >= -WORLD.offset.x && xWhenYisHeight <= Configuration.width - WORLD.offset.x && from.y < to.y) {
            this.position = new Point(xWhenYisHeight, Configuration.height);
        }
        // left
        if (yWhenXis0 >= 0 && yWhenXis0 <= Configuration.height && from.x > to.x) {
            this.position = new Point(-WORLD.offset.x, yWhenXis0);
        }
        // right
        if (yWhenXisWidth >= 0 && yWhenXisWidth <= Configuration.height && from.x < to.x) {
            this.position = new Point(Configuration.width - WORLD.offset.x, yWhenXisWidth);
        }

        var minLineWidth = Infinity,
            minLinePoint = null;
        for (var i = 0, len = solids.length; i < len; i++) {
            if (!solids[i].isHookable) {
                continue;
            }
            var lines = solids[i].lineSegments();
            for (var j = 0; j < lines.length; j++) {
                var ka = ((from.x - this.position.x) * (lines[j][0].y - this.position.y) - (from.y - this.position.y) * (lines[j][0].x - this.position.x)) / ((from.y - this.position.y) * (lines[j][1].x - lines[j][0].x) - (from.x - this.position.x) * (lines[j][1].y - lines[j][0].y));
                if (ka <= 0 || ka >= 1) {
                    continue;
                }
                var intersectionX = lines[j][0].x + ka * (lines[j][1].x - lines[j][0].x),
                      intersectionY = lines[j][0].y + ka * (lines[j][1].y - lines[j][0].y);

                var dotProduct = (from.x - intersectionX) * (from.x - this.position.x) + (from.y - intersectionY) * (from.y - this.position.y),
                    isIntersectionInDemiLine = dotProduct >= 0;

                if (!isIntersectionInDemiLine) {
                    continue;
                }

                var lineWidth = Math.sqrt(Math.pow(intersectionX - from.x, 2) + Math.pow(intersectionY - from.y, 2));
                if (lineWidth > Math.sqrt(Math.pow(Configuration.width, 2) + Math.pow(Configuration.height, 2))) {
                    continue;
                }
                if (lineWidth < minLineWidth) {
                    minLineWidth = lineWidth;
                    minLinePoint = new Point(intersectionX, intersectionY);
                }
            }
        }
        if (minLinePoint !== null) {
            this.position = minLinePoint;
        } else {
            this.isValid = false;
        }
    }
}

Hook.prototype = Object.create(Drawable.prototype);

Hook.prototype.draw = function (context, fromObject) {
    context.beginPath();
    context.lineWidth = 0.5;
    context.strokeStyle = this.color;
    context.moveTo(fromObject.position.x, fromObject.position.y);
    context.lineTo(hook.position.x, hook.position.y);
    context.stroke();
    context.closePath();
};
