/* ============================================
   ITALIAN PIZZA HUB — Complete Working JavaScript
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const state = {
    cart: [],
    isCartOpen: false,
    isMobileMenuOpen: false,
    promoBarVisible: true,
    toastTimer: null
  };

  // ============================================
  // DOM REFERENCES
  // ============================================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const els = {
    loadingScreen: $('#loadingScreen'),
    loadingBar: $('#loadingBar'),
    promoBar: $('#promoBar'),
    promoClose: $('#promoClose'),
    customCursor: $('#customCursor'),
    customCursorFollower: $('#customCursorFollower'),
    scrollProgress: $('#scrollProgress'),
    navbar: $('#navbar'),
    navLinks: $('#navLinks'),
    mobileToggle: $('#mobileToggle'),
    mobileClose: $('#mobileClose'),
    cartOverlay: $('#cartOverlay'),
    cartSidebar: $('#cartSidebar'),
    cartToggle: $('#cartToggle'),
    cartClose: $('#cartClose'),
    cartItems: $('#cartItems'),
    cartEmpty: $('#cartEmpty'),
    cartFooter: $('#cartFooter'),
    cartBadge: $('#cartBadge'),
    cartSubtotal: $('#cartSubtotal'),
    cartDelivery: $('#cartDelivery'),
    cartTotalPrice: $('#cartTotalPrice'),
    btnContinue: $('#btnContinue'),
    dishesScroll: $('#dishesScroll'),
    dishesPrev: $('#dishesPrev'),
    dishesNext: $('#dishesNext'),
    menuTabs: $('#menuTabs'),
    menuList: $('#menuList'),
    categoryCards: $$('.category-card'),
    floatingOrder: $('#floatingOrder'),
    toast: $('#toast'),
    toastMessage: $('#toastMessage'),
    heroBgImg: $('#heroBgImg'),
    heroScroll: $('#heroScroll'),
    hero: $('#hero')
  };

  // ============================================
  // LOADING SCREEN
  // ============================================
  function initLoading() {
    if (!els.loadingScreen || !els.loadingBar) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          els.loadingScreen.classList.add('hidden');
        }, 600);
      }
      els.loadingBar.style.width = progress + '%';
    }, 100);
  }

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!els.customCursor || !els.customCursorFollower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      els.customCursor.style.left = cursorX + 'px';
      els.customCursor.style.top = cursorY + 'px';
      els.customCursorFollower.style.left = followerX + 'px';
      els.customCursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = 'a, button, .dish-card, .menu-item, .feature-card, .review-card, .category-card, .gallery-item, .scroll-btn, .btn-primary, .btn-secondary, .btn-nav, .btn-checkout, .btn-view-all, .btn-add-cart, .btn-cta, .btn-continue, .btn-view-gallery, .floating-order, .menu-tab';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        els.customCursor.classList.add('hover');
        els.customCursorFollower.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        els.customCursor.classList.remove('hover');
        els.customCursorFollower.classList.remove('hover');
      }
    });
    document.addEventListener('mouseleave', () => {
      els.customCursor.style.opacity = '0';
      els.customCursorFollower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      els.customCursor.style.opacity = '1';
      els.customCursorFollower.style.opacity = '1';
    });
  }

  // ============================================
  // SCROLL PROGRESS
  // ============================================
  function initScrollProgress() {
    if (!els.scrollProgress) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      els.scrollProgress.style.width = progress + '%';
    }, { passive: true });
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  function initNavbar() {
    if (!els.navbar) return;
    window.addEventListener('scroll', () => {
      els.navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    if (!els.mobileToggle || !els.navLinks) return;
    function open() {
      state.isMobileMenuOpen = true;
      els.navLinks.classList.add('active');
      els.mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      state.isMobileMenuOpen = false;
      els.navLinks.classList.remove('active');
      els.mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
    els.mobileToggle.addEventListener('click', () => {
      state.isMobileMenuOpen ? close() : open();
    });
    if (els.mobileClose) els.mobileClose.addEventListener('click', close);
    $$('.nav-link', els.navLinks).forEach(link => link.addEventListener('click', close));
  }

  // ============================================
  // PROMO BAR
  // ============================================
  function initPromoBar() {
    if (!els.promoBar || !els.promoClose) return;
    els.promoClose.addEventListener('click', () => {
      els.promoBar.classList.add('hidden-bar');
      state.promoBarVisible = false;
      els.navbar.classList.add('no-promo');
      if (els.hero) els.hero.classList.add('no-promo');
    });
  }

  // ============================================
  // CART — FIXED
  // ============================================
  function initCart() {
    if (!els.cartToggle || !els.cartSidebar) return;

    function closeCart() {
        els.cartOverlay.classList.remove('active');
        els.cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openCart() {
        els.cartOverlay.classList.add('active');
        els.cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    els.cartToggle.addEventListener('click', openCart);
    
    // Close with X button
    els.cartClose.onclick = closeCart;
    
    // Close with overlay click
    els.cartOverlay.onclick = closeCart;
    
    // Close with continue button
    if (els.btnContinue) els.btnContinue.onclick = closeCart;
    
    // Close with Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeCart();
    });
}

  function updateCartUI() {
    if (!els.cartItems || !els.cartBadge) return;
    const totalQty = state.cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    const subtotal = state.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    const delivery = subtotal >= 20 ? 0 : 2.50;
    const total = subtotal + delivery;

    els.cartBadge.textContent = totalQty;
    els.cartBadge.classList.toggle('visible', totalQty > 0);

    if (state.cart.length === 0) {
      els.cartItems.innerHTML = '';
      if (els.cartEmpty) els.cartEmpty.style.display = 'flex';
      if (els.cartFooter) els.cartFooter.style.display = 'none';
    } else {
      if (els.cartEmpty) els.cartEmpty.style.display = 'none';
      if (els.cartFooter) els.cartFooter.style.display = 'block';
      els.cartItems.innerHTML = state.cart.map(function(item, idx) {
        return '<div class="cart-item">' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.name + '</div>' +
            '<div class="cart-item-price">&pound;' + item.price.toFixed(2) + '</div>' +
          '</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" data-action="dec" data-idx="' + idx + '" aria-label="Decrease">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="qty-btn" data-action="inc" data-idx="' + idx + '" aria-label="Increase">+</button>' +
          '</div>' +
          '<button class="cart-item-remove" data-action="remove" data-idx="' + idx + '" aria-label="Remove">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>';
      }).join('');

      $$('.qty-btn, .cart-item-remove', els.cartItems).forEach(function(btn) {
        btn.addEventListener('click', function() {
          const idx = parseInt(btn.dataset.idx);
          const action = btn.dataset.action;
          if (action === 'inc') state.cart[idx].qty++;
          else if (action === 'dec') { state.cart[idx].qty--; if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1); }
          else if (action === 'remove') state.cart.splice(idx, 1);
          updateCartUI();
        });
      });
    }
    if (els.cartSubtotal) els.cartSubtotal.textContent = '\u00a3' + subtotal.toFixed(2);
    if (els.cartDelivery) els.cartDelivery.textContent = delivery === 0 ? 'Free' : '\u00a3' + delivery.toFixed(2);
    if (els.cartTotalPrice) els.cartTotalPrice.textContent = '\u00a3' + total.toFixed(2);
  }

  // ============================================
  // MENU FILTERING
  // ============================================
  function initMenuFilter() {
    if (!els.menuTabs || !els.menuList) return;
    const tabs = $$('.menu-tab', els.menuTabs);
    const items = $$('.menu-item', els.menuList);

    function filter(category) {
      items.forEach(function(item) {
        item.style.display = (category === 'all' || item.dataset.category === category) ? '' : 'none';
      });
    }

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        filter(tab.dataset.tab);
      });
    });

    els.categoryCards.forEach(function(card) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        const cat = card.dataset.category;
        els.categoryCards.forEach(function(c) { c.classList.remove('active'); });
        card.classList.add('active');
        tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === cat); });
        filter(cat);
        const fullMenu = document.getElementById('fullMenu');
        if (fullMenu) {
          const offset = state.promoBarVisible ? 112 : 72;
          const top = fullMenu.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================
  // DISHES HORIZONTAL SCROLL
  // ============================================
  function initDishesScroll() {
    if (!els.dishesScroll || !els.dishesPrev || !els.dishesNext) return;
    const scrollAmount = 310;

    els.dishesPrev.addEventListener('click', function() {
      els.dishesScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    els.dishesNext.addEventListener('click', function() {
      els.dishesScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    function updateArrows() {
      const tolerance = 5;
      const atStart = els.dishesScroll.scrollLeft <= tolerance;
      const atEnd = els.dishesScroll.scrollLeft >= els.dishesScroll.scrollWidth - els.dishesScroll.clientWidth - tolerance;
      els.dishesPrev.style.opacity = atStart ? '0.3' : '1';
      els.dishesPrev.style.pointerEvents = atStart ? 'none' : 'auto';
      els.dishesNext.style.opacity = atEnd ? '0.3' : '1';
      els.dishesNext.style.pointerEvents = atEnd ? 'none' : 'auto';
    }

    els.dishesScroll.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
    window.addEventListener('resize', updateArrows, { passive: true });
  }

  // ============================================
  // FLOATING ORDER BUTTON
  // ============================================
  function initFloatingOrder() {
    if (!els.floatingOrder) return;
    function updateVisibility() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      els.floatingOrder.classList.toggle('visible', window.scrollY > heroBottom * 0.7);
    }
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  function showToast(message) {
    if (!els.toast || !els.toastMessage) return;
    els.toastMessage.textContent = message;
    els.toast.classList.add('active');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function() {
      els.toast.classList.remove('active');
    }, 3000);
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = state.promoBarVisible ? 112 : 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

  // ============================================
  // ACTIVE NAV LINK
  // ============================================
  function initActiveNav() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    if (!sections.length || !navLinks.length) return;
    window.addEventListener('scroll', function() {
      let current = '';
      const offset = state.promoBarVisible ? 140 : 100;
      sections.forEach(function(section) {
        if (window.scrollY >= section.offsetTop - offset) current = section.getAttribute('id');
      });
      navLinks.forEach(function(link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }, { passive: true });
  }

  // ============================================
  // HERO PARALLAX
  // ============================================
  function initHeroParallax() {
    if (!els.heroBgImg) return;
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            els.heroBgImg.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.2) + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // FLOATING FOOD PARTICLES
  // ============================================
  function initFoodParticles() {
    if (!els.hero) return;
    const foodEmojis = ['🍕', '🍝', '🥩', '🌿', '🍅', '🧄', '🫒', '🌶️', '🧀', '🍞'];
    function createParticle() {
      const particle = document.createElement('span');
      particle.classList.add('hero-particle');
      particle.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 4 + 5) + 's';
      particle.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
      els.hero.appendChild(particle);
      particle.addEventListener('animationend', function() { particle.remove(); });
    }
    for (let i = 0; i < 8; i++) { setTimeout(createParticle, i * 600); }
    setInterval(createParticle, 3000);
  }

  // ============================================
  // HERO SCROLL CHEVRON
  // ============================================
  function initHeroScroll() {
    if (!els.heroScroll) return;
    els.heroScroll.addEventListener('click', function() {
      const popular = document.getElementById('popular');
      if (popular) {
        const offset = state.promoBarVisible ? 112 : 72;
        const top = popular.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

  // ============================================
  // GSAP ANIMATIONS
  // ============================================
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const tl = gsap.timeline();
    tl.from('#heroTitle .title-line', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
      .from('#heroDesc', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      .from('#heroButtons', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('#heroRating', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('#heroScroll', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

    if (typeof ScrollTrigger !== 'undefined') {
      // About
      gsap.from('.about-image', { scrollTrigger: { trigger: '#about', start: 'top 70%' }, x: -50, opacity: 0, duration: 0.9, ease: 'power3.out' });
      gsap.from('.about-content', { scrollTrigger: { trigger: '#about', start: 'top 70%' }, x: 50, opacity: 0, duration: 0.9, ease: 'power3.out' });
      // CTA
      gsap.from('.cta-content', { scrollTrigger: { trigger: '#cta', start: 'top 75%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
      // Delivery
      gsap.from('.delivery-content', { scrollTrigger: { trigger: '#delivery', start: 'top 75%' }, x: -40, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.delivery-image', { scrollTrigger: { trigger: '#delivery', start: 'top 75%' }, x: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
      // Section headers
      gsap.utils.toArray('.section-header').forEach(function(header) {
        gsap.from(header, { scrollTrigger: { trigger: header, start: 'top 85%' }, y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' });
      });
      // Feature cards
      gsap.from('.feature-card', { scrollTrigger: { trigger: '.features-grid', start: 'top 85%' }, y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
      // Review cards
      gsap.from('.review-card', { scrollTrigger: { trigger: '.reviews-grid', start: 'top 85%' }, y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initLoading();
    initCursor();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initPromoBar();
    initCart();
    initMenuFilter();
    initDishesScroll();
    initFloatingOrder();
    initSmoothScroll();
    initActiveNav();
    initHeroParallax();
    initHeroScroll();
    initFoodParticles();
    initGSAPAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();