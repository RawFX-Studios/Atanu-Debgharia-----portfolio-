/* ========================================
   THEME TOGGLE
   ======================================== */

(function initTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const stored = localStorage.getItem('theme');

    if (stored === 'light' || stored === 'dark') {
        root.setAttribute('data-theme', stored);
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }
})();

/* ========================================
   MOBILE NAV — HAMBURGER & ACCORDION DROPDOWNS
   ======================================== */

(function initMobileNav() {
    const siteNav = document.querySelector('.site-nav');
    const hamburger = document.getElementById('navHamburger');
    const dropdownTriggers = document.querySelectorAll('.nav-item__trigger');
    const MOBILE_BP = 768;

    function isMobile() {
        return window.innerWidth <= MOBILE_BP;
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.nav-item.active').forEach(item => {
            item.classList.remove('active');
            const trigger = item.querySelector('.nav-item__trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function closeMobileMenu() {
        if (!siteNav) return;
        siteNav.classList.remove('is-open');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
        }
        closeAllDropdowns();
    }

    if (hamburger && siteNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            if (!isOpen) {
                closeAllDropdowns();
            }
        });
    }

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', e => {
            if (!isMobile()) return;

            e.preventDefault();
            e.stopPropagation();

            const navItem = trigger.closest('.nav-item');
            if (!navItem) return;

            const wasActive = navItem.classList.contains('active');
            closeAllDropdowns();

            if (!wasActive) {
                navItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    document.querySelectorAll('.site-nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            if (isMobile()) {
                closeMobileMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (!isMobile()) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isMobile()) {
            closeMobileMenu();
        }
    });
})();

/* ========================================
   SMOOTH SCROLLING
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

/* ========================================
   CONTACT FORM
   ======================================== */

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (message.length < 10) {
            alert('Message should be at least 10 characters long.');
            return;
        }

        successMessage.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

        console.log('Form submitted:', { name, email, message });
    });
}

/* ========================================
   SCROLL REVEAL ANIMATIONS
   ======================================== */

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.skill-card, .portfolio-card, section').forEach(el => {
    revealObserver.observe(el);
});

/* ========================================
   HERO VIDEO — MOBILE PERFORMANCE
   ======================================== */

function disableVideoAutoplayOnMobile() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('video').forEach(video => {
            video.removeAttribute('autoplay');
            video.pause();
        });
    }
}

function markHeroVideoFallback() {
    const heroSection = document.querySelector('.hero-section');
    const heroVideo = document.querySelector('.hero-video source');
    if (heroSection && heroVideo && !heroVideo.getAttribute('src')) {
        heroSection.classList.add('video-fallback');
    }
}

window.addEventListener('load', () => {
    disableVideoAutoplayOnMobile();
    markHeroVideoFallback();
});

window.addEventListener('resize', disableVideoAutoplayOnMobile);

/* ========================================
   SUBTLE HERO PARALLAX (DESKTOP ONLY)
   ======================================== */

window.addEventListener('scroll', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo || window.innerWidth < 769) return;

    const offset = window.pageYOffset;
    if (offset < window.innerHeight) {
        heroVideo.style.transform = `translateY(${offset * 0.35}px)`;
    }
}, { passive: true });

/* ========================================
   PROFILE IMAGE FALLBACK
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('profilePic');
    if (!img) return;

    function showFallback() {
        const dpBox = img.closest('.dp-box');
        if (!dpBox || dpBox.querySelector('.dp-fallback')) return;

        img.remove();
        const fallback = document.createElement('div');
        fallback.className = 'dp-fallback';
        fallback.textContent = 'AD';
        dpBox.appendChild(fallback);
    }

    img.addEventListener('error', showFallback);

    if (img.complete && img.naturalWidth === 0) {
        showFallback();
    }

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

/* ========================================
   KEYBOARD NAV ACCESSIBILITY
   ======================================== */

document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});
