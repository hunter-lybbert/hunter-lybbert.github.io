const zoomableArea = document.querySelector('.zoomable-area');
const content = document.querySelector('.content');
const innerWrapper = document.querySelector('.inner-wrapper');
const clickableAreas = document.querySelectorAll('.clickable-area');

let isZoomed = false;
let currentScale = 1;
let currentOrigin = '50% 50%';
let initialScrollTop = 0;  // For storing initial scroll position

// Store the original positions of the clickable areas (relative to the content)
const clickablePositions = [
    { top: 30, left: 40, link: 'https://linkedin.com/in/hunter-lybbert' },
    { top: 60, left: 50, link: 'https://github.com/hunter-lybbert' }
];

// Linear easing function
function linear(t) {
    return t; // Linear progression
}

// Animate zoom with linear easing
function animateZoom(fromScale, toScale, origin, duration = 600, onComplete = () => {}) {
    let startTime;

    innerWrapper.style.transformOrigin = origin;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = linear(progress);  // Using linear easing
        const scale = fromScale + (toScale - fromScale) * eased;

        innerWrapper.style.transform = `scale(${scale})`; // Only scale the innerWrapper (the image)

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            currentScale = toScale;
            onComplete();
        }
    }

    requestAnimationFrame(step);
}

// Adjust clickable area positions based on the zoom level
function updateClickableAreas() {
    clickableAreas.forEach((area, index) => {
        const { top, left } = clickablePositions[index];

        // Calculate the new position based on the zoom level
        const scaledTop = (top / 100) * content.clientHeight * currentScale;
        const scaledLeft = (left / 100) * content.clientWidth * currentScale;

        // Set the new position of the clickable area (without scaling it)
        area.style.top = `${scaledTop}px`;
        area.style.left = `${scaledLeft}px`;
    });
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
        animateZoom(currentScale, 3, currentOrigin, 200);  // Zoom in with linear
        clickableAreas.forEach(area => area.style.display = 'block'); // Show clickable areas
        isZoomed = true;
    } else {
        // Zoom out without resetting the origin
        animateZoom(currentScale, 1, currentOrigin, 200, () => {
            clickableAreas.forEach(area => area.style.display = 'none'); // Hide clickable areas
        });
        isZoomed = false;
    }

    // Update clickable area positions after zoom
    updateClickableAreas();
});

// Adjust scroll position during zoom
zoomableArea.addEventListener('scroll', () => {
    if (isZoomed) {
        // Get current scroll position
        const scrollTop = zoomableArea.scrollTop;

        // Calculate the scroll offset and adjust image position accordingly
        // Scale the scroll offset based on the zoom level
        const offset = (scrollTop - initialScrollTop) * (currentScale - 1);

        // Apply scroll offset to the innerWrapper with a rate adjustment based on zoom level
        const scrollAdjustment = (scrollTop - initialScrollTop) * (currentScale - 1) * 0.5; // 0.5 adjusts scroll speed

        innerWrapper.style.transform = `scale(${currentScale}) translateY(-${scrollAdjustment}px)`; // Apply adjusted scroll offset
    }

    // Update clickable area positions during scroll
    updateClickableAreas();
});


// On zoom, store initial scroll position
zoomableArea.addEventListener('click', () => {
    if (isZoomed) {
        initialScrollTop = zoomableArea.scrollTop;
    }
});
