# سِجل الأُنس — Setup guide (GitHub Pages + Apps Script)

The app is now split in two:

| File | Lives in | What it does |
|---|---|---|
| `index.html` | **GitHub** (GitHub Pages) | The page people open. Shows a "Sign in with Google" button, then asks the backend for this person's data. Contains **no** data, emails or PIN. |
| `Code.gs` | **Apps Script only** | The backend. Checks each Google sign-in is genuine, applies your email rules, reads/writes your sheets **as you**. |

> ⚠️ **Never upload `Code.gs` to GitHub.** On a free GitHub account the repository is public, and `Code.gs` contains your admin PIN and every allowed-email list. Only `index.html` (and this README) go to GitHub.

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
2. At the top of `Code.gs`, fill in:
   ```js
   const GOOGLE_CLIENT_ID = "....apps.googleusercontent.com";   // from Step 2
   const SITE_URL = "https://YOUR_GITHUB_USERNAME.github.io/sijil/"; // from Step 1
   ```
3. **Recommended:** change `ITEMS_ADMIN_PIN` from `"9090"` to something longer (6+ digits). The backend locks an account out for 15 minutes after 5 wrong PINs, but a longer PIN is still safer.
4. **Save** (💾).
5. In the function dropdown at the top, choose **`setupCheck`** → **Run**.
   - Google asks you to approve permissions → choose your account → **Advanced → Go to … (unsafe) → Allow**.
     This screen is **only for you**, once. Your staff will never see it.
   - Open **Execution log**. You want: `✓ Everything looks good.` If you see `✗` lines, fix what they say and run it again.
6. **Deploy → New deployment** → ⚙️ → **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   - **Deploy**, then copy the **Web app URL** (starts with `https://script.google.com/macros/s/`, ends with `/exec`).
7. The old `index` HTML file in the Apps Script project is no longer used. You can delete it.

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
3. Send staff the **new** link. Tell them: *open it in Chrome or Safari, not inside WhatsApp*. (If they do open it inside WhatsApp, the page itself shows them how to switch.)

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
| Who can see what | Same as before: the admin panel in the app, or the **Items** / **Access** tabs in the settings spreadsheet. No redeploy needed. |

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

## What stayed the same

- Every email rule: items, the two dashboards and the contact buttons, plus the admin panel with its permissions matrix.
- The **Items**, **Access** and **Contacts** tabs, and the contact log tab in Main.
- The page's look, and everything on it.
