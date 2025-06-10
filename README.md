# README for Kuuv Backend

## 1. Introduction
Kuuv backend handles authentication, database management, and API endpoints. It connects to the database, manages user data, OTP verification, categories, and locations.

---

## 2. Project Structure

### Database Connection
- 🔗 Connects to the database.

### Helpers
- 🌍 Contains country data.
- 🔑 Generates and verifies authentication tokens.
- ✅ Validates incoming API requests.

### Models
- 📂 Stores category, location, OTP (with expiration), and user data.

### Response Messages
- 📢 Handles success, error, and server-related responses.

### API Routes
- 🛠️ Manages OTP login, categories, users, and location data.

### Main Server
- 🚀 Entry point for the backend API.

---

## 3. Installation and Running the Backend

### Clone the Repository
```sh
📦 git clone [repository link]
cd kuuv-backend
```

### Install Dependencies
```sh
📥 npm install
```

### Setup Environment Variables
Create a `.env` file and add credentials:
```
🔐 MONGO_URI=your_database_url
🔐 JWT_SECRET=your_secret_key
🔐 PORT=5000
```

### Start the Backend Server
```sh
🚀 node server.js
```
By default, the server runs on `http://localhost:5000`.

---

## 4. API Overview

### Authentication
- 🔑 Sends OTP for login.
- ✅ Verifies OTP and logs in the user.

### Categories
- 📂 Creates and retrieves categories.

### Users
- 👤 Creates and retrieves user details.

### Location
- 📍 Fetches location data.

---

## 5. Running Backend with Frontend
Ensure the backend is running before starting the frontend:
```sh
🚀 node server.js
```
Then, start the frontend separately using Expo for mobile or a local server for the web version.

For testing the API, use **Postman**. To see real-time output in the UI, run the frontend project from the repository: [Kuuv Frontend](https://github.com/syoft/kuuv). Read this README and run both backend and frontend for full functionality.

