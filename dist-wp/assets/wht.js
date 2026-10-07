/* =========================================================
   WHT ELECTRICAL — shared behaviour
   One IIFE, no dependencies. Every block is guarded, so this
   file is safe on any page even if a component isn't present.
   ========================================================= */
(function () {
    "use strict";
    var site = document.querySelector('.wht-site');
    if (!site) return;

    /* ---------- Hero video ----------
       6.5 MB is too much to send to a phone that cannot see it: below 1025px the
       blue panel covers the whole hero, so the poster photograph is the picture.
       Reduced-motion visitors keep the poster too. */
    var heroVideo = site.querySelector('.wht-hero__video');
    if (heroVideo && heroVideo.dataset.src &&
        window.matchMedia('(min-width: 1025px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        /* The autoplay attribute is on the element but inert until a src exists.
           Setting it here is what starts playback, and it is also what lets the
           browser resume by itself after the tab has been in the background. */
        heroVideo.src = heroVideo.dataset.src;
        var playing = heroVideo.play();
        if (playing && playing.catch) playing.catch(function () { /* autoplay blocked: poster stays */ });
    }

    /* ---------- Current year ---------- */
    var yr = site.querySelector('#wht-year');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ---------- Header shadow + back-to-top visibility ---------- */
    var header = site.querySelector('.wht-header');
    var totop = site.querySelector('.wht-totop');
    function onScroll() {
        if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
        if (totop) totop.classList.toggle('is-visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (totop) {
        totop.addEventListener('click', function () {
            var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Services dropdown ----------
       Hover is handled in CSS; this adds click + keyboard support and
       closes on Esc, outside click, or focus leaving the menu. */
    var subToggle = site.querySelector('[data-sub-toggle]');
    if (subToggle) {
        var subWrap = subToggle.parentNode;
        var closeSub = function () { subToggle.setAttribute('aria-expanded', 'false'); };
        subToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = subToggle.getAttribute('aria-expanded') === 'true';
            subToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
        document.addEventListener('click', function (e) {
            if (!subWrap.contains(e.target)) closeSub();
        });
        subWrap.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { closeSub(); subToggle.focus(); }
        });
        subWrap.addEventListener('focusout', function () {
            window.setTimeout(function () {
                if (!subWrap.contains(document.activeElement)) closeSub();
            }, 0);
        });
    }

    /* ---------- Mobile drawer with focus trap ---------- */
    var drawer = site.querySelector('#wht-drawer');
    var overlay = site.querySelector('.wht-overlay');
    var openBtn = site.querySelector('[data-drawer-open]');
    var lastFocus = null;

    function focusable() {
        return drawer ? Array.prototype.slice.call(drawer.querySelectorAll('a[href], button:not([disabled])')) : [];
    }
    function openDrawer() {
        if (!drawer) return;
        lastFocus = document.activeElement;
        drawer.hidden = false; overlay.hidden = false;
        requestAnimationFrame(function () { drawer.classList.add('is-open'); overlay.classList.add('is-open'); });
        document.body.style.overflow = 'hidden';
        if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
        var f = focusable(); if (f.length) f[0].focus();
        document.addEventListener('keydown', onDrawerKey);
    }
    function closeDrawer() {
        if (!drawer || drawer.hidden) return;
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', onDrawerKey);
        window.setTimeout(function () { drawer.hidden = true; overlay.hidden = true; }, 350);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onDrawerKey(e) {
        if (e.key === 'Escape') { closeDrawer(); return; }
        if (e.key !== 'Tab') return;
        var f = focusable(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (openBtn) openBtn.addEventListener('click', openDrawer);
    site.querySelectorAll('[data-drawer-close]').forEach(function (el) { el.addEventListener('click', closeDrawer); });

    /* ---------- Search overlay (WordPress native search) ---------- */
    var search = site.querySelector('#wht-search');
    var searchBtn = site.querySelector('[data-search-open]');
    var searchLastFocus = null;

    function onSearchKey(e) { if (e.key === 'Escape') closeSearch(); }
    function openSearch() {
        if (!search) return;
        closeDrawer();
        searchLastFocus = document.activeElement;
        search.hidden = false;
        requestAnimationFrame(function () { search.classList.add('is-open'); });
        document.body.style.overflow = 'hidden';
        if (searchBtn) searchBtn.setAttribute('aria-expanded', 'true');
        var input = search.querySelector('input[name="s"]');
        if (input) input.focus();
        document.addEventListener('keydown', onSearchKey);
    }
    function closeSearch() {
        if (!search || search.hidden) return;
        search.classList.remove('is-open');
        document.body.style.overflow = '';
        if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', onSearchKey);
        window.setTimeout(function () { search.hidden = true; }, 260);
        if (searchLastFocus && searchLastFocus.focus) searchLastFocus.focus();
    }
    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    site.querySelectorAll('[data-search-close]').forEach(function (el) { el.addEventListener('click', closeSearch); });
    if (search) search.addEventListener('click', function (e) { if (e.target === search) closeSearch(); });

    /* ---------- GA4 / GTM conversion events (Tab 11) ----------
       Pushes the named event to dataLayer. Safe no-op without GTM. */
    site.querySelectorAll('[data-wht-event]').forEach(function (el) {
        el.addEventListener('click', function () {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: el.getAttribute('data-wht-event') });
        });
    });

    /* ---------- Enquiry form (placeholder validation) ----------
       Replace with Elementor Form / WPForms / CF7 in WordPress.
       This only gives visitors feedback if the static form is left in place. */
    var form = site.querySelector('#wht-quote-form');
    var status = site.querySelector('#wht-form-status');
    if (form && status) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            status.className = 'wht-form__status';
            if (form.website && form.website.value) return; /* honeypot tripped */
            var ok = true;
            form.querySelectorAll('[required]').forEach(function (field) {
                if (!field.value.trim()) { ok = false; field.setAttribute('aria-invalid', 'true'); }
                else field.removeAttribute('aria-invalid');
            });
            if (!ok) {
                status.classList.add('is-err');
                status.textContent = 'Please complete the required fields marked with an asterisk.';
                return;
            }
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'quote_submit' });
            status.classList.add('is-ok');
            status.textContent = 'Thanks — this demo form is not connected yet. Please call or WhatsApp WHT for now.';
            form.reset();
        });
    }
})();
