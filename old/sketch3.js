const cursorSketch = (p) => {
  let cx, cy;

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
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.clear();

    cx = p.lerp(cx, p.mouseX, 0.75);
    cy = p.lerp(cy, p.mouseY, 0.75);

    drawFlower(cx, cy);
  };

  function drawFlower(x, y) {
    p.push();
    p.translate(x, y);
    p.noStroke();
    p.blendMode(p.ADD);

    for (let i = 0; i < 6; i++) {
      p.rotate(p.TWO_PI / 6);
      p.fill(255, 220, 120, 40);
      p.ellipse(18, 0, 40);
    }

    p.fill(255, 140, 200, 160);
    p.ellipse(0, 0, 18);

    p.fill(255);
    p.ellipse(0, 0, 4);

    p.blendMode(p.BLEND);
    p.pop();
  }
};

if (window.innerWidth >= 1025) {
  new p5(cursorSketch);
}

let cursorP5 = null;

function initCursor() {
  if (window.innerWidth >= 1025 && !cursorP5) {
    cursorP5 = new p5(cursorSketch);
  }

  if (window.innerWidth < 1025 && cursorP5) {
    cursorP5.remove();   
    cursorP5 = null;
  }
}

initCursor();
window.addEventListener('resize', initCursor);


