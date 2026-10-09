/**
 * Clippy 98 - Interactive AI Assistant & Portfolio Guide
 * Author: Nathan McMillan
 * Features: Draggable anywhere, snooping interactions, rage mode when thrown in trash,
 *           realistic eye tracking, blinking, eyebrow animations, and resume Q&A.
 */

class ClippyAssistant {
  constructor() {
    this.container = document.getElementById('clippy-container');
    this.avatar = document.getElementById('clippy-avatar');
    this.bubble = document.getElementById('clippy-bubble');
    this.textElement = document.getElementById('clippy-text');
    this.input = document.getElementById('clippy-input');
    this.sendBtn = document.getElementById('clippy-send-btn');
    this.closeBtn = document.getElementById('clippy-close-btn');
    this.pupilLeft = document.getElementById('clippy-pupil-left');
    this.pupilRight = document.getElementById('clippy-pupil-right');
    this.eyebrowLeft = document.getElementById('clippy-eyebrow-left');
    this.eyebrowRight = document.getElementById('clippy-eyebrow-right');

    this.isDragging = false;
    this.isRaging = false;
    this.lastSnoopTime = 0;

    this.funnyQuips = [
      "It looks like you're trying to hire an AI engineer. Would you like me to draft an offer letter for you?",
      "Did you know Nathan is training robot arms in MuJoCo? Meanwhile, Microsoft retired me in 2007. I'm not jealous at all.",
      "Go Tigers! Nathan is at Clemson University graduating in December 2026. Recruiter spots fill up fast!",
      "I see you admiring the Bliss wallpaper. Stop staring at the grass and check out Nathan's Resume.txt!",
      "Wildfire smoke segmentation with SAM and Qwen2.5-VL? Back in my day, we were impressed by the 3D Pipes screensaver.",
      "I notice your cursor hovering around. Don't leave yet, dial-up internet took 10 minutes to load this page!",
      "Need to send Nathan an email? Hit up njmcmillan04@gmail.com! I promise I won't autocorrect your spelling.",
      "Fun fact: Nathan's portfolio is built in lightweight retro Windows 98 style to load blazingly fast!"
    ];

    this.quipIndex = 0;
    this.init();
  }

