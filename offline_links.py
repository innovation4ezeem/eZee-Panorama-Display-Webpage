"""
Point the links inside the saved property folders at each other instead of eweb247.com,
so the saved copies can be browsed page to page when the main server is down.

Run it again whenever you add or re-save pages. It only touches links that still point at
eweb247.com or at the 'not saved' notice (those get relinked once the page is saved), so
running it twice is safe:

    python offline_links.py

What it does, for every <a href="https://eweb247.com/<site>/<page>"> in
"Single Properties/*/*.html" and "Group Properties/*/*.html":
  - the page is saved       -> relative link to the saved file (works across sites too)
  - the page wasn't saved   -> offline-missing.html, which explains and offers the live link
Links to other domains (booking engine, maps, social) and to images/files are left alone.

It also adds the sites' own interactive scripts back from offline-scripts/ (mobile menu, room
photo sliders, Bootstrap stand-in; see SCRIPTS below), since SingleFile doesn't save scripts, and a small <style id=offline-fix> to each page: the sites fade sections in with
scroll-animation scripts (AOS), which SingleFile doesn't keep, so without it those sections
stay invisible. The style shows them in their finished state.
"""
import os, re
from collections import Counter
from pathlib import Path
from urllib.parse import quote, unquote

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
NOTICE = re.compile(r"^(?:\.\./)*offline-missing\.html#(.+)$")
GALLERY_JS = ROOT / "offline-gallery.js"   # inlined: SingleFile's CSP only allows inline scripts
GALLERY_TAG = re.compile(r"<script id=offline-gallery>.*?</script>", re.S)
LIGHTBOX = re.compile(r"""<a\b[^>]*\bdata-(?:bs-)?toggle=["']?lightbox""", re.I)  # older templates' photo pop-ups
# The sites' own scripts aren't saved, so the interactive bits are re-added from offline-scripts/:
#   <site>.js                    that site's mobile menu, on every page of the site
#   <site>.<page>.js / -*.js     scripts for one page, e.g. hotelzara.room-detail.js for room-detail.html
#   _images.js                   runs first on every page: real photos back into SingleFile's de-duplicated <img>s
#   _bootstrap.js                stand-in for Bootstrap collapse/dropdown/carousel, on every page
SCRIPTS = ROOT / "offline-scripts"
MENU_TAG = re.compile(r"<script id=offline-menu>.*?</script>", re.S)


def menu_script(site, page):
    """The site's and page's scripts plus the Bootstrap stand-in, each isolated so one can't break another."""
    stem = Path(page).stem.lower()
    parts = [SCRIPTS / "_images.js", SCRIPTS / f"{site}.js", SCRIPTS / f"{site}.{stem}.js",
             *sorted(SCRIPTS.glob(f"{site}.{stem}-*.js")), SCRIPTS / "_bootstrap.js"]
    body = "".join("\ntry{(function(){\n" + f.read_text(encoding="utf-8") + "\n})()}catch(e){}"
                   for f in parts if f.exists())
    return f"<script id=offline-menu>{body}</script>"


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


def rewrite(path, sites, stats, site):
    text = path.read_text(encoding="utf-8", errors="surrogateescape")

    def fix_href(m):
        url = m.group(3) or m.group(4) or m.group(5) or ""
        noticed = NOTICE.match(url)
        if noticed:  # sent to the notice on an earlier run; relink if that page has been saved since
            url = unquote(noticed.group(1))
            live = LIVE.match(url)
            if not live or not sites.get(live.group(1).lower(), {}).get(page_key(live.group(2))):
                return m.group(0)
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
    if "gallery" in path.name.lower() or LIGHTBOX.search(new_text):
        viewer = f"<script id=offline-gallery>{GALLERY_JS.read_text(encoding='utf-8')}</script>"
        if GALLERY_TAG.search(new_text):
            new_text = GALLERY_TAG.sub(lambda m: viewer, new_text, count=1)
        else:
            new_text += viewer
        if viewer not in text:
            stats["galleries"] += 1
    menu = menu_script(site, path.name)
    new_text = MENU_TAG.sub(lambda m: menu, new_text, count=1) if MENU_TAG.search(new_text) else new_text + menu
    if menu not in text:
        stats["menus"] += 1
    if new_text != text:
        path.write_text(new_text, encoding="utf-8", errors="surrogateescape", newline="")
        stats["files"] += 1


def main():
    sites = build_index()
    print(f"Found {len(sites)} saved sites: {', '.join(sorted(sites))}")
    stats = {"files": 0, "linked": 0, "missing": 0, "styled": 0, "galleries": 0, "menus": 0, "missing_pages": Counter()}
    for site, pages in sites.items():
        for f in sorted(set(pages.values())):
            rewrite(f, sites, stats, site)
    print(f"Updated {stats['files']} files: {stats['linked']} links now go to saved pages, "
          f"{stats['missing']} go to the 'not saved' notice, {stats['styled']} pages got the animation fix, "
          f"{stats['galleries']} pages got the photo viewer, {stats['menus']} pages got their menu/slider scripts.")
    if stats["missing_pages"]:
        print("\nPages linked to but not saved (save them into the folder and re-run to include):")
        for url, n in sorted(stats["missing_pages"].items()):
            print(f"  {url}  ({n})")


if __name__ == "__main__":
    main()
