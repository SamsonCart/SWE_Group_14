# Pushpin Booking System

This project is a comprehensive booking system for a service marketplace, connecting customers with local service providers. It features account creation, service searches, profile views, reviews, appointment booking, availability management, and review responses.

## Project Structure

The project is divided into three main components:

1. Server (Node.js/Express)
2. Admin (Vue 3)
3. Client (Nuxt 3)

## Setup

### Server

1. Navigate to the `server` directory
2. Create a `.env` file with the following content:

```
NODE_ENV = development
DB_URL = YourMongoDBURL
API_PREFIX = /api/v1.0.0/
AUTH_SECRET = YourSecretStringForAPILike-----KvKiA2mMjxGO25Diiibz
API_PORT = 3000
CLIENT_URL = http://localhost:3001/
```

3. Install dependencies and run:

```
yarn
yarn dev
```

### Admin Panel

1. Navigate to the `admin` directory
2. Create a `.env` file with the following content:

```
VITE_API_ENDPOINT=http://localhost:3000/api/v1.0.0/
VITE_API_DOMAIN=http://localhost:3000/
```

3. Install dependencies and run:

```
yarn
yarn dev
```

### Client

1. Navigate to the `client` directory
2. Create a `.env` file with the following content:

```
VITE_API_ENDPOINT=http://localhost:3000/api/v1.0.0/
VITE_API_ENDPOINTHOST=http://localhost:3000/
```

3. Install dependencies and run:

```
yarn
yarn dev
```

## References

### Template

1. MEVN Boilerplate was used as a starter template with permission from Dr. Rani. The library can be found at https://github.com/mustafacagri/mevn-boilerplate?tab=readme-ov-file.

### Server

1. MongoDB Cloud Atlas was used for database management with permission from Dr. Rani. The library can be found at https://www.mongodb.com/.
2. Express was used for the web application framework. The library can be found at https://expressjs.com/.
3. Mongoose was used for object data modeling. The library can be found at https://mongoosejs.com/.
4. Bcryptjs was used for password hashing. The library can be found at https://www.npmjs.com/package/bcryptjs.
5. Jsonwebtoken was used for JWT implementation. The library can be found at https://www.npmjs.com/package/jsonwebtoken.
6. Cors was used for enabling Cross-Origin Resource Sharing. The library can be found at https://www.npmjs.com/package/cors.
7. Dotenv was used for loading environment variables. The library can be found at https://www.npmjs.com/package/dotenv.
8. Joi was used for data validation. The library can be found at https://joi.dev/.
9. Multer was used for handling multipart/form-data. The library can be found at https://www.npmjs.com/package/multer.
10. Winston was used for logging. The library can be found at https://github.com/winstonjs/winston.

### Admin

1. Vue 3 was used as the frontend framework. The library can be found at https://vuejs.org/.
2. Vite was used as the build tool. The library can be found at https://vitejs.dev/.
3. Vuetify was used for UI components. The library can be found at https://vuetifyjs.com/.
4. Pinia was used for state management. The library can be found at https://pinia.vuejs.org/.
5. Axios was used for HTTP requests. The library can be found at https://axios-http.com/.
6. Vue Router was used for routing. The library can be found at https://router.vuejs.org/.

### Client

1. Nuxt 3 was used as the frontend framework. The library can be found at https://nuxt.com/.
2. Vuetify was used for UI components. The library can be found at https://vuetifyjs.com/.
3. Pinia was used for state management. The library can be found at https://pinia.vuejs.org/.
4. Leaflet was used for interactive maps. The library can be found at https://leafletjs.com/.
5. Vee-validate was used for form validation. The library can be found at https://vee-validate.logaretm.com/.
6. Yup was used for object schema validation. The library can be found at https://github.com/jquense/yup.
7. Font Awesome was used for icons. The library can be found at https://fontawesome.com/.
8. Material Design Icons were used for additional icons. The library can be found at https://materialdesignicons.com/.
9. Sass was used for CSS preprocessing. The library can be found at https://sass-lang.com/.
10. Lodash was used for utility functions. The library can be found at https://lodash.com/.
