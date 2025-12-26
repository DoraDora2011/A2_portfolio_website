
//This project was built with **p5.js**. Some parts of this sketch are referenced from the following guides and use chapGPT's advanced knowledge and Gemini 2.5 Flash to reinforce.
//The following functions and techniques are referenced and used in the code:  

//- **p5.js Reference**  
  //- `createGraphics()` – Procedural noise texture  
    //<https://p5js.org/reference/p5/createGraphics/>  
  //- `blendMode()` – ADD, HARD_LIGHT, DIFFERENCE, BLEND  
   //<https://p5js.org/reference/p5/blendMode/>  

//- **Trigonometry for halo rays and orbital charms**  
  //- `sin()`, `cos()`  
   // <https://p5js.org/reference/p5/sin/>  
   // <https://p5js.org/reference/p5/cos/>  

//- **Particle system & OOP structure**  
  //- JavaScript ES6 `class` (AnimatedCoin, FlowerCluster, Point, FlyingAsset)  
    //<https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes>  
  //- p5.js transforms: `push()`, `translate()`, `rotate()`  
    //<https://p5js.org/reference/p5/push/>  
    //<https://p5js.org/reference/p5/translate/>  
    //<https://p5js.org/reference/p5/rotate/>  

//- **Sound handling**  
  //- `userStartAudio()` – required for browser audio unlock  
    //<https://p5js.org/reference/p5/userStartAudio/>  
  //- `amp()` – used for fade-in gain ramps (heaven sound)  
  //<https://processing.org/reference/libraries/sound/SoundFile_amp_.html>

//- **Typing Effect**  
  //- `keyTyped()` – capture typed characters  
    //<https://p5js.org/reference/p5/keyTyped/>  
  //- `random()` – select random sound index  
    //<https://p5js.org/reference/p5/random/>  
  //- `loadSound()` – load typing sound files  
    //<https://p5js.org/reference/p5/loadSound/>  
  //- `SoundFile.play()` – play selected typing sound  
    //<https://p5js.org/reference/p5.SoundFile/play/>  
  //- `SoundFile.isLoaded()` – check sound file readiness  
    //<https://p5js.org/reference/p5.SoundFile/isLoaded/>  
  //- `SoundFile.setVolume()` – control playback volume  
    //<https://p5js.org/reference/#/p5.SoundFile/setVolume>  

// Part of the code (adding sounds) is referenced and edited from the following YouTube tutorial.
// Original link: https://www.youtube.com/watch?v=MDX5VaMOzZg
// Author: Benjamin Siegel

// Part of the code (text random pop up after Enter) is referenced and edited from'sketch.js' belongs in Nguyen Thu Trang (s3926717)'s Assigment 1.
// Original link: https://rmiteduau-my.sharepoint.com/:f:/g/personal/s3926717_rmit_edu_vn/Ev-fiIQ_6_VFiLRoa8g68xwBwlET_A4U3Y33XfoCF7-k-A?e=XaWcy2
// Author: Nguyen Thu Trang (s3926717)

// Part of the code (Rotating image on Opening screen and Restart Ritual button) is referenced and edited from'sketch.js' belongs in Doan Tran Quoc Trinh (s4014892)'s Assignment 3.
// Original link: https://rmiteduau-my.sharepoint.com/:f:/g/personal/s3926717_rmit_edu_vn/EqmkWhK490NHq7c2DNYJjwwBHsa94bv72bHjpa3inwpUVA?e=araVuw
// Author: Doan Tran Quoc Trinh (s4014892)

// Part of the code (Export PNG and SVG buttons) is referenced and edited from'sketch.js' belongs in Nguyen Hoang Dan Khanh (s3980663)'s Assignment 3.
// Original link: https://rmiteduau-my.sharepoint.com/:f:/g/personal/s3926717_rmit_edu_vn/Es0k1txsuxRPgvbf73r_7k0BCuxwE1K16M4PhYmY2-uzgA?e=6u85DG
// Author: Nguyen Hoang Dan Khanh (s3980663)

//====================================================//
// === DECLARATION OF VARIABLES & CONSTANTS ===

// --- STATE CONTROL (which screen is currently active) ---
let showStartScreen = true;       // Start screen: "TAP TO START"
let showMainScreen = false;       // Main illustration (carp, coins, halo)
let showTextBoxScreen = false;    // Screen with textbox for entering a wish
let showBackgroundText = false;   // Random floating text phase (after typing wish)
let showTowerTransition = false;  // Transition animation to tower
let showTowerScreen = false;      // Final tower screen

// --- TIMING & TRANSITIONS ---
let transitionStartTime = 0;      // Time when tower transition begins
const TRANSITION_DURATION = 10000;// Duration of tower transition (ms)
let coinAnimationStartTime = 0;   // Time when coin animation starts
let coinAnimationTriggered = false;// Whether coin animation has started
let bgTextStartTime = 0;          // Start time of floating background text

