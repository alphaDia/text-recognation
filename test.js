const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// init event handlers
function init() {
  canvas.addEventListener("mousedown", event_handler, false);
  canvas.addEventListener("mousemove", event_handler, false);
  canvas.addEventListener("mouseup", event_handler, false);

  canvas.addEventListener("touchmove", event_handler, false);
  canvas.addEventListener("touchstart", event_handler, false);
  canvas.addEventListener("touchend", event_handler, false);
}

const pencil = {
  started: false,

  init(ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    this.started = true;
  },

  move(ev) {
    ev.preventDefault();
    if (this.started) {
      context.lineTo(ev._x, ev._y);
      context.lineWidth = 10;
      context.stroke();
    }
  },

  end() {
    if (this.started) this.started = false;
  },

  mousedown(ev) {
    this.init(ev);
  },

  mousemove(ev) {
    this.move(ev);
  },

  mouseup() {
    this.end();
  },

  touchstart(ev) {
    this.init(ev);
  },

  touchmove(ev) {
    this.move(ev);
  },

  touchend() {
    this.end();
  },
};

function event_handler(ev) {
  if (ev.type.toLowerCase().startsWith("mouse")) {
    if (ev.layerX || ev.layerX == 0) {
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    }
  } else {
    if (ev.touches && (ev.touches[0]?.clientX || ev.touches[0]?.clientX == 0)) {
      ev._x = ev.touches[0].clientX;
      ev._y = ev.touches[0].clientY;
    }
  }

  const func = pencil[ev.type];
  if (func) func.apply(pencil, [ev]);
}

init();

// when drawing is done do the following
const input = document.getElementById("input");

document.getElementById("done").addEventListener(
  "click",
  function (ev) {
    ev.preventDefault();
    document.getElementById("process").innerHTML = "processing ...";
    url = canvas.toDataURL();

    Tesseract.recognize(url, "eng", { logger: (m) => console.log(m) }).then(
      ({ text }) => {
        input.value = text;
        canvas.parentElement.classList.add("hide-modal");
        canvas.parentElement.classList.remove("show-modal");
        document.getElementById("process").innerHTML = "";
      }
    );
  },
  false
);

input.onfocus = () => {
  canvas.parentElement.classList.add("show-modal");
  canvas.parentElement.classList.remove("hide-modal");
};
