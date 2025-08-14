# District Controller Guide

This guide explains the district controller setup, which follows the same pattern as the country controller with MySQL database integration.

## Overview

The district controller provides a complete REST API for managing districts in the MySQL database. It follows the exact same pattern as the country controller for consistency.

## File Structure

```
Dronam/backend/
├── controllers/
│   ├── districtController.js      # Main district controller (new)
│   └── districtControllerUpdated.js # Enhanced version (existing)
├── routes/
│   └── districtRoutes.js          # District routes (new)
└── scripts/
    └── testDistrictApi.js         # Test script for API testing
```

## API Endpoints

### Base URL
All district endpoints are available at: `http://localhost:3001/api/districts`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all districts |
| GET | `/:id` | Get district by ID |
| POST | `/` | Create new district |
| PUT | `/:id` | Update district |
| DELETE | `/:id` | Delete district |

### Request/Response Examples

#### GET /api/districts
```json
[
  {
    "district_id": 1,
    "district_name": "Bangalore Urban",
    "district_code": "BLR",
    "state_id": 1,
    "description": "Capital district",
    "status": 1,
    "created_by_id": 1,
    "created_date": "2024-01-01T00:00:00.000Z",
    "updated_by_id": null,
    "updated_date": null
  }
]
```

#### POST /api/districts
**Request Body:**
```json
{
  "district_name": "Mumbai Suburban",
  "district_code": "MUM",
  "state_id": 2,
  "description": "Financial capital district",
  "status": 1,
  "created_by_id": 1
}
```

**Response:**
```json
{
  "message": "District created successfully!",
  "district": {
    "district_id": 2,
    "district_name": "Mumbai Suburban",
    "district_code": "MUM",
    "state_id": 2,
    "description": "Financial capital district",
    "status": 1,
    "created_by_id": 1,
    "created_date": "2024-01-01T00:00:00.000Z",
    "updated_by_id": null,
    "updated_date": null
  }
}
```

## Database Schema

### Districts Table
```sql
CREATE TABLE IF NOT EXISTS districts (
  district_id INT AUTO_INCREMENT PRIMARY KEY,
  district_name VARCHAR(255) NOT NULL,
  district_code VARCHAR(50) NOT NULL,
  state_id INT,
  description TEXT,
  status TINYINT DEFAULT 1,
  created_by_id INT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_id INT,
  updated_date TIMESTAMP NULL,
  FOREIGN KEY (state_id) REFERENCES states(state_id)
);
```

## MySQL Connection

The district controller uses the same MySQL connection pool as other controllers:

```javascript
const { pool } = require('../config/database');
```

### Database Configuration
- **Host**: localhost (or from environment variable)
- **User**: root (or from environment variable)
- **Password**: Sudarshan@7234 (or from environment variable)
- **Database**: dronam (or from environment variable)
- **Port**: 3306 (or from environment variable)

## Usage Examples

### 1. Start the server
```bash
cd Dronam/backend
npm start
```

### 2. Test the API
```bash
# Run the test script
node scripts/testDistrictApi.js

# Or test individual endpoints
curl http://localhost:3001/api/districts
```

### 3. Create a district programmatically
```javascript
const axios = require('axios');

const newDistrict = {
  district_name: 'Chennai',
  district_code: 'CHN',
  state_id: 3,
  description: 'Tamil Nadu capital',
  created_by_id: 1
};

axios.post('http://localhost:3001/api/districts', newDistrict)
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## Error Handling

The district controller includes comprehensive error handling:

- **400 Bad Request**: Missing required fields or duplicate district code
- **404 Not Found**: District not found
- **500 Internal Server Error**: Database or server errors

## Validation Rules

- **district_name**: Required, string
- **district_code**: Required, string, must be unique
- **state_id**: Required, integer, must reference existing state
- **description**: Optional, string
- **status**: Optional, defaults to 1 (active)

## Relationships

- **states**: Each district belongs to a state (foreign key: state_id)
- **zones**: Districts can have multiple zones (one-to-many relationship)

## Testing

The test script `testDistrictApi.js` provides comprehensive testing:
- Get all districts
- Create a new district
- Get district by ID
- Update district
- Delete district

Run tests with:
```bash
node scripts/testDistrictApi.js
```

## Integration with Frontend

The district controller can be integrated with frontend components like:
- DistrictMaster.jsx
- DistrictMasterUpdated.jsx
- ZoneMasterUpdated.jsx (for zone creation within districts)

## Best Practices

1. **Consistent Pattern**: Follows the same pattern as countryController for consistency
2. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
3. **Validation**: Input validation for required fields
4. **Database Transactions**: Uses MySQL connection pool for efficient database operations
5. **Security**: Prepared statements to prevent SQL injection
6. **Scalability**: Designed to handle large datasets efficiently
