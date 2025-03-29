# API Documentation

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| POST | `/api/auth/register` | Register a new company | No | - |
| POST | `/api/auth/login` | Login and get authentication token | No | - |
| GET | `/api/auth/profile` | Get user profile | Yes | Any |
| POST | `/api/auth/change-password` | Change user password | Yes | Any |

## Company Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/companies` | Get all companies | Yes | Government |
| POST | `/api/companies` | Create a new company | Yes | Government |
| PUT | `/api/companies/approve/:id` | Approve/unapprove a company | Yes | Government |
| DELETE | `/api/companies/:id` | Delete a company | Yes | Government |
| GET | `/api/companies/:id` | Get company by ID | Yes | Company Owner or Government |
| PUT | `/api/companies/:id` | Update company details | Yes | Company Owner or Government |

## Sensor Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| POST | `/api/sensors` | Create a new sensor | Yes | Government |
| POST | `/api/sensors/report_reading` | Send sensor reading to the server | Yes | Company |
| GET | `/api/sensors` | Get all sensors | Yes | Government |
| GET | `/api/sensors/:id` | Get sensor by ID | Yes | Government |
| DELETE | `/api/sensors/:id` | Delete a sensor | Yes | Government |

## Authentication

All protected endpoints require a valid JWT token to be included in the request header:

```
Authorization: Bearer <token>
```

## Roles

- **Government**: Users with government role can manage all companies and sensors
- **Company Owner**: Users can only manage their own company details
- **Any**: Any authenticated user

## Error Responses

- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Valid token but insufficient permissions
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Server Error**: Internal server error

## Example Workflow

1. Register a company:
   ```
   POST /api/auth/register
   {
     "name": "Company Name",
     "username": "companyuser",
     "password": "securepassword",
     "walletAddress": "0x..."
   }
   ```

2. Login to get token:
   ```
   POST /api/auth/login
   {
     "username": "companyuser",
     "password": "securepassword"
   }
   ```
   Response contains JWT token

3. Access protected endpoints using the token in the Authorization header
