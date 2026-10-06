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
background:#EFE9D6;color:#2A2418;font-family:Tahoma,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
.box{max-width:340px}.seal{width:64px;height:64px;margin:0 auto 16px;border-radius:50%;border:3px solid #B4872B;
display:flex;align-items:center;justify-content:center;font-size:30px;color:#B4872B;background:#1F3B32}
h1{font-size:20px;margin:0 0 8px}p{margin:0 0 18px;color:#5B5340;line-height:1.7}
button{background:#1F3B32;color:#EFE9D6;border:0;border-radius:999px;padding:10px 26px;font-size:15px;font-family:inherit}</style>
</head><body><div class="box"><div class="seal">أ</div><h1>لا يوجد اتصال بالإنترنت</h1>
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
