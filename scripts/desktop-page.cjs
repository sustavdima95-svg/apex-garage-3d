const fs = require("fs");
const file = "index.html";
let html = fs.readFileSync(file, "utf8");
html = html.replace('<html lang="ru">', '<html lang="ru" data-offline="true" data-desktop="true">');
html = html.replace(/<button id="download">[^<]*<\/button>/, '<button id="download" hidden></button><button type="button" id="desktopReleases">Скачать актуальную версию</button>');
html = html.replace("</body>", '<script>document.getElementById("desktopReleases").onclick=()=>window.open("https://github.com/sustavdima95-svg/apex-garage-3d/releases/latest","_blank");</script></body>');
html = html.replace("Играть в браузере ↗", "Играть");
fs.writeFileSync(file, html);

