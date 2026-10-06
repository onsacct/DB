# سِجل الأُنس — Setup guide (GitHub Pages + Apps Script)

The app is now split in two:

| File | Lives in | What it does |
|---|---|---|
| `index.html` | **GitHub** (GitHub Pages) | The page people open. Shows a "Sign in with Google" button, then asks the backend for this person's data. Contains **no** data or email lists. |
| `Code.gs` | **Apps Script only** | The backend. Checks each Google sign-in is genuine, applies your email rules, reads/writes your sheets **as you**. |
| `Setup.gs` | **Apps Script, once** | Copies the old built-in lists into the settings spreadsheet the first time. Delete it afterwards. |
| `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | **GitHub**, next to `index.html` | Make the site installable as a phone app and let it be packaged as an Android APK (see **Phone app and Android APK** below). No data in them. |

**Where your data lives:** everything — items, who's allowed to see what, the WhatsApp messages, the class list and the admins — is in the settings spreadsheet (**سِجل الأُنس - إعدادات الأصناف**), in five tabs: **Items**, **Access**, **Templates**, **Classes**, **Admins**. None of it is written inside the code any more.

> ⚠️ **Never upload `Code.gs` or `Setup.gs` to GitHub.** On a free GitHub account the repository is public, and `Setup.gs` contains email lists. Only `index.html`, the app files (`manifest.json`, `sw.js`, the four icons) and this README go to GitHub.

Total time: about 30 minutes, once.

---

## Step 1 — Create the GitHub site (5 min)

1. Sign in at [github.com](https://github.com) and click **New repository**.
2. Name it, for example `sijil`. Leave it **Public** (required for free GitHub Pages). Click **Create repository**.
3. In the new repository: **Settings → Pages**.
   - **Source:** Deploy from a branch
   - **Branch:** `main` and `/ (root)` → **Save**

   (If "main" isn't offered yet, do Step 4's upload first, then come back.)
4. Your site address will be:
   `https://YOUR_GITHUB_USERNAME.github.io/sijil/`
   Write it down — you need it in Steps 2 and 3.

## Step 2 — Get a Google Client ID (10 min)

Do this signed in as the Google account that owns the Apps Script project.

