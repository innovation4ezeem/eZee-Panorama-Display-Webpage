"""
Point the links inside the saved property folders at each other instead of eweb247.com,
so the saved copies can be browsed page to page when the main server is down.

Run it again whenever you add or re-save pages (it only touches links that still point
at eweb247.com, so running it twice is safe):

    python offline_links.py

What it does, for every <a href="https://eweb247.com/<site>/<page>"> in
"Single Properties/*/*.html" and "Group Properties/*/*.html":
  - the page is saved       -> relative link to the saved file (works across sites too)
  - the page wasn't saved   -> offline-missing.html, which explains and offers the live link
Links to other domains (booking engine, maps, social) and to images/files are left alone.

It also adds a small <style id=offline-fix> to each page: the sites fade sections in with
scroll-animation scripts (AOS), which SingleFile doesn't keep, so without it those sections
stay invisible. The style shows them in their finished state.
"""
import os, re
from collections import Counter
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent
FOLDERS = ["Single Properties", "Group Properties"]
MISSING = ROOT / "offline-missing.html"

LIVE = re.compile(r"^https?://(?:www\.)?eweb247\.com/([^/?#]+)/?([^?#]*)(?:\?[^#]*)?(#.*)?$", re.I)
A_TAG = re.compile(r"<a\b[^>]*>", re.I)
HREF = re.compile(r"""(\bhref\s*=\s*)("([^"]*)"|'([^']*)'|([^\s>"']+))""", re.I)
SAVED_FROM = re.compile(r"url: (\S+)")
ASSET = re.compile(r"\.(jpe?g|png|gif|webp|svg|pdf|mp4|webm)$", re.I)  # lightbox/download links, not pages
FIX_ID = "offline-fix"
FIX_CSS = (f'<style id={FIX_ID}>'
           '[data-aos]{opacity:1!important;transform:none!important;visibility:visible!important}'
           '</style>')
CHARSET = re.compile(r"<meta charset=[^>]*>", re.I)


def page_key(name):
    """about / aboutus / about-us.html -> 'about'; '' and index.html -> 'index'."""
    k = re.sub(r"\.html?$", "", name.lower()).replace("-", "").replace("_", "")
    if k.endswith("us") and len(k) > 4:
        k = k[:-2]
    return k or "index"


def saved_from(path):
    with open(path, encoding="utf-8", errors="ignore") as f:
        m = SAVED_FROM.search(f.read(600))
    return m.group(1) if m else None


def build_index():
    """{site key: {page key: Path}} from folder contents and each file's SingleFile header."""
    sites = {}
    for top in FOLDERS:
        for folder in sorted((ROOT / top).glob("*/")):
            files = sorted(folder.glob("*.htm*"))
            origins = {f: saved_from(f) for f in files}
            keys = Counter(LIVE.match(u).group(1).lower() for u in origins.values() if u and LIVE.match(u))
            if not keys:
                print(f"  ! {folder.relative_to(ROOT)}: can't tell which site this is, skipped")
                continue
            pages = {}
            for f in files:  # file names win over headers (some headers are mislabelled)
                pages.setdefault(page_key(f.name), f)
            for f, u in origins.items():
                m = u and LIVE.match(u)
                if m:
                    pages.setdefault(page_key(m.group(2)), f)
            sites[keys.most_common(1)[0][0]] = pages
    return sites


def rel_url(target, here):
    return quote(os.path.relpath(target, here.parent).replace(os.sep, "/"), safe="/#")


def rewrite(path, sites, stats):
    text = path.read_text(encoding="utf-8", errors="surrogateescape")

    def fix_href(m):
        url = m.group(3) or m.group(4) or m.group(5) or ""
        live = LIVE.match(url)
        if not live or live.group(1).lower() not in sites or ASSET.search(live.group(2)):
            return m.group(0)
        target = sites[live.group(1).lower()].get(page_key(live.group(2)))
        if target:
            stats["linked"] += 1
            new = rel_url(target, path) + (live.group(3) or "")
        else:
            stats["missing"] += 1
            stats["missing_pages"][url.lower()] += 1
            new = rel_url(MISSING, path) + "#" + quote(url, safe=":/")
        return f'{m.group(1)}"{new}"'

    new_text = A_TAG.sub(lambda t: HREF.sub(fix_href, t.group(0)), text)
    if f"id={FIX_ID}" not in new_text:
        m = CHARSET.search(new_text)
        at = m.end() if m else 0
        new_text = new_text[:at] + FIX_CSS + new_text[at:]
        stats["styled"] += 1
    if new_text != text:
        path.write_text(new_text, encoding="utf-8", errors="surrogateescape", newline="")
        stats["files"] += 1


def main():
    sites = build_index()
    print(f"Found {len(sites)} saved sites: {', '.join(sorted(sites))}")
    stats = {"files": 0, "linked": 0, "missing": 0, "styled": 0, "missing_pages": Counter()}
    for pages in sites.values():
        for f in sorted(set(pages.values())):
            rewrite(f, sites, stats)
    print(f"Updated {stats['files']} files: {stats['linked']} links now go to saved pages, "
          f"{stats['missing']} go to the 'not saved' notice, {stats['styled']} pages got the animation fix.")
    if stats["missing_pages"]:
        print("\nPages linked to but not saved (save them into the folder and re-run to include):")
        for url, n in sorted(stats["missing_pages"].items()):
            print(f"  {url}  ({n})")


if __name__ == "__main__":
    main()