// --- ASSETS (fonts, images, noise textures) ---
let customFont;                   // Primary display font
let fontList = [];                // List of alternate fonts for random text
let carpTetImg;                   // Carp image (centerpiece on main screen)
let overlayImg;                   // Background overlay texture
let luckyCharmImg1, luckyCharmImg2;// Lucky charm images
let textBoxImg;                   // Wish input textbox image
let towerImg;                     // Golden tower image
let coinImg;                      // Coin image
let josspaperImg1, josspaperImg2, josspaperImg3, josspaperImg4; // Joss paper assets
let charmImg1, charmImg2;         // Additional charms
let noiseImg;                     // Procedural noise texture
let sliderBox; // Container div for both sliders and labels
let captureBox, btnPng, btnSvg; // screenshot box and buttons
let resetBox, btnReset;        // reset box and button 

// --- SOUND (audio assets) ---
let buttonSound;                  // Start button sound effect
let heavenSound;                  // Ambient heaven sound for main screen
let knockingWoodenFishSound;      // Wooden fish loop during wish input
let ambienceSound;                // Background ambience for tower transition
let typingSounds = [];            // Array of typing sound effects (w1–w10)
let reverb;                       // Reverb effect applied to ambience

// --- UI ELEMENTS (interactive sliders on tower screen) ---
let assetSizeSlider;              // Controls scale of flying assets
let reverbSlider;                 // Controls intensity of reverb

// --- TEXT INPUT STATE (user’s wish typing) ---
let userWish = "";                // User’s typed wish
let backspaceHold = false;        // Continuous BACKSPACE flag
let deleteHold = false;           // Continuous DELETE flag
let lastDeleteTime = 0;           // Timestamp of last delete action
const deleteInterval = 100;       // Interval (ms) for repeated delete

// --- EFFECT PROPERTIES ---
const overlayColors = ["#951a2d", "#eabb47", "#ca3e9f", "#63228d", "#2d8d96"]; 
let chosenOverlayColor;           // Random overlay color chosen each run
let screenOverlayColor;           // Semi-transparent screen overlay
let bgFooterAlpha = 255;          // Footer text alpha (fades out during transition)
const screenOverlayAlpha = 150;   // Overlay opacity
const noiseDensity = 0.15;        // Noise density for procedural texture
const baseWidth = 1920;           // Reference width for responsive scaling
const maxClusters = 50;          // maximum number of bloom clusters
const minClusterSize = 200;      // min size of a cluster
const maxClusterSize = 400;      // max size of a cluster
const frameRateForNewCluster = 10; // how often to spawn a new cluster (frames)

// --- ANIMATION VARIABLES ---
let carpScale = 1;                // Scale factor for carp
let carpCurrentScale = 0.1;       // Current scale during intro animation
let carpTargetScale = 1;          // Target scale for carp
let allCoins = [];                // Array of coin animations
let flyingAssets = [];            // Assets flying during tower transition
let towerScaleFactor;             // Scaling factor for tower
let flowerClusters = [];          // Blooming charms (text input background)
let backgroundTexts = [];         // Random floating texts (wish transition)

// === PRELOAD (Load all assets before setup) ===
function preload() {
    // Load fonts
    customFont = loadFont('Fonts/NeueHaasDisplayRoman.ttf');
    fontList.push(customFont);
    fontList.push(loadFont('Fonts/UTM Staccato.otf'));
    fontList.push(loadFont('Fonts/UTM Aristote.otf'));
    fontList.push(loadFont('Fonts/UTM Demian KT.otf'));
    fontList.push(loadFont('Fonts/UTM Spring.otf'));

    // Load images
    carpTetImg = loadImage('asset/carp on Tet holiday.png');
    overlayImg = loadImage('asset/Overlay.png');
    luckyCharmImg1 = loadImage('asset/New Year lucky charm 1.png');
    luckyCharmImg2 = loadImage('asset/New Year lucky charm 2.png');
    textBoxImg = loadImage('asset/text box.png');
    towerImg = loadImage('asset/Lucky Golden Tower.png');
    coinImg = loadImage('asset/coin.png');
    josspaperImg1 = loadImage('asset/Josspaper 1.png');
    josspaperImg2 = loadImage('asset/Josspaper 2.png');
    josspaperImg3 = loadImage('asset/Josspaper 3.png');
    josspaperImg4 = loadImage('asset/Josspaper 4.png');
    charmImg1 = loadImage('asset/New Year lucky charm 1.png');
    charmImg2 = loadImage('asset/New Year lucky charm 2.png');

    // Load sounds
    soundFormats('ogg', 'mp3');
    buttonSound = loadSound('sounds/button sound.ogg');
    heavenSound = loadSound('sounds/haeven sound.ogg');
    knockingWoodenFishSound = loadSound('sounds/knocking wooden fish.ogg');
    ambienceSound = loadSound('sounds/Ambience sound.ogg');

    // Load multiple typing sounds (w1–w10)
    for (let i = 1; i <= 10; i++) {
        typingSounds.push(loadSound(`sounds/w${i}.ogg`));
    }
}

