// Lightbox shared by the hub (profile picture) and the sketches page, using the page's
// <dialog id="lightbox">. It shows entries[i] while the URL hash is #<entries[i].id>, so links,
// the back button and shared #links all work. An entry may give:
//   src, caption: what to show (otherwise the image and caption already in the dialog stay)
//   width, height: the image's real size, used to size it in the lightbox
function setupLightbox(entries) {
  const lightbox = document.getElementById('lightbox');
  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const navButtons = lightbox.querySelectorAll('.lightbox-nav');
  let current = -1;
  let openedHere = false; // opened by a link on this page (vs. a shared #link), so closing can go back

  function sync() {
    const i = entries.findIndex(entry => entry.id === decodeURIComponent(location.hash.slice(1)));
    if (i < 0) {
      if (lightbox.open) lightbox.close();
      return;
    }
    current = i;
    const entry = entries[i];
    if (entry.src) img.src = entry.src;
    if (entry.caption != null) caption.textContent = entry.caption;
    img.alt = caption.textContent.trim();
    // Browsers can misreport an SVG's own size, so size from known dimensions when we have them:
    // as large as fits on screen, never enlarged
    img.style.width = entry.width && entry.height
      ? `min(90vw, ${entry.width}px, calc(80vh * ${entry.width / entry.height}))`
      : '';
    if (!lightbox.open) {
      lightbox.showModal();
      lightbox.focus(); // rather than the first button, which would show a focus ring
    }
  }

  function step(delta) {
    const next = entries[(current + delta + entries.length) % entries.length];
    location.replace('#' + encodeURIComponent(next.id)); // browse without piling up history
  }

  window.addEventListener('hashchange', () => {
    const wasOpen = lightbox.open;
    sync();
    if (!wasOpen && lightbox.open) openedHere = true;
  });

  // Closed via ×, Esc or the backdrop: drop the #hash too
  lightbox.addEventListener('close', () => {
    if (location.hash) {
      if (openedHere) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    openedHere = false;
  });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox.querySelector('.popup-close').addEventListener('click', () => lightbox.close());

  if (entries.length < 2) navButtons.forEach(b => b.hidden = true);
  navButtons.forEach(b => b.addEventListener('click', () => step(+b.dataset.step)));
  document.addEventListener('keydown', e => {
    if (!lightbox.open || entries.length < 2) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  sync();
}
