/* ================================================================
   script.js — AGPI Site Vitrine
   Contenu :
     1. Navbar : ombre au scroll
     2. Burger menu mobile
     3. Compteurs animés (hero stats)
     4. Révélation des éléments au scroll (IntersectionObserver)
   ================================================================ */


/* ── 1. NAVBAR : ombre quand on scrolle vers le bas ── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    // Ajoute/retire la classe "scrolled" selon la position de défilement
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  });
})();


/* ── 2. BURGER MENU MOBILE ── */
(function () {
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('navLinks');

  // Création dynamique du menu mobile (clone des liens desktop)
  let mobileMenu = document.getElementById('mobileMenu');

  // Si le menu mobile n'existe pas encore dans le DOM, on le crée
  if (!mobileMenu && navLinks) {
    mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobileMenu';
    mobileMenu.className = 'nav-mobile';

    // Cloner chaque lien du menu desktop dans le menu mobile
    navLinks.querySelectorAll('a').forEach(function (link) {
      const clone = link.cloneNode(true);
      mobileMenu.appendChild(clone);
    });

    // Insérer le menu mobile juste après la navbar dans le DOM
    document.querySelector('.navbar').insertAdjacentElement('afterend', mobileMenu);
  }

  if (!burger || !mobileMenu) return;

  // Basculer l'état ouvert/fermé du menu
  burger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    // Accessibilité : indiquer l'état au lecteur d'écran
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Fermer le menu quand on clique sur un lien
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    }
  });
})();


/* ── 3. COMPTEURS ANIMÉS ── */
(function () {
  // Sélectionne tous les éléments portant l'attribut data-target
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  /**
   * Anime un élément de 0 jusqu'à la valeur data-target
   * @param {HTMLElement} el
   */
  function runCounter(el) {
    const target    = parseInt(el.getAttribute('data-target'), 10);
    const duration  = 1000; // ms
    const framerate = 16;   // ~60 fps
    const steps     = duration / framerate;
    const increment = target / steps;
    let current = 0;

    const interval = setInterval(function () {
      current += increment;
      if (current >= target) {
        el.textContent = target; // afficher la valeur exacte finale
        clearInterval(interval);
      } else {
        el.textContent = Math.floor(current);
      }
    }, framerate);
  }

  // Déclencher uniquement quand l'élément est visible (une seule fois)
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target); // ne pas rejouer l'animation
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) { observer.observe(el); });
})();


/* ── 4. RÉVÉLATION DES ÉLÉMENTS AU SCROLL ── */
(function () {
  // Tous les éléments avec la classe "reveal" seront animés à l'entrée
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Ajouter la classe "visible" → déclenche la transition CSS
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animer une seule fois
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
})();