// === SETUP (Initialize canvas, variables, sliders) ===
function setup() {
    createCanvas(windowWidth, windowHeight);   // Fullscreen canvas
    frameRate(30);                             // Smooth animation at 30 FPS

     // This code is extracted and edited based on sketch.js in Assignment 3 by Nguyen Hoang Dan Khanh (S3980663) and Doan Quoc Trinh (s4014892)
     // === BUTTONS: Save PNG, Export SVG, Restart Ritual ===
    captureBox = createDiv();
    captureBox.style('position', 'fixed');
    captureBox.style('top', '16px');
    captureBox.style('right', '16px');
    captureBox.style('z-index', '9999');
    captureBox.style('display', 'flex');
    captureBox.style('gap', '8px');

    btnPng = createButton('Save PNG');
    btnPng.parent(captureBox);
    btnPng.style('padding', '8px 12px');
    btnPng.style('border', '1px solid #eabb47');
    btnPng.style('border-radius', '0');
    btnPng.style('background', 'rgba(0,0,0,0.6)');
    btnPng.style('color', '#eabb47');
    btnPng.mousePressed(savePngScreenshot);

    btnSvg = createButton('Export SVG');
    btnSvg.parent(captureBox);
    btnSvg.style('padding', '8px 12px');
    btnSvg.style('border', '1px solid #eabb47');
    btnSvg.style('border-radius', '0');
    btnSvg.style('background', 'rgba(0,0,0,0.6)');
    btnSvg.style('color', '#eabb47');
    btnSvg.mousePressed(exportSvgScreenshot);

    resetBox = createDiv();
    resetBox.style('position', 'fixed');
    resetBox.style('bottom', '16px');
    resetBox.style('left', '16px');
    resetBox.style('right', '');

    btnReset = createButton('Restart Ritual');
    btnReset.parent(resetBox);
    btnReset.style('padding', '8px 12px');
    btnReset.style('border', '1px solid #2d8d96');
    btnReset.style('border-radius', '0');
    btnReset.style('background', 'rgba(0,0,0,0.6)');
    btnReset.style('color', '#2d8d96');
    btnReset.mousePressed(resetSketch);
    resetBox.hide();

    // Initialize overlay colors
    screenOverlayColor = color(0, 0, 0, screenOverlayAlpha);
    chosenOverlayColor = color(random(overlayColors));

    // Scale carp and tower images to screen size
    calculateScale();

    // Create animated concentric coin circles around carp
    initializeCoins();

    // Generate procedural noise texture (static grain layer)
    generateNoiseTexture();

    // Trigger coin animation at startup
    coinAnimationTriggered = true;
    coinAnimationStartTime = millis();

    //ChatGPT advanced knowledge
    // === SLIDER BOX (container for both sliders + labels) ===
    sliderBox = createDiv();
    sliderBox.style('padding', '15px');
    sliderBox.style('background', 'rgba(0,0,0,0.5)'); // semi-transparent
    sliderBox.style('border', '2px solid #eabb47');   // golden border
    sliderBox.style('border-radius', '12px');
    sliderBox.style('width', '330px'); //Fix the size of the box
    sliderBox.hide(); // chỉ hiển thị ở Tower screen

    // Label + Asset Size slider
    createP("Drag the bar to find out what you are really praying for")
    .parent(sliderBox)
    .style('color', '#fff')
    .style('font-size', '28px')                 // keep 28px
    .style('font-family', "'Neue Haas Display', system-ui, sans-serif")
    .style('margin', '10px 0');

    assetSizeSlider = createSlider(0.1, 2.0, 1.0, 0.01);
    assetSizeSlider.parent(sliderBox);
    assetSizeSlider.style('width', '240px');
    assetSizeSlider.style('accent-color', '#eabb47'); // color for track + thumb

    // Label + Reverb slider
    createP("Drag to see the sound feel")
    .parent(sliderBox)
    .style('color', '#fff')
    .style('font-size', '28px')
    .style('font-family', "'Neue Haas Display', system-ui, sans-serif")
    .style('margin', '20px 0 10px 0');

    reverbSlider = createSlider(0, 1, 0, 0.01);
    reverbSlider.parent(sliderBox);
    reverbSlider.style('width', '240px');
    reverbSlider.style('accent-color', '#951a2d'); 

    // Initialize reverb effect
    reverb = new p5.Reverb();
    reverbSlider = createSlider(0, 1, 0, 0.01);
    reverbSlider.style('width', '150px');
    reverbSlider.hide();
    reverbSlider.input(reverbSliderChanged);
}

// === DRAW (Main rendering loop) ===
function draw() {
    if (showStartScreen) {
        drawStartScreen();               // "TAP TO START"
    } else if (showMainScreen) {
        drawMainIllustration();          // Carp, coins, halo
    } else if (showTextBoxScreen) {
        drawFlowerEffect();              // Blooming charms behind textbox
        drawScreenOverlay();             // Semi-transparent overlay
        drawTextBoxScreenContent();      // Wish typing box
    } else if (showBackgroundText) {
        drawRandomBackgroundPattern();   // Floating wish text animation
    } else if (showTowerTransition) {
        drawTowerTransition();           // Joss papers + charms float upwards
    } else if (showTowerScreen) {
        drawTowerScreen();               // Final golden tower scene
    }
}

