const fs = require("fs");
const file = "index.html";
let html = fs.readFileSync(file, "utf8");
html = html.replace('<html lang="ru">', '<html lang="ru" data-offline="true" data-desktop="true">');
html = html.replace('<button id="download">', '<button id="download" hidden>');
html = html.replace("Играть в браузере ↗", "Войти в гараж ↗");
fs.writeFileSync(file, html);
