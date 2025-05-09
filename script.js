const zoomableArea = document.querySelector('.zoomable-area');
const content = document.querySelector('.content');
const clickableAreas = document.querySelectorAll('.clickable-area');

let isZoomed = false;
let currentScale = 1;
let currentOrigin = '50% 50%';
let initialScrollTop = 0;  // For storing initial scroll position

// Linear easing function
function linear(t) {
    return t; // Linear progression
}

// Animate zoom with linear easing
function animateZoom(fromScale, toScale, origin, duration = 600, onComplete = () => {}) {
    let startTime;

    content.style.transformOrigin = origin;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = linear(progress);  // Using linear easing
        const scale = fromScale + (toScale - fromScale) * eased;

        content.style.transform = `scale(${scale})`;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            currentScale = toScale;
            onComplete();
        }
    }

    requestAnimationFrame(step);
}

// Handle click to zoom in or out
zoomableArea.addEventListener('click', (e) => {
    const rect = content.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;
    const origin = `${percentX}% ${percentY}%`;

    if (!isZoomed) {
        currentOrigin = origin;
        animateZoom(currentScale, 3.5, currentOrigin, 300);  // Zoom in with linear
        clickableAreas.forEach(area => area.style.display = 'block'); // Show clickable areas
        isZoomed = true;
    } else {
        // Zoom out without resetting the origin
        animateZoom(currentScale, 1, currentOrigin, 300, () => {
            clickableAreas.forEach(area => area.style.display = 'none'); // Hide clickable areas
        });
        isZoomed = false;
    }
});

// Adjust scroll position during zoom
zoomableArea.addEventListener('scroll', () => {
    if (isZoomed) {
        // Get current scroll position
        const scrollTop = zoomableArea.scrollTop;

        // Calculate the scroll offset and adjust image position accordingly
        const offset = (scrollTop - initialScrollTop) * (currentScale - 1);
        content.style.transform = `scale(${currentScale}) translateY(-${offset}px)`;
    }
});

// On zoom, store initial scroll position
zoomableArea.addEventListener('click', () => {
    if (isZoomed) {
        initialScrollTop = zoomableArea.scrollTop;
    }
});
