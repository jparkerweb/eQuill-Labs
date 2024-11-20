document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.main-nav');
    const scrollThreshold = 10;

    function updateNavBackground() {
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Initial check
    updateNavBackground();

    // Add scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavBackground();
                ticking = false;
            });
            ticking = true;
        }
    });
});
