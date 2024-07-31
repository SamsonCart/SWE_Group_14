# SWE_Group_14

This project aims to build a comprehensive booking system for a service marketplace, connecting customers with local service providers. The key features include account creation for customers and businesses, service searches, profile views, reviews, booking appointments, managing availability, and responding to customer reviews. The system ensures only available time slots can be booked and personalizes the information based on the user's role. The project is structured into client-side and server-side directories, each organized to maintain a clean and manageable codebase.

Google Drive documentation can be viewed here: https://drive.google.com/drive/folders/1Dupu0u9eok5X5bfg0LITFOGVpfv8i3kn

### .env file in the `server` folder

You should create a .env file in the server folder.

```
#SERVER ENV
# Environment mode, typically 'development' or 'production'
NODE_ENV=development
# URL of the MongoDB database
DB_URL = "mongodb+srv://wcpark:gvFtRYr7IQ57gYju@cluster0.lor9kqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Prefix for all API endpoints
API_PREFIX=/api/v1.0.0/
# Secret key used for authentication (ensure this is a strong, random string)
AUTH_SECRET=YourSecretStringForAPI
# Port number the API server will run on
API_PORT=4444
# URL of the client application
CLIENT_URL=http://localhost:3001

```

### .env file in the `admin` folder

You should create a .env file in the admin folder.

```
# Endpoint for the API server used by the admin dashboard
VITE_API_ENDPOINT=http://localhost:4444/api/v1.0.0
# Domain of the API server used by the admin dashboard
VITE_API_DOMAIN=http://localhost:4444

```

### .env file in the `client` folder

You should create a .env file in the `client` folder.

```
# Endpoint for the API server used by the client dashboard
VITE_API_ENDPOINT=http://localhost:4444/api/v1.0.0
# Host domain for the API server used by the client dashboard
VITE_API_ENDPOINTHOST=http://localhost:4444

```

### How to run the project

```
cd server
yarn
yarn dev

cd admin
yarn
yarn dev

cd client
yarn
yarn dev