1. Open **[console.cloud.google.com/auth/clients](https://console.cloud.google.com/auth/clients)**. If asked, create a project (any name, e.g. `sijil`).
2. If you see **Get started** (first time only), fill in:
   - **App name:** سِجل الأُنس
   - **User support email:** your email
   - **Audience:** External
   - **Contact email:** your email
   - Agree → **Create**
   - **Leave the logo empty** — adding one can trigger an extra Google review.
3. Go to **Clients → Create client**:
   - **Application type:** Web application
   - **Name:** sijil
   - **Authorized JavaScript origins → Add URI:** `https://YOUR_GITHUB_USERNAME.github.io`
     (exactly this — `https://`, your username, `.github.io`, **no** slash or `/sijil` at the end)
   - **Create**, then copy the **Client ID** (ends with `.apps.googleusercontent.com`).
4. **Do not click "Publish app".** Leave the app in **Testing**. Because it only uses *Sign in with Google* (name and email), Google lets **any** Google account sign in while it's in Testing: no test-user list, no "unverified app" warning, and no 7-day expiry. Publishing would only add requirements (home page, privacy policy) that this app doesn't need.

## Step 3 — Update Apps Script (10 min)

1. Open your Apps Script project. Replace **everything** in `Code.gs` with the new `Code.gs`.
   Then add the one-time helper: **＋ (Files) → Script**, name it `Setup`, and paste in `Setup.gs`.
2. At the top of `Code.gs`, fill in:
   ```js
   const GOOGLE_CLIENT_ID = "....apps.googleusercontent.com";   // from Step 2
   const SITE_URL = "https://YOUR_GITHUB_USERNAME.github.io/sijil/"; // from Step 1
   ```
3. **Save** (💾).
4. In the function dropdown at the top, choose **`setupCheck`** → **Run**.
   - Google asks you to approve permissions → choose your account → **Advanced → Go to … (unsafe) → Allow**.
     This screen is **only for you**, once. Your staff will never see it.
   - If the **Admins** tab is empty, it adds **you** (the account running it) as the first **Level 1** admin.
   - Open **Execution log**. It lists what it did: which settings tabs it filled from `Setup.gs` (it **never** overwrites a tab that already has data) and that automatic refresh is on. You want: `✓ Everything looks good.` If you see `✗` lines, fix what they say and run it again.
   - Once it says ✓, you can delete the `Setup` file (⋮ next to it → Delete). It's only needed once.
5. **Deploy → New deployment** → ⚙️ → **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   - **Deploy**, then copy the **Web app URL** (starts with `https://script.google.com/macros/s/`, ends with `/exec`).
6. The old `index` HTML file in the Apps Script project is no longer used. You can delete it.

## Step 4 — Fill in and upload `index.html` (5 min)

1. Open `index.html` in any text editor. Near the top of the first `<script>`, fill in the two settings:
   ```js
   const API_URL = "https://script.google.com/macros/s/..../exec";     // from Step 3
   const GOOGLE_CLIENT_ID = "....apps.googleusercontent.com";           // same as in Code.gs
   ```
2. In your GitHub repository: **Add file → Upload files** → drop in `index.html` (and this `README.md` if you like) → **Commit changes**.
3. Wait about a minute, then open your site address from Step 1.

## Step 5 — Test, then share the new link

1. Open the site on your computer and sign in. Check you see what you expect.
2. Open it on a phone **in Chrome or Safari** and sign in.
3. Send staff the **new** link.

## Step 6 — Clean-up (after everyone is using the new link)

- **Old link:** Apps Script → **Deploy → Manage deployments** → select the **old** deployment ("Execute as: User accessing…") → **Archive**.
- **Settings spreadsheet** ("سِجل الأُنس - إعدادات الأصناف"): **Share → General access → Restricted**. It held every allowed-email list and no longer needs to be open to anyone with the link.
- **Main spreadsheet:** staff no longer need access to it for the dashboards or contact buttons to work. Only keep sharing it with people who open the sheet itself from the catalog.

---

## Making changes later

| You changed… | Do this |
|---|---|
| `Code.gs` | **Deploy → Manage deployments** → ✏️ on the *new* deployment → **Version: New version** → **Deploy**. The URL stays the same. (Saving alone does **not** update the live app.) |
| `index.html` | Edit it on GitHub (✏️ icon on the file) → **Commit changes**. Live in about a minute. |
| Who can see what | The control panel in the app (the ⚙ لوحة التحكم button at the top of the page — admins only), or the **Items** / **Access** tabs in the settings spreadsheet. |
| Google file sharing for an item | The item's **مشاركة الملف** setting (Items tab column `shareAs`): `viewer`, `editor` or `none`. Empty = `viewer`. |
| Who is an admin | Level 1 admins: control panel → **المشرفون** tab. Or the **Admins** tab in the settings spreadsheet (`email`, `level` 1–3). |
| WhatsApp messages | The **Templates** tab: `id`, `label` (shown in the menu), `text`. Use `{name}`, `{absences}`, `{totalWeeks}` where the student's details should go. |
| Class names or order | The **Classes** tab: `code` (= the tab name in Main, e.g. `02`), `name`. Row order = order on the site. |

None of these need a redeploy, and changes show on the next page load (see below).

## Admins and levels (no PIN)

The ⚙ **لوحة التحكم** button (top of the page, in the header) appears only for emails on the **Admins** list. Every action is checked again on the server against the signed-in email, so hiding the button isn't the only protection.

| Level | Can do |
|---|---|
| **1** | Everything, including adding admins, changing their level and removing them. |
| **2** | Everything except managing admins. |
| **3** | Edit existing items and their permissions. **Can't** add new items, and **can't** change who gets the call/WhatsApp buttons (that column is locked). |

There must always be at least one Level 1 admin — the panel and the server both refuse a change that would leave none. Admins can always sign in, even if they're on no other list.

## Google file sharing

Ticking someone for an item only shows them its **link** on the site. If that link is a **Google Sheet**, Google also needs the file itself shared with them, otherwise it refuses to open it. The control panel handles this:

- **When you save:** every spreadsheet item you just added people to is shared with them automatically, as **view** or **edit** depending on the item's **مشاركة الملف** setting (or not at all if it's set to "بدون مشاركة تلقائية"). The panel shows what was shared.
- **When you remove someone:** their access to the file is **not** removed automatically (they may need it for other reasons). The panel lists them with a **إزالة وصولهم للملف** button so you decide.
- **المشاركة tab → 🔍 فحص مشاركة الملفات:** checks every spreadsheet item and lists who on the list is missing access (with a share button) and who has access but isn't on the list (with a remove button).
- The script only ever shares a file with people **on that item's list**, and never removes you or the file's owner.
- It can only share files you own or can edit. If not, the panel says it couldn't open the file.

**No sharing is ever needed for:** Google Forms (answering them), the attendance and statistics dashboards, the call/WhatsApp buttons, or admins. All of those run through the script.

## Speed: how the server memory works

- **Settings** (items, access lists, messages, classes) are kept in the server's memory *and* in a permanent copy inside the script. Every sign-in and every permission check uses that copy — it never opens the sheet.
- The sheet is read only when it **changes**: when an admin saves the control panel (including adding a new item or changing admins), when anyone edits the settings spreadsheet by hand, or when you press **🔄 تحديث البيانات**. The fresh copy is stored straight away, so the next visitor is fast too.
- **Attendance data** (class tabs, Contacts in Main) is kept in memory too. It refreshes automatically when anyone edits Main or a form is submitted into it, and at least every 30 minutes.
- If something still looks out of date (for example, Main was changed by another script or a formula), open the control panel and press **🔄 تحديث البيانات**.

## Phone app and Android APK

