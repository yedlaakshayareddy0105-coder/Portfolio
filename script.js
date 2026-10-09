/**
 * ==============================================================================
 * PORTFOLIO JAVASCRIPT
 * Student: Yedla Akshaya Reddy
 * Degree: Integrated M.Tech Computer Science (3rd Year), VIT
 * Technologies: Vanilla JavaScript (ES6+), Bootstrap 5 API
 * Purpose: Interactive portfolio behaviors, DOM manipulation & lab presentation
 * ==============================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. DOMContentLoaded Initialization
 * 2. Typing Effect (Hero Subtitle)
 * 3. Sticky Navbar & Scroll Styling
 * 4. Active Navigation Link Highlighting
 * 5. Mobile Navigation Menu Auto-Close
 * 6. Skill Category Filtering (DOM Manipulation)
 * 7. Contact Form Client-Side Validation
 * 8. Copy Email to Clipboard Feature
 * 9. Scroll-to-Top Button
 * 10. Placeholder Link Notification (GitHub / Certificates)
 * ==============================================================================
 */

// Wait for the complete HTML document to be parsed before running scripts
document.addEventListener('DOMContentLoaded', () => {
    initHeroTyping();
    initNavbarScrollEffect();
    initActiveNavLink();
    initMobileNavAutoClose();
    initSkillCategoryFilter();
    initContactFormValidation();
    initCopyEmailButton();
    initScrollToTopButton();
    initPlaceholderNotice();
});


/* ==============================================================================
   2. TYPING EFFECT (HERO SUBTITLE)
   Simulates typing and deleting roles one letter at a time using setTimeout.
   Easy to explain during presentation:
   - words: Array of phrases to rotate through
   - charIndex: Current character position in the word
   - isDeleting: Boolean flag tracking if we are typing forward or backspacing
   ============================================================================== */
function initHeroTyping() {
    const typingSpan = document.getElementById('typing-text');
    if (!typingSpan) return;

    // List of titles/roles to display
    const roles = [
        "Full-Stack Developer",
        "AI & Cloud Enthusiast",
        "Software Engineering Student",
        "Creative Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;    // Speed when typing characters (ms)
    const deletingSpeed = 45;  // Speed when erasing characters (ms)
    const pauseDelay = 1800;   // Pause before erasing completed word (ms)

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove one character
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            // If word is completely erased, switch to the next word
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length; // Loop back to 0
            }
        } else {
            // Add one character
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            // If word is completely typed, pause then start erasing
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(type, pauseDelay);
                return;
            }
        }

        // Schedule next character update
        const nextSpeed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(type, nextSpeed);
    }

    // Start typing loop
    type();
}


/* ==============================================================================
   3. STICKY NAVBAR & SCROLL STYLING
   Adds a shadow and darker background when user scrolls down more than 50px.
   Demonstrates: window scroll event, classList manipulation.
   ============================================================================== */
function initNavbarScrollEffect() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}


/* ==============================================================================
   4. ACTIVE NAVIGATION LINK HIGHLIGHTING
   Updates the active link in the navbar based on current scroll position.
   Demonstrates: looping over NodeLists, comparing offsetTop with scrollY.
   ============================================================================== */
function initActiveNavLink() {
    const sections = document.querySelectorAll('header[id], section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // 120px offset for fixed navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}


/* ==============================================================================
   5. MOBILE NAVIGATION MENU AUTO-CLOSE
   On mobile devices, when a user clicks a menu link, automatically collapse
   the dropdown menu so it doesn't block the screen.
   Demonstrates: Bootstrap JavaScript API (bootstrap.Collapse).
   ============================================================================== */
function initMobileNavAutoClose() {
    const navCollapse = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    if (!navCollapse) return;

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if navbar is currently expanded on smaller screens
            if (navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}


/* ==============================================================================
   6. SKILL CATEGORY FILTERING (DOM MANIPULATION)
   Allows filtering skill cards by categories: All, Languages, Web, Data/Cloud, Tools.
   Demonstrates: Event listeners, dataset attributes, style.display manipulation.
   ============================================================================== */
function initSkillCategoryFilter() {
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card-col');

    if (filterButtons.length === 0 || skillCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Read selected category filter
            const selectedCategory = button.getAttribute('data-filter');

            // 3. Show or hide each skill column
            skillCards.forEach(col => {
                const cardCategory = col.getAttribute('data-category');

                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    col.style.display = 'block';
                    col.style.opacity = '0';
                    setTimeout(() => {
                        col.style.opacity = '1';
                        col.style.transition = 'opacity 0.3s ease';
                    }, 50);
                } else {
                    col.style.display = 'none';
                }
            });
        });
    });
}


/* ==============================================================================
   7. CONTACT FORM CLIENT-SIDE VALIDATION
   Performs client-side validation on user input:
   - Full Name: Not empty
   - Email: Valid regex email pattern
   - Subject: Not empty
   - Message: At least 10 characters long
   Shows an in-page Bootstrap success alert upon valid submission.
   No backend required for this college lab assignment.
   ============================================================================== */
