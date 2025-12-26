// ===== ANIMATED BACKGROUND - Color Strips =====
// Adapted from sketch.js - p5.js background animation

const backgroundSketch = (p) => {
  let strips = [];
  let stripCount;
  let speedFactor = 3; // Slower for subtle effect

  // Color preset - sunset theme
  const theme = {
    baseHue: 280,
    hueRange: 60,
    saturation: 50,
    brightness: 90
  };

  // Responsive config
  let device = "desktop";
  let stripBase = 18;
  let stripMin = 6;
  let stripMax = 28;
  let yStep = 2;
  let speedMin = 0.001;
  let speedMax = 0.003;

  function detectDevice() {
    const w = p.windowWidth;
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
    } else if (device === "tablet") {
      stripBase = 22;
      stripMin = 10;
      stripMax = 32;
      yStep = 3;
      speedMin = 0.0008;
      speedMax = 0.002;
    } else {
      stripBase = 18;
      stripMin = 6;
      stripMax = 28;
      yStep = 2;
      speedMin = 0.001;
      speedMax = 0.003;
    }
    stripCount = p.int(p.width / stripBase);
  }

  function generateStrips() {
    strips = [];
    let x = 0;
    for (let i = 0; i < stripCount; i++) {
      let w = p.random(stripMin, stripMax);
      strips.push(new Strip(x, w));
      x += w;
    }
  }

  class Strip {
    constructor(x, w) {
      this.x = x;
      this.w = w;
      this.phase = p.random(1000);
      this.speed = p.random(speedMin, speedMax);
    }

    update() {
      this.phase += this.speed * speedFactor;
    }

    display() {
      for (let y = 0; y < p.height; y += yStep) {
        let n = p.noise(this.x * 0.01, y * 0.005, this.phase);

        let hue = theme.baseHue + p.sin(n * p.TWO_PI) * theme.hueRange;
        let sat = theme.saturation + n * 20;
        let bri = theme.brightness + p.sin(this.phase + y * 0.01) * 6;
        let alpha = 70; // Slightly transparent

        p.fill(hue, sat, bri, alpha);
        p.rect(this.x, y, this.w, 3);
      }
    }
  }

  p.setup = () => {
    const container = document.getElementById("bg-canvas-hero");
    if (!container) return;

    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent("bg-canvas-hero");

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();

    detectDevice();
    setupByDevice();
    generateStrips();
  };

  p.draw = () => {
    p.background(210, 30, 95); // Light blue-gray base

    strips.forEach(s => {
      s.update();
      s.display();
    });
  };

  p.windowResized = () => {
    const container = document.getElementById("bg-canvas-hero");
    if (!container) return;

    p.resizeCanvas(p.windowWidth, p.windowHeight);
    detectDevice();
    setupByDevice();
    generateStrips();
  };
};

// Initialize when DOM is ready (only once)
let bgInitialized = false;

function initBackground() {
  if (bgInitialized) return;
  const container = document.getElementById("bg-canvas-hero");
  if (container && typeof p5 !== 'undefined') {
    new p5(backgroundSketch);
    bgInitialized = true;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackground);
} else {
  initBackground();
}