// === INTERACTION FUNCTIONS (User input handling) ===
function touchStarted() {
    // Unlock audio on first interaction (required by browsers)
    userStartAudio();

    // Play button click sound if loaded
    if (buttonSound && buttonSound.isLoaded()) buttonSound.play();

    // Ignore touches once final tower screen is active
    if (showTowerScreen) return;

    // --- From Start Screen → Main Screen ---
    if (showStartScreen) {
        showStartScreen = false;
        showMainScreen = true;
        carpCurrentScale = 0.1; // Reset carp animation scale

        // Play heaven ambient sound (fade in)
        if (heavenSound && heavenSound.isLoaded()) {
            heavenSound.setVolume(0);
            heavenSound.play();
            heavenSound.amp(0.7, 3);
        }
    } 
    // --- From Main Screen → TextBox Screen ---
    else if (showMainScreen) {
        let carpW = carpTetImg.width * carpCurrentScale;
        let carpH = carpTetImg.height * carpCurrentScale;
        let cx = width / 2;
        let cy = height / 2;

        // Check if user tapped inside carp image
        if (mouseX > cx - carpW / 2 && mouseX < cx + carpW / 2 &&
            mouseY > cy - carpH / 2 && mouseY < cy + carpH / 2) {
            showMainScreen = false;
            showTextBoxScreen = true;

            // Play wooden fish loop while typing wish
            if (knockingWoodenFishSound && knockingWoodenFishSound.isLoaded()) {
                knockingWoodenFishSound.setLoop(true);
                knockingWoodenFishSound.setVolume(0.5);
                knockingWoodenFishSound.play();
            }
        }
    }
    return false; // Prevent default browser behavior
}

// Handle typed characters during TextBox Screen
function keyTyped() {
    if (showTextBoxScreen) {
        if (key.length === 1) {
            userWish += key;

            // Play random typing sound for effect
            if (typingSounds.length > 0) {
                let idx = floor(random(typingSounds.length));
                let s = typingSounds[idx];
                if (s.isLoaded()) {
                    s.setVolume(0.3);
                    s.play();
                }
            }
        }
    }
}

// Handle ENTER, BACKSPACE, DELETE
function keyPressed() {
    if (showTextBoxScreen) {
        if (keyCode === BACKSPACE) {
            backspaceHold = true;
            if (userWish.length > 0) userWish = userWish.slice(0, -1);
            lastDeleteTime = millis();
        } else if (keyCode === DELETE) {
            deleteHold = true;
            if (userWish.length > 0) userWish = userWish.slice(0, -1);
            lastDeleteTime = millis();
        } 
        // --- When ENTER is pressed ---
    else if (keyCode === ENTER || keyCode === RETURN) {
    if (userWish.length > 0) {
        showTextBoxScreen = false;
        showBackgroundText = true; // Switch to floating wish text
        resetBox.show();
        prepareBackgroundPattern(userWish);
        bgTextStartTime = millis();
        bgFooterAlpha = 255;

        if (knockingWoodenFishSound && knockingWoodenFishSound.isLoaded()) {
            knockingWoodenFishSound.stop();
        }
        if (ambienceSound && ambienceSound.isLoaded()) {
            ambienceSound.loop();
            ambienceSound.setVolume(0.6);
            reverb.process(ambienceSound, 1, 0);
    }
  }
}
    }
}

// Stop continuous delete once keys are released
function keyReleased() {
    if (keyCode === BACKSPACE) backspaceHold = false;
    if (keyCode === DELETE) deleteHold = false;
}

// Adjust canvas and assets when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateScale();
    initializeCoins();
    generateNoiseTexture();

    // Reposition sliders if tower screen is active
    if (showTowerScreen) {
        positionSlider();
    }
}

// === DRAWING FUNCTIONS FOR EACH SCREEN ===

// --- START SCREEN ---
function drawStartScreen() {
    background(0);
    textFont(customFont);
    textSize(72);
    fill('#eabb47');
    textAlign(CENTER, CENTER);
    noStroke();
    text("TAP TO START", width / 2, height / 2);
}

// --- MAIN SCREEN ILLUSTRATION ---
function drawMainIllustration() {
    background(0);
    drawBackground(); // Overlay texture
    drawCoinCircles(); // Concentric rotating coin circles
    drawHaloRays(width / 2, height / 2, min(width, height) * 0.4); // Halo rays
    drawCenterpiece(); // Central carp
    image(noiseImg, 0, 0, width, height); // Grain noise overlay

    // Instruction text (pulsing alpha effect)
    textFont(customFont);
    textAlign(CENTER, CENTER);
    noStroke();
    let alpha = map(sin(frameCount * 0.05), -1, 1, 50, 255);
    fill(255, alpha);
    textSize(32);
    text("Tap the josspaper to continue the ceremony", width / 2, height - 60);
}

// --- TEXTBOX SCREEN (wish input) ---
function drawTextBoxScreenContent() {
    let isMobile = width < height;
    let boxW, boxH, boxX, boxY;

    if (isMobile) {
        // Fit image fullscreen in portrait orientation
        boxW = height;
        boxH = width;
        push();
        translate(width / 2, height / 2);
        rotate(HALF_PI); // Rotate for vertical mobile orientation
        imageMode(CENTER);
        image(textBoxImg, 0, 0, boxW, boxH);
        pop();
        boxX = width / 2;
        boxY = height / 2;
    } else {
        // Desktop scale (60% of window)
        imageMode(CENTER);
        let scaleFactor = min(width * 0.6 / textBoxImg.width, height * 0.6 / textBoxImg.height);
        boxX = width / 2;
        boxY = height / 2;
        boxW = textBoxImg.width * scaleFactor;
        boxH = textBoxImg.height * scaleFactor;
        image(textBoxImg, boxX, boxY, boxW, boxH);
    }

    // Instruction above textbox
    textFont(customFont);
    textAlign(CENTER, CENTER);
    noStroke();
    fill('#eabb47');
    textSize(32);
    text("WHAT DO YOU WISH FOR THIS NEW YEAR", boxX, boxY - boxH * 0.3);

    // Display typed wish
    if (userWish.length > 0) {
        fill(255);
        textSize(32);
        text(userWish, boxX, boxY);
    }

    // Blinking cursor
    if (frameCount % 60 < 30) {
        let txtWidth = textWidth(userWish);
        let cursorX = boxX - txtWidth / 2 + txtWidth;
        let cursorY = boxY;
        stroke(255);
        strokeWeight(2);
        line(cursorX + 5, cursorY - 20, cursorX + 5, cursorY + 20);
    }

    // Continuous delete (BACKSPACE / DELETE held down)
    if ((backspaceHold || deleteHold) && millis() - lastDeleteTime > deleteInterval) {
        if (userWish.length > 0) {
            userWish = userWish.slice(0, -1);
        }
        lastDeleteTime = millis();
    }
}

