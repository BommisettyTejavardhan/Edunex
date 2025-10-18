# Railway Deployment Guide

This guide explains how to deploy the LMS application to Railway with both backend and frontend services.

## Prerequisites

1. Railway account (https://railway.app/)
2. Railway CLI installed (`npm install -g @railway/cli`)
3. Git repository with the LMS code

## Deployment Steps

### 1. Create Railway Project

1. Go to https://railway.app/new and create a new project
2. Choose "Deploy from GitHub repo" or "Deploy from CLI"

### 2. Set Up MySQL Database

1. In your Railway project, click "+ New" and select "Database"
2. Choose "MySQL" as the database type
3. Railway will automatically provision a MySQL database
4. Note the database connection details from the "Connect" tab:
   - Host
   - Port (usually 3306)
   - Database name (usually "railway")
   - Username (usually "root")
   - Password

### 3. Deploy Backend API

1. Create a new service in Railway
2. Select your repository or upload the code
3. Set the root directory to `/backend`
4. Railway will automatically detect it's a Node.js project
5. Set the following environment variables in Railway:
   ```
   NODE_ENV=production
   PORT=5000
   DB_TYPE=mysql
   DB_HOST=<your-mysql-host>
   DB_PORT=3306
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=<your-mysql-password>
   JWT_SECRET=<generate-a-strong-secret>
   CORS_ORIGIN=https://<your-frontend-domain>.railway.app
   FRONTEND_URL=https://<your-frontend-domain>.railway.app
   ```

### 4. Deploy Frontend

1. Create another service in Railway
2. Select your repository or upload the code
3. Set the root directory to `/frontend`
4. Railway will automatically detect it's a Node.js/React project
5. The build command will be `npm run build`
6. The start command is configured in `frontend/railway.json`

### 5. Configure Environment Variables

#### Backend Environment Variables:
- `NODE_ENV`: production
- `PORT`: 5000
- `DB_TYPE`: mysql
- `DB_HOST`: Your Railway MySQL host
- `DB_PORT`: 3306
- `DB_NAME`: railway
- `DB_USER`: root
- `DB_PASSWORD`: Your Railway MySQL password
- `JWT_SECRET`: Generate a strong secret key
- `CORS_ORIGIN`: https://your-frontend.railway.app
- `FRONTEND_URL`: https://your-frontend.railway.app

### 6. Connect Services

1. In Railway, go to your project settings
2. Enable "Service Links" to connect your frontend to your backend
3. This allows the frontend to communicate with the backend API

## Manual Deployment via CLI

If you prefer to deploy via CLI:

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Create a new project:
   ```bash
   railway init
   ```

4. Deploy backend:
   ```bash
   cd backend
   railway up
   ```

5. Deploy frontend:
   ```bash
   cd ../frontend
   railway up
   ```

## Important Notes

1. **Database Migrations**: The application will automatically initialize the database with sample data on first run
2. **Environment Variables**: Make sure all environment variables are properly set in Railway
3. **CORS Configuration**: Ensure CORS_ORIGIN matches your frontend URL
4. **File Uploads**: Uploaded files are stored in the `uploads/` directory, but this is not persistent on Railway. Consider using a storage service like AWS S3 for production
5. **Mock Database**: If you don't set up MySQL, the application will fall back to a mock database (not recommended for production)

## Troubleshooting

1. **Connection Issues**: Check that all environment variables are correctly set
2. **CORS Errors**: Verify that CORS_ORIGIN matches your frontend URL exactly
3. **Build Failures**: Check the build logs in Railway for specific error messages
4. **Database Connection**: Ensure the MySQL add-on is properly configured and connected

## Production Considerations

1. **Persistent Storage**: Use external storage (AWS S3, Cloudinary) for file uploads
2. **Email Service**: Integrate with an email service for notifications
3. **Monitoring**: Set up monitoring and alerting
4. **Backup**: Configure regular database backups
5. **Security**: Use strong passwords and rotate secrets regularly

For more information, refer to the [Railway documentation](https://docs.railway.app/).