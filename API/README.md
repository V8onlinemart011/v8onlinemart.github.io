# V8 Mini Mart - Standalone REST API Server 🚀

ប្រព័ន្ធ Backend API Server នេះត្រូវបានរៀបចំឡើងជាលក្ខណៈ **Modular Architecture** ដោយបែងចែកជា ២ ផ្នែកដាច់ដោយឡែកពីគ្នា គឺ **Guest APIs (សម្រាប់ភ្ញៀវ)** និង **Admin APIs (សម្រាប់ Admin)**។

---

## ⚡ គោលការណ៍ Cloud Storage សំខាន់ (No Local Images)

> 💡 **សំគាល់ច្បាស់:** File API និង File Admin **មិនមានតួនាទីផ្ទុក ឬរក្សាទុករូបភាពលើ Disk ក្នុង Folder API ឡើយ!**
> 
> * រាល់រូបភាពទំនិញទាំងអស់ត្រូវបានទាញចេញពី **Web App Cloud Storage Website** (តាមរយៈ URL `WEB_APP_STORAGE_URL`) ឬ **Cloudinary CDN**។
> * រាល់ពេល Admin ធ្វើការ Upload រូបភាពថ្មី រូបភាពនឹងត្រូវ Stream ផ្ទាល់ពី Memory ទៅកាន់ Cloud Storage (Cloudinary) ដោយមិនមានការបង្កើត File រូបភាពក្នុងម៉ាស៊ីន API ឡើយ។

---

## 📂 រចនាសម្ព័ន្ធ Folder API

```text
API/
├── 📂 guest/                  ─── [APIs សម្រាប់ភ្ញៀវទូទៅ (Storefront & Clients)]
│   ├── guestRoutes.js         # Routes: /api/guest/products, /api/guest/orders...
│   └── guestController.js     # Logic សម្រាប់បង្ហាញទំនិញ និងទទួលការកុម្ម៉ង់
│
├── 📂 admin/                  ─── [APIs សម្រាប់ Admin គ្រប់គ្រងហាង]
│   ├── adminRoutes.js         # Routes: /api/admin/products, /api/admin/upload...
│   └── adminController.js     # Logic សម្រាប់ស្តុក, បន្ថែមទំនិញ, និង Cloud Upload
│
├── 📂 config/                 ─── [ការកំណត់ប្រព័ន្ធ & Cloud Storage]
│   ├── storageUrl.js          # បម្លែង URL រូបភាពទៅកាន់ Web App Cloud Storage
│   ├── cloudinary.js          # Cloudinary In-Memory Streaming Upload (No disk write)
│   └── database.js            # Sync ទិន្នន័យពី Web App Storage & format ទំនិញ
│
├── server.js                  # Main Express Server
├── package.json               # Backend Dependencies
├── .env                       # កូនសោរ Cloudinary & WEB_APP_STORAGE_URL
├── .env.example               # គំរូ Environment Variables
├── render.yaml                # 1-Click Deploy សម្រាប់ Render.com
└── Procfile                   # Deploy សម្រាប់ Railway / Heroku
```

---

## 🌐 Endpoints ដែលបានបែងចែក

### ១. ផ្នែកសម្រាប់ភ្ញៀវទូទៅ (Guest APIs)
* `GET /api/guest/products` — ទាញយកបញ្ជីទំនិញ (រូបភាពភ្ជាប់ទៅ Web App Storage ដោយស្វ័យប្រវត្ត)
* `GET /api/guest/products/:id` — មើលព័ត៌មានលម្អិតទំនិញ
* `GET /api/guest/categories` — ប្រភេទមុខទំនិញ
* `POST /api/guest/orders` — កុម្ម៉ង់ទិញទំនិញ (កាត់ស្តុកស្វ័យប្រវត្ត)
* `GET /api/guest/orders/:id` — តាមដានស្ថានភាព Order
* `GET /api/guest/health` — ពិនិត្យសុខភាព API

### ២. ផ្នែកសម្រាប់ Admin (Admin APIs)
* `GET /api/admin/products` — មើលបញ្ជីទំនិញទាំងអស់ក្នុងស្តុក (រួមទាំងថ្លៃដើម Cost Price)
* `POST /api/admin/products` — បន្ថែមទំនិញថ្មី
* `PUT /api/admin/products/:id` — កែប្រែទំនិញ និងចំនួនស្តុក (Stock In / Stock Out)
* `DELETE /api/admin/products/:id` — លុបទំនិញ
* `GET /api/admin/orders` — មើលបញ្ជី Order ទាំងអស់
* `PUT /api/admin/orders/:id/status` — ប្តូរស្ថានភាព Order & Assign Rider
* `POST /api/admin/upload` — Upload រូបភាពចូល Cloud Storage ផ្ទាល់ (Stream ចូល Cloudinary)
* `GET /api/admin/dashboard` — របាយការណ៍សង្ខេបចំណូល និងទំនិញជិតអស់ពីស្តុក
* `GET /api/admin/stock-movements` — ប្រវត្តិប្រែប្រួលស្តុកទំនិញ

---

## 🛠️ របៀប Run ធ្វើតេស្តក្នុងកុំព្យូទ័រ
```bash
cd API
npm install
npm start
```
* **Status Dashboard:** `http://localhost:5000/`
* **Guest API:** `http://localhost:5000/api/guest/products`
* **Admin API:** `http://localhost:5000/api/admin/products`
