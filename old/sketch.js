let strips = [];
let stripCount;
let cnv;
let container;
let speedFactor = 5; // Adjust this value to speed up or slow down the animation

/* =========================
   COLOR PRESET
========================= */
const colorPresets = {
  realityBlue: {
    baseHue: 210,
    hueRange: 35,
    saturation: 40,
    brightness: 95
  },

  sunset: {
    baseHue: 280,
    hueRange: 60,
    saturation: 50,
    brightness: 90
  },

  mintPink: {
    baseHue: 190,
    hueRange: 80,
    saturation: 30,
    brightness: 96
  }
};

let theme = colorPresets.sunset;

/* =========================
   RESPONSIVE CONFIG
========================= */
let device = "desktop";

let stripBase = 18;
let stripMin = 6;
let stripMax = 28;
let yStep = 2;
let speedMin = 0.001;
let speedMax = 0.003;

function detectDevice() {
  const w = window.innerWidth;

  if (w < 600) device = "mobile";
  else if (w < 1024) device = "tablet";
  else device = "desktop";
}

function setupByDevice() {
  if (device === "mobile") {
    stripBase = 28;
    stripMin = 16;
    stripMax = 40;
    yStep = 4;
    speedMin = 0.0005;
    speedMax = 0.0015;
  }

  if (device === "tablet") {
    stripBase = 22;
    stripMin = 10;
    stripMax = 32;
    yStep = 3;
    speedMin = 0.0008;
    speedMax = 0.002;
  }

  if (device === "desktop") {
    stripBase = 18;
    stripMin = 6;
    stripMax = 28;
    yStep = 2;
    speedMin = 0.001;
    speedMax = 0.003;
  }

  stripCount = int(width / stripBase);
}

/* =========================
   SETUP (FULL WIDTH)
========================= */
function setup() {
  container = document.getElementById("bg-canvas");
  cnv = createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  cnv.parent("bg-canvas");

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  detectDevice();
  setupByDevice();
  generateStrips();
}

/* =========================
   DRAW 
========================= */
function draw() {
  background(210, 30, 95);

  strips.forEach(s => {
    s.update();
    s.display();
  });
}

/* =========================
   STRIP GENERATION
========================= */
function generateStrips() {
  strips = [];
  let x = 0;

  for (let i = 0; i < stripCount; i++) {
    let w = random(stripMin, stripMax);
    strips.push(new Strip(x, w));
    x += w;
  }
}

/* =========================
   STRIP CLASS 
========================= */
class Strip {
  constructor(x, w) {
    this.x = x;
    this.w = w;
    this.phase = random(1000);
    this.speed = random(speedMin, speedMax);
  }

  update() {
    this.phase += this.speed * speedFactor;
  }

  display() {
    for (let y = 0; y < height; y += yStep) {
      let n = noise(this.x * 0.01, y * 0.005, this.phase);

      let hue =
        theme.baseHue +
        sin(n * TWO_PI) * theme.hueRange;

      let sat = theme.saturation + n * 20;
      let bri =
        theme.brightness +
        sin(this.phase + y * 0.01) * 6;

      let alpha = 90;

      fill(hue, sat, bri, alpha);
      rect(this.x, y, this.w, 3);
    }
  }
}

/* =========================
   RESIZE 
========================= */
function windowResized() {
  resizeCanvas(
    window.innerWidth,
    window.innerHeight
  );

  detectDevice();
  setupByDevice();
  generateStrips();
}
