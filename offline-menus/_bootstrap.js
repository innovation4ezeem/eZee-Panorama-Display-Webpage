/* Stand-in for Bootstrap's collapse/dropdown toggles, which the older eZee templates
   (Grand Mahal, Royal, Paradise, Holiday Inn) use for the mobile menu. The saved pages
   don't include jQuery/Bootstrap, so the hamburger did nothing. Added to every saved page
   by offline_links.py; it only acts on data-toggle="collapse" / "dropdown" elements. */
document.addEventListener('click', function (e) {
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