// --- RANDOM FLOATING TEXT (after wish is submitted) ---
function drawRandomBackgroundPattern() {
  background(0, 40);

  let anyVisible = false;    // track if any text is still visible
  let sumAlpha = 0;          // count averange alpha
  let countAlpha = 0;

  for (let bg of backgroundTexts) {
    // bay lên
    bg.y -= bg.speed;

    // hover -> move away
    const tw = textWidth(bg.txt);
    if (!bg.exploded &&
        mouseX > bg.x - tw / 2 && mouseX < bg.x + tw / 2 &&
        mouseY > bg.y - bg.size / 2 && mouseY < bg.y + bg.size / 2) {
      bg.exploded = true;
    }

    // fade: explode fast, usually slow
    bg.alpha -= bg.exploded ? 8 : 1.2;

    // see if still visible on screen (also alpha > 0) 
    const visible = (bg.alpha > 0) && (bg.y + bg.size > 0);
    if (visible) {
      anyVisible = true;
      // draw 
      push();
      textFont(bg.font);
      textSize(bg.size);
      fill(red(bg.color), green(bg.color), blue(bg.color), bg.alpha);
      noStroke();
      textAlign(CENTER, CENTER);
      text(bg.txt, bg.x, bg.y);
      pop();

    // contribute to the average alpha to control the footer
      sumAlpha += bg.alpha;
      countAlpha++;
    }
  }

// --- Footer tutorial (desktop ONLY), with sync flashing + fading ---
  if (!isMobile()) {
    const avgAlpha = countAlpha ? (sumAlpha / countAlpha) : 0;
    bgFooterAlpha = lerp(bgFooterAlpha, avgAlpha, 0.15); // smooth fade
    const pulse = map(sin(frameCount * 0.05), -1, 1, 60, 255); // blink
    const footerAlpha = min(bgFooterAlpha, pulse); // mix fade and blink

    push();
    textFont(customFont);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255, footerAlpha);
    textSize(32);
    text("You can hover over the text to see it fade away", width / 2, height - 60);
    pop();
  }

// --- Phase exit condition: no more visible text
// OR hard timeout to avoid jam (e.g. 18s) ---
  const timedOut = (millis() - bgTextStartTime) > 18000;
  if (!anyVisible || timedOut) {
    showBackgroundText = false;
    showTowerTransition = true;
    transitionStartTime = millis();
    initializeFlyingAssets();
  }
}

// Helper: Check if device is mobile
function isMobile() {
  return width < height;
}

// === FLOWER CLUSTERS (blooming charms behind the textbox) ===

// Draws a soft background of lucky charms blooming and orbiting.
// This runs while the TextBox screen is active.
function drawFlowerEffect() {
    background(0, 5); // slight trail

    // Spawn new cluster periodically until reaching maxClusters
    if (frameCount % frameRateForNewCluster === 0 && flowerClusters.length < maxClusters) {
        flowerClusters.push(new FlowerCluster());
    }

    // Update & render clusters; remove when finished
    for (let i = flowerClusters.length - 1; i >= 0; i--) {
        const cluster = flowerClusters[i];
        cluster.update();
        cluster.display();
        if (cluster.isFinished()) {
            flowerClusters.splice(i, 1);
        }
    }
}

// Single blooming cluster with small orbiting charms
class FlowerCluster {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.initialSize = 5;
        this.targetSize = random(minClusterSize, maxClusterSize);
        this.currentSize = this.initialSize;

        this.alpha = 0;          // fade in/out
        this.growing = true;     // first phase: grow to target
        this.bloomed = false;    // after reaching target, show children

        this.childCharms = [];
        this.chosenOverlayColor = color(random(overlayColors));

