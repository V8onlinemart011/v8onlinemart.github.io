# 🚀 ការណែនាំអំពីការបែងចែក ២ Folders សម្រាប់ Hosting (V8 Mini Mart)

ប្រព័ន្ធទាំងមូលត្រូវបានបែងចែកជា **២ Folders ដាច់ដោយឡែកពីគ្នា 100%**៖
1. **Folder "API"** សម្រាប់ Hosting លើ Cloud Server (ដូចជា Render.com, Railway.app) សម្រាប់ឱ្យភ្ញៀវ និង Admin ប្រើប្រាស់។
2. **Folder "Web App"** សម្រាប់ដាក់ចូល Cloud Storage Website (ដូចជា GitHub Pages, Cloudflare Pages, Vercel, Netlify)។

---

## ⚡ គោលការណ៍ Cloud Storage សំខាន់ (គ្មានការផ្ទុករូបភាពក្នុង API ឡើយ)

> 💡 **ចំណុចពិសេស:** File API និង File Admin **មិនមានតួនាទីផ្ទុក ឬរក្សាទុករូបភាពលើ Disk ក្នុង Folder API ឡើយ!**
> 
> * រាល់រូបភាពទំនិញទាំងអស់ ត្រូវបានទាញចេញពី **Web App Cloud Storage Website** (តាមរយៈ URL `WEB_APP_STORAGE_URL`) ឬ **Cloudinary Cloud Storage**។
> * រាល់ពេល Admin ធ្វើការ Upload រូបភាពថ្មី រូបភាពត្រូវបានបញ្ជូនត្រង់ទៅរក្សាទុកក្នុង Cloud Storage (Cloudinary) ដោយស្វ័យប្រវត្ត ហើយ API គ្រាន់តែរក្សាទុក Cloud URL (`https://res.cloudinary.com/...`) ប៉ុណ្ណោះ។

---

## 📂 រចនាសម្ព័ន្ធបែងចែក Folder ទាំងពីរ

```text
d:/Tools/Website/
│
├── 📂 API/                    ─── [សម្រាប់ Hosting លើ GitHub / Cloud Server អោយភ្ញៀវប្រើ]
│   ├── 📂 guest/              # 👤 APIs សម្រាប់ភ្ញៀវទូទៅ (Products, Categories, Order, Tracking)
│   │   ├── guestRoutes.js     # Routes: /api/guest/...
│   │   └── guestController.js # Logic សម្រាប់ភ្ញៀវ
│   │
│   ├── 📂 admin/              # 🔐 APIs សម្រាប់ Admin គ្រប់គ្រងហាង
│   │   ├── adminRoutes.js     # Routes: /api/admin/...
│   │   └── adminController.js # Logic សម្រាប់ Admin, ស្តុក, និង Upload ទៅ Cloud
│   │
│   ├── 📂 config/             # ⚙️ Cloud Storage & Database Config
│   │   ├── storageUrl.js      # កំណត់ទាញរូបភាពពី Web App Cloud Storage
│   │   ├── cloudinary.js      # Streaming Upload ទៅ Cloudinary (No disk storage)
│   │   └── database.js        # Sync ទិន្នន័យពី Web App Storage
│   │
│   ├── server.js              # Express REST API Server + Live Status Dashboard
│   ├── package.json           # Dependencies សម្រាប់ Server
│   ├── .env                   # កូនសោរ Cloudinary & WEB_APP_STORAGE_URL
│   ├── .env.example           # គំរូសម្រាប់ Cloud Hosting
│   ├── render.yaml            # 1-Click Deploy សម្រាប់ Render.com
│   ├── Procfile               # Config សម្រាប់ Railway / Heroku
│   └── README.md              # ការណែនាំ API
│
└── 📂 Web App/                ─── [សម្រាប់ដាក់ចូល Cloud Storage Website]
    ├── src/                   # React Frontend Code (UI, Pages, Context)
    │   └── services/api.js    # កូដភ្ជាប់ទៅកាន់ Live API Server
    ├── public/                # Assets, Icons, Logos, Banners
    ├── index.html             # HTML មេ
    ├── package.json           # Frontend Dependencies
    ├── vite.config.js         # Config Vite
    ├── .env.production        # កំណត់ Live API URL
    ├── .env.example           # គំរូ Config
    ├── dist/                  # 🌟 Folder កូដ Build រួច (Upload ទៅ Cloud Storage)
    └── README.md              # ការណែនាំ Hosting Web App
```

---

## 🎯 ផ្នែកទី ១៖ របៀប Hosting Folder "API" (ភ្ញៀវ និង Admin)

1. **Push Folder "API" ទៅកាន់ GitHub**។
2. ចូលទៅកាន់ **[Render.com](https://dashboard.render.com)** (ឬ **Railway.app**) ➔ ចុច **New +** ➔ **Web Service**។
3. ភ្ជាប់ GitHub Repository របស់អ្នក រួចកំណត់៖
   * **Root Directory:** `API`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
   * **Environment Variables:**
     * `CLOUDINARY_URL` = តម្លៃពី `API/.env`
     * `WEB_APP_STORAGE_URL` = `https://v8onlinemart011.github.io/v8onlinemart.github.io` (ឬ URL របស់ Web App)
     * `CORS_ORIGIN` = `*`
4. ចុច **Create Web Service**។
5. អ្នកនឹងទទួលបាន Public Live URL (ឧ. `https://v8-mart-api.onrender.com`):
   * ភ្ញៀវបើកមើល Dashboard Status តាម Browser៖ `https://v8-mart-api.onrender.com/`
   * Guest APIs: `https://v8-mart-api.onrender.com/api/guest/products`
   * Admin APIs: `https://v8-mart-api.onrender.com/api/admin/products`

---

## 🎯 ផ្នែកទី ២៖ របៀបដាក់ Folder "Web App" លើ Cloud Storage Website

1. បើក File `Web App/.env.production` រួចកំណត់ Live API URL:
   ```env
   VITE_API_BASE_URL=https://v8-mart-api.onrender.com
   ```
2. ដំណើរការ Build ក្នុង `Web App`:
   ```bash
   cd "Web App"
   npm run build
   ```
3. Folder **`Web App/dist/`** នឹងបង្កើតឡើងដែលមានតែ Pure Static Files (HTML, CSS, JS)។
4. Upload មាតិកាក្នុង Folder **`dist/`** ទៅកាន់ Cloud Storage Website ណាមួយក៏បាន (GitHub Pages, Cloudflare Pages, Vercel, Netlify, AWS S3)។

---

## 💻 របៀប Run ធ្វើតេស្តក្នុងកុំព្យូទ័រ (Local Test)

* **ដំណើរការ API Server:**
  ```bash
  cd API
  npm start
  ```
  *(ដំណើរការលើ: [http://localhost:5000](http://localhost:5000))*

* **ដំណើរការ Web App:**
  ```bash
  cd "Web App"
  npm run dev
  ```
  *(ដំណើរការលើ: [http://localhost:3000](http://localhost:3000))*
