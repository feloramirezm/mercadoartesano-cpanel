import os
import hashlib
from pathlib import Path

HASH_FILE = ".deploy-hashes"
DEPLOY_LIST = ".deploy-to-upload.txt"
EXCLUDES = [
    ".git", ".github", "venv", "__pycache__",
    ".env", "staticfiles", "db-respaldo.sqlite3"
]

def file_should_be_skipped(path):
    for excl in EXCLUDES:
        if excl in path.parts or path.name.endswith(excl) or path.match(excl):
            return True
    return False

def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def load_old_hashes():
    if not os.path.exists(HASH_FILE):
        return {}
    with open(HASH_FILE, 'r') as f:
        lines = f.readlines()
    return dict(line.strip().split("  ", 1) for line in lines)

def main():
    new_hashes = {}
    files_to_upload = []
    old_hashes = load_old_hashes()

    for root, _, files in os.walk("."):
        for file in files:
            path = Path(root) / file
            if path.is_file() and not file_should_be_skipped(path):
                rel_path = str(path.relative_to("."))
                new_hash = hash_file(path)
                new_hashes[rel_path] = new_hash
                if old_hashes.get(rel_path) != new_hash:
                    files_to_upload.append(rel_path)

    # Write upload list
    with open(DEPLOY_LIST, "w") as f:
        for path in files_to_upload:
            f.write(path + "\n")

    # Write new hashes
    with open(HASH_FILE, "w") as f:
        for path, h in new_hashes.items():
            f.write(f"{h}  {path}\n")

if __name__ == "__main__":
    main()