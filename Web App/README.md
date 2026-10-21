# V8 Mini Mart - Web App (Frontend) 🛒

This folder contains the complete, standalone Frontend Web Application for **V8 Mini Mart**.
It is built with React 18, Vite, and Tailwind CSS, and is ready to be hosted on any **Cloud Storage / Static Website Hosting** platform.

---

## 📁 Folder Structure

```text
Web App/
├── src/                    # React components, pages, context, and styles
│   └── services/api.js     # Connects to your hosted live API
├── public/                 # Static assets, icons, logos, banners
├── index.html              # Main HTML entry point
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite build & server configuration
├── .env.example            # Example configuration
├── .env.production         # Live API URL configuration for cloud hosting
└── dist/                   # Production build output (Deploy this folder!)
```

---

## 🛠️ How to Run Locally

```bash
cd "Web App"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ How to Host on Cloud Storage Websites

### Step 1: Set Live API URL
Open `.env.production` and set your live API URL (obtained from your hosted `API` server on Render/Railway):
```env
VITE_API_BASE_URL=https://your-api-domain.onrender.com
```

### Step 2: Build for Production
Run:
```bash
npm run build
```
This will compile the entire web app into the `dist/` directory as pure, optimized static files (HTML, CSS, JS, images).

### Step 3: Deploy `dist/` to Cloud Storage

* **Cloudflare Pages / Vercel / Netlify (Drag & Drop or Git):**
  Upload the contents of the `dist/` folder, or connect your Git repository and set:
  * **Build Command:** `npm run build`
  * **Output Directory:** `dist`

* **GitHub Pages:**
  Push this repository to GitHub. The GitHub Actions workflow will automatically build and publish to `https://<username>.github.io/<repo-name>/`.

* **Firebase Hosting / AWS S3 / Google Cloud Storage:**
  Upload all files inside `dist/` directly into your public bucket or hosting site.
