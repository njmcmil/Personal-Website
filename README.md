# 🖥️ Nathan McMillan - Windows 98 Retro Portfolio

An authentic Windows 98/2000 themed personal portfolio website designed to run seamlessly on a **Raspberry Pi 4**, featuring an interactive AI-inspired **Clippy** assistant.

![Tech Stack](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi%204-C51A4A?style=flat&logo=raspberry-pi&logoColor=white)

---

## ✨ Features

- **Iconic Retro UI:** Authentic 3D beveled borders, classic teal desktop (`#008080`), and retro gray menus (`#c0c0c0`).
- **Interactive Windows:**
  - **Draggable:** Grab the title bar and move windows anywhere on screen.
  - **Maximizable & Minimizable:** Toggle full-screen browser tabs or minimize to the taskbar.
  - **Focus Stacking:** Clicked windows jump to the foreground (`z-index` management).
- **Fake Browser Experience (Nathan Explorer):**
  - Switch between tabs (Featured Projects, Raspberry Pi Specs, GitHub / Connect).
  - Live updated URL address bar.
- **Interactive Clippy Assistant:**
  - Eyes follow the cursor across the screen.
  - Speech bubble with helpful portfolio navigation tips.
  - Question box that responds with contextual answers about skills, projects, and hosting.
- **Taskbar & Start Menu:**
  - Live system tray digital clock.
  - Functional Start Menu with app shortcuts.
  - Dynamic taskbar buttons synchronized with open windows.

---

## 📁 File Structure

```text
Personal-Website/
├── index.html            # Main markup with desktop, windows, and Clippy
├── css/
│   └── styles.css        # Windows 98 CSS theme & 3D bevel utilities
├── js/
│   ├── app.js            # Window dragging, maximizing, tabs, taskbar, clock
│   └── clippy.js         # Clippy animations, pupil tracking, and Q&A engine
├── assets/
│   ├── icons/            # Retro icons and assets
│   └── images/           # Screenshots and thumbnails
├── .gitignore            # Git ignore rules
└── README.md             # Documentation
```

---

## 🥧 Running on Raspberry Pi 4

Because this project is built with lightweight vanilla HTML, CSS, and JavaScript, it consumes almost **0% CPU** and **under 15MB RAM** on a Raspberry Pi 4.

### Quick Setup with Nginx:
1. Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```
2. Copy files to the web root:
   ```bash
   sudo cp -r /path/to/Personal-Website/* /var/www/html/
   ```
3. Visit `http://<your-pi-ip-address>` in any browser on your local network!
