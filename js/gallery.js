// gallery.js - enhances the radio-based carousel with controls, autoplay toggle,
// keyboard navigation, swipe support and a simple lightbox.
(function(){
  const ids = ['img-1','img-2','img-3','img-4','img-5','img-6'];
  let idx = 0;
  let autoplay = true;
  let interval = null;

  function goTo(n){
    idx = (n + ids.length) % ids.length;
    const el = document.getElementById(ids[idx]);
    if(el) el.checked = true;
    updateActiveThumb();
  }

  function next(){ goTo(idx+1); }
  function prev(){ goTo(idx-1); }

  function startAutoplay(){
    if(interval) clearInterval(interval);
    interval = setInterval(next, 4000);
    autoplay = true;
    togglePlayBtn();
  }
  function stopAutoplay(){ if(interval) clearInterval(interval); interval = null; autoplay = false; togglePlayBtn(); }

  function toggleAutoplay(){ autoplay ? stopAutoplay() : startAutoplay(); }

  function togglePlayBtn(){
    const btn = document.querySelector('.gallery-play');
    if(!btn) return;
    btn.textContent = autoplay ? 'Pause' : 'Play';
  }

  function updateActiveThumb(){
    document.querySelectorAll('.thumb').forEach((t,i)=>{
      t.classList.toggle('active', i===idx);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', e=>{
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggleAutoplay(); }
  });

  // Small swipe support for touch devices
  (function addSwipe(){
    let startX = 0; let endX = 0;
    const slides = document.querySelector('.slides');
    if(!slides) return;
    slides.addEventListener('touchstart', e=> startX = e.changedTouches[0].screenX );
    slides.addEventListener('touchend', e=>{ endX = e.changedTouches[0].screenX; if(startX - endX > 40) next(); if(endX - startX > 40) prev(); });
  })();

  // Thumbnails click handlers
  document.addEventListener('click', e=>{
    if(e.target.matches('.thumb')){
      const i = Number(e.target.dataset.index);
      goTo(i);
    }
    if(e.target.matches('.gallery-prev')) prev();
    if(e.target.matches('.gallery-next')) next();
    if(e.target.matches('.gallery-play')) toggleAutoplay();
  });

  // Lightbox
  function openLightbox(src, caption){
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<div class="lightbox-inner"><button class="lb-close" aria-label="Close">✕</button><img src="${src}" alt=""><p class="lb-caption">${caption||''}</p></div>`;
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').focus();
    lb.addEventListener('click', (ev)=>{ if(ev.target === lb || ev.target.classList.contains('lb-close')) lb.remove(); });
  }

  document.addEventListener('click', e=>{
    if(e.target.matches('.slides .slide img')){
      openLightbox(e.target.src, e.target.alt);
    }
  });

  // initialize
  window.addEventListener('load', ()=>{
    // ensure idx matches checked radio at start
    ids.forEach((id,i)=>{ const r = document.getElementById(id); if(r && r.checked) idx = i; });
    updateActiveThumb();
    startAutoplay();
    togglePlayBtn();
  });

})();
