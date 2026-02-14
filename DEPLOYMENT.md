# Bellcrop Event Management System - Render Deployment Guide

## Deployment Steps

### 1. Backend Deployment (Node.js API)

1. **Create a new Web Service on Render:**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the following configuration:
     - **Name**: bellcrop-backend
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Root Directory**: `backend`

2. **Environment Variables:**
   Add these environment variables in the Render dashboard:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `PORT` - 10000 (Render will override this)

### 2. Frontend Deployment (Static Site)

1. **Create a new Static Site on Render:**
   - Go to https://render.com
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Set the following configuration:
     - **Name**: bellcrop-frontend
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Root Directory**: `frontend`

2. **Environment Variables:**
   Add this environment variable:
   - `VITE_API_URL` - Set to your backend URL (e.g., `https://bellcrop-backend.onrender.com/api`)

### 3. Update Frontend Configuration

After deploying the backend, update the `frontend/.env.production` file with your actual backend URL:

```
VITE_API_URL=https://your-backend-service-name.onrender.com/api
```

### 4. CORS Configuration

Update your backend `server.js` to handle CORS properly for production:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Add `FRONTEND_URL` environment variable to your backend with your frontend's Render URL.

## Environment Variables Summary

### Backend (.env):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend (.env.production):
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Important Notes

1. **Free Tier Limitations**: Render's free tier has some limitations including sleep after 15 minutes of inactivity
2. **Build Time**: First builds may take several minutes
3. **Custom Domains**: You can add custom domains in the Render dashboard
4. **Environment Sync**: Environment variables are not synced by default - you need to set them manually

## Post-Deployment

1. After both services are deployed, update the frontend's `VITE_API_URL` with the actual backend URL
2. Rebuild the frontend service
3. Test the application to ensure everything works correctly

The application should now be accessible at your frontend's Render URL!