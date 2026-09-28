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

## Backup sites (when eweb247.com is down)

`Single Properties/` and `Group Properties/` hold saved copies of each site's main pages (SingleFile snapshots, images included). Each card's **Offline copy** button opens them, and it becomes the main button when the live site isn't responding.

- **One link per property:** `go.html?hotelzara` opens the live site if it answers within 5 seconds, otherwise the backup. `go.html?hotelzara&backup` always opens the backup. Slugs are in `sites.js`.
- **After adding or re-saving pages**, run `python offline_links.py`. It points the menu links inside the saved pages at each other instead of eweb247.com, and it's safe to run repeatedly. Links to pages that weren't saved (FAQs, blogs, policies, room detail) open `offline-missing.html`, which offers the live link; the script lists them so you can save any that matter.
- Name the folder anything; the script identifies the site from the `url:` line SingleFile writes at the top of each file.

## Adding or removing a property

Edit `sites.js` only. Both the page and the capture script read from it. Set `"offline"` to the saved home page if there is one.

## Worth knowing

- Screenshots (click a card's thumbnail) are images of the home page only. The offline copies are clickable, but booking engines and forms still need the live site.
- The backup folders are ~340 MB. That's fine for GitHub and Pages (no single file is near the 100 MB limit), but the first push takes a while.
- A **private** repo needs a paid GitHub plan for Pages. On a free plan the Pages URL is public — the page is set to `noindex`, so search engines won't list it, but anyone with the link can open it.
