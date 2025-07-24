# 📡 API Documentation

This document describes the REST API endpoints for the Duty Roster application.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-app-name.onrender.com`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "message": "Optional message",
  "error": "Error message (if success is false)"
}
```

## People Management

### Get All People

```http
GET /api/people
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+1-555-0101",
      "is_active": 1,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Create Person

```http
POST /api/people
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123"
  },
  "message": "Person added successfully"
}
```

### Update Person

```http
PUT /api/people/:id
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1-555-0124"
}
```

### Delete Person

```http
DELETE /api/people/:id
```

## Duties Management

### Get All Duties

```http
GET /api/duties
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kitchen Cleaning",
      "description": "Clean kitchen counters, sink, stove, and sweep floor",
      "frequency": "daily",
      "days_of_week": null,
      "is_group_duty": 0,
      "is_active": 1,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Bathroom Cleaning",
      "description": "Clean toilet, sink, mirror, and mop floor",
      "frequency": "weekly",
      "days_of_week": "[1]",
      "is_group_duty": 0,
      "is_active": 1,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Create Duty

```http
POST /api/duties
Content-Type: application/json

{
  "name": "Vacuum Living Room",
  "description": "Vacuum carpet and clean under furniture",
  "frequency": "weekly",
  "days_of_week": [3, 6],
  "is_group_duty": false
}
```

**Frequency Options:**

- `"daily"` - Every day
- `"weekly"` - Specific days of the week
- `"custom"` - Custom scheduling

**Days of Week (for weekly duties):**

- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- `3` = Wednesday
- `4` = Thursday
- `5` = Friday
- `6` = Saturday

### Update Duty

```http
PUT /api/duties/:id
Content-Type: application/json

{
  "name": "Deep Kitchen Clean",
  "description": "Monthly deep cleaning of kitchen",
  "frequency": "custom",
  "is_group_duty": true
}
```

### Delete Duty

```http
DELETE /api/duties/:id
```

## Assignments Management

### Get All Assignments

```http
GET /api/assignments
```

**Query Parameters:**

- `start_date` - Filter assignments from this date (YYYY-MM-DD)
- `end_date` - Filter assignments to this date (YYYY-MM-DD)
- `person_id` - Filter by person ID
- `duty_id` - Filter by duty ID
- `status` - Filter by status (`pending`, `completed`, `overdue`)

**Example:**

```http
GET /api/assignments?start_date=2024-01-15&end_date=2024-01-21&status=pending
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "duty_id": 1,
      "person_id": 1,
      "assigned_date": "2024-01-15",
      "due_date": "2024-01-15",
      "status": "completed",
      "completed_at": "2024-01-15T18:30:00.000Z",
      "notes": "Completed thoroughly",
      "created_at": "2024-01-15T10:00:00.000Z",
      "duty_name": "Kitchen Cleaning",
      "person_name": "Alice Johnson"
    }
  ]
}
```

### Create Assignment

```http
POST /api/assignments
Content-Type: application/json

{
  "duty_id": 1,
  "person_id": 2,
  "assigned_date": "2024-01-16",
  "due_date": "2024-01-16"
}
```

### Update Assignment

```http
PUT /api/assignments/:id
Content-Type: application/json

{
  "person_id": 3,
  "due_date": "2024-01-17",
  "status": "completed",
  "notes": "Task completed early"
}
```

### Complete Assignment

```http
POST /api/assignments/:id/complete
Content-Type: application/json

{
  "notes": "All done, extra cleaning needed next time"
}
```

### Delete Assignment

```http
DELETE /api/assignments/:id
```

## Admin Operations

### Generate Weekly Assignments

```http
POST /api/admin/generate-assignments
Content-Type: application/json

{
  "start_date": "2024-01-15",
  "end_date": "2024-01-21"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "assignments_created": 15,
    "start_date": "2024-01-15",
    "end_date": "2024-01-21"
  },
  "message": "Weekly assignments generated successfully"
}
```

