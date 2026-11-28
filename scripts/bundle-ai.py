from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parents[1]
for archive in (root / "release").glob("*.zip"):
    with ZipFile(archive, "a") as z:
        for file in (root / "AI").iterdir():
            if file.is_file():
                z.write(file, "AI/" + file.name)
    print("Bundled AI launcher:", archive)
