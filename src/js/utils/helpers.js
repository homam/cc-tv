// Utility functions for animations and calculations

export function countUp(el, end, duration = 1500, prefix = '', decimals = 0) {
    let start = parseFloat(el.innerText.replace(/[^0-9.]/g, '')) || 0;
    if (start === end) return;
    const startTime = Date.now();
    const frame = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = start + (end - start) * progress;
        el.innerText = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

export function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

export function tween(start, end, duration, onUpdate, onComplete, easing = (t) => t) {
    const startTime = Date.now();
    function frame() {
        const elapsed = Date.now() - startTime;
        let progress = Math.min(elapsed / duration, 1);
        progress = easing(progress);

        const interpolated = {};
        for (const key in start) {
            interpolated[key] = start[key] + (end[key] - start[key]) * progress;
        }
        onUpdate(interpolated);

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            if (onComplete) onComplete();
        }
    }
    requestAnimationFrame(frame);
}

export const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; 