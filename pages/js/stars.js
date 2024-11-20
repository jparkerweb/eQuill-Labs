function initStarBackground() {
    const projectHeaders = document.querySelectorAll('.project-header');
    
    projectHeaders.forEach(header => {
        // Create 3 layers of stars
        for (let i = 1; i <= 3; i++) {
            const layer = document.createElement('div');
            layer.className = `star-layer star-layer-${i}`;
            
            // Randomize animation properties
            const twinkleDelay = -Math.random() * 5;
            const floatDelay = -Math.random() * 10;
            
            // Set both animation delays separately
            layer.style.animationDelay = `${twinkleDelay}s, ${floatDelay}s`;
            
            header.appendChild(layer);
        }
    });
}

document.addEventListener('DOMContentLoaded', initStarBackground); 