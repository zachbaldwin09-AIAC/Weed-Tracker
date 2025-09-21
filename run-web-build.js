#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

process.chdir(path.join(__dirname, 'web'));
const child = spawn('npm', ['run', 'build'], { 
  stdio: 'inherit',
  shell: false 
});

child.on('error', (error) => {
  console.error('Error building web app:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});