// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            navLinks.classList.remove('active');
        }
    });

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

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
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
});
