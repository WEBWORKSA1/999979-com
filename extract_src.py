#!/usr/bin/env python3
"""Regenerate editable src/<page>.html bodies from the built root pages.
Run once after cloning:  python3 extract_src.py  →  edit src/*.html  →  python3 build.py
"""
import glob, os, re
ROOT = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(ROOT, "src"), exist_ok=True)
n = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    html = open(path, encoding="utf-8").read()
    m = re.search(r'<main id="main">\n(.*)\n</main>', html, re.S)
    if not m:
        continue
    with open(os.path.join(ROOT, "src", os.path.basename(path)), "w", encoding="utf-8") as fh:
        fh.write(m.group(1))
    n += 1
print(f"Extracted {n} page bodies into src/")
