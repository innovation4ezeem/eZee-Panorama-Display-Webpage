/* Put real photos back into SingleFile's de-duplicated images. When the same photo appears
   more than once, SingleFile stores it once as a CSS variable (--sf-img-N) and turns each
   <img> into a blank SVG placeholder with that photo as its background. It looks right,
   but sliders that copy one image's src into another (room photo galleries) then copy the
   blank placeholder, so the main photo never changes. This runs first on every saved page
   (offline_links.py) and swaps each placeholder's src back to the photo it stands for. */
document.querySelectorAll('img[src^="data:image/svg+xml"]').forEach(function (img) {
  var style = img.getAttribute('style') || '';
  var v = /background-image:\s*var\((--sf-img-\d+)\)/.exec(style);
  if (!v) return;
  var url = /url\(\s*["']?(.*?)["']?\s*\)\s*$/.exec(getComputedStyle(img).getPropertyValue(v[1]).trim());
  if (!url || !url[1]) return;
  img.src = url[1];
  // the photo is now the image itself, so drop the background copy of it
  img.setAttribute('style', style.replace(/background-[a-z-]+:[^;]*!important;?/g, ''));
});
