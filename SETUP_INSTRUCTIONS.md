# Learning Management System (LMS) - Setup Instructions

## Prerequisites
1. Node.js (v14 or higher)
2. MongoDB (local installation or MongoDB Atlas account)

## MongoDB Setup Options

### Option 1: Local MongoDB Installation
1. Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Add your IP address to the whitelist (or allow access from anywhere for development)
5. Get the connection string and update the MONGO_URI in `backend/.env`

## Installation Steps

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your MongoDB connection string:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the backend server:
   ```bash
   npm run server
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. The application will be available at http://localhost:3000

## Development Notes
- The frontend uses Tailwind CSS via CDN for styling
- The backend uses JWT for authentication
- All API requests are proxied to the backend during development