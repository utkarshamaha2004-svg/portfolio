/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - UTKARSHA MAHAMUNI (PYTHON DEVELOPER)
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
    const roles = ['Python Developer', 'Web Developer', 'Tech Enthusiast', 'Problem Solver'];
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
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    // =========================================================
    // 5. SKILLS PROGRESS BAR ANIMATION
    // =========================================================
    const skillsSection = document.getElementById('skills-section');
    let skillsAnimated  = false;

    const animateSkills = () => {
        document.querySelectorAll('.progress-wrap').forEach(wrap => {
            const label  = wrap.querySelector('.progress-percent');
            const fill   = wrap.querySelector('.progress-bar-fill');
            const target = parseInt(label.getAttribute('data-target'), 10);
            
            // Set final bar width
            fill.style.width = target + '%';
            
            // Count up text percent
            let count = 0;
            const stepTime = Math.abs(Math.floor(1500 / target));
            const timer = setInterval(() => {
                count += 1;
                label.textContent = count + '%';
                if (count >= target) {
                    clearInterval(timer);
                }
            }, stepTime);
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
    }, { threshold: 0.2 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }


    // =========================================================
    // 6. CURSOR SPOTLIGHT TRACKING
    // =========================================================
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    if (cursorSpotlight && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorSpotlight.style.opacity = '1';
            cursorSpotlight.style.left = e.clientX + 'px';
            cursorSpotlight.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', () => {
            cursorSpotlight.style.opacity = '0';
        });
    }


    // =========================================================
    // 7. ACTIVE NAVIGATION HIGHLIGHT (Spy Scroll)
    // =========================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyScroll = () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', spyScroll);


    // =========================================================
    // 8. CONTACT FORM SIMULATION
    // =========================================================
    const contactForm  = document.getElementById('contact-form');
    const statusMsg    = document.getElementById('form-status');

    if (contactForm && statusMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            statusMsg.textContent = 'Sending message...';
            statusMsg.className = 'form-status-message mt-3';

            setTimeout(() => {
                statusMsg.textContent = 'Thank you! Your message was sent successfully.';
                statusMsg.className = 'form-status-message success mt-3';
                contactForm.reset();
            }, 1200);
        });
    }
});


// =========================================================
// 9. INTERACTIVE PROJECTS SIMULATOR LOGIC
// =========================================================
let cartItemsCount = 0;
let cartItemsTotal = 0;

window.buyMockProduct = (name, price) => {
    cartItemsCount += 1;
    cartItemsTotal += price;
    
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    if (countEl) countEl.textContent = cartItemsCount;
    if (totalEl) totalEl.textContent = '₹' + cartItemsTotal;
    
    // Add visual splash on cart totals
    const checkoutBlock = document.querySelector('.agri-checkout-mock');
    if (checkoutBlock) {
        checkoutBlock.style.transform = 'scale(1.05)';
        checkoutBlock.style.borderColor = 'var(--primary)';
        setTimeout(() => {
            checkoutBlock.style.transform = 'scale(1)';
            checkoutBlock.style.borderColor = 'rgba(255,255,255,0.05)';
        }, 150);
    }
};

const mockStudents = [
    { name: 'Kiran G.', roll: '104', grade: 'O', gradeBg: 'bg-green' },
    { name: 'Pooja M.', roll: '105', grade: 'A+', gradeBg: 'bg-green' },
    { name: 'Snehal S.', roll: '106', grade: 'A', gradeBg: 'bg-blue' },
    { name: 'Rahul R.', roll: '107', grade: 'B+', gradeBg: 'bg-purple' }
];
let mockStudentIdx = 0;

window.addNewMockStudent = () => {
    const table = document.querySelector('.student-records-table');
    if (!table) return;
    
    if (mockStudentIdx >= mockStudents.length) {
        // Reset or notify
        mockStudentIdx = 0;
    }
    
    const newStudent = mockStudents[mockStudentIdx];
    mockStudentIdx++;
    
    // Create element
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
        <span>${newStudent.name}</span>
        <span>${newStudent.roll}</span>
        <span class="grade-badge ${newStudent.gradeBg}">${newStudent.grade}</span>
    `;
    
    // Style transition
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    row.style.transition = 'all 0.3s ease';
    
    table.appendChild(row);
    
    // Trigger paint
    setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 50);
};


// =========================================================
// 10. CERTIFICATE VIEWING LIGHTBOX MODAL
// =========================================================
window.openCertModal = (filePath, title, description) => {
    const modal = document.getElementById('cert-modal');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalDesc = document.getElementById('cert-modal-desc');
    const mediaContainer = document.getElementById('cert-media-container');
    const downloadLink = document.getElementById('cert-download-link');
    
    if (!modal || !mediaContainer) return;
    
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    downloadLink.href = filePath;
    downloadLink.setAttribute('download', filePath.substring(filePath.lastIndexOf('/') + 1));
    
    // Clear previous media
    mediaContainer.innerHTML = '';
    
    // Determine content type by extension
    const isPdf = filePath.toLowerCase().endsWith('.pdf');
    
    if (isPdf) {
        // Since iframe embedding of local files in browser is blocked, we offer a rich preview icon and download invitation
        mediaContainer.innerHTML = `
            <div class="cert-preview-pdf-link">
                <i data-lucide="file-text" class="pdf-icon"></i>
                <p style="font-weight:700; font-size:1.1rem; text-align:center;">PDF Document Certificate</p>
                <p style="color:var(--text-muted); font-size:0.9rem; text-align:center; max-width: 300px;">Click the button below to download and read the full certified document.</p>
            </div>
        `;
        // Refresh icons inside modal
        lucide.createIcons();
    } else {
        // Image rendering
        mediaContainer.innerHTML = `
            <img class="cert-preview-img" src="${filePath}" alt="${title}">
        `;
    }
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeCertModal = () => {
    const modal = document.getElementById('cert-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
};

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});
