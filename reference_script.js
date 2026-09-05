/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - ONKAR DAGADE (DATA ANALYST)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. DARK / LIGHT THEME TOGGLE
    // =========================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    htmlElement.setAttribute('data-theme', savedTheme || (systemPrefersDark ? 'dark' : 'light'));

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }


    // =========================================================
    // 2. MOBILE NAVIGATION DRAWER
    // =========================================================
    const menuToggleBtn    = document.querySelector('.menu-toggle');
    const mobileNavDrawer  = document.querySelector('.mobile-nav');
    const mobileNavClose   = document.querySelector('.mobile-nav-close');
    const mobileNavLinks   = document.querySelectorAll('.mobile-nav-link');

    const openMobileMenu  = () => { mobileNavDrawer.classList.add('open');    document.body.style.overflow = 'hidden'; };
    const closeMobileMenu = () => { mobileNavDrawer.classList.remove('open'); document.body.style.overflow = 'auto'; };

    if (menuToggleBtn && mobileNavClose) {
        menuToggleBtn.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }
    mobileNavLinks.forEach(l => l.addEventListener('click', closeMobileMenu));


    // =========================================================
    // 3. DYNAMIC TYPEWRITER EFFECT
    // =========================================================
    const typewriterEl = document.getElementById('typewriter');
    const roles = ['Data Analyst', 'Python Enthusiast', 'Problem Solver', 'Data Visualizer', 'BI Developer'];
    let roleIdx = 0, charIdx = 0, isDeleting = false, typingSpeed = 100;

    const typeEffect = () => {
        if (!typewriterEl) return;
        const current = roles[roleIdx];
        typewriterEl.textContent = isDeleting
            ? current.substring(0, charIdx - 1)
            : current.substring(0, charIdx + 1);
        charIdx += isDeleting ? -1 : 1;

        if (!isDeleting && charIdx === current.length) { isDeleting = true; typingSpeed = 1600; }
        else if (isDeleting && charIdx === 0)           { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; typingSpeed = 500; }
        else                                             { typingSpeed = isDeleting ? 45 : 100; }

        setTimeout(typeEffect, typingSpeed);
    };
    if (typewriterEl) setTimeout(typeEffect, 600);


    // =========================================================
    // 4. SCROLL REVEAL (directional + stagger-delay aware)
    // =========================================================
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // respect transition-delay from .delay-N classes
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    // =========================================================
    // 5. SKILLS PROGRESS BAR ANIMATION (with easing curve)
    // =========================================================
    const skillsSection = document.getElementById('skills-section');
    let skillsAnimated  = false;

    const animateSkills = () => {
        document.querySelectorAll('.progress-wrap').forEach(wrap => {
            const label  = wrap.querySelector('.progress-percent');
            const fill   = wrap.querySelector('.progress-bar-fill');
            const target = parseInt(label.getAttribute('data-target'), 10);
            const duration = 1400;
            const startTime = performance.now();

            // Smooth easing animation
            const step = (timestamp) => {
                const elapsed  = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(eased * target);

                fill.style.width  = `${value}%`;
                label.textContent = `${value}%`;

                if (progress < 1) requestAnimationFrame(step);
                else {
                    fill.style.width  = `${target}%`;
                    label.textContent = `${target}%`;
                    // add glow pulse after fill
                    fill.style.boxShadow = `0 0 12px 3px currentColor`;
                }
            };
            requestAnimationFrame(step);
        });
    };

    const skillsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                animateSkills();
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (skillsSection) skillsObserver.observe(skillsSection);


    // =========================================================
    // 6. SCROLLSPY + NAVBAR SCROLL CLASS
    // =========================================================
    const sections       = document.querySelectorAll('section');
    const desktopLinks   = document.querySelectorAll('.nav-links .nav-link');
    const navbar         = document.querySelector('.navbar-header');

    const onScroll = () => {
        // Navbar glass on scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }

        // Active nav link
        let active = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 160) active = sec.id;
        });
        desktopLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load


    // =========================================================
    // 7. CURSOR SPOTLIGHT EFFECT
    // =========================================================
    const spotlight = document.getElementById('cursor-spotlight');

    if (spotlight) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let curX   = mouseX;
        let curY   = mouseY;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateSpotlight = () => {
            // Smooth lag follow
            curX += (mouseX - curX) * 0.08;
            curY += (mouseY - curY) * 0.08;
            spotlight.style.left = `${curX}px`;
            spotlight.style.top  = `${curY}px`;
            requestAnimationFrame(animateSpotlight);
        };
        animateSpotlight();

        // Hide on idle
        let idleTimer;
        document.addEventListener('mousemove', () => {
            spotlight.style.opacity = '1';
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { spotlight.style.opacity = '0'; }, 3000);
        });
    }


    // =========================================================
    // 8. MOUSE PARALLAX ON HERO SECTION
    // =========================================================
    const heroSection   = document.querySelector('.hero-section');
    const heroImgCard   = document.querySelector('.hero-img-card');
    const heroContent   = document.querySelector('.hero-content');
    const orbs          = document.querySelectorAll('.orb');

    if (heroSection && heroImgCard) {
        heroSection.addEventListener('mousemove', e => {
            const rect  = heroSection.getBoundingClientRect();
            const cx    = rect.left + rect.width  / 2;
            const cy    = rect.top  + rect.height / 2;
            const dx    = (e.clientX - cx) / rect.width;
            const dy    = (e.clientY - cy) / rect.height;

            // Img card parallax (opposite direction)
            heroImgCard.style.transform = `
                translateX(${dx * -18}px) translateY(${dy * -12}px)
                rotateX(${dy * 6}deg) rotateY(${dx * -8}deg)
            `;

            // Hero content subtle parallax
            if (heroContent) {
                heroContent.style.transform = `
                    translateX(${dx * 8}px) translateY(${dy * 5}px)
                `;
            }

            // Orbs slow parallax at varying depths
            orbs.forEach((orb, i) => {
                const depth = (i + 1) * 0.4;
                orb.style.transform = `translate(${dx * 35 * depth}px, ${dy * 25 * depth}px)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            heroImgCard.style.transform = '';
            if (heroContent) heroContent.style.transform = '';
            orbs.forEach(orb => orb.style.transform = '');
        });
    }


    // =========================================================
    // 9. 3D CARD TILT ON PROJECT CARDS
    // =========================================================
    const projectCards = document.querySelectorAll('.project-card-link');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x    = e.clientX - rect.left;
            const y    = e.clientY - rect.top;
            const cx   = rect.width  / 2;
            const cy   = rect.height / 2;
            const rotX = ((y - cy) / cy) * -8;
            const rotY = ((x - cx) / cx) *  8;

            card.style.transform = `
                perspective(800px)
                rotateX(${rotX}deg) rotateY(${rotY}deg)
                translateY(-8px) scale(1.03)
            `;
            card.style.boxShadow = `
                ${-rotY * 2}px ${rotX * 2}px 40px rgba(0,0,0,0.4),
                0 0 30px hsla(195, 90%, 50%, 0.25)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });


    // =========================================================
    // 10. MAGNETIC BUTTON EFFECT ON PRIMARY BUTTONS
    // =========================================================
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x    = e.clientX - rect.left - rect.width  / 2;
            const y    = e.clientY - rect.top  - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px) scale(1.04)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    // =========================================================
    // 11. PARTICLE BURST ON HIRE-ME / CTA BUTTON CLICK
    // =========================================================
    const createParticles = (x, y) => {
        const colors = ['#00c3ff', '#9d4edd', '#ff4daa', '#ffdd00'];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('span');
            p.className = 'burst-particle';
            document.body.appendChild(p);

            const angle  = (i / 18) * 360;
            const dist   = 60 + Math.random() * 80;
            const rad    = (angle * Math.PI) / 180;
            const tx     = Math.cos(rad) * dist;
            const ty     = Math.sin(rad) * dist;
            const size   = 4 + Math.random() * 6;
            const color  = colors[Math.floor(Math.random() * colors.length)];

            Object.assign(p.style, {
                position: 'fixed', borderRadius: '50%', pointerEvents: 'none',
                width: `${size}px`, height: `${size}px`,
                background: color, zIndex: '9999',
                left: `${x - size / 2}px`, top: `${y - size / 2}px`,
                transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease',
                opacity: '1',
            });

            requestAnimationFrame(() => {
                p.style.transform = `translate(${tx}px, ${ty}px) scale(0.1)`;
                p.style.opacity   = '0';
            });

            setTimeout(() => p.remove(), 750);
        }
    };

    document.querySelectorAll('.btn-primary, .project-view-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            createParticles(e.clientX, e.clientY);
        });
    });


    // =========================================================
    // 12. MOCK CV DOWNLOAD INTERACTION
    // =========================================================
    const downloadBtn = document.getElementById('cv-download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', e => {
            // Allow native download behavior by not calling e.preventDefault()
            const orig = downloadBtn.innerHTML;
            downloadBtn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> <span>Preparing CV…</span>`;
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                downloadBtn.innerHTML = `<i data-lucide="check"></i> <span>Downloaded!</span>`;
                if (window.lucide) window.lucide.createIcons();
                setTimeout(() => {
                    downloadBtn.innerHTML = orig;
                    if (window.lucide) window.lucide.createIcons();
                }, 2800);
            }, 1400);
        });
    }


    // =========================================================
    // 13. CONTACT FORM SUBMISSION
    // =========================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus  = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<span>Sending…</span>`;

            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = '✅ Thank you! Your message has been sent successfully.';
                    formStatus.className   = 'form-status-message success';
                }
                contactForm.reset();
                btn.disabled = false;
                btn.innerHTML = orig;
                setTimeout(() => {
                    if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status-message'; }
                }, 5500);
            }, 1800);
        });
    }


    // =========================================================
    // 14. STAGGERED NUMBER COUNTER ANIMATION (stat cards)
    // =========================================================
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length) {
        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el      = entry.target;
                const target  = parseInt(el.getAttribute('data-count') || el.textContent, 10);
                if (isNaN(target)) return;
                const duration = 1600;
                const start    = performance.now();

                const run = (ts) => {
                    const p = Math.min((ts - start) / duration, 1);
                    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + (el.dataset.suffix || '+');
                    if (p < 1) requestAnimationFrame(run);
                };
                requestAnimationFrame(run);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => countObserver.observe(el));
    }


    // =========================================================
    // 15. LOADER SPIN UTILITY INJECTION
    // =========================================================
    const spin = document.createElement('style');
    spin.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.9s linear infinite; }
    `;
    document.head.appendChild(spin);

    // Init Lucide icons
    if (window.lucide) window.lucide.createIcons();

});