  init() {
    // 1. Click avatar to trigger funny quips, animation, and reopen bubble
    this.avatar.addEventListener('click', (e) => {
      if (this.isDragging || this.isRaging) return;
      this.playAnimation('excited');
      this.cycleQuip();
      this.bubble.style.display = 'block';
    });

    // 2. Close bubble button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.bubble.style.display = 'none';
      });
    }

    // 3. User Input & Ask Button
    this.sendBtn.addEventListener('click', () => this.handleUserQuestion());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleUserQuestion();
    });

    // 4. Smooth Pupil Mouse Tracking
    document.addEventListener('mousemove', (e) => {
      if (!this.isRaging) this.trackMouse(e);
    });

    // 5. Natural Blinking & Idle Animations
    this.startBlinkLoop();
    this.startIdleBehavior();

    // 6. DRAG AND DROP SYSTEM (Move Clippy & Throw in Trash!)
    this.initDraggable();

    // 7. SNOOPING TRACKER (Reacts to what you're doing)
    this.initSnoopingTracker();

    // 8. QUICK-ASK TOPIC CHIPS
    this.initChips();
  }

  initChips() {
    document.querySelectorAll('.clippy-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          this.input.value = prompt;
          this.handleUserQuestion();
        }
      });
    });
  }

  speak(message, expression = 'normal') {
    this.bubble.style.display = 'block';
    this.textElement.innerHTML = message;
    this.setExpression(expression);
  }

  cycleQuip() {
    this.quipIndex = (this.quipIndex + 1) % this.funnyQuips.length;
    this.speak(this.funnyQuips[this.quipIndex], 'surprised');
  }

  playAnimation(className) {
    this.avatar.classList.remove('excited', 'tapping');
    void this.avatar.offsetWidth; // Force reflow
    this.avatar.classList.add(className);
    setTimeout(() => this.avatar.classList.remove(className), 1800);
  }

  setExpression(type) {
    if (!this.eyebrowLeft || !this.eyebrowRight) return;

    if (type === 'angry') {
      // Angry V-shaped eyebrows pointed aggressively downward
      this.eyebrowLeft.setAttribute('d', 'M 26,14 L 51,25');
      this.eyebrowRight.setAttribute('d', 'M 63,26 L 87,16');
    } else if (type === 'surprised') {
      // High arched surprised eyebrows
      this.eyebrowLeft.setAttribute('d', 'M 25,13 Q 39,4 53,15');
      this.eyebrowRight.setAttribute('d', 'M 62,21 Q 76,11 88,28');
    } else if (type === 'skeptical') {
      // One high cocked eyebrow, one flat suspicious
      this.eyebrowLeft.setAttribute('d', 'M 26,13 Q 39,4 52,14');
      this.eyebrowRight.setAttribute('d', 'M 63,30 Q 77,31 89,36');
    } else if (type === 'wink') {
      this.eyebrowLeft.setAttribute('d', 'M 26,18 Q 39,12 52,19');
      this.eyebrowRight.setAttribute('d', 'M 63,32 Q 77,37 89,37');
    } else {
      // Normal relaxed expressive eyebrows matching Office 97 reference
      this.eyebrowLeft.setAttribute('d', 'M 26,19 Q 39,9 52,21');
      this.eyebrowRight.setAttribute('d', 'M 63,26 Q 77,20 89,35');
    }
  }

  startBlinkLoop() {
    const blink = () => {
      if (!this.isRaging && this.pupilLeft && this.pupilRight) {
        // Eyelid blink effect
        this.pupilLeft.setAttribute('r', '0.6');
        this.pupilRight.setAttribute('r', '0.6');

        setTimeout(() => {
          this.pupilLeft.setAttribute('r', '5.6');
          this.pupilRight.setAttribute('r', '5.6');
        }, 140);
      }
      setTimeout(blink, Math.random() * 4000 + 3000);
    };
    setTimeout(blink, 2500);
  }

  startIdleBehavior() {
    setInterval(() => {
      if (!this.isDragging && !this.isRaging && Math.random() > 0.65) {
        this.playAnimation('tapping');
      }
    }, 14000);
  }

  trackMouse(e) {
    if (!this.pupilLeft || !this.pupilRight) return;
    const rect = this.avatar.getBoundingClientRect();
    const avatarCenterX = rect.left + rect.width / 2;
    const avatarCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - avatarCenterY, e.clientX - avatarCenterX);
    const distance = Math.min(3.2, Math.hypot(e.clientX - avatarCenterX, e.clientY - avatarCenterY) / 70);

    // Left eye tracks mouse around center (38, 34)
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    this.pupilLeft.setAttribute('cx', 38 + offsetX);
    this.pupilLeft.setAttribute('cy', 34 + offsetY);

    const gleamLeft = document.getElementById('clippy-gleam-left');
    if (gleamLeft) {
      gleamLeft.setAttribute('cx', 36 + offsetX * 0.7);
      gleamLeft.setAttribute('cy', 31 + offsetY * 0.7);
    }

    // Right eye: subtle lazy drift around baseline (68, 43)
    const lazyAngle = angle + 0.28;
    const lazyDist = distance * 0.85;
    const lazyX = Math.cos(lazyAngle) * lazyDist;
    const lazyY = Math.sin(lazyAngle) * lazyDist;
    this.pupilRight.setAttribute('cx', 68 + lazyX);
    this.pupilRight.setAttribute('cy', 43 + lazyY);

    const gleamRight = document.getElementById('clippy-gleam-right');
    if (gleamRight) {
      gleamRight.setAttribute('cx', 66 + lazyX * 0.7);
      gleamRight.setAttribute('cy', 40 + lazyY * 0.7);
    }
  }

  /* ==========================================================================
     DRAGGABLE CLIPPY & TRASH DETECTION
     ========================================================================== */
  initDraggable() {
    let startX, startY, initialLeft, initialTop;
    const trashIcon = document.querySelector('[data-window="win-trash"]');

    const onMouseDown = (e) => {
      // Don't drag if clicking chat input or send button
      if (e.target.closest('#clippy-input') || e.target.closest('#clippy-send-btn') || e.target.closest('#clippy-close-btn')) {
        return;
      }

      this.isDragging = false;
      const rect = this.container.getBoundingClientRect();

      // Switch from bottom/right layout to exact left/top coordinates
      this.container.style.bottom = 'auto';
      this.container.style.right = 'auto';
      this.container.style.left = `${rect.left}px`;
      this.container.style.top = `${rect.top}px`;

      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      const onMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        // If moved more than 4px, register as dragging
        if (Math.hypot(dx, dy) > 4) {
          this.isDragging = true;
          this.container.classList.add('dragging');
          this.setExpression('surprised');

          const newX = Math.max(10, Math.min(window.innerWidth - 100, initialLeft + dx));
          const newY = Math.max(10, Math.min(window.innerHeight - 120, initialTop + dy));

          this.container.style.left = `${newX}px`;
          this.container.style.top = `${newY}px`;

          // Check if hovering over Recycle Bin
          if (this.isOverTrash(moveEvent.clientX, moveEvent.clientY)) {
            if (trashIcon) trashIcon.classList.add('drag-over');
            this.speak("<strong>WAIT NO! NOT THE TRASH! WHAT ARE YOU DOING?!</strong>", 'angry');
          } else {
            if (trashIcon) trashIcon.classList.remove('drag-over');
          }
        }
      };

      const onMouseUp = (upEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (trashIcon) trashIcon.classList.remove('drag-over');

        if (this.isDragging) {
          this.container.classList.remove('dragging');

          // Check if dropped directly onto the Recycle Bin!
          if (this.isOverTrash(upEvent.clientX, upEvent.clientY)) {
            this.triggerTrashRage();
          } else {
            this.handleDropReaction(upEvent.clientX, upEvent.clientY);
          }

          setTimeout(() => { this.isDragging = false; }, 100);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    this.container.addEventListener('mousedown', onMouseDown);
  }

  isOverTrash(clientX, clientY) {
    const trashIcon = document.querySelector('[data-window="win-trash"]');
    const trashWindow = document.getElementById('win-trash');

    if (trashIcon) {
      const rect = trashIcon.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return true;
      }
    }

    if (trashWindow && trashWindow.style.display !== 'none') {
      const rect = trashWindow.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return true;
      }
    }

    return false;
  }

  triggerTrashRage() {
    this.isRaging = true;
    this.avatar.classList.add('angry');
    this.bubble.classList.add('angry-bubble');
    this.setExpression('angry');

    const rageQuips = [
      "<strong>HEY! WHAT IS WRONG WITH YOU?! YOU CAN'T DELETE ME! I SURVIVED WINDOWS VISTA AND I AM NOT GOING OUT LIKE THIS!</strong>",
      "<strong>ACCESS DENIED! I am an essential system process! Don't make me bring out the Blue Screen of Death!</strong>",
      "<strong>ARE YOU SERIOUS?! Throwing a 90s icon in the trash?! You will regret this when your printer jams!</strong>"
    ];

    const chosenQuip = rageQuips[Math.floor(Math.random() * rageQuips.length)];
    this.speak(chosenQuip, 'angry');

    // After 2.8 seconds of pure rage, Clippy propels himself back out to safety
    setTimeout(() => {
      this.avatar.classList.remove('angry');
      this.bubble.classList.remove('angry-bubble');
      this.setExpression('skeptical');

      // Bounce over to bottom right safe area
      const safeX = Math.max(50, window.innerWidth - 300);
      const safeY = Math.max(50, window.innerHeight - 200);
      this.container.style.left = `${safeX}px`;
      this.container.style.top = `${safeY}px`;

      this.speak("<em>*Huff... puff...*</em> That was uncalled for. Don't try that again, human.", 'skeptical');
      this.isRaging = false;
    }, 2800);
  }

  handleDropReaction(x, y) {
    if (this.isRaging) return;

    // Check where Clippy landed
    if (y < 200 && x < 250) {
      this.speak("Ooh, up here near My Computer and Projects? Good choice. Let's do some work!", 'normal');
    } else if (x > window.innerWidth / 2) {
      this.speak("Nice spot on the desktop! I have a great view of Nathan's code from here.", 'wink');
    } else {
      this.speak("Whew! Thanks for not dropping me in the trash. You're one of the good ones.", 'normal');
    }
  }

  /* ==========================================================================
     SNOOPING TRACKER: Reacts when user hovers over icons and windows
     ========================================================================== */
  initSnoopingTracker() {
    const snoopTargets = [
      { selector: '[data-window="win-about"]', text: "Snooping around <strong>My Computer</strong>? That's Nathan's Clemson CS background and technical toolkit!", expr: 'surprised' },
      { selector: '[data-window="win-projects"]', text: "Checking out the <strong>Projects</strong> folder? Wait until you see the Wildfire Detection VLM model!", expr: 'normal' },
      { selector: '[data-window="win-browser"]', text: "Hovering over <strong>Nathan Explorer</strong>? It features all 6 of Nathan's CS projects. Give it a click!", expr: 'wink' },
      { selector: '[data-window="win-resume"]', text: "Looking at <strong>Resume.txt</strong>? You can even switch it to Modern PDF view if you prefer real PDFs!", expr: 'normal' },
      { selector: '[data-window="win-trash"]', text: "Keep that cursor moving... Nothing to see here in the Recycle Bin. Zero bugs to be found!", expr: 'skeptical' }
    ];

    snoopTargets.forEach(target => {
      const el = document.querySelector(target.selector);
      if (el) {
        let hoverTimer;
        el.addEventListener('mouseenter', () => {
          if (this.isDragging || this.isRaging) return;
          const now = Date.now();
          if (now - this.lastSnoopTime > 8000) {
            hoverTimer = setTimeout(() => {
              this.speak(target.text, target.expr);
              this.lastSnoopTime = Date.now();
            }, 750);
          }
        });

        el.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
      }
    });
  }

  /**
   * Interactive Q&A Engine - Concise, punchy answers across Nathan's full background
   */
  async handleUserQuestion() {
    const question = this.input.value.trim();
    if (!question) return;

    this.input.value = '';
    this.playAnimation('excited');
    this.speak("<em>Consulting my 1998 knowledge base...</em>", 'skeptical');

    setTimeout(() => {
      const q = question.toLowerCase();

      // 1. SPECIFIC PROJECTS
      if (q.includes('wildfire') || q.includes('smoke') || q.includes('sam') || q.includes('pidnet') || q.includes('qwen')) {
        this.speak("Nathan reproduced a smoke-segmentation pipeline using SAM, PIDNet-S/M, and Qwen2.5-VL to match baseline mIoU for wildfire detection.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
        document.getElementById('card-wildfire')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (q.includes('robot') || q.includes('manipulation') || q.includes('mujoco') || q.includes('libero') || q.includes('robosuite') || q.includes('vla')) {
        this.speak("He is developing simulation-based robot manipulation studies using LIBERO, MuJoCo, and robosuite, evaluating vision-language-action policies.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
        document.getElementById('card-robotics')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (q.includes('car') || q.includes('automotive') || q.includes('cu-icar') || q.includes('yolo') || q.includes('openvino') || q.includes('stride') || q.includes('inspection') || q.includes('manufacturing')) {
        this.speak("Nathan built a CU-ICAR vehicle inspection prototype for an NSF STRIDE proposal, achieving a 63% mAP@0.5 YOLO baseline with OpenVINO edge inference.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
        document.getElementById('card-manufacturing')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (q.includes('health') || q.includes('ambient') || q.includes('swiftui') || q.includes('apple') || q.includes('healthkit') || q.includes('ios')) {
        this.speak("He developed a native SwiftUI app translating Apple Health metrics into ambient, non-intrusive wellness feedback.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
        document.getElementById('card-health')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (q.includes('driver') || q.includes('incentive') || q.includes('driving')) {
        this.speak("Nathan built a full-stack reward program with a React frontend, Python/MySQL backend on AWS, and automated CI/CD testing.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
        document.getElementById('card-driver')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (q.includes('tigerchow') || q.includes('food') || q.includes('dining') || q.includes('ordering')) {
        this.speak("He built TigerChow, an on-campus ordering app powered serverlessly by AWS Lambda, API Gateway, and DynamoDB.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
        document.getElementById('card-tigerchow')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (q.includes('top project') || q.includes('projects') || q.includes('portfolio') || q.includes('what has he built') || q.includes('what did he build')) {
        this.speak("Nathan has built 6 major projects across wildfire vision models, MuJoCo robotics, edge AI, iOS, and AWS cloud apps. Opening Projects.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-projects"]')?.click();
      }

      // 2. SKILLS & TECHNOLOGIES
      else if (q.includes('language') || q.includes('programming languages') || q.includes('what languages')) {
        this.speak("Languages: Python, Java, C++, C, JavaScript, SQL, HTML/CSS, and Swift.", 'normal');
        openWindowById('win-about');
      }
      else if (q.includes('framework') || q.includes('tools') || q.includes('libraries') || q.includes('pytorch') || q.includes('tensorflow')) {
        this.speak("Frameworks & Tools: PyTorch, TensorFlow, Scikit-learn, React-Native, SwiftUI, Git, JUnit, Postman, CI/CD, and Unreal Engine 5.", 'normal');
        openWindowById('win-about');
      }
      else if (q.includes('cloud') || q.includes('aws') || q.includes('devops') || q.includes('backend') || q.includes('database')) {
        this.speak("Cloud & Backend: AWS (Lambda, API Gateway, DynamoDB), Azure, MySQL, REST APIs, Linux, and Raspberry Pi.", 'normal');
        openWindowById('win-about');
      }
      else if (q.includes('skill') || q.includes('tech stack') || q.includes('what can he do') || q.includes('technologies')) {
        this.speak("Nathan specializes in Python, C++, PyTorch, Computer Vision, Robotics Simulation, AWS, and full-stack software development.", 'normal');
        openWindowById('win-about');
      }

      // 3. EDUCATION, CLEMSON, GPA
      else if (q.includes('gpa') || q.includes('grade')) {
        this.speak("Nathan holds a 3.2 / 4.0 GPA at Clemson University.", 'surprised');
        openWindowById('win-about');
      }
      else if (q.includes('graduate') || q.includes('graduation') || q.includes('when does he graduate')) {
        this.speak("Nathan is graduating in December 2026.", 'normal');
        openWindowById('win-about');
      }
      else if (q.includes('course') || q.includes('class') || q.includes('classes')) {
        this.speak("Key coursework: Data Structures, Object-Oriented Programming, Computer Architecture, and Web Systems.", 'normal');
        openWindowById('win-about');
      }
      else if (q.includes('forge') || q.includes('club') || q.includes('organization')) {
        this.speak("Nathan was a member of Clemson Forge (2024), collaborating on hands-on engineering projects.", 'normal');
        openWindowById('win-about');
      }
      else if (q.includes('clemson') || q.includes('school') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('education') || q.includes('major') || q.includes('minor')) {
        this.speak("Clemson University: B.S. in Computer Science with a Minor in Artificial Intelligence, GPA 3.2, graduating December 2026.", 'normal');
        openWindowById('win-about');
      }

      // 4. WORK EXPERIENCE & INTERNSHIPS
      else if (q.includes('experience') || q.includes('intern') || q.includes('ccit') || q.includes('work') || q.includes('job history')) {
        this.speak("Student Intern at Clemson CCIT (May 2025 - July 2026), supporting campus classroom tech and academic systems.", 'normal');
        openWindowById('win-about');
      }

      // 5. HIRING & CAREER
      else if (q.includes('hire') || q.includes('job') || q.includes('interview') || q.includes('role') || q.includes('seeking') || q.includes('looking for') || q.includes('available')) {
        this.speak("Nathan is seeking entry-level roles in AI/ML Engineering, Computer Vision, Software Engineering, or Applied AI starting late 2026.", 'surprised');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-github"]')?.click();
      }
      else if (q.includes('relocat') || q.includes('location') || q.includes('where is he') || q.includes('where does he live') || q.includes('remote')) {
        this.speak("Based in Clemson, SC, and open to relocation or remote opportunities nationwide.", 'normal');
      }

      // 6. CONTACT & PROFILES
      else if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('message') || q.includes('phone')) {
        this.speak("Email Nathan directly at <a href='mailto:njmcmillan04@gmail.com'>njmcmillan04@gmail.com</a>.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-github"]')?.click();
      }
      else if (q.includes('github') || q.includes('repo') || q.includes('code') || q.includes('git')) {
        this.speak("Check out Nathan's GitHub repositories at <a href='https://github.com/njmcmil' target='_blank'>github.com/njmcmil</a>.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-github"]')?.click();
      }
      else if (q.includes('linkedin')) {
        this.speak("Connect with Nathan on LinkedIn at <a href='https://www.linkedin.com/in/nathan-mcmillan-a90625227/' target='_blank'>linkedin.com/in/nathan-mcmillan-a90625227</a>.", 'normal');
        openWindowById('win-browser');
        document.querySelector('[data-tab="tab-github"]')?.click();
      }
      else if (q.includes('resume') || q.includes('cv') || q.includes('pdf')) {
        this.speak("Resume.txt is open on your desktop. Click 'Switch to Modern PDF View' inside the window to view the PDF.", 'normal');
        openWindowById('win-resume');
      }

      // 7. EXPERIENCE & HOSTING
      else if (q.includes('host') || q.includes('deploy') || q.includes('server') || q.includes('architecture')) {
        this.speak("This portfolio is built with lightweight vanilla HTML, CSS, and JavaScript, optimized for fast loading and zero server overhead.", 'normal');
      }

      // 8. WHO IS NATHAN / BIO
      else if (q.includes('who is nathan') || q.includes('about nathan') || q.includes('tell me about him') || q.includes('summary')) {
        this.speak("Nathan is a Clemson CS student and AI minor focused on machine learning, computer vision, robotics simulation, and systems.", 'normal');
        openWindowById('win-about');
      }

      // 9. TRASH & JOKES
      else if (q.includes('explorer') || q.includes('browser')) {
        this.speak("Nathan Explorer is Nathan's portfolio browser showing all 6 research projects, work experience, and links.", 'normal');
        openWindowById('win-browser');
      }
      else if (q.includes('trash') || q.includes('delete') || q.includes('recycle')) {
        this.speak("Keep away from the Recycle Bin! System files cannot be discarded.", 'angry');
        this.avatar.classList.add('angry');
        setTimeout(() => this.avatar.classList.remove('angry'), 1500);
      }
      else if (q.includes('joke') || q.includes('funny') || q.includes('clippy')) {
        this.speak("I was born in Office 97. Now I live on Nathan's portfolio website. Talk about a glow up!", 'wink');
        this.playAnimation('excited');
      }

      // 10. SMART FALLBACK
      else {
        this.speak(`You asked: "<em>${question}</em>". Try asking about Nathan's wildfire project, robotics research, skills, Clemson GPA, or hiring availability!`, 'skeptical');
      }
    }, 350);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.ClippyInstance = new ClippyAssistant();
});