        // Generate small orbiting charms around the main one
        const numChildren = floor(random(5, 12));
        for (let i = 0; i < numChildren; i++) {
            this.childCharms.push({
                angle: random(TWO_PI),
                dist: random(this.targetSize * 0.2, this.targetSize * 0.5),
                rotationSpeed: random(-0.02, 0.02),
                size: random(30, 80)
            });
        }
    }

    update() {
        if (this.growing) {
            // Smooth bloom to target size + fade in
            this.currentSize = lerp(this.currentSize, this.targetSize, 0.09);
            this.alpha = lerp(this.alpha, 255, 0.10);
            if (abs(this.currentSize - this.targetSize) < 1) {
                this.growing = false;
                this.bloomed = true;
            }
        } else if (this.bloomed) {
            // Short hold, then start fading out
            // (You can keep it simple and start fading immediately)
            this.alpha -= 3; // slow fade
            if (this.alpha < 0) this.alpha = 0;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);

        // Main charm (use luckyCharmImg1 for Phase 3 as agreed)
        tint(this.chosenOverlayColor, this.alpha);
        image(luckyCharmImg1, 0, 0, this.currentSize, this.currentSize);

        // Orbiting children rotate slowly around the center
        for (let c of this.childCharms) {
            push();
            // Advance rotation for a gentle spin
            c.angle += c.rotationSpeed;

            const ox = cos(c.angle) * c.dist;
            const oy = sin(c.angle) * c.dist;

            tint(this.chosenOverlayColor, this.alpha);
            image(luckyCharmImg1, ox, oy, c.size, c.size);
            pop();
        }
        pop();
    }

    isFinished() {
        return !this.growing && !this.bloomed && this.alpha <= 0 || (!this.growing && this.alpha <= 0);
    }
}

// === TOWER TRANSITION (from wish → final tower) ===
function drawTowerTransition() {
    background(0, 5);
    let elapsedTime = millis() - transitionStartTime;
    let transitionProgress = min(1, elapsedTime / TRANSITION_DURATION);

    // Animate all flying assets (joss paper, coins, charms)
    for (let asset of flyingAssets) {
        asset.update(elapsedTime);
        asset.display();
    }

    // Draw glowing hologram effect behind tower
    drawHologramGlow(transitionProgress);

    // Tower fading in gradually
    drawFadingTower(transitionProgress);

    // When transition completes → activate final tower screen
    if (transitionProgress >= 1) {
    showTowerTransition = false;
    showTowerScreen = true;
    resetBox.show(); 
    }
}

// === FINAL TOWER SCREEN ===
function drawTowerScreen() {
    background(0, 2);

    // Make sure slider box is visible and positioned correctly
    if (sliderBox && sliderBox.elt.style.display === "none") {
        sliderBox.show();
        positionSlider();
    }

    // Animate flying assets continuously (infinite loop)
    for (let asset of flyingAssets) {
        asset.update(millis());
        asset.display();
    }

    drawHologramGlow(1);
    drawFadingTower(1);

    // Instruction text
    push();
    fill(255);
    textSize(28);
    textFont(customFont);
    textAlign(CENTER, CENTER);
    text('Drag the bar to find out what you are really praying for', width / 2, assetSizeSlider.y + assetSizeSlider.height + 30);
    text('Drag to see the sound feel', width / 2, reverbSlider.y + reverbSlider.height + 30);
    pop();
}

// === COMMON VISUAL ELEMENTS ===

// Semi-transparent dark overlay
function drawScreenOverlay() {
    noStroke();
    fill(screenOverlayColor);
    rect(0, 0, width, height);
}

// Overlay texture for background
function drawBackground() {
    push();
    tint(255, 127.5); // Half transparent
    imageMode(CORNER);
    image(overlayImg, 0, 0, width, height);
    pop();
}

// Draw concentric animated coin circles
function drawCoinCircles() {
    blendMode(HARD_LIGHT);
    for (let coin of allCoins) {
        coin.updateAndDisplay(coinAnimationStartTime);
    }
    blendMode(BLEND);
}

// Draw carp centerpiece (scales up smoothly)
function drawCenterpiece() {
    push();
    imageMode(CENTER);
    translate(width / 2, height / 2);
    carpCurrentScale = lerp(carpCurrentScale, carpTargetScale, 0.05);
    image(carpTetImg, 0, 0, carpTetImg.width * carpCurrentScale, carpTetImg.height * carpCurrentScale);
    pop();
}

// Draw halo rays radiating around carp
function drawHaloRays(cx, cy, radius) {
    push();
    translate(cx, cy);
    rotate(frameCount * 0.002);
    strokeWeight(2);
    const numRays = 60;
    for (let i = 0; i < numRays; i++) {
        const ang = TWO_PI * i / numRays;
        const len = radius * (0.8 + 0.2 * sin(frameCount * 0.05 + i));
        const alpha = 80 + 60 * sin(frameCount * 0.05 + i * 0.5);
        stroke(255, 220, 100, alpha);
        line(0, 0, cos(ang) * len, sin(ang) * len);
    }
    pop();
}

// Glowing hologram behind tower (during transition/final screen)
function drawHologramGlow(progress) {
    push();
    translate(width / 2, height / 2);
    let towerActualWidth = towerImg.width * towerScaleFactor;
    let glowYOffset = -50;
    blendMode(ADD);
    noStroke();

    // Multiple colored glow circles
    for (let i = 0; i < overlayColors.length; i++) {
        let c = color(overlayColors[i]);
        let alpha = map(sin(frameCount * 0.03 + i * 0.5), -1, 1, 30, 80);
        c.setAlpha(alpha * progress);
        let currentRadius = towerActualWidth * 0.6 + sin(frameCount * 0.05 + i * 0.7) * 20;
        fill(c);
        circle(0, glowYOffset, currentRadius * 1.5);
    }

    // Extra small moving glows
    for (let i = 0; i < 3; i++) {
        let c = color(random(overlayColors));
        let alpha = map(sin(frameCount * 0.02 + i * 0.3), -1, 1, 10, 40);
        c.setAlpha(alpha * progress);
        fill(c);
        let shiftX = sin(frameCount * 0.04 + i) * 30;
        let shiftY = cos(frameCount * 0.03 + i) * 15;
        circle(shiftX, glowYOffset + shiftY, towerActualWidth * 0.6 * random(0.8, 1.2));
    }
    blendMode(BLEND);
    pop();
}

