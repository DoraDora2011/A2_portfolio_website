// ===== FLOWER CURSOR EFFECT =====
// Adapted from sketch3.js - p5.js flower cursor
// OPTIMIZED: Reduced redraws, throttled frame rate, cached calculations

const cursorSketch = (p) => {
  let cx, cy;
  let lastMouseX = 0, lastMouseY = 0;
  let isMoving = false;
  let idleFrames = 0;

  p.setup = () => {
    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent(document.body);
    c.style('position', 'fixed');
    c.style('top', '0');
    c.style('left', '0');
    c.style('pointer-events', 'none');
    c.style('z-index', '10000');

    cx = p.mouseX;
    cy = p.mouseY;

    // Limit frame rate to reduce CPU usage
    p.frameRate(30);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    // Check if mouse has moved significantly
    const dx = p.mouseX - lastMouseX;
    const dy = p.mouseY - lastMouseY;
    const mouseMoved = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;

    if (mouseMoved) {
      isMoving = true;
      idleFrames = 0;
      lastMouseX = p.mouseX;
      lastMouseY = p.mouseY;
    } else {
      idleFrames++;
      // After 10 idle frames, stop redrawing to save CPU
      if (idleFrames > 10) {
        isMoving = false;
      }
    }

    // Only redraw if cursor is moving or recently moved
    if (isMoving || idleFrames <= 10) {
      p.clear();

      cx = p.lerp(cx, p.mouseX, 0.75);
      cy = p.lerp(cy, p.mouseY, 0.75);

      drawFlower(cx, cy);
    }
  };

  function drawFlower(x, y) {
    p.push();
    p.translate(x, y);
    p.noStroke();
    p.blendMode(p.ADD);

    // Draw 6 petals
    for (let i = 0; i < 6; i++) {
      p.rotate(p.TWO_PI / 6);
      p.fill(255, 220, 120, 40);
      p.ellipse(18, 0, 40);
    }

    // Inner pink circle
    p.fill(255, 140, 200, 160);
    p.ellipse(0, 0, 18);

    // Center white dot
    p.fill(255);
    p.ellipse(0, 0, 4);

    p.blendMode(p.BLEND);
    p.pop();
  }
};

// Only initialize on desktop (width >= 1025px)
let cursorP5 = null;

function initFlowerCursor() {
  if (window.innerWidth >= 1025 && !cursorP5) {
    cursorP5 = new p5(cursorSketch);
    document.body.style.cursor = 'none';
  }

  if (window.innerWidth < 1025 && cursorP5) {
    cursorP5.remove();
    cursorP5 = null;
    document.body.style.cursor = 'auto';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFlowerCursor);
} else {
  initFlowerCursor();
}

window.addEventListener('resize', initFlowerCursor);
