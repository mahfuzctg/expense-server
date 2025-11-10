# Expense Insight Dashboard - Backend

A modular backend API for tracking personal expenses built with Node.js, Express.js, TypeScript, and MongoDB. Includes user authentication with JWT and user-specific expense management.

## 🎯 Features

- ✅ User authentication (JWT + bcrypt)
  - Register new users
  - Login users
  - Get current user profile (/me)
- ✅ User-specific expenses (each user can only access their own data)
- ✅ Add, edit, delete, and view expenses
- ✅ Filter expenses by category and month
- ✅ Chart endpoint - get total expenses by category
- ✅ Data persistence in MongoDB
- ✅ Type-safe with TypeScript
- ✅ Input validation with Zod
- ✅ Error handling middleware
- ✅ Security with Helmet and CORS
- ✅ Request logging with Morgan

## 🏗️ Project Structure

```
expense-insight-backend/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── index.ts                  # Environment & DB config
│   │   ├── modules/
│   │   │   ├── user/
│   │   │   │   ├── user.constant.ts      # User roles constants
│   │   │   │   ├── user.interface.ts     # TypeScript interfaces
│   │   │   │   ├── user.model.ts         # Mongoose schema & model
│   │   │   │   ├── user.service.ts       # Business logic
│   │   │   │   ├── user.controller.ts    # Express controller
│   │   │   │   └── user.route.ts         # API routes
│   │   │   ├── auth/
│   │   │   │   ├── auth.constant.ts      # Auth messages
│   │   │   │   ├── auth.interface.ts     # TypeScript interfaces
│   │   │   │   ├── auth.validation.ts    # Zod validation schemas
│   │   │   │   ├── auth.service.ts       # Business logic
│   │   │   │   ├── auth.controller.ts    # Express controller
│   │   │   │   └── auth.route.ts         # API routes
│   │   │   └── expense/
│   │   │       ├── expense.constant.ts   # Category enums
│   │   │       ├── expense.interface.ts  # TypeScript interfaces
│   │   │       ├── expense.validation.ts # Zod validation schemas
│   │   │       ├── expense.model.ts      # Mongoose schema & model
│   │   │       ├── expense.service.ts    # Business logic
│   │   │       ├── expense.controller.ts # Express controller
│   │   │       └── expense.route.ts      # API routes
│   │   ├── utils/
│   │   │   ├── ApiError.ts               # Custom error handler
│   │   │   ├── catchAsync.ts             # Async error handler
│   │   │   └── sendResponse.ts           # Response helper
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts        # JWT authentication
│   │   │   ├── validateRequest.ts        # Request validation
│   │   │   ├── globalErrorHandler.ts     # Global error handler
│   │   │   └── notFound.ts               # 404 handler
│   │   └── app.ts                        # Express app configuration
│   └── server.ts                         # Entry point
├── .env                                  # Environment variables
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies
└── README.md                             # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or remote instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-insight-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/expense-insight

   # JWT Configuration
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_IN=7

   # Optional: Frontend URL for CORS
   # FRONTEND_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update `MONGO_URI` in `.env` with your MongoDB connection string.

5. **Run the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Health Check
- **GET** `/health` - Check server status
- **GET** `/` - API information

### Authentication (Public)
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user

### User (Protected - requires authentication)
- **GET** `/api/users/me` - Get current user profile

### Expenses (Protected - requires authentication)
- **POST** `/api/expenses` - Create a new expense
- **GET** `/api/expenses` - Get all expenses (with optional filters)
- **GET** `/api/expenses/chart` - Get expenses by category for chart
- **GET** `/api/expenses/:id` - Get a single expense by ID
- **PUT** `/api/expenses/:id` - Update an expense by ID
- **DELETE** `/api/expenses/:id` - Delete an expense by ID

### Query Parameters (GET /api/expenses)
- `category` - Filter by category (Food, Transport, Utilities, Other)
- `month` - Filter by month (1-12)
- `year` - Filter by year (e.g., 2024)

## 📝 API Examples

### Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Get Current User (Protected)
```bash
GET /api/users/me
Authorization: Bearer <token>
```

### Create an Expense (Protected)
```bash
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lunch at Restaurant",
  "category": "Food",
  "amount": 25.50,
  "date": "2024-01-15T12:00:00.000Z"
}
```

### Get All Expenses (Protected)
```bash
GET /api/expenses
Authorization: Bearer <token>
```

### Get Expenses by Category (Protected)
```bash
GET /api/expenses?category=Food
Authorization: Bearer <token>
```

### Get Expenses by Month (Protected)
```bash
GET /api/expenses?month=1&year=2024
Authorization: Bearer <token>
```

### Get Chart Data (Protected)
```bash
GET /api/expenses/chart
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Chart data retrieved successfully",
  "data": [
    {
      "category": "Food",
      "total": 150.50,
      "count": 5
    },
    {
      "category": "Transport",
      "total": 80.00,
      "count": 3
    },
    ...
  ]
}
```

### Update an Expense (Protected)
```bash
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 30.00,
  "title": "Updated Title"
}
```

### Delete an Expense (Protected)
```bash
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

## 🗂️ Data Models

### User Schema
```typescript
{
  name: string;        // Required, 2-50 characters
  email: string;       // Required, unique, valid email
  password: string;    // Required, min 6 characters (hashed)
  role: string;        // Default: 'user'
}
```

### Expense Schema
```typescript
{
  title: string;        // Required, max 100 characters
  category: enum;       // Required, one of: Food, Transport, Utilities, Other
  amount: number;       // Required, must be positive, minimum 0.01
  date: Date;          // Required, ISO date string
  createdBy: ObjectId; // Required, reference to User (automatically set)
}
```

## 🔒 Authentication

All expense endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is obtained from the login or register endpoint and expires after 7 days (configurable).

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run type-check` - Run TypeScript type checking

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Helmet** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing configuration
- **Input Validation** - Zod schemas for request validation
- **Error Handling** - Comprehensive error handling middleware
- **User Isolation** - Users can only access their own expenses

## 🧪 Testing

API endpoints can be tested using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

### Example cURL commands:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get expenses (replace TOKEN with actual token)
curl http://localhost:3000/api/expenses \
  -H "Authorization: Bearer TOKEN"
```

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variable management
- `cors` - CORS middleware
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `zod` - Schema validation
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing

### Development
- `typescript` - TypeScript compiler
- `ts-node-dev` - TypeScript development server
- `@types/*` - TypeScript type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env` file
- Verify MongoDB connection string format

### Authentication Issues
- Verify `JWT_SECRET` is set in `.env` file
- Check token expiration
- Ensure token is included in Authorization header

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

### TypeScript Errors
- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed
- Check `tsconfig.json` configuration

## 📝 Notes

- Each user can only access their own expenses
- Expenses are automatically associated with the authenticated user
- Chart data is user-specific and shows totals by category
- All expense operations require authentication
# expense-server
