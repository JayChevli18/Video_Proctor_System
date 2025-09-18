# Video Proctor System - Backend

A comprehensive backend system for video proctoring during online interviews with real-time focus and object detection.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Interview Management**: Create, schedule, and manage interview sessions
- **Real-time Detection**: Computer vision-based detection of focus loss and unauthorized objects
- **Video Processing**: Upload and process interview recordings
- **Reporting**: Generate comprehensive proctoring reports with integrity scores
- **WebSocket Support**: Real-time communication for live detection events

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Computer Vision**: TensorFlow.js, OpenCV, MediaPipe
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── interviewController.ts # Interview management
│   ├── reportController.ts  # Report generation
│   └── userController.ts    # User management
├── middleware/
│   ├── auth.ts             # Authentication middleware
│   └── errorHandler.ts     # Error handling
├── models/
│   ├── User.ts             # User schema
│   ├── Interview.ts        # Interview schema
│   └── Report.ts           # Report schema
├── routes/
│   ├── authRoutes.ts       # Authentication routes
│   ├── interviewRoutes.ts  # Interview routes
│   ├── reportRoutes.ts     # Report routes
│   └── userRoutes.ts       # User routes
├── services/
│   ├── computerVisionService.ts # CV detection logic
│   └── videoProcessingService.ts # Video processing
├── utils/
│   └── logger.ts           # Logging utility
└── server.ts               # Main server file
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/video_proctor_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=100MB
   UPLOAD_PATH=./uploads
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system.

4. **Run the application**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/role/:role` - Get users by role

### Interviews
- `GET /api/interviews` - Get interviews
- `GET /api/interviews/:id` - Get interview by ID
- `POST /api/interviews` - Create interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview
- `PUT /api/interviews/:id/start` - Start interview
- `PUT /api/interviews/:id/end` - End interview
- `POST /api/interviews/:id/detection` - Add detection event

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports/generate/:interviewId` - Generate report
- `GET /api/reports/interview/:interviewId` - Get report by interview

## Detection Types

The system detects the following events:

1. **Focus Lost**: Candidate looking away from screen (>5 seconds)
2. **Face Absent**: No face detected in frame (>10 seconds)
3. **Multiple Faces**: More than one face detected
4. **Phone Detected**: Mobile phone visible in frame
5. **Notes Detected**: Books or paper notes visible
6. **Device Detected**: Unauthorized electronic devices

## Integrity Scoring

The system calculates an integrity score (0-100) based on detected events:

- Focus Lost: -2 points per event
- Face Absent: -5 points per event
- Multiple Faces: -10 points per event
- Phone Detected: -15 points per event
- Notes Detected: -20 points per event
- Device Detected: -10 points per event

## WebSocket Events

Real-time events emitted via Socket.io:

- `join-interview` - Join interview room
- `interview-started` - Interview started
- `interview-ended` - Interview ended
- `detection-event` - New detection event

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

### Logging
Logs are written to:
- Console (development)
- `logs/error.log` (error logs)
- `logs/combined.log` (all logs)

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Zod
- File upload restrictions

## Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Add logging for important operations
4. Write tests for new features
5. Update documentation

## License

ISC
