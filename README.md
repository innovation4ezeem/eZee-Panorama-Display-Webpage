# eZee hotel website showcase (sales backup)

A single page listing all 18 eweb247 demo sites. Each card shows a thumbnail, whether the live site is responding right now, and two buttons: **Live site** and **Saved copy**. If a site is down, the saved copy becomes the main button and opens a full-page image of the home page.

Works three ways: on GitHub Pages, from Google Drive (download the folder, open `index.html`), or straight off a laptop with no internet.

## 1. Capture the thumbnails (one time, on any computer)

```
pip install playwright pillow
playwright install chromium
python capture.py
```

This fills `thumbnails/` with `<slug>.jpg` (card preview) and `<slug>-full.jpg` (saved copy) for every site. Re-capture one site with `python capture.py hotelzara`.

## 2. Put it on GitHub Pages

1. Create a repository and upload everything in this folder, including `thumbnails/` and the hidden `.github/` folder.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / root → Save.
3. The page appears at `https://<your-account>.github.io/<repo-name>/` within a minute or two.

The included workflow re-captures every Monday and commits fresh images, so the backup stays current. Run it anytime from the **Actions** tab → *Refresh backup screenshots* → *Run workflow*. (If you skip step 1, running this workflow once does the first capture for you.)

## Adding or removing a property

Edit `sites.js` only. Both the page and the capture script read from it.

## Worth knowing

- Saved copies are images of the home page, not clickable websites. Good for showing design; booking engines and inner pages need the live site.
- A **private** repo needs a paid GitHub plan for Pages. On a free plan the Pages URL is public — the page is set to `noindex`, so search engines won't list it, but anyone with the link can open it.
