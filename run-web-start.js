#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

process.chdir(path.join(__dirname, 'web'));
const child = spawn('npm', ['run', 'start'], { 
  stdio: 'inherit',
  shell: true 
});

child.on('error', (error) => {
  console.error('Error starting web production server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});