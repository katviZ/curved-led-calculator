# Deploy to Render.com - Step by Step

## Prerequisites
- GitHub account
- Code pushed to a GitHub repository

## Deploy Steps

### 1. Push to GitHub (if not already)
```bash
cd D:\Open_Code_Base\curved-led-calculator
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/curved-led-calculator.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com) → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your `curved-led-calculator` repository
5. Configure:
   - **Name**: `curved-led-calculator`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/server.js`
   - **Plan**: **Free**

### 3. Add Persistent Disk (Required for XML database)
1. Click **"Advanced"** tab
2. Under **"Disks"** → **"Add Disk"**
   - **Name**: `xml-data`
   - **Mount Path**: `/opt/render/project/src/server/db`
   - **Size**: `1 GB`
3. Click **"Add Disk"**

### 4. Set Environment Variables
1. Go to **"Environment"** tab
2. Add:
   - **Key**: `NODE_ENV` → **Value**: `production`
   - **Key**: `ADMIN_PASSWORD` → **Value**: `your-secure-password-here`
3. Click **"Save Changes"**

### 5. Deploy
1. Click **"Create Web Service"**
2. Wait for build and deploy (~2-3 minutes)
3. Your app will be live at: `https://curved-led-calculator.onrender.com`

## What You Get
- **Live URL**: `https://curved-led-calculator.onrender.com`
- **Free tier**: 750 hours/month (enough for 24/7)
- **Persistent storage**: XML databases saved on disk
- **Auto-deploy**: Push to `main` branch → Auto rebuilds

## Admin Access
1. Visit your live URL
2. Login with any email or request trial
3. Click **"Dashboard"** in header
4. Enter admin password (set in step 4)
5. View analytics and manage trials

## Troubleshooting
- **Build fails**: Check build logs in Render dashboard
- **API errors**: Verify disk is mounted at correct path
- **Data lost**: Ensure disk is properly mounted (step 3)
- **Slow first load**: Free tier spins down after inactivity (wakes up on next request)