### Reset All Assignments

```http
POST /api/admin/reset-assignments
```

**Response:**

```json
{
  "success": true,
  "message": "All assignments have been reset"
}
```

## Notifications

### Send Reminder Notifications

```http
POST /api/notifications/send-reminders
```

**Response:**

```json
{
  "success": true,
  "data": {
    "emails_sent": 3,
    "whatsapp_sent": 0,
    "failed": 0
  },
  "message": "Reminder notifications sent successfully"
}
```

### Send Custom Notification

```http
POST /api/notifications/send-custom
Content-Type: application/json

{
  "person_id": 1,
  "subject": "Duty Reminder",
  "message": "Don't forget about your kitchen cleaning duty today!",
  "type": "email"
}
```

## Settings

### Get All Settings

```http
GET /api/admin/settings
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "key": "notification_enabled",
      "value": "true",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "key": "reminder_days",
      "value": "1",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Update Setting

```http
PUT /api/admin/settings/:key
Content-Type: application/json

{
  "value": "2"
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code                   | Status | Description                             |
| ---------------------- | ------ | --------------------------------------- |
| `VALIDATION_ERROR`     | 400    | Invalid request data                    |
| `NOT_FOUND`            | 404    | Resource not found                      |
| `DUPLICATE_ASSIGNMENT` | 409    | Assignment already exists for this date |
| `DATABASE_ERROR`       | 500    | Database operation failed               |
| `EMAIL_ERROR`          | 500    | Email sending failed                    |

### Example Error Response

```json
{
  "success": false,
  "error": "Person with ID 999 not found",
  "code": "NOT_FOUND"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting for:

- Assignment creation: 100 requests per hour
- Notification sending: 10 requests per hour
- General API calls: 1000 requests per hour

## Data Validation

### Person Validation

- `name`: Required, 1-100 characters
- `email`: Optional, valid email format
- `phone`: Optional, any format

### Duty Validation

- `name`: Required, 1-100 characters
- `description`: Optional, up to 500 characters
- `frequency`: Required, one of: `daily`, `weekly`, `custom`
- `days_of_week`: Required for weekly duties, array of integers 0-6

### Assignment Validation

- `duty_id`: Required, must exist in duties table
- `person_id`: Required, must exist in people table
- `assigned_date`: Required, valid date format (YYYY-MM-DD)
- `due_date`: Required, valid date format (YYYY-MM-DD)
- `status`: Optional, one of: `pending`, `completed`, `overdue`

## Webhooks (Future Feature)

Planned webhook endpoints for external integrations:

- `POST /api/webhooks/assignment-completed`
- `POST /api/webhooks/assignment-overdue`
- `POST /api/webhooks/weekly-summary`

## SDK Examples

### JavaScript/Node.js

```javascript
const API_BASE = 'http://localhost:5000/api';

// Get all people
const people = await fetch(`${API_BASE}/people`).then((r) => r.json());

// Create assignment
const assignment = await fetch(`${API_BASE}/assignments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    duty_id: 1,
    person_id: 2,
    assigned_date: '2024-01-16',
    due_date: '2024-01-16',
  }),
}).then((r) => r.json());
```

### Python

```python
import requests

API_BASE = 'http://localhost:5000/api'

# Get all duties
response = requests.get(f'{API_BASE}/duties')
duties = response.json()

# Complete assignment
response = requests.post(f'{API_BASE}/assignments/1/complete',
  json={'notes': 'Task completed successfully'})
result = response.json()
```

### cURL

```bash
# Get assignments for a date range
curl -X GET "http://localhost:5000/api/assignments?start_date=2024-01-15&end_date=2024-01-21"

# Create a new person
curl -X POST http://localhost:5000/api/people \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"+1-555-0199"}'

# Generate weekly assignments
curl -X POST http://localhost:5000/api/admin/generate-assignments \
  -H "Content-Type: application/json" \
  -d '{"start_date":"2024-01-15","end_date":"2024-01-21"}'
```
