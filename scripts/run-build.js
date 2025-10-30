const { spawn } = require('child_process');

const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const args = ['run', 'build'];

const p = spawn(cmd, args, { stdio: 'inherit' });

p.on('close', code => {
  console.log(`build process exited with code ${code}`);
  process.exit(code);
});
