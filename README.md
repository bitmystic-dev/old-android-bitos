#  BitOS Android (Building Instructions)

Use this to update only the changed files in the directory (faster building process)

```bash
git pull
```
---

# 1. Download / Clone the GitHub Repo

On your PC:

```bash
git clone YOUR_GITHUB_REPO_URL
cd your-project
```

Or just download ZIP from GitHub.

---

# 2. Install Node.js

Install:

* Node.js LTS
* Git
* Android Studio

Use official sites:

* [Node.js](https://nodejs.org?utm_source=chatgpt.com)
* [Android Studio](https://developer.android.com/studio?utm_source=chatgpt.com)
* [Git](https://git-scm.com?utm_source=chatgpt.com)

---

# 3. Install Dependencies

Inside project folder:

```bash
npm install
```

---

# 4. Run Website Locally

```bash
npm run dev
```

Make sure BitOS fully works first.

Especially check:

* Firebase auth
* Habits sync
* Tasks sync
* Mobile responsiveness
* Sidebar
* Planner
* Themes

---

# 5. Convert Website Into Android App (Capacitor)

Install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

Initialize:

```bash
npx cap init
```

Example:

```bash
App Name: BitOS
Package ID: com.bitmystic.bitos
```

---

# 6. Build the Website

```bash
npm run build
```

This creates the production web files.

Usually inside:

```bash
dist/
```

---

# 7. Add Android Platform

```bash
npx cap add android
```

---

# 8. Sync Capacitor

```bash
npx cap sync
```

This copies your web app into Android.

---

# 9. Open Android Studio

```bash
npx cap open android
```

Android Studio opens automatically.

---

# 10. Build APK

Inside Android Studio:

## Build APK

Top bar:

```text
Build → Build APK(s)
```

OR

```text
Build → Generate Signed Bundle/APK
```