function initContactFormValidation() {
    const form = document.getElementById('contactForm');
    const alertBox = document.getElementById('formSuccessAlert');

    if (!form) return;

    form.addEventListener('submit', (event) => {
        // Prevent default browser form reload
        event.preventDefault();

        // Retrieve input fields
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');

        let isValid = true;

        // 1. Validate Name
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
        }

        // 2. Validate Email using Regular Expression (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
        }

        // 3. Validate Subject
        if (!subjectInput.value.trim()) {
            subjectInput.classList.add('is-invalid');
            isValid = false;
        } else {
            subjectInput.classList.remove('is-invalid');
        }

        // 4. Validate Message (minimum 10 characters)
        if (messageInput.value.trim().length < 10) {
            messageInput.classList.add('is-invalid');
            isValid = false;
        } else {
            messageInput.classList.remove('is-invalid');
        }

        // If all fields are valid, display friendly confirmation
        if (isValid) {
            const senderName = nameInput.value.trim();

            if (alertBox) {
                alertBox.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-check-circle-fill fs-4 me-2 text-success"></i>
                        <div>
                            <strong>Thank you, ${escapeHtml(senderName)}!</strong> 
                            Your message has been validated successfully. In a production environment, this connects to a backend email API.
                        </div>
                    </div>
                `;
                alertBox.classList.remove('d-none');
                alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Reset form fields
            form.reset();

            // Hide alert after 8 seconds
            setTimeout(() => {
                if (alertBox) {
                    alertBox.classList.add('d-none');
                }
            }, 8000);
        }
    });

    // Clear validation error on input focus
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                input.classList.remove('is-invalid');
            }
        });
    });
}

// Utility function to prevent XSS in client-rendered messages
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}


/* ==============================================================================
   8. COPY EMAIL TO CLIPBOARD FEATURE
   Copies the student's contact email to the clipboard with one click.
   Demonstrates: Modern Clipboard API (navigator.clipboard) & feedback UI.
   ============================================================================== */
function initCopyEmailButton() {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const emailAddress = copyBtn.getAttribute('data-email') || 'akshaya.reddy@vit.ac.in';

        // Use modern navigator clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(emailAddress).then(() => {
                showCopyFeedback(copyBtn);
            }).catch(() => {
                fallbackCopy(emailAddress, copyBtn);
            });
        } else {
            fallbackCopy(emailAddress, copyBtn);
        }
    });

    function showCopyFeedback(btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2 text-success me-1"></i>Copied!';
        btn.classList.add('btn-outline-success');
        btn.classList.remove('btn-outline-cyan');

        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.classList.remove('btn-outline-success');
            btn.classList.add('btn-outline-cyan');
        }, 2200);
    }

    function fallbackCopy(text, btn) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showCopyFeedback(btn);
    }
}


/* ==============================================================================
   9. SCROLL-TO-TOP BUTTON
   Shows floating button when user scrolls past 300px; clicks scroll to top.
   Demonstrates: window.scrollTo with smooth behavior.
   ============================================================================== */
function initScrollToTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ==============================================================================
   10. PLACEHOLDER LINK NOTIFICATION (GITHUB / CERTIFICATES)
   Instead of dead '#' links or fake URLs, clicking any placeholder button
   opens a helpful Bootstrap modal that guides the student and faculty on
   how and where real project repository / certificate URLs are linked.
   ============================================================================== */
function initPlaceholderNotice() {
    const placeholderButtons = document.querySelectorAll('.placeholder-link');
    const modalElement = document.getElementById('placeholderModal');
    const modalTitle = document.getElementById('placeholderModalTitle');
    const modalBody = document.getElementById('placeholderModalBody');

    if (!modalElement || placeholderButtons.length === 0) return;

    const bsModal = new bootstrap.Modal(modalElement);

    placeholderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const itemType = button.getAttribute('data-type') || 'Project';
            const itemName = button.getAttribute('data-name') || 'Item';

            if (modalTitle) {
                modalTitle.textContent = `${itemType} Link Placeholder`;
            }

            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="text-center py-2">
                        <i class="bi bi-info-circle text-cyan display-5 mb-3 d-block"></i>
                        <h6 class="text-white mb-2">${escapeHtml(itemName)}</h6>
                        <p class="text-secondary small mb-3">
                            This is a clean academic placeholder. As required for this placement portfolio, 
                            no fake GitHub URLs or unauthorized credentials have been invented.
                        </p>
                        <div class="bg-dark p-3 rounded text-start border border-secondary border-opacity-25">
                            <span class="text-purple small fw-bold d-block mb-1">To connect your real link:</span>
                            <code class="text-cyan small d-block">
                                &lt;a href="https://github.com/your-username/repo-name" target="_blank"&gt;
                            </code>
                        </div>
                    </div>
                `;
            }

            bsModal.show();
        });
    });
}