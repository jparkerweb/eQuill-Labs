// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        let isMenuOpen = false;

        if (!mobileMenuToggle || !mobileMenu) {
            return;
        }

        // Set initial styles
        mobileMenu.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 90;
        `;

        const mobileMenuContent = mobileMenu.querySelector('.mobile-menu-content');
        if (mobileMenuContent) {
            mobileMenuContent.style.cssText = `
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                padding: 2rem;
            `;
        }

        // Function to close mobile menu
        function closeMobileMenu() {
            mobileMenu.style.display = 'none';
            mobileMenuToggle.classList.remove('active');
            isMenuOpen = false;
        }

        // Function to open mobile menu
        function openMobileMenu() {
            mobileMenu.style.display = 'block';
            mobileMenuToggle.classList.add('active');
            isMenuOpen = true;
        }

        // Function to toggle mobile menu
        function toggleMobileMenu(e) {
            e.stopPropagation();
            
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        // Add click event to toggle button
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !e.target.closest('#mobile-menu') && !e.target.closest('#mobile-menu-toggle')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu when clicking on a nav link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Add debug click handler
        mobileMenuToggle.addEventListener('click', () => {
            console.log('Current menu state:', {
                isOpen: isMenuOpen,
                menuDisplay: mobileMenu.style.display,
                toggleClasses: mobileMenuToggle.className
            });
        });
    }

    // Helper function to check if we're on the index page
    function isIndexPage() {
        const path = window.location.pathname;
        return path.endsWith('index.html') || 
               path.endsWith('/') || 
               path === '' || 
               path === '/';
    }

    // Helper function to check if we're on a project page
    function isProjectPage() {
        return document.documentElement.getAttribute('data-is-project') === 'true';
    }

    // Helper function to get relative path to index
    function getRelativePathToIndex() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        return segments.length > 0 ? '../'.repeat(segments.length - 1) : './';
    }

    // Initialize mobile menu first
    initMobileMenu();

    // Then handle smooth scroll functionality
    const navAnchors = document.querySelectorAll('.nav-links a');
    if (navAnchors) {
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Handle non-hash links normally
                if (!href.includes('#')) {
                    return;
                }

                // If we're on a project page, let the link navigate normally
                if (isProjectPage()) {
                    return;
                }

                // If we're not on the index page and the link doesn't include 'index',
                // let it navigate normally
                if (!isIndexPage() && !href.includes('index')) {
                    return;
                }

                e.preventDefault();
                
                // Extract the hash part
                const hashPart = href.includes('#') ? '#' + href.split('#')[1] : href;
                if (hashPart === '#') return;

                // If we're on a subpage and trying to go to index with hash,
                // navigate manually
                if (!isIndexPage() && href.includes('index#')) {
                    window.location.href = href;
                    return;
                }

                // We're on index page, do smooth scroll
                const target = document.querySelector(hashPart);
                if (target) {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without causing navigation
                    if (history.pushState) {
                        history.pushState(null, null, hashPart);
                    }
                }
            });
        });
    }
});
