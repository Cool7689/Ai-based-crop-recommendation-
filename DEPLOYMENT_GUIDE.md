# 🚀 Free Online Deployment Guide

## Overview
Deploy your AI Crop Recommendation System online for **FREE** using:
- **Vercel** (Frontend) - Free hosting
- **Railway** (Backend + AI Service) - Free tier
- **MongoDB Atlas** (Database) - Free tier
- **Demo AI Mode** - No API keys required

## Step 1: Prepare for Deployment

### 1.1 Update Environment Variables

**Frontend (.env):**
```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_AI_SERVICE_URL=https://your-ai-service-url.railway.app
```

**Backend (.env):**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop-recommendation
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**AI Service (.env):**
```bash
NODE_ENV=production
PORT=5001
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
BACKEND_URL=https://your-backend-url.railway.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy Frontend
```bash
cd frontend
vercel login
vercel --prod
```

### 2.3 Configure Environment Variables
In Vercel dashboard:
- Go to your project settings
- Add environment variables:
  - `REACT_APP_API_URL` = `https://your-backend-url.railway.app`
  - `REACT_APP_AI_SERVICE_URL` = `https://your-ai-service-url.railway.app`

## Step 3: Deploy Backend to Railway

### 3.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 3.2 Deploy Backend
```bash
cd backend
railway login
railway init
railway up
```

### 3.3 Configure Environment Variables
In Railway dashboard:
- Go to your project settings
- Add environment variables from backend/.env

## Step 4: Deploy AI Service to Railway

### 4.1 Create New Railway Project
```bash
cd ai-service
railway init
railway up
```

### 4.2 Configure Environment Variables
In Railway dashboard:
- Add environment variables from ai-service/.env

## Step 5: Set Up MongoDB Atlas

### 5.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Get connection string

### 5.2 Configure Database
1. Create database: `crop-recommendation`
2. Create collections:
   - `farmers`
   - `chatsessions`
   - `crops`

## Step 6: Update URLs

### 6.1 Update Frontend URLs
After deployment, update:
- `vercel.json` with actual Railway URLs
- Frontend environment variables

### 6.2 Update Backend URLs
Update backend to point to:
- Frontend Vercel URL
- AI Service Railway URL

## Step 7: Test Deployment

### 7.1 Test Frontend
Visit your Vercel URL and check:
- ✅ Page loads
- ✅ Can register/login
- ✅ Chat interface works

### 7.2 Test Backend
Test API endpoints:
- ✅ Health check
- ✅ Authentication
- ✅ Chat functionality

### 7.3 Test AI Service
Test AI endpoints:
- ✅ AI service status
- ✅ Crop recommendations
- ✅ Chat responses

## Step 8: Production Configuration

### 8.1 Enable Demo Mode
Since Ollama won't work on Railway (no GPU), the system will automatically use demo mode:
- ✅ Pre-written crop recommendations
- ✅ Sample chat responses
- ✅ No API keys required

### 8.2 Optional: Add Real AI
To add real AI later:
1. Get free OpenAI credits
2. Update AI service environment variables
3. Redeploy

## Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] AI Service deployed to Railway
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] URLs updated
- [ ] System tested
- [ ] Demo mode working

## Cost Breakdown

- **Vercel**: Free (up to 100GB bandwidth)
- **Railway**: Free (up to $5 credit)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: $0/month

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS settings in backend
2. **Environment variables**: Check all URLs are correct
3. **Database connection**: Verify MongoDB Atlas connection string
4. **AI service**: Ensure demo mode is working

### Support:
- Check Railway logs for backend issues
- Check Vercel logs for frontend issues
- Check MongoDB Atlas for database issues

## Next Steps After Deployment

1. **Share the URL** with users
2. **Monitor usage** and performance
3. **Add real AI** when ready
4. **Scale up** if needed

Your AI Crop Recommendation System is now live and free! 🎉