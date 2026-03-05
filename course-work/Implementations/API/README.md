# Pet Finder API

## 📋 Overview

Pet Finder API is a comprehensive REST API built with Node.js and Express.js that powers a pet finder application. The API allows users to post about lost pets, search for missing animals, comment on posts, and manage their accounts. This is a distributed application designed to help reunite lost pets with their owners.

## 🎯 Features

- **User Authentication**: Secure registration and login with JWT tokens stored in HTTP-only cookies
- **User Management**: Get, update, and delete user profiles
- **Pet Posts**: Create, read, update, and delete posts about lost pets
- **Image Upload**: Support for uploading pet images with automatic file management
- **Comments**: Add comments to pet posts to provide tips or information
- **Category Support**: Organize lost pets by category (dog, cat, parrot, snake)
- **Location Tracking**: Track where pets were lost
- **Status Tracking**: Mark posts as found/unfound
- **Secure Endpoints**: All endpoints (except auth) are protected with authentication middleware

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MySQL (via mysql2)
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **File Upload**: Multer
- **API Documentation**: Swagger/OpenAPI with swagger-jsdoc and swagger-ui-express
- **CORS**: Cross-origin resource sharing enabled
- **Cookie Parser**: For secure cookie management
- **Environment Variables**: dotenv for configuration management

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL database running
- npm or yarn package manager

### Setup Steps

1. **Navigate to the API directory**:

   ```bash
   cd course-work/Implementations/API
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your database configuration:
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=pet_finder
     PORT=3000
     HOST_NAME=localhost
     NODE_ENV=development
     ACCESS_TOKEN_SECRET=your_secret_key
     CLIENT_ORIGIN=http://localhost:3000
     ```

4. **Start the database** (if using Docker):
   ```bash
   cd ../DB
   docker compose up
   ```

## 🚀 Running the API

### Development Mode (with auto-reload)

```bash
npm run dev-server
```

### Production Mode

```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation & Testing with Swagger

### Accessing Swagger UI

Once the API is running, open your browser and navigate to:

```
http://localhost:3000/api-docs
```

### Features of Swagger UI

1. **View All Endpoints**: See all available API endpoints organized by tags
2. **Interactive Testing**: Test endpoints directly from the browser
3. **Schema Validation**: View request/response schemas
4. **Authentication**: Understand which endpoints require authentication
5. **Example Responses**: See example responses for each endpoint

## 📋 API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| POST   | `/auth/register` | Register a new user | ❌            |
| POST   | `/auth/login`    | Login user          | ❌            |
| POST   | `/auth/logout`   | Logout user         | ❌            |

### User Endpoints

| Method | Endpoint | Description           | Auth Required |
| ------ | -------- | --------------------- | ------------- |
| GET    | `/user`  | Get current user info | ✅            |
| PATCH  | `/user`  | Update user profile   | ✅            |
| DELETE | `/user`  | Delete user account   | ✅            |

### Post Endpoints

| Method | Endpoint     | Description               | Auth Required |
| ------ | ------------ | ------------------------- | ------------- |
| GET    | `/posts`     | Get all unfound pet posts | ✅            |
| GET    | `/posts/:id` | Get user's own posts      | ✅            |
| POST   | `/posts`     | Create a new post         | ✅            |
| PATCH  | `/posts/:id` | Update a post             | ✅            |
| DELETE | `/posts/:id` | Delete a post             | ✅            |

### Comment Endpoints

| Method | Endpoint            | Description            | Auth Required |
| ------ | ------------------- | ---------------------- | ------------- |
| GET    | `/comments/:postId` | Get comments on a post | ✅            |
| POST   | `/comments`         | Create a comment       | ✅            |
| PATCH  | `/comments/:id`     | Update a comment       | ✅            |
| DELETE | `/comments/:id`     | Delete a comment       | ✅            |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Bcrypt Password Hashing**: Passwords are hashed with bcrypt (SALT_ROUNDS = 10)
- **HTTP-only Cookies**: Tokens stored in secure, HTTP-only cookies
- **CORS Protection**: CORS enabled with specific origin configuration
- **Authorization Checks**: Users can only update/delete their own posts and comments
- **Input Validation**: Server-side validation for all inputs

## 📂 Project Structure

```
src/
├── index.js                 # Main application entry point
├── utils.js                 # Utility functions
├── config/
│   ├── constants.js         # Configuration constants
│   ├── db.js                # Database connection setup
│   └── swagger.js           # Swagger/OpenAPI configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management logic
│   ├── postController.js    # Post management logic
│   └── commentController.js # Comment management logic
├── middlewares/
│   └── auth.js              # JWT authentication middleware
└── models/
    ├── User.js              # User model
    ├── Post.js              # Post model
    └── Comment.js           # Comment model
```

## 👨‍💻 Author

Mehmed Yunuz - stu2401322028@uni-plovdiv.bg

## 📄 License

ISC License

---

**Happy pet finding! 🐾**
