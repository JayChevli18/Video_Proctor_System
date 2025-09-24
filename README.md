# 🎥 Video Proctor System

A comprehensive AI-powered video proctoring system for online interviews with real-time focus detection, object recognition, and integrity scoring. Built with modern web technologies and computer vision capabilities.

![Video Proctor System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🚀 Features

### 🎯 Core Functionality
- **Real-time Focus Detection**: Monitors candidate attention using computer vision
- **Object Recognition**: Detects unauthorized items (phones, notes, devices)
- **Live Integrity Scoring**: Real-time scoring system (0-100)
- **Video Recording**: Automatic interview recording and storage
- **WebSocket Integration**: Real-time communication and updates

### 🔍 Detection Capabilities
- **Focus Loss**: Detects when candidate looks away (>5 seconds)
- **Face Absence**: Monitors for missing face detection (>10 seconds)
- **Multiple Faces**: Identifies presence of additional people
- **Phone Detection**: Recognizes mobile phones in frame
- **Notes Detection**: Identifies books, papers, and written materials
- **Device Detection**: Spots unauthorized electronic devices

### 👥 User Management
- **Role-based Access**: Interviewer, Candidate, and Admin roles
- **JWT Authentication**: Secure token-based authentication
- **User Profiles**: Comprehensive user management system
- **Session Management**: Secure login/logout functionality

### 📊 Reporting & Analytics
- **Comprehensive Reports**: Detailed integrity analysis
- **Historical Data**: Track performance over time
- **Export Capabilities**: Download reports in multiple formats
- **Real-time Dashboard**: Live monitoring and statistics

## 🏗️ Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React UI      │    │ • Express API   │    │ • User Data     │
│ • Redux Store   │    │ • Socket.io     │    │ • Interviews    │
│ • Real-time UI  │    │ • CV Detection  │    │ • Reports       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: Formik with Yup validation
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide React icons

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.io
- **Computer Vision**: TensorFlow.js, MediaPipe
- **File Upload**: Multer
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

#### Computer Vision
- **Face Detection**: MediaPipe Face Mesh
- **Object Detection**: TensorFlow.js COCO-SSD
- **Focus Analysis**: Gaze direction detection
- **Fallback Mode**: Simulation when models unavailable

## 📁 Project Structure

```
Video_Proctor_System/
├── Backend/                          # Node.js Backend
│   ├── src/
│   │   ├── config/                   # Database configuration
│   │   ├── controllers/              # API controllers
│   │   ├── middleware/               # Custom middleware
│   │   ├── models/                   # MongoDB schemas
│   │   ├── routes/                   # API routes
│   │   ├── services/                 # Business logic
│   │   ├── utils/                    # Utility functions
│   │   └── server.ts                 # Main server file
│   ├── package.json
│   └── README.md
├── Frontend/                         # Next.js Frontend
│   └── video_proctor_system/
│       ├── src/
│       │   ├── app/                  # Next.js App Router
│       │   ├── components/           # React components
│       │   ├── hooks/                # Custom hooks
│       │   ├── lib/                  # Utility libraries
│       │   ├── store/                # Redux store
│       │   └── types/                # TypeScript types
│       ├── package.json
│       └── README.md
└── README.md                         # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **MongoDB** 4.4+
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Video_Proctor_System
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Setup environment
cp env.example .env

# Edit .env file with your configuration
# Required: MONGODB_URI, JWT_SECRET

# Start MongoDB (if not running)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend/video_proctor_system

# Install dependencies
npm install

# Setup environment (creates .env.local)
npm run setup

# Start frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## ⚙️ Configuration

### Backend Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/video_proctor_db

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Interview Management
- `GET /api/interviews` - Get interviews
- `GET /api/interviews/:id` - Get interview by ID
- `POST /api/interviews` - Create interview
- `PUT /api/interviews/:id` - Update interview
- `PUT /api/interviews/:id/start` - Start interview
- `PUT /api/interviews/:id/end` - End interview
- `POST /api/interviews/:id/detection` - Add detection event

### Reporting
- `GET /api/reports` - Get all reports
- `POST /api/reports/generate/:interviewId` - Generate report
- `GET /api/reports/interview/:interviewId` - Get report by interview

## 🎯 Integrity Scoring System

The system calculates an integrity score (0-100) based on detected events:

| Event Type | Points Deducted | Description |
|------------|----------------|-------------|
| Focus Lost | -2 | Candidate looking away from screen |
| Face Absent | -5 | No face detected in frame |
| Multiple Faces | -10 | More than one face detected |
| Phone Detected | -15 | Mobile phone visible in frame |
| Notes Detected | -20 | Books or paper notes visible |
| Device Detected | -10 | Unauthorized electronic devices |

**Final Score Calculation**: `100 - (Total Deductions)`

## 🔌 WebSocket Events

Real-time communication via Socket.io:

- `join-interview` - Join interview room
- `interview-started` - Interview started
- `interview-ended` - Interview ended
- `detection-event` - New detection event
- `integrity-update` - Real-time score updates

## 🛡️ Security Features

### Backend Security
- JWT authentication with secure tokens
- Password hashing using bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with Zod
- File upload restrictions

### Frontend Security
- Protected routes and components
- Role-based access control
- Secure API communication
- Input validation and sanitization
- XSS protection

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
```

### Frontend Testing
```bash
cd Frontend/video_proctor_system
npm run lint
```

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"interviewer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd Backend
npm run build
npm start

# Frontend
cd Frontend/video_proctor_system
npm run build
npm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure CORS for production domain
5. Set up proper logging

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Performance Optimizations

### Frontend
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization
- Efficient re-rendering with React.memo

### Backend
- Database indexing
- Query optimization
- Caching with Redis (optional)
- Compression middleware
- Rate limiting

## 🔧 Troubleshooting

### Common Issues

#### Computer Vision Models Not Loading
- Check internet connection for model downloads
- System falls back to simulation mode
- Verify TensorFlow.js and MediaPipe dependencies

#### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify database permissions

#### CORS Errors
- Update CORS_ORIGIN in backend .env
- Ensure frontend URL matches backend configuration

#### Socket.io Connection Issues
- Check WebSocket URL configuration
- Verify firewall settings
- Ensure both servers are running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use proper error handling
- Add comprehensive logging
- Write tests for new features
- Update documentation
- Follow conventional commit messages

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TensorFlow.js** for computer vision capabilities
- **MediaPipe** for face detection
- **Next.js** for the amazing React framework
- **MongoDB** for the flexible database solution
- **Socket.io** for real-time communication

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for secure and fair online interviews**
