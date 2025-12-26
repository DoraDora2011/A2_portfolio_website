const aboutSketch = (p) => {
  let img;
  let icons = [];
  let gridCols, gridRows;
  let spacing = 100;

  p.preload = () => {
    img = p.loadImage("images/pattern-old-coin.png");
  };

  p.setup = () => {
    const c = p.createCanvas(
      p.windowWidth,
      document.querySelector("#about").offsetHeight
    );
    c.parent("bg-canvas-about");

    p.imageMode(p.CENTER);
    p.noStroke();
    p.clear();

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
    p.clear();

    for (let icon of icons) {
      icon.x = p.lerp(icon.x, icon.tx, icon.speed);
      icon.y = p.lerp(icon.y, icon.ty, icon.speed);

      if (p.dist(icon.x, icon.y, icon.tx, icon.ty) < 1) {
        icon.spinning = true;
      }

      if (icon.spinning) icon.angle += icon.spinSpeed;

      p.push();
      p.translate(icon.x, icon.y);
      p.rotate(icon.angle);
      p.image(img, 0, 0, icon.size, icon.size);
      p.pop();
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(
      p.windowWidth,
      document.querySelector("#about").offsetHeight
    );
  };
};

new p5(aboutSketch);
