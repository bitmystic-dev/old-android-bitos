#  BitOS Android (Building Instructions)

Use this command to update only the changed files in the directory (faster apk building process whenever any new version of code is pushed to github)

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

Or just download ZIP from GitHub. (using Git and git pull is strongly recommended if you are a long time supporter)

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

Install Capacitor (Do this always after using git pull):

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
Package ID: com.bitmysticdev.bitos
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

make sure to use "Find" feature and find:

```bash
<?xml version="1.0" encoding="UTF-8">
```
there will be comments above this in a few files. Do remove them (if it shows red line but for safety we'll do otherwise the apk build fails)

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


