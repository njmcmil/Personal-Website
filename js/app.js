/**
 * Windows 98 Portfolio - Core OS Logic
 * Author: Nathan McMillan
 * Handles: Window dragging, maximizing/minimizing, browser tabs, start menu, and clock.
 */

// Track highest z-index so clicked windows always jump to the front
let highestZIndex = 100;

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initStartMenu();
  initDesktopIcons();
  initWindows();
  initBrowserTabs();
  initResumeViewerToggle();
  syncTaskbar();
});

/* ==========================================================================
   1. Live Digital Clock in System Tray
   ========================================================================== */
function initClock() {
  const clockElement = document.getElementById('system-clock');
  function updateTime() {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. Start Menu Toggle
   ========================================================================== */
function initStartMenu() {
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = startMenu.classList.toggle('open');
    startBtn.classList.toggle('active', isOpen);
  });

  // Clicking anywhere outside closes the Start Menu
  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      startMenu.classList.remove('open');
      startBtn.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. Desktop Icons (Selection & Opening)
   ========================================================================== */
function initDesktopIcons() {
  const icons = document.querySelectorAll('.desktop-icon');

  icons.forEach((icon) => {
    // Single click selects the icon (highlight)
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    });

    // Double click opens the window
    icon.addEventListener('dblclick', () => {
      const windowId = icon.getAttribute('data-window');
      if (windowId) openWindowById(windowId);
    });
  });

  // Clicking on empty desktop background clears selection
  document.getElementById('desktop').addEventListener('click', (e) => {
    if (e.target.id === 'desktop') {
      icons.forEach(i => i.classList.remove('selected'));
    }
  });
}

/* ==========================================================================
   4. Window Management (Drag, Maximize, Minimize, Close, Focus)
   ========================================================================== */
function initWindows() {
  const windows = document.querySelectorAll('.window');

  windows.forEach((win) => {
    // Click inside window brings it to focus
    win.addEventListener('mousedown', () => bringToFront(win));

    // Titlebar Dragging
    const titlebar = win.querySelector('.window-titlebar');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    titlebar.addEventListener('mousedown', (e) => {
      // Don't drag if clicking buttons or if maximized
      if (e.target.closest('.win-btn') || win.classList.contains('maximized')) return;

      isDragging = true;
      bringToFront(win);

      startX = e.clientX;
      startY = e.clientY;
      initialLeft = win.offsetLeft;
      initialTop = win.offsetTop;

      function onMouseMove(moveEvent) {
        if (!isDragging) return;
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        win.style.left = `${Math.max(0, initialLeft + deltaX)}px`;
        win.style.top = `${Math.max(0, initialTop + deltaY)}px`;
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Window Control Buttons
    const closeBtn = win.querySelector('.win-btn-close');
    const maxBtn = win.querySelector('.win-btn-max');
    const minBtn = win.querySelector('.win-btn-min');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        win.style.display = 'none';
        syncTaskbar();
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', () => {
        win.classList.toggle('maximized');
        maxBtn.textContent = win.classList.contains('maximized') ? '❐' : '□';
      });
    }

    if (minBtn) {
      minBtn.addEventListener('click', () => {
        win.style.display = 'none';
        syncTaskbar();
      });
    }
  });
}

function bringToFront(win) {
  highestZIndex++;
  win.style.zIndex = highestZIndex;

  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
  syncTaskbar();
}

function openWindowById(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  win.style.display = 'flex';
  bringToFront(win);
  syncTaskbar();

  // Close start menu if open
  document.getElementById('start-menu').classList.remove('open');
  document.getElementById('start-btn').classList.remove('active');
}

/* ==========================================================================
   5. Taskbar Sync (Shows Open Windows as Taskbar Buttons)
   ========================================================================== */
function syncTaskbar() {
  const container = document.getElementById('taskbar-items');
  container.innerHTML = '';

  const windows = document.querySelectorAll('.window');
  windows.forEach((win) => {
    // If window is visible on screen
    if (win.style.display !== 'none' && getComputedStyle(win).display !== 'none') {
      const taskBtn = document.createElement('button');
      taskBtn.className = 'taskbar-item win-outset';
      if (win.classList.contains('active')) taskBtn.classList.add('active');

      const title = win.querySelector('.window-title span')?.textContent || 'Window';
      taskBtn.textContent = title;

      taskBtn.addEventListener('click', () => {
        if (win.classList.contains('active')) {
          // If already active, minimize it
          win.style.display = 'none';
          syncTaskbar();
        } else {
          // Restore and bring to front
          win.style.display = 'flex';
          bringToFront(win);
        }
      });

      container.appendChild(taskBtn);
    }
  });
}

/* ==========================================================================
   6. Fake Browser Tab Switching (Inside Internet Explorer)
   ========================================================================== */
function initBrowserTabs() {
  const tabs = document.querySelectorAll('.browser-tab');
  const panes = document.querySelectorAll('.tab-pane');
  const urlInput = document.getElementById('browser-url');

  const tabUrls = {
    'tab-projects': 'http://nathan.dev/projects',
    'tab-pi': 'http://nathan.dev/raspberry-pi-server',
    'tab-github': 'http://nathan.dev/connect-github'
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-tab');

      // Update active tab styling
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Switch active content pane
      panes.forEach(pane => {
        pane.style.display = (pane.id === targetPaneId) ? 'block' : 'none';
      });

      // Update fake URL address bar
      if (tabUrls[targetPaneId]) {
        urlInput.value = tabUrls[targetPaneId];
      }
    });
  });
}

/* ==========================================================================
   7. Resume View Toggle (Notepad Text vs Modern PDF View)
   ========================================================================== */
function initResumeViewerToggle() {
  const toggleBtn = document.getElementById('toggle-resume-view');
  const textView = document.getElementById('resume-text-view');
  const pdfView = document.getElementById('resume-pdf-view');

  if (!toggleBtn || !textView || !pdfView) return;

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyText = (textView.style.display !== 'none');
    if (isCurrentlyText) {
      textView.style.display = 'none';
      pdfView.style.display = 'flex';
      toggleBtn.textContent = 'Switch to Retro Notepad View';
    } else {
      textView.style.display = 'block';
      pdfView.style.display = 'none';
      toggleBtn.textContent = 'Switch to Modern PDF View';
    }
  });
}

