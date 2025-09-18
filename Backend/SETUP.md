# Backend Setup Guide

## Quick Setup (Windows)

1. **Run the installation script**:
   ```bash
   install.bat
   ```

2. **Configure environment**:
   ```bash
   copy env.example .env
   ```
   
   Edit `.env` file with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/video_proctor_db
   JWT_SECRET=your_very_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=100MB
   UPLOAD_PATH=./uploads
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info
   ```

3. **Start MongoDB** (if not already running)

4. **Start the server**:
   ```bash
   npm run dev
   ```

## Manual Setup

If the installation script doesn't work, install dependencies manually:

```bash
# Core dependencies
npm install express mongoose jsonwebtoken bcryptjs cors helmet multer socket.io zod dotenv winston compression express-rate-limit

# TypeScript dependencies
npm install --save-dev typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/multer @types/compression nodemon ts-node

# Computer Vision dependencies
npm install @tensorflow/tfjs-node @mediapipe/face_mesh
```

## Troubleshooting

### OpenCV Issues
- We've removed the problematic `opencv4nodejs` package
- Using TensorFlow.js and MediaPipe instead for better compatibility

### TensorFlow.js Issues
- If TensorFlow.js fails to load, the system will fall back to simulation mode
- Check your internet connection for model downloads

### MediaPipe Issues
- MediaPipe models are loaded from CDN
- If CDN is blocked, the system will use simulation mode

## Testing the Setup

1. **Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"interviewer"}'
   ```

3. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Development

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm start`

## API Documentation

Once the server is running, you can test the API endpoints:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Interviews**: `/api/interviews/*`
- **Reports**: `/api/reports/*`

## Computer Vision Features

The system includes:
- **Face Detection**: Using MediaPipe Face Mesh
- **Object Detection**: Using TensorFlow.js COCO-SSD model
- **Focus Analysis**: Gaze direction detection
- **Fallback Mode**: Simulation when models fail to load

## Next Steps

1. Test the backend API endpoints
2. Set up the frontend to connect to this backend
3. Configure MongoDB for production use
4. Set up proper logging and monitoring
