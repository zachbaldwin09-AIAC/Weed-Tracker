#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

process.chdir(path.join(__dirname, 'web'));
const child = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

child.on('error', (error) => {
  console.error('Error starting web dev server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});