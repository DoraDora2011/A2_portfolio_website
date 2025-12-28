// Reusable sketch factory for creating coin background on any section
// OPTIMIZED: Frame rate limited, visibility-based rendering

const createCoinSketch = (sectionSelector, canvasParentId) => {
  return (p) => {
    let img;
    let icons = [];
    let gridCols, gridRows;
    let spacing = 100;
    let isVisible = true;
    let allSettled = false; // Track if all icons have settled

    p.preload = () => {
      img = p.loadImage("assets/images/pattern-old-coin.png");
    };

    // Check if section is in viewport
    function checkVisibility() {
      const section = document.querySelector(sectionSelector);
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    p.setup = () => {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const c = p.createCanvas(
        p.windowWidth,
        section.offsetHeight
      );
      c.parent(canvasParentId);

      p.imageMode(p.CENTER);
      p.noStroke();
      p.clear();
      p.frameRate(24); // Limit frame rate

      gridCols = Math.ceil((p.width + spacing) / spacing);
      gridRows = Math.ceil((p.height + spacing) / spacing);

      for (let y = 0; y < gridRows; y++) {
        for (let x = 0; x < gridCols; x++) {
          let tx = x * spacing + spacing / 2;
          let ty = y * spacing + spacing / 2;

          icons.push({
            x: p.random(p.width),
            y: p.random(p.height),
            tx,
            ty,
            size: p.random(40, 80),
            speed: p.random(0.02, 0.05),
            angle: p.random(p.TWO_PI),
            spinning: false,
            spinSpeed: p.random(0.01, 0.05)
          });
        }
      }
    };

    p.draw = () => {
      // Only render if visible
      isVisible = checkVisibility();
      if (!isVisible) return;

      p.clear();

      let settledCount = 0;

      for (let icon of icons) {
        // Only lerp if not settled
        if (!icon.spinning) {
          icon.x = p.lerp(icon.x, icon.tx, icon.speed);
          icon.y = p.lerp(icon.y, icon.ty, icon.speed);

          if (p.dist(icon.x, icon.y, icon.tx, icon.ty) < 1) {
            icon.spinning = true;
            icon.x = icon.tx; // Snap to final position
            icon.y = icon.ty;
          }
        } else {
          settledCount++;
        }

        if (icon.spinning) icon.angle += icon.spinSpeed;

        p.push();
        p.translate(icon.x, icon.y);
        p.rotate(icon.angle);
        p.image(img, 0, 0, icon.size, icon.size);
        p.pop();
      }

      // If all icons are spinning (settled), we could further reduce updates
      allSettled = (settledCount === icons.length);
    };

    p.windowResized = () => {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      p.resizeCanvas(
        p.windowWidth,
        section.offsetHeight
      );
    };
  };
};

// Create background for About section
new p5(createCoinSketch("#about-me", "bg-canvas-about"));

// Create background for Philosophy section (same coin effect)
new p5(createCoinSketch("#philosophy", "bg-canvas-philosophy"));
