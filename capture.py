"""
Capture a thumbnail and a full-page backup image of every site in sites.js.

Setup (once):
    pip install playwright pillow
    playwright install chromium

Run:
    python capture.py              # all sites
    python capture.py hotelzara    # just one or more slugs

Output (next to index.html):
    thumbnails/<slug>.jpg        first screen, 1440x900 scaled to 720 wide
    thumbnails/<slug>-full.jpg   the whole home page, scrollable in the backup viewer
"""
import json, re, sys, time
from io import BytesIO
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "thumbnails"
VIEWPORT = {"width": 1440, "height": 900}
FULL_MAX_HEIGHT = 12000  # px; very long pages are cropped so files stay small
BLOCKED = re.compile(r"403 ERROR|Request blocked|The request could not be satisfied|Access Denied", re.I)


def load_sites():
    text = (ROOT / "sites.js").read_text(encoding="utf-8")
    return json.loads(re.search(r"\[.*\]", text, re.S).group(0))


def save_jpg(png_bytes, path, width=None, max_height=None, quality=78):
    img = Image.open(BytesIO(png_bytes)).convert("RGB")
    if max_height and img.height > max_height:
        img = img.crop((0, 0, img.width, max_height))
    if width and img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def settle(page):
    # Scroll through the page so lazy-loaded images render, then return to top.
    height = page.evaluate("document.body.scrollHeight")
    for y in range(0, min(height, FULL_MAX_HEIGHT), 700):
        page.evaluate(f"window.scrollTo(0, {y})")
        time.sleep(0.25)
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(1.5)


def main():
    OUT.mkdir(exist_ok=True)
    wanted = {s.lower() for s in sys.argv[1:]}
    sites = [s for s in load_sites() if not wanted or s["slug"] in wanted]
    failed = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport=VIEWPORT, device_scale_factor=1,
                                  user_agent=None, locale="en-US")
        for s in sites:
            print(f"-> {s['name']:<24} {s['url']}", flush=True)
            page = ctx.new_page()
            try:
                resp = page.goto(s["url"], wait_until="domcontentloaded", timeout=60000)
                try:
                    page.wait_for_load_state("networkidle", timeout=20000)
                except Exception:
                    pass  # some sites never go idle (chat widgets, trackers)
                # Never overwrite a good image with an error page (eweb247's CloudFront
                # returns "403 ERROR / Request blocked" to data-centre IPs such as GitHub Actions).
                if resp is None or resp.status >= 400 or BLOCKED.search(page.inner_text("body")[:2000]):
                    raise RuntimeError(f"site returned an error page (HTTP {resp.status if resp else '?'}); kept the old image")
                settle(page)
                save_jpg(page.screenshot(), OUT / f"{s['slug']}.jpg", width=720, quality=80)
                save_jpg(page.screenshot(full_page=True), OUT / f"{s['slug']}-full.jpg",
                         width=1200, max_height=FULL_MAX_HEIGHT, quality=70)
                print("   saved")
            except Exception as e:
                failed.append(s["slug"])
                print(f"   FAILED: {e}")
            finally:
                page.close()
        browser.close()
    # Written as a .js file so the page can read it even when opened from disk.
    if len(failed) < len(sites):
        stamp = time.strftime("%d %b %Y, %H:%M UTC", time.gmtime())
        (OUT / "captured.js").write_text(f'window.CAPTURED_AT = "{stamp}";\n', encoding="utf-8")
    print(f"\nDone. {len(sites) - len(failed)} saved, {len(failed)} failed {failed or ''}")


if __name__ == "__main__":
    main()