// Tower fading in smoothly (0 → full opacity)
function drawFadingTower(progress) {
    push();
    imageMode(CENTER);
    let towerAlpha = map(progress, 0, 1, 0, 255);
    tint(255, towerAlpha);
    image(towerImg, width / 2, height / 2, towerImg.width * towerScaleFactor, towerImg.height * towerScaleFactor);
    pop();
}

// === SUPPORT FUNCTIONS (Reverb, Scaling, Noise) ===

// Update reverb based on slider value
function reverbSliderChanged() {
    let reverbTime = reverbSlider.value();
    reverb.set(reverbTime, 0.5, true);
}

// Calculate carp and tower scaling for responsive layout
function calculateScale() {
    if (carpTetImg) {
        let sByW = (width * 0.6) / carpTetImg.width;
        let sByH = (height * 0.6) / carpTetImg.height;
        carpScale = min(sByW, sByH);
        carpTargetScale = carpScale;
    }
    towerScaleFactor = min(width * 0.7 / towerImg.width, height * 0.7 / towerImg.height);
}

// Generate static procedural noise texture
function generateNoiseTexture() {
    noiseImg = createGraphics(width, height);
    noiseImg.pixelDensity(1);
    noiseImg.loadPixels();
    for (let i = 0; i < (noiseImg.width * noiseImg.height * 4); i += 4) {
        if (random() < noiseDensity) {
            noiseImg.pixels[i] = 0;
            noiseImg.pixels[i + 1] = 0;
            noiseImg.pixels[i + 2] = 0;
            noiseImg.pixels[i + 3] = 128;
        }
    }
    noiseImg.updatePixels();
}

// === COINS (Concentric Circles Around Carp) ===
function initializeCoins() {
    allCoins = [];
    let cumulativeDelay = 0;
    const PER_COIN_DELAY = 40;
    const PAUSE_BETWEEN_CIRCLES = 400;
    let centerX = width / 2;
    let centerY = height / 2;
    let baseCarpWidth = carpTetImg.width;

    // Circle 1: 20 coins
    let radius1 = (baseCarpWidth * carpScale) / 2 + 180 * (width / baseWidth);
    for (let i = 0; i < 20; i++) {
        let angle = TWO_PI / 20 * i;
        let x = centerX + radius1 * cos(angle);
        let y = centerY + radius1 * sin(angle);
        allCoins.push(new AnimatedCoin(luckyCharmImg2, x, y, 0.5 * (width / baseWidth), angle, cumulativeDelay));
        cumulativeDelay += PER_COIN_DELAY;
    }
    cumulativeDelay += PAUSE_BETWEEN_CIRCLES;

    // Circle 2: 28 coins
    let radius2 = (baseCarpWidth * carpScale) / 2 + 360 * (width / baseWidth);
    for (let i = 0; i < 28; i++) {
        let angle = TWO_PI / 28 * i + PI / 28;
        let x = centerX + radius2 * cos(angle);
        let y = centerY + radius2 * sin(angle);
        allCoins.push(new AnimatedCoin(luckyCharmImg2, x, y, 0.4 * (width / baseWidth), angle, cumulativeDelay));
        cumulativeDelay += PER_COIN_DELAY;
    }
    cumulativeDelay += PAUSE_BETWEEN_CIRCLES;

    // Circle 3: 36 coins
    let radius3 = (baseCarpWidth * carpScale) / 2 + 500 * (width / baseWidth);
    for (let i = 0; i < 36; i++) {
        let angle = TWO_PI / 36 * i;
        let x = centerX + radius3 * cos(angle);
        let y = centerY + radius3 * sin(angle);
        allCoins.push(new AnimatedCoin(luckyCharmImg2, x, y, 0.35 * (width / baseWidth), angle, cumulativeDelay));
        cumulativeDelay += PER_COIN_DELAY;
    }
}

// AnimatedCoin class (moves coins outward with delay + glow)
class AnimatedCoin {
    constructor(img, targetX, targetY, targetScale, targetAngle, delay) {
        this.img = img;
        this.currentX = width / 2;
        this.currentY = height / 2;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetScale = targetScale;
        this.targetAngle = targetAngle;
        this.delay = delay;
        this.currentAlpha = 0;
        this.targetAlpha = 100;
    }

    updateAndDisplay(animationMasterStartTime) {
        let elapsedTime = millis() - animationMasterStartTime;

        if (coinAnimationTriggered && elapsedTime > this.delay) {
            this.currentX = lerp(this.currentX, this.targetX, 0.07);
            this.currentY = lerp(this.currentY, this.targetY, 0.07);
            this.currentAlpha = lerp(this.currentAlpha, this.targetAlpha, 0.07);
        }

        push();
        translate(this.currentX, this.currentY);
        rotate(this.targetAngle + PI / 2);
        imageMode(CENTER);

        let imgWidth = this.img.width * this.targetScale;
        let imgHeight = this.img.height * this.targetScale;

        // Glow circle behind coin
        noStroke();
        fill(red(chosenOverlayColor), green(chosenOverlayColor), blue(chosenOverlayColor), 60);
        ellipse(0, 0, imgWidth * 1.4, imgHeight * 1.4);

        // Coin image
        tint(255, 255);
        image(this.img, 0, 0, imgWidth, imgHeight);
        pop();
    }
}

