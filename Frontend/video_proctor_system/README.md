# Video Proctor System - Frontend

A comprehensive frontend application for the Video Proctor System, built with Next.js, React, and modern web technologies. This application provides a complete interface for managing online interviews with real-time AI-powered proctoring capabilities.

## Features

- **🔐 Authentication System**: Secure login/register with JWT token management
- **📊 Dashboard**: Comprehensive overview with statistics and quick actions
- **📅 Interview Management**: Create, schedule, and manage interview sessions
- **🎥 Live Proctoring**: Real-time video monitoring with AI detection
- **📈 Reporting System**: Detailed integrity reports and analytics
- **👥 User Management**: Role-based access control (Interviewer, Candidate, Admin)
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: WebSocket integration for live detection events
- **🎨 Modern UI**: Beautiful, intuitive interface with Tailwind CSS

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with Redux Persist
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: Formik with Yup validation
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Video**: React Webcam

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── interviews/        # Interview management
│   ├── proctoring/        # Live proctoring interface
│   └── reports/           # Reports and analytics
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── proctoring/        # Proctoring-specific components
│   └── ui/                # Generic UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api.ts            # API client configuration
│   ├── socket.ts         # Socket.io client
│   └── utils.ts          # Utility functions
├── store/                 # Redux store configuration
│   ├── slices/           # Redux slices
│   └── index.ts          # Store setup
└── types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running on http://localhost:5000

### Installation

1. **Clone and Setup**
   ```bash
   cd Frontend/video_proctor_system
   npm run setup
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Configuration

The setup script creates a `.env.local` file with default configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run setup` - Initial setup and dependency installation

## Key Features

### Authentication
- Secure JWT-based authentication
- Role-based access control
- Protected routes and components
- Automatic token refresh

### Dashboard
- Overview statistics and metrics
- Recent interviews and reports
- Quick action buttons
- Real-time updates

### Interview Management
- Create and schedule interviews
- Manage interview lifecycle
- View interview details
- Start/stop interview sessions

### Live Proctoring
- Real-time video monitoring
- AI-powered detection events
- Live integrity scoring
- WebSocket integration for instant updates

### Reporting System
- Comprehensive integrity reports
- Detailed analytics and insights
- Export capabilities
- Historical data tracking

## API Integration

The frontend integrates with the backend API through:

- **REST API**: For CRUD operations
- **WebSocket**: For real-time updates
- **File Upload**: For video processing
- **Authentication**: JWT token management

## State Management

Uses Redux Toolkit for predictable state management:

- **Auth Slice**: User authentication and profile
- **UI Slice**: Application UI state
- **Interview Slice**: Interview data and operations
- **Report Slice**: Report data and generation

## Real-time Features

- Live detection events via WebSocket
- Real-time integrity score updates
- Instant notifications for violations
- Live interview status updates

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## Security Features

- JWT token authentication
- Protected routes and components
- Role-based access control
- Secure API communication
- Input validation and sanitization

## Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization
- Efficient re-rendering

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Write responsive components
4. Add proper loading states
5. Include accessibility features

## License

ISC License
