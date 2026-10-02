"""
Put Google Maps, Google Forms and YouTube embeds back into the saved property pages.

SingleFile can't save these: it empties each <iframe>'s src and leaves a blank snapshot,
so maps and contact forms show up as empty boxes in the offline copies. They're hosted by
Google/YouTube, not eweb247.com, so pointing them back at the original address makes them
work again even when eweb247.com is down (the viewer still needs internet access).

Needs eweb247.com to be reachable, because it reads each page's live HTML to find the
original addresses. Run it once after saving or re-saving pages:

    python restore_embeds.py

Only blank iframes are touched, so running it twice is safe.
"""
import re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
FOLDERS = ["Single Properties", "Group Properties"]
IFRAME = re.compile(r"""<iframe\b(?:[^>"']|"[^"]*"|'[^']*')*>""", re.I)  # quoted values (srcdoc) may contain ">"
BLANK_SRC = re.compile(r"""\ssrc(?:=""|='')?(?=[\s>])""", re.I)
SRC = re.compile(r"""\ssrc=("([^"]*)"|'([^']*)'|([^\s>]+))""", re.I)
DROP = re.compile(r"""\s(?:srcdoc|sandbox)=("[^"]*"|'[^']*'|[^\s>]*)""", re.I)
TITLE = re.compile(r"""\stitle=("([^"]*)"|'([^']*)'|([^\s>]+))""", re.I)
SAVED_FROM = re.compile(r"url: (\S+)")
CSP_FRAME = re.compile(r"(<meta http-equiv=\"?content-security-policy\"?[^>]*?frame-src 'self' data:)(?! https://www\.google)", re.I)
EMBED_HOSTS = " https://www.google.com https://docs.google.com https://www.youtube.com https://www.youtube-nocookie.com"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36"


def attr(rx, tag):
    m = rx.search(tag)
    return next((g for g in m.groups()[1:] if g is not None), "") if m else ""


def live_embeds(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    out = []
    for tag in IFRAME.findall(html):
        src = attr(SRC, tag)
        if src.startswith("http") and "googletagmanager" not in src:  # skip the hidden analytics frame
            out.append((attr(TITLE, tag), src))
    return out


def allow_embeds(text):
    """SingleFile's CSP only allows frames from the page itself; let Google/YouTube in."""
    if re.search(r"<iframe\b[^>]*\ssrc=\"https://(www\.google|docs\.google|www\.youtube)", text):
        text = CSP_FRAME.sub(lambda m: m.group(1) + EMBED_HOSTS, text, count=1)
    return text


def restore(path):
    text = path.read_text(encoding="utf-8", errors="surrogateescape")
    blanks = [m for m in IFRAME.finditer(text) if BLANK_SRC.search(m.group(0))]
    if not blanks:
        allowed = allow_embeds(text)
        if allowed != text:
            path.write_text(allowed, encoding="utf-8", errors="surrogateescape", newline="")
        return 0
    origin = SAVED_FROM.search(text[:600])
    if not origin:
        print(f"  ! {path.relative_to(ROOT)}: no SingleFile url header, skipped")
        return 0
    live = live_embeds(origin.group(1))
    by_title = {t: s for t, s in live if t}
    fixed, out, last = 0, [], 0
    for i, m in enumerate(blanks):
        tag, title = m.group(0), attr(TITLE, m.group(0))
        src = by_title.get(title) if title else None
        if not src and len(live) == len(blanks):  # untitled: fall back to position on the page
            src = live[i][1]
        if not src:
            print(f"  ? {path.relative_to(ROOT)}: couldn't match iframe {title or '#%d' % (i + 1)}")
            continue
        new = DROP.sub("", BLANK_SRC.sub(f' src="{src}"', tag, count=1))
        out += [text[last:m.start()], new]
        last = m.end()
        fixed += 1
    if fixed:
        path.write_text(allow_embeds("".join(out) + text[last:]), encoding="utf-8", errors="surrogateescape", newline="")
    return fixed


def main():
    total = pages = 0
    for top in FOLDERS:
        for f in sorted((ROOT / top).glob("*/*.htm*")):
            try:
                n = restore(f)
            except Exception as e:
                print(f"  ! {f.relative_to(ROOT)}: {e}")
                continue
            if n:
                pages += 1
                total += n
                print(f"  {n} embed(s)  {f.relative_to(ROOT)}")
    print(f"\nRestored {total} embeds on {pages} pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
