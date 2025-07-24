# Project Structure Documentation

This document outlines the overall project structure for the Duty Roster application. It provides guidelines for organizing code and understanding the existing architecture.

## Root Directory Structure

The project follows a clear separation between frontend and backend code:

```
project-root/
├── .husky/                # Git hooks configuration
├── .kiro/                 # Kiro AI assistant configuration
├── database/              # Database configuration and files
├── docs/                  # Project documentation
├── frontend/              # Frontend application code
├── node_modules/          # Node.js dependencies
├── routes/                # API route definitions
├── scripts/               # Utility scripts
├── services/              # Backend services
├── .env                   # Environment variables (not in version control)
├── .env.example           # Example environment variables
├── .eslintrc.js           # ESLint configuration
├── .prettierrc.js         # Prettier configuration
├── package.json           # Project dependencies and scripts
├── README.md              # Project overview
└── server.js              # Main server entry point
```

## Backend Structure

The backend follows a modular structure organized by feature:

```
project-root/
├── database/              # Database layer
│   ├── db.js              # Database connection and utilities
│   └── duty_roster.db     # SQLite database file
├── routes/                # API routes organized by feature
│   ├── admin.js           # Admin-related endpoints
│   ├── assignments.js     # Assignment-related endpoints
│   ├── duties.js          # Duty-related endpoints
│   ├── notifications.js   # Notification-related endpoints
│   └── people.js          # People-related endpoints
├── services/              # Business logic services
│   ├── notifications.js   # Notification service
│   └── scheduler.js       # Scheduling service
└── server.js              # Express server configuration
```

### Backend Organization Principles

1. **Feature-based Organization**: Routes and services are organized by feature or domain (duties, people, assignments, etc.)
2. **Separation of Concerns**:
   - Routes handle HTTP requests and responses
   - Services contain business logic
   - Database layer handles data access
3. **Modular Design**: Each component has a single responsibility and can be tested independently

## Frontend Structure

See [Frontend Structure Documentation](./frontend-structure.md) for detailed information about the frontend organization.

## File Naming Conventions

See [File Naming Conventions](./file-naming-conventions.md) for guidelines on naming files and directories.

## Configuration Files

The project uses several configuration files:

- `.eslintrc.js` - ESLint configuration (see [ESLint Configuration Guide](./eslint-config.md))
- `.prettierrc.js` - Prettier configuration (see [Prettier Configuration](./prettier-config.md))
- `.husky/` - Git hooks (see [Git Hooks Configuration](./git-hooks.md))
- `.env` - Environment variables (not in version control)
- `.env.example` - Example environment variables

## Scripts

The `scripts/` directory contains utility scripts for various tasks:

- Database management
- Code formatting
- Development utilities

## Documentation

The `docs/` directory contains project documentation:

- Coding standards
- Configuration guides
- Project structure
- Development workflows

## Version Control

- `.gitignore` - Specifies files that should not be tracked by Git
- `.github/` - GitHub-specific configuration (workflows, templates, etc.)
