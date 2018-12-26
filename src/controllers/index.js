var topPx;
HTMLElement.prototype.getStyle = function getStyle(attr) {
    return this.currentStyle ? this.currentStyle[attr] : document.defaultView.getComputedStyle(this, null)[attr];
};
var loadImg = function () {
    var $img = new Image();
    $img.src = "https://cdn.max-c.com/wiki/755790/map-snow.jpg";
    $img.className = "base";
    document.querySelector(".roe-map-container").appendChild($img);
    $img = new Image();
    $img.src = "https://cdn.max-c.com/wiki/755790/map-snow-ruler.jpg";
    $img.className = "ruler";
    document.querySelector(".roe-map-container").appendChild($img);
    var loadRulerImg = function() {
        imageLoaded(".roe-map-container img.ruler");
    };
    imageLoaded(".roe-map-container img.base", function (w, h) {
        document.querySelector(".roe-map-container").style.display = "block";
        setTimeout(function () {
            topPx = this.offsetTop;
            loadRulerImg();
        }.bind(this));
    });
};

setTimeout(function () {
    loadImg();
}, 100);

function ease(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

var el = document.querySelector(".roe-map-container");
Transform(el);
var initScale = 1;
new AlloyFinger(el, {
    multipointStart: function () {
        To.stopAll();
        initScale = el.scaleX;
    },
    pinch: function (evt) {
        el.scaleX = el.scaleY = initScale * evt.zoom;
    },
    multipointEnd: function () {
        To.stopAll();
        if (el.scaleX < 1) {
            new To(el, "scaleX", 1, 500, ease);
            new To(el, "scaleY", 1, 500, ease);
        }
        if (el.scaleX > 2) {
            new To(el, "scaleX", 2, 500, ease);
            new To(el, "scaleY", 2, 500, ease);
        }
        var rotation = el.rotateZ % 360;

        if (rotation < 0) rotation = 360 + rotation;
        el.rotateZ = rotation;

        if (rotation > 0 && rotation < 45) {
            new To(el, "rotateZ", 0, 500, ease);
        } else if (rotation >= 315) {
            new To(el, "rotateZ", 360, 500, ease);
        } else if (rotation >= 45 && rotation < 135) {
            new To(el, "rotateZ", 90, 500, ease);
        } else if (rotation >= 135 && rotation < 225) {
            new To(el, "rotateZ", 180, 500, ease);
        } else if (rotation >= 225 && rotation < 315) {
            new To(el, "rotateZ", 270, 500, ease);
        }
    },
    pressMove: function (evt) {
        el.translateX += evt.deltaX;
        el.translateY += evt.deltaY;
        evt.preventDefault();
    },
    doubleTap: function (evt) {
        To.stopAll();
        if (el.scaleX > 1.5) {
            new To(el, "scaleX", 1, 500, ease);
            new To(el, "scaleY", 1, 500, ease);
            new To(el, "translateX", 0, 500, ease);
            new To(el, "translateY", 0, 500, ease);
        } else {
            var box = el.getBoundingClientRect();
            var x = box.width - ((evt.changedTouches[0].pageX) * 2) - (box.width / 2 - (evt.changedTouches[0].pageX));
            var y = box.height - ((evt.changedTouches[0].pageY - topPx) * 2) - (box.height / 2 - (evt.changedTouches[0].pageY - topPx));
            new To(el, "scaleX", 2, 500, ease);
            new To(el, "scaleY", 2, 500, ease);
            new To(el, "translateX", x, 500, ease);
            new To(el, "translateY", y, 500, ease);
        }
    }
});

function addRuler() {
    var $obj = document.querySelector(".roe-map > span");
    var active = $obj.classList.contains("active");
    document.querySelector(".roe-map-container img.ruler").style.opacity = active ? 0 : 1;
    if(active) {
        $obj.classList.remove("active");
    } else {
        $obj.classList.add("active");
    }
}

function clearEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}
