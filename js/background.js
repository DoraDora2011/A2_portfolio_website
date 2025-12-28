// ===== ANIMATED BACKGROUND - Color Strips =====
// Adapted from sketch.js - p5.js background animation
// OPTIMIZED: Frame rate limited, visibility-based rendering

const backgroundSketch = (p) => {
  let strips = [];
  let stripCount;
  let speedFactor = 3; // Slower for subtle effect
  let isVisible = true;

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
      yStep = 6; // Increased for performance
      speedMin = 0.0005;
      speedMax = 0.0015;
    } else if (device === "tablet") {
      stripBase = 22;
      stripMin = 10;
      stripMax = 32;
      yStep = 4; // Increased for performance
      speedMin = 0.0008;
      speedMax = 0.002;
    } else {
      stripBase = 18;
      stripMin = 6;
      stripMax = 28;
      yStep = 3; // Slightly increased for performance
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
        let alpha = 70;

        p.fill(hue, sat, bri, alpha);
        p.rect(this.x, y, this.w, yStep + 1);
      }
    }
  }

  // Check if element is in viewport
  function checkVisibility() {
    const container = document.getElementById("bg-canvas-home-1");
    if (!container) return false;
    const rect = container.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  p.setup = () => {
    const container = document.getElementById("bg-canvas-home-1");
    if (!container) return;

    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent("bg-canvas-home-1");

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    p.frameRate(24); // Limit frame rate

    detectDevice();
    setupByDevice();
    generateStrips();
  };

  p.draw = () => {
    // Only render if visible
    isVisible = checkVisibility();
    if (!isVisible) return;

    p.background(210, 30, 95);

    strips.forEach(s => {
      s.update();
      s.display();
    });
  };

  p.windowResized = () => {
    const container = document.getElementById("bg-canvas-home-1");
    if (!container) return;

    p.resizeCanvas(p.windowWidth, p.windowHeight);
    detectDevice();
    setupByDevice();
    generateStrips();
  };
};

// Initialize when DOM is ready (only once)
let bgInitialized = false;
let bg2Initialized = false;

function initBackground() {
  // Initialize for home-1 (desktop) and home-2 (mobile only)
  if (!bgInitialized) {
    const container = document.getElementById("bg-canvas-home-1");
    if (container && typeof p5 !== 'undefined') {
      new p5(backgroundSketch);
      bgInitialized = true;
    }
  }

  // Initialize for home-2 (mobile only - will be hidden on desktop)
  if (!bg2Initialized) {
    const container2 = document.getElementById("bg-canvas-home-2");
    if (container2 && typeof p5 !== 'undefined') {
      // Use same background sketch as home-1 for home-2
      const backgroundSketch2 = (p) => {
        let strips = [];
        let stripCount;
        let speedFactor = 3;
        let isVisible = true;

        const theme = {
          baseHue: 280,
          hueRange: 60,
          saturation: 50,
          brightness: 90
        };

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
            yStep = 6;
            speedMin = 0.0005;
            speedMax = 0.0015;
          } else if (device === "tablet") {
            stripBase = 22;
            stripMin = 10;
            stripMax = 32;
            yStep = 4;
            speedMin = 0.0008;
            speedMax = 0.002;
          } else {
            stripBase = 18;
            stripMin = 6;
            stripMax = 28;
            yStep = 3;
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
              let alpha = 70;
              p.fill(hue, sat, bri, alpha);
              p.rect(this.x, y, this.w, yStep + 1);
            }
          }
        }

        function checkVisibility() {
          const container = document.getElementById("bg-canvas-home-2");
          if (!container) return false;
          const rect = container.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        }

        p.setup = () => {
          const container = document.getElementById("bg-canvas-home-2");
          if (!container) return;

          const c = p.createCanvas(p.windowWidth, p.windowHeight);
          c.parent("bg-canvas-home-2");

          p.colorMode(p.HSB, 360, 100, 100, 100);
          p.noStroke();
          p.frameRate(24);

          detectDevice();
          setupByDevice();
          generateStrips();
        };

        p.draw = () => {
          isVisible = checkVisibility();
          if (!isVisible) return;

          p.background(210, 30, 95);
          strips.forEach(s => {
            s.update();
            s.display();
          });
        };

        p.windowResized = () => {
          const container = document.getElementById("bg-canvas-home-2");
          if (!container) return;

          p.resizeCanvas(p.windowWidth, p.windowHeight);
          detectDevice();
          setupByDevice();
          generateStrips();
        };
      };

      new p5(backgroundSketch2);
      bg2Initialized = true;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackground);
} else {
  initBackground();
}
