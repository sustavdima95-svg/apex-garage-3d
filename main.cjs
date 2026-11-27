const { app, BrowserWindow, session } = require("electron");
const path = require("path");

app.setName("Apex Garage 3D");

app.whenReady().then(async () => {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const allowed = ["file:", "data:", "blob:"].some(prefix => details.url.startsWith(prefix));
    callback({ cancel: !allowed });
  });
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 800,
    minHeight: 580,
    title: "Apex Garage 3D",
    backgroundColor: "#10151b",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  window.removeMenu();
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:")) event.preventDefault();
  });
  await window.loadFile(path.join(__dirname, "index.html"));
});
app.on("window-all-closed", () => app.quit());
