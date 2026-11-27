const { app, BrowserWindow, session, dialog, shell } = require("electron");
const path = require("path");

const releasesPage = "https://github.com/sustavdima95-svg/apex-garage-3d/releases/latest";
const releaseApi = "https://api.github.com/repos/sustavdima95-svg/apex-garage-3d/releases/latest";

function newerVersion(tag, installed) {
  const parse = value => /^v?(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number);
  const latest = parse(tag), current = parse(installed);
  if (!latest || !current) return false;
  for (let i = 0; i < latest.length; i++) {
    if (latest[i] !== current[i]) return latest[i] > current[i];
  }
  return false;
}

function watchReleases(window) {
  let announced = "", busy = false;
  async function check() {
    if (busy || window.isDestroyed()) return;
    busy = true;
    try {
      const response = await fetch(releaseApi, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "ApexGarage3D/" + app.getVersion() },
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) return;
      const release = await response.json();
      if (window.isDestroyed() || release.draft || release.prerelease ||
          release.tag_name === announced || !newerVersion(release.tag_name, app.getVersion())) return;
      const platform = { win32: "win", linux: "Linux", darwin: "mac" }[process.platform];
      const filename = "ApexGarage3D-" + platform + "-" + process.arch + ".zip";
      if (!release.assets?.some(asset => asset.name === filename && asset.state === "uploaded")) return;
      announced = release.tag_name;
      const answer = await dialog.showMessageBox(window, {
        type: "info", title: "Обновление Apex Garage 3D",
        message: "Вышла версия " + announced.slice(1),
        detail: "У тебя установлена " + app.getVersion() + ". Открой страницу релиза в браузере и скачай " + filename + ".",
        buttons: ["Открыть скачивание", "Позже"], defaultId: 0, cancelId: 1
      });
      if (answer.response === 0) await shell.openExternal(releasesPage);
    } catch { /* The local game remains playable offline. */ }
    finally { busy = false; }
  }
  void check();
  const timer = setInterval(check, 4 * 60 * 60 * 1000);
  window.once("closed", () => clearInterval(timer));
}

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
      autoplayPolicy: "no-user-gesture-required",
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  window.removeMenu();
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url === releasesPage) void shell.openExternal(releasesPage).catch(() => {});
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:")) event.preventDefault();
  });
  await window.loadFile(path.join(__dirname, "index.html"));
  watchReleases(window);
});
app.on("window-all-closed", () => app.quit());
