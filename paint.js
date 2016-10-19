var canvas;
var context;

// TODO:
// * colors
// * line, square, circle tools
// * square select tool


var CSS_COLOR_NAMES = {"aliceblue":1, "antiquewhite":1, "aqua":1, "aquamarine":1, "azure":1, "beige":1, "bisque":1, "black":1, "blanchedalmond":1, "blue":1, "blueviolet":1, "brown":1, "burlywood":1, "cadetblue":1, "chartreuse":1, "chocolate":1, "coral":1, "cornflowerblue":1, "cornsilk":1, "crimson":1, "cyan":1, "darkblue":1, "darkcyan":1, "darkgoldenrod":1, "darkgray":1, "darkgrey":1, "darkgreen":1, "darkkhaki":1, "darkmagenta":1, "darkolivegreen":1, "darkorange":1, "darkorchid":1, "darkred":1, "darksalmon":1, "darkseagreen":1, "darkslateblue":1, "darkslategray":1, "darkslategrey":1, "darkturquoise":1, "darkviolet":1, "deeppink":1, "deepskyblue":1, "dimgray":1, "dimgrey":1, "dodgerblue":1, "firebrick":1, "floralwhite":1, "forestgreen":1, "fuchsia":1, "gainsboro":1, "ghostwhite":1, "gold":1, "goldenrod":1, "gray":1, "grey":1, "green":1, "greenyellow":1, "honeydew":1, "hotpink":1, "indianred":1, "indigo":1, "ivory":1, "khaki":1, "lavender":1, "lavenderblush":1, "lawngreen":1, "lemonchiffon":1, "lightblue":1, "lightcoral":1, "lightcyan":1, "lightgoldenrodyellow":1, "lightgray":1, "lightgrey":1, "lightgreen":1, "lightpink":1, "lightsalmon":1, "lightseagreen":1, "lightskyblue":1, "lightslategray":1, "lightslategrey":1, "lightsteelblue":1, "lightyellow":1, "lime":1, "limegreen":1, "linen":1, "magenta":1, "maroon":1, "mediumaquamarine":1, "mediumblue":1, "mediumorchid":1, "mediumpurple":1, "mediumseagreen":1, "mediumslateblue":1, "mediumspringgreen":1, "mediumturquoise":1, "mediumvioletred":1, "midnightblue":1, "mintcream":1, "mistyrose":1, "moccasin":1, "navajowhite":1, "navy":1, "oldlace":1, "olive":1, "olivedrab":1, "orange":1, "orangered":1, "orchid":1, "palegoldenrod":1, "palegreen":1, "paleturquoise":1, "palevioletred":1, "papayawhip":1, "peachpuff":1, "peru":1, "pink":1, "plum":1, "powderblue":1, "purple":1, "red":1, "rosybrown":1, "royalblue":1, "saddlebrown":1, "salmon":1, "sandybrown":1, "seagreen":1, "seashell":1, "sienna":1, "silver":1, "skyblue":1, "slateblue":1, "slategray":1, "slategrey":1, "snow":1, "springgreen":1, "steelblue":1, "tan":1, "teal":1, "thistle":1, "tomato":1, "turquoise":1, "violet":1, "wheat":1, "white":1, "whitesmoke":1, "yellow":1, "yellowgreen":1};

function setupColorInput() {
    var colorInput = document.querySelector(".color");
    var colorPreview = document.querySelector(".color-preview");
    var colorPreviewInput = document.querySelector(".color-preview-input");
    var colorInputMsg = document.querySelector(".color-input-msg");

    function setColor(value) {
        colorInput.value = value;
        colorPreview.style.backgroundColor = value;
        console.log("color value: ", value);
    }

    colorPreview.onclick = function() {
        colorPreviewInput.click();
    }
    colorPreviewInput.onchange = function() {
        setColor(colorPreviewInput.value);
        console.log(colorPreviewInput);
    }

    colorInput.onchange = function() {
        var colorValue = colorInput.value.trim();
        colorInputMsg.textContent = "";
        if (/^[a-zA-Z]+$/.test(colorValue)) {
            if (CSS_COLOR_NAMES[colorValue]) {
                setColor(colorValue);
            } else {
                colorInputMsg.textContent = "invalid color name: " + colorValue;
                setColor("black");
            }
        } else if (colorValue[0] == "#") {
            var len = colorValue.length;
            if (len == 4 || len == 7) {
                colorPreview.style.backgroundColor = colorValue;
            } else {
                colorInputMsg.textContent = "invalid color value";
                setColor("black");
           }
        }
    }
    colorInput.onchange();
}

var viewport;

function setupResolution() {
    var widthInput = document.querySelector(".resolution .width");
    var heightInput = document.querySelector(".resolution .height");

    function update(e, noConfirm) {
        if (!noConfirm) {
            var yes = confirm("changing size will erase everything. continue?");
            if (!yes) {
                widthInput.value = viewport.width;
                heightInput.value = viewport.height;
                return;
            }
        }

        var width = widthInput.value.trim();
        var height = heightInput.value.trim();

        if (width == "" && height != "")
            width = height;
        else if (width != "" && height == "")
            height = width;
        else if (width == "" && height == "") {
            width = "640";
            height = "480";
        }

        widthInput.value = width;
        heightInput.value = height;

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = canvas.width+"px";
        canvas.style.height = canvas.height+"px";

        viewport = {
            width: canvas.width,
            height: canvas.height,
        };

        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log("setting resolution to ", canvas.width + "x" + canvas.height);
    }

    widthInput.onchange = update;
    heightInput.onchange = update;
    update(null, true);
}

var canvasState = (function() {
    var index = 0;
    var stack = [];
    var size = 10;

    var module = {};
    module.save = function() {
        var data = context.getImageData(0, 0, canvas.width, canvas.height);
        stack[++index] = data;
        if (stack.length > size) {
            stack.shift();
            index--;
        }
    }

    module.undo = function() {
        if (index > 1) {
            var data = stack[--index];
            context.putImageData(data, 0, 0);
        }
    }

    module.redo = function() {
        if (index < stack.length - 1) {
            var data = stack[++index];
            context.putImageData(data, 0, 0);
        }
    }

    return module;
})();

function setupCanvasState() {
    var undoButton = document.querySelector("button.undo");
    var redoButton = document.querySelector("button.redo");

    undoButton.onclick = canvasState.undo;
    redoButton.onclick = canvasState.redo;
}

function load() {
    canvas = document.querySelector("canvas.paint");
    context = canvas.getContext("2d");

    var canvasRect = canvas.getBoundingClientRect();
    var colorPreview = document.querySelector(".color-preview");

    function translatePos(pos) {
        pos.x = pos.x * (canvas.width/viewport.width);
        pos.y = pos.y * (canvas.height/viewport.height);
        return pos;
    }

    function getPos(e) {
        // TODO: include scrollbar offset in computation
        return {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        }
    }

    setupColorInput();
    setupResolution();
    setupCanvasState();

    var shouldDraw = false;
    var lastPos;

    function draw(e) {
        var pos = translatePos(getPos(e));
        context.strokeStyle = colorPreview.style.backgroundColor;

        if (lastPos) {
            context.beginPath();
            context.moveTo(lastPos.x, lastPos.y);
            context.lineTo(pos.x, pos.y);
            context.stroke();
        }
        lastPos = pos;
    }

    canvasState.save();
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
        if (shouldDraw) {
            shouldDraw = false;
            lastPos = null;
            canvasState.save();
        }
    }
    canvas.onmouseleave = canvas.onmouseup;
}

window.addEventListener("load", load);