Upload these files to the **same GitHub repository, in the same folder as `index.html`**: `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`. Then open `https://onsacct.github.io/DB/manifest.json` — if you see the app name, they're live.

Nothing changes in Apps Script or Google Cloud: the app opens the same address, so sign-in and every email rule work exactly as on the site. When you update `index.html` on GitHub, the app picks up the change by itself — no new APK is needed (only to change the app's name or icon).

### Easiest: install straight from Chrome (no APK file)
- **Android:** open the site in Chrome → **⋮** → **Install app** (or **Add to Home screen**) → **Install**. Chrome builds a real app for that phone: an icon in the app drawer that opens full screen, without an address bar.
- **iPhone:** Safari → **Share** → **Add to Home Screen**. Try sign-in once on an iPhone; if it doesn't complete from the home-screen icon, iPhone users simply keep using the site in Safari.

### An APK file (to send to people, or for Google Play)
1. Go to **[pwabuilder.com](https://www.pwabuilder.com)**, paste `https://onsacct.github.io/DB/` and press **Start**.
2. **Package for stores → Android → Generate package.** In the options:
   - **Package ID:** for example `io.github.onsacct.sijil` (never change it later).
   - **App name / Short name:** السِجل ولوحة المعلومات / السِجل.
   - **Fallback behavior:** keep **Custom Tabs** — *not* WebView. Google blocks sign-in inside a WebView.
   - **Signing key:** Create new.
3. Download the zip. It holds:
   - the **`.apk`** — the file you install or send;
   - the **`.aab`** — only for uploading to Google Play;
   - **`signing.keystore`** and **`signing-key-info.txt`** — keep both somewhere safe and private (not on GitHub). Every future version must be signed with them; if they're lost, the app can't be updated;
   - **`assetlinks.json`** — for the next step.
4. **Remove the address bar** (optional, 5 min). Without this the app works, but shows a thin address bar at the top.
   1. On GitHub create a new **public** repository named exactly **`onsacct.github.io`**.
   2. Add the file `assetlinks.json` from the zip at the path **`.well-known/assetlinks.json`** (type `.well-known/assetlinks.json` as the file name when creating it, then paste its contents).
   3. Add an empty file named **`.nojekyll`** (without it GitHub hides the `.well-known` folder).
   4. **Settings → Pages →** Deploy from a branch, `main`, `/ (root)`.
   5. Check that `https://onsacct.github.io/.well-known/assetlinks.json` opens. The site at `/DB/` is not affected.
5. **Install it.** Send the `.apk` (WhatsApp, Drive, email). On the phone, open it and allow **Install unknown apps** for the app it was opened from, when Android asks.
   - **Google Play instead:** a developer account costs a one-time US$25. Upload the `.aab`. Play re-signs the app with its own key, so copy the **SHA-256** from Play Console → **App integrity → App signing** and add it as a second fingerprint in `assetlinks.json`, or the address bar comes back for Play installs.

## Troubleshooting

| What you see | Cause and fix |
|---|---|
| **"لم يكتمل الإعداد…"** | The two settings in `index.html` aren't filled in (Step 4). |
| Google error **`origin_mismatch`**, or no sign-in button | The **Authorized JavaScript origin** must be exactly `https://YOUR_GITHUB_USERNAME.github.io`. After changing it, wait a few minutes. |
| **"استجابة غير متوقعة من الخادم…"** | `API_URL` is wrong (must end with `/exec`, not `/dev`), or the deployment isn't set to **Who has access: Anyone**. |
| Sign-in works, then **"…(token is for a different app)"** | `GOOGLE_CLIENT_ID` in `Code.gs` and `index.html` don't match, or you edited `Code.gs` without deploying a **New version**. |
| **"…(GOOGLE_CLIENT_ID is not set in Code.gs)"** | Fill it in at the top of `Code.gs`, then deploy a **New version**. |
| Someone sees only one or two items | They signed in with a different Gmail than the one on your list. Their email shows at the top of the page; they tap **تبديل الحساب** (switch account). |
| **"انتهت الجلسة…"** | Normal: a Google sign-in lasts about an hour. They tap the button again and carry on where they were. |
| A change in the sheet doesn't show on the site | Control panel → **🔄 تحديث البيانات**, then reload. If it keeps happening, run `setupCheck` again (it reinstalls the automatic refresh). |
| You don't see the ⚙ button | Your email isn't in the **Admins** tab (or you're signed in with another account — check the email at the top of the page). |
| A whole section disappeared for everyone | Its row in the **Access** tab is missing or its list is empty. An empty list means *nobody* (unless **public** is TRUE). |
| The bottom of the site doesn't show the latest **إصدار الخادم** | The new `Code.gs` isn't deployed yet: **Deploy → Manage deployments → ✏️ → New version → Deploy**. |

## What stayed the same

- Every email rule: items, the two dashboards and the contact buttons, plus the control panel with its permissions matrix. Emails that aren't on any list can't get in at all.
- The **Items**, **Access** and **Contacts** tabs, and the contact log tab in Main.
- The page's look, and everything on it.
