class NetworkAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.numPoints = 30; 
        this.maxDistance = 200; 
        this.init();
    }

    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.opacity = '0.3'; 
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1'; 
        
        const hero = document.querySelector('.hero');
        if (!hero) return;
        hero.insertBefore(this.canvas, hero.firstChild);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1, 
                vy: (Math.random() - 0.5) * 1  
            });
        }
        
        this.animate();
    }

    resize() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        this.canvas.width = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
    }

    drawLines() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 1; 

        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                const dx = this.points[i].x - this.points[j].x;
                const dy = this.points[i].y - this.points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = 1 - (distance / this.maxDistance);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.8})`; 
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.points[i].x, this.points[i].y);
                    this.ctx.lineTo(this.points[j].x, this.points[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;

            if (point.x < 0 || point.x > this.canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > this.canvas.height) point.vy *= -1;
        });

        this.drawLines();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NetworkAnimation();
});
