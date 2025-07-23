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

  win.loadURL('http://localhost:3000'); // React frontend
}

function startDjangoServer() {
  const script = path.join(__dirname, 'backend', 'venv', 'Scripts', 'python.exe');
  const manage = path.join(__dirname, 'backend', 'manage.py');
  djangoProcess = spawn(script, [manage, 'runserver', '8000']);

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
