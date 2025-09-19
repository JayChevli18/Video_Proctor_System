#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Video Proctor System Frontend...\n');

// Create .env.local file if it doesn't exist
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local from .env.example');
  } else {
    const envContent = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME=Video Proctor System
NEXT_PUBLIC_APP_VERSION=1.0.0
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local with default configuration');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n🎉 Frontend setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure the backend server is running on http://localhost:5000');
console.log('2. Run "npm run dev" to start the frontend development server');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n🔧 Configuration:');
console.log('- API URL: http://localhost:5000/api');
console.log('- Socket URL: http://localhost:5000');
console.log('- Update .env.local if you need different URLs');