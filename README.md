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

To refresh the thumbnails, run `python capture.py` on your own computer and push the `thumbnails/` folder. Don't rely on the GitHub workflow (*Actions* → *Refresh backup screenshots*): eweb247.com blocks GitHub's servers with a "403 ERROR / Request blocked" page, so it's manual-only now, and `capture.py` keeps the old image instead of saving an error page.

## Backup sites (when eweb247.com is down)

`Single Properties/` and `Group Properties/` hold saved copies of each site's main pages (SingleFile snapshots, images included). Each card's **Offline copy** button opens them, and it becomes the main button when the live site isn't responding.

- **One link per property:** `go.html?hotelzara` opens the live site if it answers within 5 seconds, otherwise the backup. `go.html?hotelzara&backup` always opens the backup. Slugs are in `sites.js`.
- **After adding or re-saving pages**, run `python offline_links.py`. It points the menu links inside the saved pages at each other instead of eweb247.com, and it's safe to run repeatedly. Links to pages that weren't saved (FAQs, blogs, policies, room detail) open `offline-missing.html`, which offers the live link; the script lists them so you can save any that matter.
- **Then run `python restore_embeds.py`** (while eweb247.com is up). SingleFile blanks out Google Maps, Google Forms and YouTube embeds; this puts their original addresses back from the live pages, so maps and contact forms show in the offline copies. They load from Google, so they still work when eweb247.com is down, as long as there's internet.
- Name the folder anything; the script identifies the site from the `url:` line SingleFile writes at the top of each file.
- **Save pages at desktop width with "remove hidden elements" turned off**, or menus, dropdowns and slider captions go missing. From the command line: `npx single-file-cli <url> <file> --browser-width=1440 --browser-height=900 --remove-hidden-elements=false` (add `--browser-executable-path` pointing at Chrome or Edge if needed).

## Adding or removing a property

Edit `sites.js` only. Both the page and the capture script read from it. Set `"offline"` to the saved home page if there is one.

## Worth knowing

- Screenshots (click a card's thumbnail) are images of the home page only. The offline copies are clickable, but booking engines and forms still need the live site.
- The backup folders are ~340 MB. That's fine for GitHub and Pages (no single file is near the 100 MB limit), but the first push takes a while.
- A **private** repo needs a paid GitHub plan for Pages. On a free plan the Pages URL is public — the page is set to `noindex`, so search engines won't list it, but anyone with the link can open it.
