var canvas;
var context;

function load() {
    canvas = document.querySelector("canvas.paint");
    context = canvas.getContext("2d");

    var computedStyle = getComputedStyle(canvas);
    var canvasRect = canvas.getBoundingClientRect();

    var viewport = {
        width: parseInt(computedStyle.width),
        height: parseInt(computedStyle.height),
    };

    canvas.width = viewport.width*3/4;
    canvas.height = viewport.height*3/4;

    function translatePos(pos) {
        pos.x = pos.x * (canvas.width/viewport.width);
        pos.y = pos.y * (canvas.height/viewport.height);
        return pos;
    }

    function getPos(e) {
        return {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        }
    }

    var shouldDraw = false;
    var lastPos;

    function draw(e) {
        var pos = translatePos(getPos(e));
        if (lastPos) {
            context.beginPath();
            context.moveTo(lastPos.x, lastPos.y);
            context.lineTo(pos.x, pos.y);
            context.stroke();
        }
        lastPos = pos;
    }

    canvas.onmousedown = function(e) {
        shouldDraw = true;
        draw(e);
    }
    canvas.onmousemove = function(e) {
        if (shouldDraw) {
            draw(e);
        }
    }
    canvas.onmouseup = function(e) {
        shouldDraw = false;
        lastPos = null;
    }
    canvas.onmouseleave = canvas.onmouseup;
}

window.addEventListener("load", load);
