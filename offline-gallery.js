/* Photo viewer for the saved pages.
   SingleFile doesn't keep the sites' own lightbox scripts, so clicking a photo did nothing
   offline. offline_links.py inlines this file into every gallery page and every page with
   lightbox links: clicking a photo (or the hover overlay on top of it) opens it large, with
   prev/next and a strip of the other photos in its set. It uses the images already saved in
   the page, so it works without eweb247.com.
   - Pages with <a data-toggle="lightbox"> links (older eZee templates: Royal, Royal Orbit,
     Grand Mahal, Holiday Inn, Paradise): one set per data-gallery group, as on the live site.
   - Other gallery pages: all the large photos on the page form one set. */
(function () {
  function ready(fn) { document.readyState === 'complete' ? fn() : addEventListener('load', fn) }
  ready(function () {
    var sets = [];   // each set: [{img, item}]
    var links = document.querySelectorAll('a[data-toggle="lightbox"], a[data-bs-toggle="lightbox"]');
    if (links.length) {
      var groups = {};
      links.forEach(function (a, i) {
        // The link either wraps the photo, or is a magnifier icon next to it (Royal, Grand Mahal,
        // Holiday Inn): use the nearest ancestor that holds a photo, and make all of it clickable.
        var box = a, img = a.querySelector('img');
        for (var n = 0; !img && box.parentElement && box.parentElement !== document.body && n < 5; n++) {
          box = box.parentElement;
          img = box.querySelector('img');
        }
        if (!img) return;
        var g = a.getAttribute('data-gallery') || ('single-' + i);
        (groups[g] = groups[g] || []).push({ img: img, item: box });
      });
      for (var g in groups) sets.push(groups[g]);
    } else {
      var SKIP = 'header, nav, footer, .logo, [class*="logo"], .breadcrumb, [class*="breadcrumb"], .creative-breadcrumb, [class*="banner"], [class*="hero"]';
      var photos = [].filter.call(document.querySelectorAll('body img'), function (img) {
        var r = img.getBoundingClientRect();
        return (img.currentSrc || img.src) && r.width >= 150 && r.height >= 100 && !img.closest(SKIP);
      });
      if (photos.length < 2) return;
      sets.push(photos.map(function (img) { return { img: img, item: img } }));
    }
    if (!sets.length) return;

    // Each photo's clickable area: the largest ancestor (up to 4 levels) that holds only this photo,
    // so overlays and "view" icons on top of it open it too.
    var all = [].concat.apply([], sets).map(function (p) { return p.img });
    sets.forEach(function (set, s) {
      set.forEach(function (p, i) {
        var item = p.item;
        for (var a = item.parentElement, n = 0; a && a !== document.body && n < 4; a = a.parentElement, n++) {
          if (all.filter(function (q) { return a.contains(q) }).length > 1) break;
          item = a;
        }
        item.style.cursor = 'zoom-in';
        item.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(s, i) }, true);
      });
    });

    var css = document.createElement('style');
    css.textContent =
      '#olb{position:fixed;inset:0;z-index:2147483000;background:#0b0d0d;display:none;flex-direction:column;font:14px/1.4 system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#eee}' +
      '#olb.on{display:flex}#olb .stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:56px 64px 12px;position:relative}' +
      '#olb .stage img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 10px 40px rgba(0,0,0,.5)}' +
      '#olb button{position:absolute;border:0;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;border-radius:999px;width:46px;height:46px;font-size:22px;line-height:46px;padding:0}' +
      '#olb button:hover{background:rgba(255,255,255,.25)}#olb .x{top:12px;right:14px}#olb .p{left:12px;top:50%;margin-top:-23px}#olb .n{right:12px;top:50%;margin-top:-23px}' +
      '#olb .c{position:absolute;top:22px;left:20px;opacity:.8}' +
      '#olb .strip{display:flex;gap:8px;overflow-x:auto;padding:10px 14px 16px;justify-content:safe center}' +
      '#olb .strip img{height:64px;width:96px;flex:0 0 auto;object-fit:cover;opacity:.5;cursor:pointer;border:2px solid transparent;border-radius:3px}' +
      '#olb .strip img.cur{opacity:1;border-color:#fff}' +
      '@media (max-width:600px){#olb .stage{padding:56px 8px 8px}#olb .p,#olb .n{top:auto;bottom:96px}}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'olb';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<div class="stage"><span class="c"></span><img alt=""><button class="x" aria-label="Close">✕</button>' +
      '<button class="p" aria-label="Previous photo">‹</button><button class="n" aria-label="Next photo">›</button></div><div class="strip"></div>';
    document.body.appendChild(box);
    var big = box.querySelector('.stage img'), count = box.querySelector('.c'), strip = box.querySelector('.strip');
    var set = [], thumbs = [], cur = 0;
    function src(img) { return img.currentSrc || img.src }

    function load(s) {
      set = sets[s];
      strip.innerHTML = '';
      thumbs = set.map(function (p, i) {
        var t = document.createElement('img');
        t.src = src(p.img); t.alt = p.img.alt || '';
        t.addEventListener('click', function () { show(i) });
        strip.appendChild(t);
        return t;
      });
      var single = set.length < 2;
      box.querySelector('.p').hidden = box.querySelector('.n').hidden = strip.hidden = single;
    }
    function show(i) {
      cur = (i + set.length) % set.length;
      big.src = src(set[cur].img); big.alt = set[cur].img.alt || '';
      count.textContent = set.length > 1 ? (cur + 1) + ' / ' + set.length : '';
      thumbs.forEach(function (t, k) { t.classList.toggle('cur', k === cur) });
      thumbs[cur].scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    function open(s, i) { load(s); box.classList.add('on'); document.documentElement.style.overflow = 'hidden'; show(i) }
    function close() { box.classList.remove('on'); document.documentElement.style.overflow = '' }
    box.querySelector('.x').onclick = close;
    box.querySelector('.p').onclick = function () { show(cur - 1) };
    box.querySelector('.n').onclick = function () { show(cur + 1) };
    box.addEventListener('click', function (e) { if (e.target === box || e.target.className === 'stage') close() });
    addEventListener('keydown', function (e) {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
  });
})();
