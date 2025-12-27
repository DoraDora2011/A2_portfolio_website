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
    const container = document.getElementById("bg-canvas-home-1");
    if (!container) return;

    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent("bg-canvas-home-1");

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
  // Initialize for home-1
  if (!bgInitialized) {
    const container = document.getElementById("bg-canvas-hero");
    if (container && typeof p5 !== 'undefined') {
      new p5(backgroundSketch);
      bgInitialized = true;
    }
  }
  
  // Initialize for home-2
  if (!bg2Initialized) {
    const container2 = document.getElementById("bg-canvas-home-2");
    if (container2 && typeof p5 !== 'undefined') {
      // Create a new sketch instance for home-2 - use same background as home-1
      const sketch2 = (p) => {
        // Use same background sketch as home-1
        let strips = [];
        let isMobile = false;
        let isTablet = false;
        
        function detectDevice() {
          isMobile = p.windowWidth <= 576;
          isTablet = p.windowWidth > 576 && p.windowWidth <= 1024;
        }
        
        function setupByDevice() {
          if (isMobile) {
            p.stripCount = 8;
            p.stripWidth = p.windowWidth / p.stripCount;
          } else if (isTablet) {
            p.stripCount = 12;
            p.stripWidth = p.windowWidth / p.stripCount;
          } else {
            p.stripCount = 16;
            p.stripWidth = p.windowWidth / p.stripCount;
          }
        }
        
        function generateStrips() {
          strips = [];
          for (let i = 0; i < p.stripCount; i++) {
            strips.push(new Strip(p, i * p.stripWidth, p.stripWidth));
          }
        }
        
        class Strip {
          constructor(p, x, w) {
            this.p = p;
            this.x = x;
            this.w = w;
            this.speed = p.random(0.5, 2);
            this.offset = p.random(1000);
          }
          
          update() {
            this.offset += this.speed;
          }
          
          display() {
            const p = this.p;
            for (let y = 0; y < p.windowHeight; y += 10) {
              const noise = p.noise(this.x * 0.01, (y + this.offset) * 0.01);
              const hue = p.map(noise, 0, 1, 280, 320);
              const sat = p.map(noise, 0, 1, 40, 80);
              const bri = p.map(noise, 0, 1, 70, 95);
              const alpha = p.map(noise, 0, 1, 60, 100);
              p.fill(hue, sat, bri, alpha);
              p.rect(this.x, y, this.w, 3);
            }
          }
        }
        
        p.setup = () => {
          const container = document.getElementById("bg-canvas-home-2");
          if (!container) return;
          
          const c = p.createCanvas(p.windowWidth, p.windowHeight);
          c.parent("bg-canvas-home-2");
          
          p.colorMode(p.HSB, 360, 100, 100, 100);
          p.noStroke();
          
          detectDevice();
          setupByDevice();
          generateStrips();
        };
        
        p.draw = () => {
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
      
      new p5(sketch2);
      bg2Initialized = true;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackground);
} else {
  initBackground();
}

