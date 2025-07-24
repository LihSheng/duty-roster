# 🧹 Duty Roster Application

A modern web application for managing cleaning duties and routine tasks in households, shared accommodations, or teams. Features an intuitive drag-and-drop calendar interface, automated scheduling, and comprehensive notification system.

![Duty Roster Demo](https://img.shields.io/badge/Demo-Available-green) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18+-blue) ![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey)

## Features

- **Duty Management**: Create and manage different types of duties with flexible frequency options
  - Daily duties
  - Weekly duties (specific days of the week)
  - Monthly duties (specific day of month, e.g., last Friday)
  - Custom frequency options
  - User-defined duties (no default duties required)
  - Group duties that can be assigned to multiple people simultaneously
- **People Management**: Add team members with contact information
- **Calendar View**: Drag-and-drop interface for duty assignments
- **Notifications**: Email and WhatsApp notifications for duty assignments and reminders
- **Admin Controls**: Generate weekly assignments and manage settings
- **Completion Tracking**: Mark duties as completed and track overdue tasks
- **Automated Deployment**: GitHub workflow for automatic deployment to Google Cloud
- **Frequency Customization**: Flexible duty scheduling with custom recurrence patterns
- **Duty Assignment**: Assign duties to specific people for specific dates
- **Duplicate Prevention**: System prevents duplicate duty assignments for the same date

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (lightweight, file-based database)
- **Frontend**: React.js with drag-and-drop calendar interface, Tailwind CSS for styling
- **Notifications**: Nodemailer (Email), WhatsApp API integration
- **CI/CD**: GitHub Actions workflow for automated deployment to Google Cloud
- **Scheduling**: Node-cron for automated task scheduling and reminders

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd duty-roster
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Seed the database with demo data** (optional)

   ```bash
   npm run seed
   ```

5. **Start the application**

   ```bash
   # Development mode (backend + frontend)
   npm run dev

   # Or start separately:
   npm start              # Backend (http://localhost:5000)
   cd frontend && npm start  # Frontend (http://localhost:3000)
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
# Application Settings
NODE_ENV=development
PORT=5000
APP_NAME=Duty Roster
BASE_URL=http://localhost:5000

# Database (SQLite - usually no config needed)
DB_PATH=./database/duty_roster.db

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# WhatsApp Configuration (optional)
WHATSAPP_API_URL=https://api.whatsapp.com/v1/messages
WHATSAPP_API_TOKEN=your-whatsapp-api-token

# Notification Settings
REMINDER_DAYS=1  # Days before due date to send reminders

# Security (generate random strings for production)
SESSION_SECRET=your-session-secret-here
JWT_SECRET=your-jwt-secret-here
```

### Gmail Setup for Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use the 16-character app password in `SMTP_PASS`

## 📖 Usage Guide

### Getting Started with Demo Data

If you seeded the database, you'll have:

- **6 sample people** (Alice, Bob, Carol, David, Emma, Frank)
- **8 realistic duties** (Kitchen cleaning, bathroom cleaning, etc.)
- **49 assignments** spanning past week and next 2 weeks

### Core Workflow

1. **👥 People Management**
   - Navigate to "People" to add household members
   - Include names, emails, and phone numbers for notifications
   - Activate/deactivate people as needed

2. **🧹 Duty Setup**
   - Go to "Duties" to create cleaning tasks
   - Set frequencies: Daily, Weekly (specific days), or Custom
   - Add detailed descriptions and mark group duties
   - Examples: "Kitchen Cleaning" (daily), "Bathroom" (weekly - Monday)

3. **📅 Calendar Management**
   - Use the drag-and-drop calendar to assign duties
   - Move assignments between people and dates
   - Visual status indicators: Pending, Completed, Overdue

4. **✅ Task Completion**
   - Click on assignments to mark as complete
   - Add completion notes if needed
   - Track completion rates and overdue tasks

5. **⚙️ Admin Controls**
   - Generate weekly assignments automatically
   - Send reminder notifications
   - Manage application settings

### Key Features

- **🎯 Smart Assignment**: Prevents duplicate assignments for same date
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔔 Notifications**: Email reminders for upcoming and overdue duties
- **📊 Progress Tracking**: Visual completion status and history
- **🎨 Modern UI**: Clean interface with dark/light theme support

## 🛠️ Development

### Project Structure

```
duty-roster/
├── backend/
│   ├── database/           # SQLite database and schema
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic (notifications, scheduler)
│   └── server.js          # Express server
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Helper functions
│   │   └── styles/        # Tailwind CSS
│   └── webpack.config.js  # Build configuration
├── scripts/               # Database utilities
└── .env.example          # Environment template
```

### Development Servers

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Database**: SQLite file at `database/duty_roster.db`

### API Endpoints

- `GET/POST /api/people` - People management
- `GET/POST /api/duties` - Duty management
- `GET/POST /api/assignments` - Assignment management
- `POST /api/admin/generate-assignments` - Generate weekly assignments
- `POST /api/notifications/send-reminders` - Send notifications

## 🚀 Deployment

### Render (Recommended)

1. **Connect your repository** to Render
2. **Set build commands**:
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
3. **Configure environment variables** in Render dashboard
4. **Deploy** - automatic deployments on git push

### Manual Deployment

```bash
# Build for production
npm run install-all
npm run build

# Start production server
NODE_ENV=production npm start
```

### Environment Variables for Production

Set these in your deployment platform:

```bash
NODE_ENV=production
PORT=10000  # Or your platform's default
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

## 📜 Available Scripts

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm start`           | Start production server                       |
| `npm run dev`         | Start development server with auto-reload     |
| `npm run client`      | Start frontend development server only        |
| `npm run build`       | Build frontend for production                 |
| `npm run install-all` | Install all dependencies (backend + frontend) |
| `npm run seed`        | Populate database with demo data              |
| `npm run reset-db`    | Reset database to empty state                 |

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Kill process on port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
```

**Database locked**

```bash
# Reset database
npm run reset-db
npm run seed
```

**Build failures**

```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules
npm run install-all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, Node.js, and SQLite
- UI components styled with Tailwind CSS
- Drag-and-drop powered by react-beautiful-dnd
- Notifications via Nodemailer
