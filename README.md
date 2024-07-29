# SWE_Group_14

This project aims to build a comprehensive booking system for a service marketplace, connecting customers with local service providers. The key features include account creation for customers and businesses, service searches, profile views, reviews, booking appointments, managing availability, and responding to customer reviews. The system ensures only available time slots can be booked and personalizes the information based on the user's role. The project is structured into client-side and server-side directories, each organized to maintain a clean and manageable codebase.

Google Drive documentation can be viewed here: https://drive.google.com/drive/folders/1Dupu0u9eok5X5bfg0LITFOGVpfv8i3kn

###  ☝️ .env file in the `server` folder

You should create a .env file in the server folder.

```
NODE_ENV = development
DB_URL = YourMongoDBURL
API_PREFIX = /api/v1.0.0/
AUTH_SECRET = YourSecretStringForAPILike-----KvKiA2mMjxGO25Diiibz
API_PORT = 3000

CLIENT_URL = http://localhost:3001/

NODEMAILER_HOST = YourMailServer
NODEMAILER_PORT = 465
NODEMAILER_SECURE = true
NODEMAILER_SENDERNAME = YourName
NODEMAILER_USER = YourMailAddress
NODEMAILER_PASS = YourPassword
```

###  ☝️ .env file in the `admin` folder

You should create a .env file in the admin folder.

```
VITE_API_ENDPOINT=http://localhost:3000/api/v1.0.0/
VITE_API_DOMAIN=http://localhost:3000/
```

###  ☝️ .env file in the `client` folder

You should create a .env file in the `client` folder.

```
VITE_API_ENDPOINT=http://localhost:3000/api/v1.0.0/
VITE_API_ENDPOINTHOST=http://localhost:3000/
```

### 🛠️ How to run the project

```
cd server
yarn install
nodemon server.js

cd admin
yarn install
yarn dev

cd client
yarn install
yarn dev

```

# Project Structure

The server-side code is organized into classes, config, controllers, and other essential directories. The structure is as follows:

```
server/
├── classes/
├── config/
├── controllers/
├── logs/
├── middlewares/
├── models/
├── node_modules/
├── routes/
├── seeder/
├── uploads/
├── utils/
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── MAGIC_STRINGS.js
├── package-lock.json
├── package.json
├── server.js
├── yarn.lock
├── Challenge Statement.pdf
├── README.md
└── .gitignore
```

The nuxt app for customer and business accounts:

```
client/
├── assets/
│── components/
│   ├── business/
│   ├── customer/
│   ├── general/
│   ├── user/
│   └── utils/
│── layouts/
│── middleware/
│── node_modules/
├── pages/
│   ├── business/
│   └── bz/
│       ├── bookings.vue
│       ├── dashboard.vue
│       ├── inquiries.vue
│       ├── profile.vue
│       ├── reviews.vue
│       └── services.vue
│   ├── bookings.vue
│   ├── dashboard.vue
│   ├── index.vue
│   ├── profile.vue
│   ├── service.vue
│   ├── signin.vue
│   └── signup.vue
├── plugins/
├── public/
└── store/
│   ├── business.js
│   ├── dashboard.js
│   ├── globalState.js
│   ├── index.js
│   ├── message.js
│   ├── notification.js
│   └── user.js

```

The admin pannel vue app
```
.
├── admin/
├── node_modules/
├── public/
├── src/
│   ├── @core/
│   ├── @iconify/
│   ├── @layouts/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── plugins/
│   ├── router/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── .editorconfig
├── .env
├── .env.example
├── .eslintrc-auto-import.json
├── .eslintrc.js
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── .stylelintrc.json
├── auto-imports.d.ts
├── components.d.ts
└── index.html

```