/* Hotel Royal Orbit menu, rewritten without jQuery from the live site's header-js.js
   (the saved pages don't include jQuery). Inlined into saved pages by offline_links.py. */
var navContainer = document.querySelector('.nav-container'),
    pushedWrap = document.querySelector('.nav-pushed-item'),
    pushItem = document.querySelector('.nav-push-item'),
    pushedHtml = pushItem ? pushItem.innerHTML : '',
    toggler = document.querySelector('.navbar-toggler'),
    navMenu = document.querySelector('.nav-menu');

// navbar toggler / close icon
if (toggler && navMenu) toggler.addEventListener('click', function () {
  toggler.classList.toggle('active');
  navMenu.classList.toggle('menu-on');
});
document.querySelectorAll('.navbar-close').forEach(function (c) {
  c.addEventListener('click', function () {
    navMenu && navMenu.classList.remove('menu-on');
    toggler && toggler.classList.remove('active');
  });
});

// dropdown triggers on items that have sub-menus
if (navMenu) navMenu.querySelectorAll('li > a').forEach(function (a) {
  var sub = a.nextElementSibling;
  if (!sub || a.parentElement.querySelector(':scope > .dd-trigger')) return;
  var t = document.createElement('span');
  t.className = 'dd-trigger';
  t.innerHTML = '<i class="fa fa-angle-down"></i>';
  a.parentElement.appendChild(t);
  t.addEventListener('click', function (e) {
    e.preventDefault();
    var ul = a.parentElement.querySelector(':scope > ul');
    if (ul) ul.style.display = getComputedStyle(ul).display === 'none' ? 'block' : 'none';
    a.parentElement.classList.toggle('active');
  });
});

// mobile layout switch at 991px, as on the live site
function breakpointCheck() {
  if (!navContainer) return;
  var mobile = window.innerWidth <= 991;
  navContainer.classList.toggle('breakpoint-on', mobile);
  if (pushedWrap) pushedWrap.innerHTML = mobile ? pushedHtml : '';
  if (pushItem) pushItem.style.display = mobile ? 'none' : '';
}
breakpointCheck();
addEventListener('resize', breakpointCheck);

// off-canvas side panel
function closeCanvas() {
  document.querySelectorAll('.offcanvas-wrapper').forEach(function (w) { w.classList.remove('show-offcanvas') });
  document.querySelectorAll('.offcanvas-overly').forEach(function (o) { o.classList.remove('show-overly') });
}
var canvasBtn = document.getElementById('offCanvasBtn');
if (canvasBtn) canvasBtn.addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelectorAll('.offcanvas-wrapper').forEach(function (w) { w.classList.add('show-offcanvas') });
  document.querySelectorAll('.offcanvas-overly').forEach(function (o) { o.classList.add('show-overly') });
});
document.querySelectorAll('.offcanvas-close, .offcanvas-overly').forEach(function (c) {
  c.addEventListener('click', function (e) { e.preventDefault(); closeCanvas() });
});

// sticky header
addEventListener('scroll', function () {
  document.querySelectorAll('.sticky-header').forEach(function (h) { h.classList.toggle('sticky-active', scrollY >= 150) });
});
