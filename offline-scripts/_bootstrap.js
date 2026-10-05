/* Stand-in for Bootstrap's collapse/dropdown toggles and carousels, which the older eZee
   templates (Grand Mahal, Royal, Paradise, Holiday Inn) use for the mobile menu, photo
   sliders and tabbed galleries (Exterior / Interior / Rooms). The saved pages don't include jQuery/Bootstrap, so the hamburger and the slider
   arrows did nothing. Added to every saved page by offline_links.py; it only acts on
   data-toggle="collapse" / "dropdown" / "tab" / "pill" and data-slide / data-slide-to elements. */

// Carousels: show slide n of the .carousel the control points at, and update its dots.
function carouselGo(carousel, to) {
  var items = carousel.querySelectorAll(':scope > .carousel-inner > .item, :scope > .carousel-inner > .carousel-item');
  if (!items.length) return;
  var cur = [].findIndex.call(items, function (i) { return i.classList.contains('active') });
  var n = to === 'next' ? cur + 1 : to === 'prev' ? cur - 1 : +to;
  n = (n + items.length) % items.length;
  items.forEach(function (it, i) { it.classList.toggle('active', i === n); it.classList.remove('next', 'prev', 'left', 'right') });
  carousel.querySelectorAll('[data-slide-to], [data-bs-slide-to]').forEach(function (dot) {
    dot.classList.toggle('active', +(dot.getAttribute('data-slide-to') || dot.getAttribute('data-bs-slide-to')) === n);
  });
}
function carouselFor(ctrl) {
  var sel = ctrl.getAttribute('data-target') || ctrl.getAttribute('data-bs-target') || ctrl.getAttribute('href');
  var c = sel && sel.charAt(0) === '#' && sel.length > 1 ? document.querySelector(sel) : null;
  return c || ctrl.closest('.carousel');
}
// Auto-advance carousels that ask for it (data-ride / data-interval), pausing on hover.
document.querySelectorAll('.carousel[data-ride="carousel"], .carousel[data-bs-ride="carousel"], .carousel[data-interval]').forEach(function (c) {
  var ms = +(c.getAttribute('data-interval') || 5000), hover = false;
  if (!ms) return;
  c.addEventListener('mouseenter', function () { hover = true });
  c.addEventListener('mouseleave', function () { hover = false });
  setInterval(function () { if (!hover) carouselGo(c, 'next') }, ms);
});

// Tabs: mark the clicked tab active and show its pane, hiding the pane's siblings.
function tabShow(tab) {
  var sel = tab.getAttribute('data-target') || tab.getAttribute('data-bs-target') || tab.getAttribute('href');
  var pane = sel && sel.charAt(0) === '#' && sel.length > 1 ? document.getElementById(sel.slice(1)) : null;
  if (!pane) return false;
  var list = tab.closest('[role="tablist"], .nav, ul') || tab.parentElement;
  list.querySelectorAll('[data-toggle="tab"], [data-bs-toggle="tab"], [data-toggle="pill"], [data-bs-toggle="pill"]').forEach(function (t) {
    var on = t === tab;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on);
    if (t.parentElement.tagName === 'LI') t.parentElement.classList.toggle('active', on);
  });
  [].forEach.call(pane.parentElement.children, function (p) {
    if (p.classList.contains('tab-pane')) p.classList.remove('active', 'in', 'show');
  });
  pane.classList.add('active', 'in', 'show');
  return true;
}
// A link like page.html#tab-2 opens that tab, as on the live site.
if (location.hash.length > 1) {
  var hashTab = document.querySelector('[data-toggle="tab"][href="' + location.hash + '"], [data-bs-toggle="tab"][href="' + location.hash + '"]');
  if (hashTab) tabShow(hashTab);
}

document.addEventListener('click', function (e) {
  var tab = e.target.closest && e.target.closest('[data-toggle="tab"], [data-bs-toggle="tab"], [data-toggle="pill"], [data-bs-toggle="pill"]');
  if (tab && tabShow(tab)) { e.preventDefault(); return; }
  var slide = e.target.closest && e.target.closest('[data-slide], [data-bs-slide], [data-slide-to], [data-bs-slide-to]');
  if (slide) {
    var c = carouselFor(slide);
    if (c) {
      e.preventDefault();
      var to = slide.getAttribute('data-slide') || slide.getAttribute('data-bs-slide');
      carouselGo(c, to || slide.getAttribute('data-slide-to') || slide.getAttribute('data-bs-slide-to'));
      return;
    }
  }
  var btn = e.target.closest && e.target.closest('[data-toggle="collapse"], [data-bs-toggle="collapse"]');
  if (btn) {
    e.preventDefault();
    var sel = btn.getAttribute('data-target') || btn.getAttribute('data-bs-target') || btn.getAttribute('href');
    var target = sel && sel !== '#' ? document.querySelector(sel) : null;
    if (!target) return;
    var opening = !(target.classList.contains('in') || target.classList.contains('show'));
    target.classList.toggle('in', opening);    // Bootstrap 3
    target.classList.toggle('show', opening);  // Bootstrap 4/5
    target.style.height = '';
    btn.classList.toggle('collapsed', !opening);
    btn.setAttribute('aria-expanded', opening);
    return;
  }
  var dd = e.target.closest && e.target.closest('[data-toggle="dropdown"], [data-bs-toggle="dropdown"]');
  if (dd) {
    e.preventDefault();
    var li = dd.parentElement, menu = li.querySelector('.dropdown-menu');
    var open = !(li.classList.contains('open') || li.classList.contains('show'));
    document.querySelectorAll('.open > [data-toggle="dropdown"], .show > [data-toggle="dropdown"]').forEach(function (o) {
      if (o !== dd) { o.parentElement.classList.remove('open', 'show'); var m = o.parentElement.querySelector('.dropdown-menu'); m && m.classList.remove('show') }
    });
    li.classList.toggle('open', open);
    li.classList.toggle('show', open);
    if (menu) menu.classList.toggle('show', open);
    dd.setAttribute('aria-expanded', open);
  }
});
