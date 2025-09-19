#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Video Proctor Frontend...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create environment file
const envPath = path.join(__dirname, '.env.local');
const envContent = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_NAME=Video Proctor System
NEXT_PUBLIC_APP_VERSION=1.0.0
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with default configuration');
} else {
  console.log('📄 .env.local file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Frontend setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure the backend server is running on http://localhost:5000');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. The frontend will be available at http://localhost:3000');
console.log('\n🔧 Available scripts:');
console.log('- npm run dev: Start development server');
console.log('- npm run build: Build the project for production');
console.log('- npm start: Start production server');
console.log('- npm run lint: Run ESLint');
console.log('\n📚 Features:');
console.log('- Real-time video proctoring with AI detection');
console.log('- Interview management and scheduling');
console.log('- Comprehensive reporting system');
console.log('- User authentication and role-based access');
console.log('- Responsive design for all devices');
