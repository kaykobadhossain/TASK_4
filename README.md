# Task Manager API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

### 3. Get Profile
**GET** `/api/auth/profile`

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2025-01-11T10:30:00.000Z"
  }
}
```

---

## Task Endpoints

### 1. Create Task
**POST** `/api/tasks`

Create a new task (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "user_id": 1,
    "created_at": "2025-01-11T10:30:00.000Z",
    "updated_at": "2025-01-11T10:30:00.000Z"
  }
}
```

---

### 2. Get User Tasks
**GET** `/api/tasks`

Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, completed)

**Example:**
```
GET /api/tasks?status=pending
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "user_id": 1,
      "created_at": "2025-01-11T10:30:00.000Z",
      "updated_at": "2025-01-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Review code",
      "description": "Review pull requests",
      "status": "in-progress",
      "user_id": 1,
      "created_at": "2025-01-11T11:00:00.000Z",
      "updated_at": "2025-01-11T11:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Task
**GET** `/api/tasks/:id`

Get a specific task by ID (user can only access their own tasks).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "user_id": 1,
    "created_at": "2025-01-11T10:30:00.000Z",
    "updated_at": "2025-01-11T10:30:00.000Z"
  }
}
```

---

### 4. Update Task
**PUT** `/api/tasks/:id`

Update a task (user can only update their own tasks).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation - Updated",
  "description": "Write comprehensive API documentation with examples",
  "status": "in-progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation - Updated",
    "description": "Write comprehensive API documentation with examples",
    "status": "in-progress",
    "user_id": 1,
    "created_at": "2025-01-11T10:30:00.000Z",
    "updated_at": "2025-01-11T12:00:00.000Z"
  }
}
```

---

### 5. Delete Task
**DELETE** `/api/tasks/:id`

Delete a task (user can only delete their own tasks).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 6. Get All Tasks (Admin Only)
**GET** `/api/tasks/admin/all`

Get all tasks from all users (admin role required).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "user_id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2025-01-11T10:30:00.000Z",
      "updated_at": "2025-01-11T10:30:00.000Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Email is required", "Password must be at least 6 characters long"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. You can only access your own tasks."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Testing with Postman/Thunder Client

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the token from the response.

### 3. Create a Task
```
POST http://localhost:5000/api/tasks
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "title": "My First Task",
  "description": "This is a test task",
  "status": "pending"
}
```

### 4. Get All Your Tasks
```
GET http://localhost:5000/api/tasks
Authorization: Bearer <your_token_here>
```

---

## Status Values
Tasks can have the following status values:
- `pending` - Task is not started
- `in-progress` - Task is being worked on
- `completed` - Task is finished

## User Roles
- `user` - Regular user (default)
- `admin` - Administrator with elevated privileges

# Database Schema
```
-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_id ON tasks(user_id);
CREATE INDEX idx_status ON tasks(status);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
```
