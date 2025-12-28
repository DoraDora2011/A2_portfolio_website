# After All –Assignment 3- Interactive Generative Ritual

Vscode, Version: 1.102.2 (user setup)

---

## Usage Notes
- For the best immersive experience, please view this work in **full screen mode** on a laptop or desktop.  
- In the right corner of Genart, there are always two buttons 'Export SVG' and 'Save PNG'. Users can click on these two buttons if they want to take a photo of the entire online votive paper burning process right then.
- This project is an **interactive generative artwork** divided into multiple stages:
  1. **Start Screen** – click to **“Tap to Start”** to go next.  
  2. **Opening Screen** – explore the central carp surrounded by animated coins, glowing halos, and background overlays. Click to the josspaper in the center to GO NEXT.  
  3. **Textbox Screen** – type your personal **New Year wish** into the box. Please use English mode when typing. The typing sounds are named **w1.ogg – w10.ogg** for random selection when each key is pressed. ENTER when you finish.  
  4. **Background Text** – your wish is multiplied into random patterns across the screen, You can hover over the text to see it fade away. Starting after you press 'ENTER' to complete your wish, a 'Restart Ritual' button will appear on the LEFT corner of the screen, which will take you back to the Opening Screen if you want to start over.
NOTE: This effect is not available on the mobile version, the text will fade out automatically.
  5. **Lucky Gold Tower Transition** – flying charms, coins, and joss paper rise up as the golden tower emerges.  
  6. **Lucky Gold Tower Screen** – adjust the **asset size slider** and **sound reverb slider** for real-time interaction.  
- Each stage contains its own **soundtrack and sound effects**. We recommend using headphones, but please adjust your volume to a comfortable level.  

---

## Installation Instructions
- Download the ZIP folder and unzip it.  
- Open **Visual Studio Code (VSCode)**.  
- Click **File → Open Folder** and select the project folder.  
- In VSCode, click **“Go Live”** in the bottom right corner to run the code.  
  - Do **not** open the `index.html` file directly from the folder, as this may cause the code to crash.  
- If you don’t see **“Go Live”**, install the following extensions from the left sidebar (**Ctrl + Shift + X**):  
  - **P5 Resources**  
  - **P5 Server**  
- After installation, you will see **“Go Live”** at the bottom right corner. Click it to launch.  
- You are now free to explore the interactive ceremony.  

---

## Documentation
If you cannot download the project files, here is a backup/online folder:  
[OneDrive Backup Link](https://rmiteduau-my.sharepoint.com/:u:/g/personal/s3974886_rmit_edu_vn/EQ-XqUjRo0dCh9GCxapUxr8BcvXRSj9WGkF8wPFW2YUyVg?e=hkCKF9)

---

## License Information
This project is released under the **GNU General Public License v3.0 (GPL-3.0)**.  
The code directory includes a `LICENSE.txt` file with the full license text.  

## References  

This project was built with **p5.js**. Some parts of this sketch are referenced from the following guides and use chapGPT's advanced knowledge and Gemini 2.5 Flash to reinforce.
The following functions and techniques are referenced and used in the code:  

- **p5.js Reference**  
  - `createGraphics()` – Procedural noise texture  
    <https://p5js.org/reference/p5/createGraphics/>  
  - `blendMode()` – ADD, HARD_LIGHT, DIFFERENCE, BLEND  
    <https://p5js.org/reference/p5/blendMode/>  

- **Trigonometry for halo rays and orbital charms**  
  - `sin()`, `cos()`  
    <https://p5js.org/reference/p5/sin/>  
    <https://p5js.org/reference/p5/cos/>  

- **Particle system & OOP structure**  
  - JavaScript ES6 `class` (AnimatedCoin, FlowerCluster, Point, FlyingAsset)  
    <https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes>  
  - p5.js transforms: `push()`, `translate()`, `rotate()`  
    <https://p5js.org/reference/p5/push/>  
    <https://p5js.org/reference/p5/translate/>  
    <https://p5js.org/reference/p5/rotate/>  

- **Sound handling**  
  - `userStartAudio()` – required for browser audio unlock  
    <https://p5js.org/reference/p5/userStartAudio/>  
  - `amp()` – used for fade-in gain ramps (heaven sound)  
  <https://processing.org/reference/libraries/sound/SoundFile_amp_.html>

- **Typing Effect**  
  - `keyTyped()` – capture typed characters  
    <https://p5js.org/reference/p5/keyTyped/>  
  - `random()` – select random sound index  
    <https://p5js.org/reference/p5/random/>  
  - `loadSound()` – load typing sound files  
    <https://p5js.org/reference/p5/loadSound/>  
  - `SoundFile.play()` – play selected typing sound  
    <https://p5js.org/reference/p5.SoundFile/play/>  
  - `SoundFile.isLoaded()` – check sound file readiness  
    <https://p5js.org/reference/p5.SoundFile/isLoaded/>  
  - `SoundFile.setVolume()` – control playback volume  
    <https://p5js.org/reference/#/p5.SoundFile/setVolume>  

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

---

## Credits  
- **Author**: Tran Thi Thuy Dung  
- **Project**: COMM2754-2025-s3974886-A3w013- After All – Compilation*  
- **School email**: s3974886@rmit.edu.vn  
