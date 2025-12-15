import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()
const DOMAIN = 'https://www.chelunliang.com'

app.use('*', secureHeaders({
    xXssProtection: false,      
    xFrameOptions: false,       
    removePoweredBy: true,      
}))

app.use('*', async (c, next) => {
    await next() 
    c.header(
        'Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; " + 
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "frame-ancestors 'none';"
    )
    c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
    c.header('Cache-Control', 'public, max-age=3600')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
})

app.get('/', (c) => {
  const cf = (c.req.raw as any).cf
  const city = cf?.city || 'Unknown City'
  const country = cf?.country || 'Earth'
  const colo = cf?.colo || 'DEV'
  const ip = c.req.header('CF-Connecting-IP') || '127.0.0.1'

  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Che-Lun Liang</title>
    <meta name="description" content="Personal website of Che-Lun Liang. Exploring Edge Computing.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${DOMAIN}/">
    <meta property="og:title" content="Che-Lun Liang">
    <meta property="og:description" content="Coding Peasant / Traveler.">
    <meta property="og:image" content="${DOMAIN}/og-image.png">

    <link rel="icon" type="image/png" href="/favicon.png" sizes="64x64">
    <link rel="shortcut icon" href="/favicon.png">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div id="terminal-overlay">
        <div class="terminal-content">
            <div id="terminal-output">
                你闖入了我的終端機, 你...你...你想幹嘛？ 輸入 'help' 可以看到所有可使用的指令。
                <br><br>
            </div>
            <div class="input-line">
                <span class="prompt">guest@chelun:~$</span>
                <input type="text" id="terminal-input" autocomplete="off" spellcheck="false">
            </div>
        </div>
    </div>

    <div class="container">
        <button type="button" class="theme-toggle" id="theme-btn" aria-label="Toggle Dark Mode">
            <span id="theme-icon">◐</span>
            <span id="theme-text">AUTO</span>
        </button>

        <header>
            <h1>Che-Lun Liang</h1>
            <div class="subtitle">Coding Peasant / Traveler</div>
        </header>

        <main>
            <div class="code-window">
                <div class="window-header">
                    <div class="traffic-lights">
                        <span class="traffic-light red"></span>
                        <span class="traffic-light yellow"></span>
                        <span class="traffic-light green"></span>
                    </div>
                    <span class="window-title">profile.json</span>
                </div>
                <div class="window-body">
                    <div class="code-line">{</div>
                    
                    <div class="code-line pl-1"><span class="json-key">"Status"</span>: <span class="json-string">"Trying new things, and currently learning about Cloudflare."</span>,</div>
                    <div class="code-line">&nbsp;</div>

                    <div class="code-line pl-1"><span class="json-key">"Stack"</span>: [</div>
                    <div class="code-line pl-2"><span class="json-string">"Python"</span>,</div>
                    <div class="code-line pl-2"><span class="json-string">"React"</span>,</div>
                    <div class="code-line pl-2"><span class="json-string">"Edge Computing"</span>,</div>
                    <div class="code-line pl-2"><span class="json-string">"Image Processing"</span></div>
                    <div class="code-line pl-1">],</div>
                    <div class="code-line">&nbsp;</div>

                    <div class="code-line pl-1"><span class="json-key">"Contact"</span>: {</div>
                    <div class="code-line pl-2"><span class="json-key">"Email"</span>: <a href="mailto:me@chelunliang.com" class="json-link">"me@chelunliang.com"</a>,</div>
                    <div class="code-line pl-2"><span class="json-key">"GitHub"</span>: <a href="https://github.com/lianglun0125" target="_blank" class="json-link">"@lianglun0125"</a>,</div>
                    <div class="code-line pl-1">},</div>
                    <div class="code-line">&nbsp;</div>

                    <div class="code-line pl-1"><span class="json-key">"Notes"</span>: <span class="json-string">"發自己的光就好，不要吹滅別人的燈。"</span></div>
                    <br>
                    <div class="code-line pl-1"><span class="json-comment">// Press '~' or tap my name five times to unlock fun features.</span></div>                    
                    <div class="code-line">}</div>
                </div>
            </div>
        </main>

        <footer>
            <div class="typing-text">:: CLIENT: ${city}, ${country} :: SERVED BY: ${colo} ::</div>
        </footer>
    </div>

    <script>
        const VISITOR_INFO = {
            ip: ${JSON.stringify(ip)},
            city: ${JSON.stringify(city)},
            country: ${JSON.stringify(country)},
            colo: ${JSON.stringify(colo)}
        };
    </script>
    <script src="/script.js"></script>
</body>
</html>
`
  return c.html(htmlContent)
})

app.get('/robots.txt', (c) => {
  return c.text(`User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml`)
})
app.get('/sitemap.xml', (c) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>
</urlset>`
  return c.text(sitemap, 200, { 'Content-Type': 'application/xml' })
})

export default app