// === BACKGROUND TEXT (Floating after wish submission) ===
function prepareBackgroundPattern(inputText) {
    backgroundTexts = [];
    for (let i = 0; i < 120; i++) {   // increase the number of letters to cover evenly
        let txtRand = inputText;
        if (inputText.length > 1 && random() < 0.3) {
            let cut = int(random(1, inputText.length));
            txtRand = inputText.substring(0, cut);
        }
        backgroundTexts.push({
            x: random(width),          // full screen
            y: random(height),         
            color: color(random(overlayColors)),
            font: random(fontList),
            size: random(28, 120),
            txt: txtRand,
            alpha: 255,
            speed: random(0.5, 1.5),
            exploded: false            // flag on hover to disintegrate
        });
    }
}


// === FLYING ASSETS (during tower transition) ===
class FlyingAsset {
    constructor(img, startY, speed, scale) {
        this.img = img;
        this.x = random(width);
        this.y = startY;
        this.speed = speed;
        this.initialScale = scale;
        this.alpha = 0;
        this.rotation = 0;
        this.rotationSpeed = random(-0.01, 0.01);
        this.startDelay = random(TRANSITION_DURATION * 0.5); // staggered start
    }

    update(elapsedTime) {
        if (elapsedTime > this.startDelay) {
            this.y -= this.speed;
            this.alpha = min(255, this.alpha + 2);

            if (this.y < -this.img.height * this.initialScale) {
                this.y = height + random(20, 200);
                this.x = random(width);
                this.alpha = 0;
                this.speed = random(1, 3);
                this.rotationSpeed = random(-0.01, 0.01);
            }
            this.rotation += this.rotationSpeed;
        }
    }

    display() {
        let currentScale = this.initialScale * assetSizeSlider.value();
        push();
        tint(255, this.alpha);
        translate(this.x, this.y);
        rotate(this.rotation);
        imageMode(CENTER);
        image(this.img, 0, 0, this.img.width * currentScale, this.img.height * currentScale);
        pop();
    }
}

// Initialize all flying assets (joss paper, coins, charms)
function initializeFlyingAssets() {
    flyingAssets = [];
    const images = [coinImg, josspaperImg1, josspaperImg2, josspaperImg3, josspaperImg4, charmImg1, charmImg2];
    const numAssets = 150;
    const baseScale = width / baseWidth;

    for (let i = 0; i < numAssets; i++) {
        let randomImg = random(images);
        let startY = height + random(20, 200);
        let speed = random(1, 3);
        let scale = random(0.08, 0.2) * baseScale;
        flyingAssets.push(new FlyingAsset(randomImg, startY, speed, scale));
    }
}

// Position sliders below tower on tower screen
    function positionSlider() {
    let boxW = sliderBox.elt.offsetWidth;
    let boxH = sliderBox.elt.offsetHeight;

    // Bottom right corner, 30px from each edge
    let posX = width - boxW - 30;
    let posY = height - boxH - 30;

    sliderBox.position(posX, posY);
    }

    // This code is extracted and edited based on sketch.js in Assignment 3 by Nguyen Hoang Dan Khanh (S3980663) and Doan Quoc Trinh (s4014892)
    // === FUNCTIONS FOR BUTTONS ===
function savePngScreenshot() {
  const phase = showTowerScreen ? 'tower' :
                showTowerTransition ? 'transition' :
                showBackgroundText ? 'background' :
                showTextBoxScreen ? 'textbox' :
                showMainScreen ? 'main' : 'start';
  saveCanvas('screenshot_' + phase, 'png');
}

function exportSvgScreenshot() {
  const canvasEl = document.querySelector('canvas');
  if (!canvasEl) return;
  const dataURL = canvasEl.toDataURL('image/png');
  const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${dataURL}" x="0" y="0" width="${width}" height="${height}" />
</svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const phase = showTowerScreen ? 'tower' :
                showTowerTransition ? 'transition' :
                showBackgroundText ? 'background' :
                showTextBoxScreen ? 'textbox' :
                showMainScreen ? 'main' : 'start';
  a.download = 'screenshot_' + phase + '.svg';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function resetSketch() {
  showStartScreen = true;
  showMainScreen = false;
  showTextBoxScreen = false;
  showBackgroundText = false;
  showTowerTransition = false;
  showTowerScreen = false;

  userWish = "";
  backgroundTexts = [];
  flyingAssets = [];
  allCoins = [];
  flowerClusters = [];

  // reset âm thanh nếu cần
  if (heavenSound && heavenSound.isPlaying()) heavenSound.stop();
  if (knockingWoodenFishSound && knockingWoodenFishSound.isPlaying()) knockingWoodenFishSound.stop();
  if (ambienceSound && ambienceSound.isPlaying()) ambienceSound.stop();

  carpCurrentScale = 0.1;
  initializeCoins();
  generateNoiseTexture();

  resetBox.hide();
  sliderBox.hide();
}