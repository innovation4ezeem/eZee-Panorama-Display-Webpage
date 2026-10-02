/* Photo viewer for the saved gallery pages.
   SingleFile doesn't keep the sites' own lightbox scripts, so clicking a gallery photo did
   nothing offline. offline_links.py inlines this file into every gallery page: clicking a
   photo (or the hover overlay on top of it) opens it large, with prev/next and a strip of
   all the gallery's photos. It uses the images already saved in the page, so it works
   without eweb247.com. */
(function () {
  function ready(fn) { document.readyState === 'complete' ? fn() : addEventListener('load', fn) }
  ready(function () {
    var SKIP = 'header, nav, footer, .logo, [class*="logo"], .breadcrumb, [class*="breadcrumb"], .creative-breadcrumb, [class*="banner"], [class*="hero"]';
    var photos = [].filter.call(document.querySelectorAll('body img'), function (img) {
      var r = img.getBoundingClientRect();
      return (img.currentSrc || img.src) && r.width >= 150 && r.height >= 100 && !img.closest(SKIP);
    });
    if (photos.length < 2) return;

    // Each photo's clickable area: the largest ancestor (up to 4 levels) that holds only this photo,
    // so overlays and "view" icons on top of it open it too.
    photos.forEach(function (img, i) {
      var item = img;
      for (var a = img.parentElement, n = 0; a && a !== document.body && n < 4; a = a.parentElement, n++) {
        if (photos.filter(function (p) { return a.contains(p) }).length > 1) break;
        item = a;
      }
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(i) }, true);
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
    var big = box.querySelector('.stage img'), count = box.querySelector('.c'), strip = box.querySelector('.strip'), cur = 0;
    var thumbs = photos.map(function (p, i) {
      var t = document.createElement('img');
      t.src = p.currentSrc || p.src; t.alt = p.alt || '';
      t.addEventListener('click', function () { show(i) });
      strip.appendChild(t);
      return t;
    });

    function show(i) {
      cur = (i + photos.length) % photos.length;
      big.src = photos[cur].currentSrc || photos[cur].src; big.alt = photos[cur].alt || '';
      count.textContent = (cur + 1) + ' / ' + photos.length;
      thumbs.forEach(function (t, k) { t.classList.toggle('cur', k === cur) });
      thumbs[cur].scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    function open(i) { box.classList.add('on'); document.documentElement.style.overflow = 'hidden'; show(i) }
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
