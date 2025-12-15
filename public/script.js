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
const termOverlay = document.getElementById('terminal-overlay');
const termInput = document.getElementById('terminal-input');
const termOutput = document.getElementById('terminal-output');

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
        const cmd = termInput.value.trim().toLowerCase();

        printOutput('guest@chelun:~$ ' + rawInput);

        if (cmd) {
            processCommand(cmd);
        }
        termInput.value = '';
        // Scroll to bottom
        termOverlay.scrollTop = termOverlay.scrollHeight;
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

    switch (cmd) {
        case 'help':
            response = `Available commands:
  help      - Show this help message
  whoami    - Show your connection info
  about     - Who is Che-Lun?
  contact   - How to reach me
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
            response = `Command not found: ${cmd}. Type 'help' for list.`;
            className = 'cmd-error';
    }

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


