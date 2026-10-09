# Nathan McMillan - Windows 98 Retro Portfolio

An authentic Windows 98/2000 themed personal portfolio website for Nathan McMillan, featuring an interactive 3D **Clippy** assistant, **Nathan Explorer**, and a full CS/AI project showcase.

---

## Features

- **Iconic Retro UI:** Authentic 3D beveled borders, classic Bliss wallpaper, and retro gray menus (`#c0c0c0`).
- **Interactive Windows:**
  - **Draggable:** Grab the title bar and move windows anywhere on screen.
  - **Maximizable & Minimizable:** Toggle full-screen browser tabs or minimize to the taskbar.
  - **Focus Stacking:** Clicked windows jump to the foreground (`z-index` management).
- **Nathan Explorer (Browser Tab Experience):**
  - Switch between tabs (Featured Projects, Experience & Skills, GitHub / Connect).
  - Live updated URL address bar.
  - Full screenshot slots and GitHub repository links for all 6 projects.
- **Resume.txt & Modern PDF Viewer:**
  - Classic retro Notepad view.
  - Instant toggle button to switch to embedded modern PDF view.
- **Interactive 3D Clippy Assistant:**
  - Curled yellow lined legal notepad backing, lavender metallic wire body, and tilted 3D egg eyes with white catchlights matching Office 97.
  - Eyes follow cursor across the screen with natural lazy eye physics and blinking.
  - Draggable anywhere on the desktop.
  - Rage mode if dragged or dropped into the Recycle Bin.
  - Large prompt box with quick-ask topic chips and concise answers about Nathan's research, skills, and background.
- **Taskbar & Start Menu:**
  - Live system tray digital clock.
  - Functional Start Menu with app shortcuts.
  - Dynamic taskbar buttons synchronized with open windows.

---

## File Structure

```text
Personal-Website/
├── index.html            # Main markup with desktop, windows, and Clippy
├── css/
│   └── styles.css        # Windows 98 CSS theme & 3D bevel utilities
├── js/
│   ├── app.js            # Window dragging, maximizing, tabs, taskbar, clock
│   └── clippy.js         # Clippy animations, pupil tracking, and Q&A engine
├── assets/
│   ├── images/           # Wallpapers, Clippy references, and project screenshots
│   └── Nathan_McMillan_Resume.pdf # Full resume PDF
└── README.md             # Documentation
```

---

## Deployment (GitHub Pages)

Because this project is built entirely with vanilla HTML5, CSS3, and JavaScript:
1. Push this repository to GitHub.
2. In your repository, go to **Settings** -> **Pages**.
3. Under **Branch**, select `main` / `root` and click **Save**.
4. Your portfolio will go live on `https://<username>.github.io/Personal-Website/`.
