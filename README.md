# CodeToolkit - Production-Ready Firebase Web Application

CodeToolkit is a responsive developer code library, snippet manager, and developer toolkit built on **Firebase Authentication** and **Firebase Realtime Database**. Designed as a pure client-side static web application, it deploys seamlessly to **GitHub Pages** with client-side hash routing, real-time live synchronization, syntax highlighting, and database-level security rules.

---

## 1. Project Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Prism.js Syntax Highlighter.
- **Routing**: GitHub Pages-compatible SPA Hash Routing (`#/`, `#/login`, `#/code/:id`, `#/admin`, `#/admin/add`, `#/admin/edit/:id`, `#/admin/manage`, `#/admin/users`, `#/admin/settings`).
- **Backend & Database**: Firebase Authentication + Firebase Realtime Database (RTDB).
- **Security**: Granular Firebase Security Rules (`firebase-rules.json`) strictly enforcing server-side role validation.

---

## 2. Firebase Database Structure

```
users/
  {userId}/
    name: string
    email: string
    role: "user" | "admin"
    createdAt: number
    status: "active" | "suspended"

admins/
  {userId}/
    email: string
    role: "admin"
    status: "active" | "suspended"

codes/
  {codeId}/
    title: string
    description: string
    code: string
    language: string
    category: string
    version: string
    tags: string[]
    status: "published" | "draft"
    createdAt: number
    updatedAt: number
    createdBy: string
    creatorEmail: string
    views: number
```

---

## 3. Firebase Security Rules (`firebase-rules.json`)

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "admins": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "codes": {
      ".read": true,
      ".indexOn": ["status", "category", "language", "updatedAt"],
      "$codeId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'",
        "views": {
          ".write": true
        }
      }
    }
  }
}
```

---

## 4. Setup & Deployment Guide

### Step 1: Firebase Project Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select or create your project: `veloralbillal`.

### Step 2: Enable Email/Password Authentication
1. Navigate to **Build > Authentication > Sign-in method**.
2. Click **Email/Password** and toggle **Enable**.
3. Save changes.

### Step 3: Create & Configure Realtime Database
1. Navigate to **Build > Realtime Database**.
2. Click **Create Database** in your preferred region.
3. Switch to the **Rules** tab, paste the contents of `firebase-rules.json`, and click **Publish**.

### Step 4: Configure Demo Admin Account
1. In Firebase Console, go to **Authentication > Users** tab.
2. Click **Add user** and enter:
   - **Email:** `admin@codetoolkit.demo`
   - **Password:** `Admin@123456`
3. Copy the created user's **UID**.
4. Go to **Realtime Database > Data** tab.
5. Create a node under `admins/{COPIED_UID}` with the following data:
   ```json
   {
     "email": "admin@codetoolkit.demo",
     "role": "admin",
     "status": "active"
   }
   ```
6. Sign in with these credentials on the app's login page to access the Admin Panel.

### Step 5: Test Locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to browse snippets and test the application.

### Step 6: Deploy to GitHub Pages
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CodeToolkit"
   git remote add origin https://github.com/your-username/codetoolkit.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings > Pages**.
3. Under **Build and deployment**, select **GitHub Actions** or choose your deployment branch (e.g. `main` or `gh-pages`).

### Step 7: Add GitHub Pages to Firebase Authorized Domains
1. Go to **Firebase Console > Authentication > Settings > Authorized domains**.
2. Click **Add domain**.
3. Enter your GitHub Pages domain:
   ```
   your-username.github.io
   ```
4. Click **Save**.

---

## 5. Key Features

- **Responsive Design**: Tested from 320px mobile to 4K ultra-wide screens.
- **Client-Side Real-time Search**: Search by title, description, category, language, tags, or code content.
- **Syntax Highlighting**: Supports 14+ languages (HTML, CSS, JS, TS, Python, PHP, Java, C, C++, SQL, Bash, JSON, XML, Markdown).
- **One-Click Tools**: Copy code, download snippet as native file type (`.html`, `.py`, `.js`, etc.), live runner preview.
- **Admin Dashboard**: Realtime statistics, snippet publishing form, draft management, and users list.
- **Zero Backend Required**: Runs directly in the browser with Firebase Modular SDK v11.
