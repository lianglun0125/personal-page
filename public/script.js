// --- Dark Mode Logic ---
const btn = document.getElementById('theme-btn');
const icon = document.getElementById('theme-icon');
const text = document.getElementById('theme-text');
const html = document.documentElement;



function getPreferredTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        text.textContent = 'DARK';
        icon.textContent = '☾';
    } else {
        html.removeAttribute('data-theme');
        text.textContent = 'LIGHT';
        icon.textContent = '☼';
    }
    localStorage.setItem('theme', theme);
}
setTheme(getPreferredTheme());
btn.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// --- Terminal Logic ---
let commandHistory = [];
let historyIndex = -1;
const termOverlay = document.getElementById('terminal-overlay');
const termInput = document.getElementById('terminal-input');
const termOutput = document.getElementById('terminal-output');
const availableCommands = ['help', 'whoami', 'about', 'contact', 'reboot', 'clear', 'exit', 'sudo'];

// Listen for keyboard shortcut (~)
document.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        toggleTerminal();
    }
    // ESC for close
    if (e.key === 'Escape' && termOverlay.classList.contains('open')) {
        toggleTerminal();
    }
});

function toggleTerminal() {
    termOverlay.classList.toggle('open');
    if (termOverlay.classList.contains('open')) {
        termInput.focus();
    }
}

// Handle command input
termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const rawInput = termInput.value;
        const cmd = rawInput.trim().toLowerCase();

        printOutput('guest@chelun:~$ ' + rawInput);

        if (cmd) {
            processCommand(cmd);
            // 存入歷史
            commandHistory.push(rawInput);
            historyIndex = commandHistory.length;
        }
        termInput.value = '';
        termOverlay.scrollTop = termOverlay.scrollHeight;
    } 
    
    else if (e.key === 'ArrowUp') {
        e.preventDefault(); 
        if (commandHistory.length > 0) {
            if (historyIndex > 0) historyIndex--;
            termInput.value = commandHistory[historyIndex];
        }
    } 
    
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            termInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            termInput.value = '';
        }
    }

    if (e.key === 'Tab') {
        e.preventDefault(); // 防止 Tab 跳到其他網頁元素
        
        const currentInput = termInput.value.trim().toLowerCase();
        if (!currentInput) return;

        // 尋找以目前輸入開頭的指令
        const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));

        if (matches.length === 1) {
            // 只有一個匹配項，直接補完
            termInput.value = matches[0];
        } else if (matches.length > 1) {
            // 有多個匹配項，可以在 terminal 輸出提示（就像 Linux 一樣）
            printOutput('guest@chelun:~$ ' + currentInput);
            printOutput(matches.join('  '));
            // 保持原本輸入的內容，方便使用者繼續打字
            termOverlay.scrollTop = termOverlay.scrollHeight;
        }
    }
});

function printOutput(text, isHtml = false) {
    const div = document.createElement('div');
    if (isHtml) div.innerHTML = text;
    else div.textContent = text;
    termOutput.appendChild(div);
}

function processCommand(cmd) {
    let response = '';
    let className = 'cmd-result';
    const codeWin = document.querySelector('.code-window');

    switch (cmd) {
        case 'help':
            response = `Available commands:
  help      - Show this help message
  whoami    - Show your connection info
  about     - Who is Che-Lun?
  contact   - How to reach me
  reboot    - Restore/Restart the profile window
  clear     - Clear terminal
  exit      - Close terminal`;
            break;
        
        case 'whoami':
            if (typeof VISITOR_INFO !== 'undefined') {
                response = `IP Address: ${VISITOR_INFO.ip}
                Location:   ${VISITOR_INFO.city}, ${VISITOR_INFO.country}
                Connection: Via Cloudflare Node [${VISITOR_INFO.colo}]`;
                            } else {
                                response = "Connection info unavailable.";
                            }
                            break;

        case 'about':
            response = "u don't know Che-lun ? he's a handsome guy.";
            break;

        case 'contact':
            response = 'Email: me@chelunliang.com';
            break;

        case 'reboot':
        case 'run':
            if (codeWin.classList.contains('tv-off-active') || codeWin.classList.contains('window-minimize')) {
                codeWin.classList.remove('tv-off-active', 'window-minimize');
                response = "System rebooting... Initializing CRT display... OK. Profile restored.";
            } else {
                response = "System is already running at PID 125. No reboot needed.";
            }
            break;

        case 'clear':
            termOutput.innerHTML = '';
            return;

        case 'exit':
            toggleTerminal();
            return;

        case 'sudo':
            response = 'PermissionError: [Errno 13] Permission denied \n\nNice try! hahaha :))) 想幹嘛？你怎那麼壞呢寶？ ';
            className = 'cmd-error';
            break;

        default:
            response = `Command not found: \${cmd}. Type 'help' for list.`;
            className = 'cmd-error';
    }

    // 渲染輸出
    const div = document.createElement('div');
    div.className = className;
    div.innerText = response;
    termOutput.appendChild(div);
}

// --- Mobile Trigger for terminal ---
const title = document.querySelector('h1');
let tapCount = 0;
let tapTimer = null;

if (title) {
    title.addEventListener('click', (e) => {
        tapCount++;
        
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
            tapCount = 0;
        }, 500);

        if (tapCount >= 5) {
            tapCount = 0; 
            toggleTerminal();
            
            setTimeout(() => {
                termInput.focus();
            }, 100);
        }
    });
}


// -------------- code window 關閉按鈕 --------------------

const closeBtn = document.querySelector('.traffic-light.red');
const miniBtn = document.querySelector('.traffic-light.yellow');
const codeWin = document.querySelector('.code-window');

// 紅色按鈕
if (closeBtn && codeWin) {
    closeBtn.addEventListener('click', () => {
        document.body.classList.add('body-flicker');
        codeWin.classList.add('tv-off-active');
        setTimeout(() => document.body.classList.remove('body-flicker'), 400);
    });
}
