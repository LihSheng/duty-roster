# Duty Roster Application

A web application for managing cleaning duties and other routine tasks in a team or household. The application allows for creating a rotation of people to handle daily, weekly, monthly, or custom frequency duties, with notifications and tracking.

## Features

-   **Duty Management**: Create and manage different types of duties with flexible frequency options
    -   Daily duties
    -   Weekly duties (specific days of the week)
    -   Monthly duties (specific day of month, e.g., last Friday)
    -   Custom frequency options
    -   User-defined duties (no default duties required)
    -   Group duties that can be assigned to multiple people simultaneously
-   **People Management**: Add team members with contact information
-   **Calendar View**: Drag-and-drop interface for duty assignments
-   **Notifications**: Email and WhatsApp notifications for duty assignments and reminders
-   **Admin Controls**: Generate weekly assignments and manage settings
-   **Completion Tracking**: Mark duties as completed and track overdue tasks
-   **Automated Deployment**: GitHub workflow for automatic deployment to Google Cloud
-   **Frequency Customization**: Flexible duty scheduling with custom recurrence patterns
-   **Duty Assignment**: Assign duties to specific people for specific dates
-   **Duplicate Prevention**: System prevents duplicate duty assignments for the same date

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: SQLite (lightweight, file-based database)
-   **Frontend**: React.js with drag-and-drop calendar interface
-   **Notifications**: Nodemailer (Email), WhatsApp API integration
-   **CI/CD**: GitHub Actions workflow for automated deployment to Google Cloud
-   **Scheduling**: Node-cron for automated task scheduling and reminders

## Installation

1. Clone the repository
2. Install dependencies:
    ```
    npm run install-all
    ```
3. Configure environment variables in `.env` file
4. Start the development server:
    ```
    npm run dev
    ```
5. Start the frontend server:
    ```
    cd frontend
    npm start
    ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp Configuration (optional)
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=
```

## Usage

1. **Add People**: Add team members who will participate in the duty roster
2. **Create Duties**: Define duties that need to be performed (e.g., trash disposal, floor cleaning)
    - Set custom frequencies (daily, weekly, monthly, or specific days)
    - Add detailed descriptions for each duty
    - No default duties are created - all duties are user-defined
    - Create group duties that apply to multiple or all team members
3. **Generate Assignments**: Use the admin panel to generate weekly assignments
4. **Manage Calendar**: Use the drag-and-drop calendar to adjust assignments as needed
5. **Track Completion**: Team members can mark duties as completed when done
6. **Manage Overdue Tasks**: Admin can track and send reminders for overdue tasks
7. **Receive Notifications**: Get email or WhatsApp notifications for upcoming and overdue duties
8. **Custom Assignments**: Manually assign duties to specific people for specific dates
9. **Deployment**: Automatically deploy to Google Cloud when pushing to the master branch

## Development

-   Backend API runs on `http://localhost:5000`
-   Frontend development server runs on `http://localhost:3000`

## Deployment

The application includes a GitHub Actions workflow for automatic deployment to Google Cloud App Engine:

1. Push your changes to the `master` branch
2. The workflow will automatically:
    - Install dependencies
    - Build the frontend
    - Deploy to Google Cloud App Engine

### Required GitHub Secrets

To enable the automatic deployment, add these secrets to your GitHub repository:

-   `GCP_PROJECT_ID`: Your Google Cloud project ID
-   `GCP_SA_KEY`: Base64-encoded service account key with App Engine Admin permissions

## Scripts

-   `npm run dev`: Start backend server with nodemon
-   `npm run client`: Start frontend development server
-   `npm start`: Start production server
-   `npm run build`: Build frontend for production
-   `npm run install-all`: Install dependencies for both frontend and backend

## License

MIT
