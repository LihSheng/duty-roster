# 🚀 Deployment Guide

This guide covers deploying the Duty Roster application to various platforms.

## Render (Recommended)

Render is the easiest platform for deploying this full-stack application.

### Step-by-Step Deployment

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Choose your branch (usually `main` or `master`)

3. **Configure Build Settings**

   ```
   Name: duty-roster (or your preferred name)
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Build Command: npm run install-all && npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables**
   Go to Environment tab and add:

   ```
   NODE_ENV=production
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   REMINDER_DAYS=1
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.onrender.com`

### Auto-Deploy Setup

Render automatically deploys when you push to your connected branch. No additional setup needed!

## Heroku

### Prerequisites

- Heroku CLI installed
- Heroku account

### Deployment Steps

1. **Login to Heroku**

   ```bash
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASS=your-gmail-app-password
   heroku config:set EMAIL_FROM=your-email@gmail.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository

2. **Configure**
   - Railway auto-detects Node.js
   - Add environment variables in the Variables tab
   - Deploy automatically starts

## Vercel (Frontend Only)

For frontend-only deployment (you'll need a separate backend):

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t duty-roster .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_USER=your-email@gmail.com \
  -e SMTP_PASS=your-password \
  duty-roster
```

## Environment Variables Reference

### Required for Production

| Variable   | Description      | Example                             |
| ---------- | ---------------- | ----------------------------------- |
| `NODE_ENV` | Environment mode | `production`                        |
| `PORT`     | Server port      | `5000` (auto-set by most platforms) |

### Email Notifications (Optional)

| Variable     | Description                 | Example                |
| ------------ | --------------------------- | ---------------------- |
| `SMTP_HOST`  | Email server host           | `smtp.gmail.com`       |
| `SMTP_PORT`  | Email server port           | `587`                  |
| `SMTP_USER`  | Email username              | `your-email@gmail.com` |
| `SMTP_PASS`  | Email password/app password | `your-app-password`    |
| `EMAIL_FROM` | From email address          | `your-email@gmail.com` |

### Optional Settings

| Variable        | Description                    | Default                     |
| --------------- | ------------------------------ | --------------------------- |
| `REMINDER_DAYS` | Days before due date to remind | `1`                         |
| `DB_PATH`       | Database file path             | `./database/duty_roster.db` |
| `BASE_URL`      | Application base URL           | Auto-detected               |

## Troubleshooting Deployment

### Common Issues

**Build Fails - Missing Dependencies**

- Ensure all build dependencies are in `dependencies`, not `devDependencies`
- Check that `webpack-cli` and `html-webpack-plugin` are included

**Database Issues**

- SQLite database is created automatically
- Ensure write permissions for database directory
- Consider using `npm run seed` after first deployment

**Port Binding Issues**

- Use `process.env.PORT` in your server
- Most platforms set this automatically

**Email Not Working**

- Use Gmail app passwords, not regular passwords
- Enable 2FA on Gmail account first
- Check firewall/security settings

### Health Check

After deployment, verify these endpoints:

- `GET /` - Should serve the React app
- `GET /api/people` - Should return JSON (empty array if no data)
- `GET /api/duties` - Should return JSON (empty array if no data)

### Performance Optimization

1. **Enable Gzip Compression**

   ```javascript
   // In server.js
   const compression = require('compression');
   app.use(compression());
   ```

2. **Set Cache Headers**

   ```javascript
   // For static files
   app.use(
     express.static('frontend/build', {
       maxAge: '1d',
     })
   );
   ```

3. **Database Optimization**
   - Consider connection pooling for high traffic
   - Add database indexes for frequently queried fields

## Monitoring

### Basic Monitoring

Most platforms provide:

- Application logs
- Performance metrics
- Uptime monitoring
- Error tracking

### Custom Monitoring

Add health check endpoint:

```javascript
// In server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

## Backup Strategy

### Database Backup

Since SQLite is file-based:

1. **Manual Backup**

   ```bash
   # Copy database file
   cp database/duty_roster.db backup/duty_roster_$(date +%Y%m%d).db
   ```

2. **Automated Backup**
   - Set up scheduled tasks on your platform
   - Use cloud storage (AWS S3, Google Cloud Storage)
   - Consider database replication for critical deployments

### Code Backup

- Use Git for version control
- Tag releases: `git tag v1.0.0`
- Keep deployment configurations in version control
