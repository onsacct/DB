// Service worker for "السِجل" — makes the site installable as an app.
//
// It deliberately caches NOTHING: every page load comes fresh from
// GitHub, and all data still comes from the Apps Script server, so the
// app can never show an old version or old data. Its only job is to
// show a friendly message instead of Chrome's error page when the phone
// has no internet.
const OFFLINE_PAGE = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>السِجل</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:#f9f9ff;color:#161c27;font-family:Tahoma,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
.box{max-width:360px;background:#fff;border-radius:12px;border-top:6px solid #00362a;padding:28px 22px;
box-shadow:0 4px 12px rgba(22,28,39,.08)}.logo{width:84px;height:84px;margin:0 auto 14px;border-radius:50%;
box-shadow:0 4px 14px rgba(22,28,39,.15)}.logo svg{display:block}
h1{font-size:20px;margin:0 0 8px}p{margin:0 0 18px;color:#404945;line-height:1.7}
button{background:#00362a;color:#fff;border:0;border-radius:8px;padding:10px 26px;font-size:15px;font-family:inherit;cursor:pointer}</style>
</head><body><div class="box"><div class="logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="84" height="84" role="img" aria-label="O and Q interlocked monogram"><defs><radialGradient id="paper" gradientUnits="userSpaceOnUse" cx="256" cy="227.2" r="360.3"><stop offset="0" stop-color="#f1efe1"/><stop offset="0.45" stop-color="#e8e5cf"/><stop offset="1" stop-color="#d4d0af"/></radialGradient><mask id="cutO" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="480"><rect x="0" y="0" width="480" height="480" fill="#fff"/><path d="M 184 236 A 104 132 0 1 1 392 236 A 104 132 0 1 1 184 236 Z M 208 236 A 80 129 0 1 0 368 236 A 80 129 0 1 0 208 236 Z" fill="#000" stroke="#000" stroke-width="12" stroke-linejoin="round"/><rect x="0" y="236" width="480" height="244" fill="#fff"/></mask><mask id="cutQ" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="480"><rect x="0" y="0" width="480" height="480" fill="#fff"/><path d="M 88 236 A 104 132 0 1 1 296 236 A 104 132 0 1 1 88 236 Z M 112 236 A 80 129 0 1 0 272 236 A 80 129 0 1 0 112 236 Z" fill="#000" stroke="#000" stroke-width="12" stroke-linejoin="round"/><rect x="0" y="0" width="480" height="236" fill="#fff"/></mask></defs><!-- white rim --><circle cx="256" cy="256" r="256" fill="#ffffff"/><circle cx="256" cy="256" r="255.5" fill="none" stroke="#161616" stroke-opacity="0.07"/><!-- cream face --><circle cx="256" cy="256" r="240" fill="url(#paper)"/><!-- monogram --><g transform="translate(16 16)" fill="#161616"><path d="M 88 236 A 104 132 0 1 1 296 236 A 104 132 0 1 1 88 236 Z M 112 236 A 80 129 0 1 0 272 236 A 80 129 0 1 0 112 236 Z" mask="url(#cutO)"/><path d="M 184 236 A 104 132 0 1 1 392 236 A 104 132 0 1 1 184 236 Z M 208 236 A 80 129 0 1 0 368 236 A 80 129 0 1 0 208 236 Z" mask="url(#cutQ)"/><path d="M 266 346 C 300 360 338 384 376 404 C 334 398 298 382 266 346 Z"/></g></svg></div><h1>لا يوجد اتصال بالإنترنت</h1>
<p>تحقّق من الاتصال ثم أعد المحاولة.</p><button onclick="location.reload()">إعادة المحاولة</button></div></body></html>`;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  // Only page loads are touched; everything else (Google sign-in, the
  // Apps Script server, fonts) goes straight to the network as before.
  if (event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(() =>
      new Response(OFFLINE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))
  );
});
