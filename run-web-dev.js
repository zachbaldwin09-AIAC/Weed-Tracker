#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const webDir = path.join(__dirname, 'web');
process.chdir(webDir);

// Check if node_modules exists in web directory, if not, install dependencies
if (!fs.existsSync(path.join(webDir, 'node_modules'))) {
  console.log('Installing web dependencies...');
  const installChild = spawn('npm', ['install'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  installChild.on('exit', (code) => {
    if (code !== 0) {
      console.error('Failed to install dependencies');
      process.exit(1);
    }
    startDevServer();
  });
} else {
  startDevServer();
}

function startDevServer() {
  // Use npx to ensure we use local dependencies
  const child = spawn('npx', ['tsx', 'server/index.ts'], { 
    stdio: 'inherit',
    shell: true,
    env: { 
      ...process.env, 
      NODE_ENV: 'development',
      PATH: path.join(webDir, 'node_modules', '.bin') + ':' + process.env.PATH
    }
  });

  child.on('error', (error) => {
    console.error('Error starting web dev server:', error);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code);
  });
}