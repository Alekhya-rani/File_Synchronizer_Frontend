const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let djangoProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:3000'); // Your React frontend
}

function startDjangoServer() {
  const backendExe = path.join(__dirname, 'backend', 'manage.exe'); // compiled EXE
  djangoProcess = spawn(backendExe, [], {
    cwd: path.dirname(backendExe),
    shell: true,
  });

  djangoProcess.stdout.on('data', (data) => {
    console.log(`Django: ${data}`);
  });

  djangoProcess.stderr.on('data', (data) => {
    console.error(`Django error: ${data}`);
  });
}

app.whenReady().then(() => {
  startDjangoServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (djangoProcess) djangoProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
