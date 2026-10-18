export function initProjectSlider() {
    const slider = document.getElementById('project-slider');
    const autoScrollSpeed = 1.5;
    const dragSensitivity = 1.5;

    let isDragging = false;
    let isHovered = false;
    let dragStartX;
    let dragStartScrollLeft;
    let sliderWidth;
    let animationFrameId;

    function autoScrollSlider() {
        if (!isHovered && !isDragging) {
            slider.scrollLeft += autoScrollSpeed;

            if (slider.scrollLeft >= slider.scrollWidth / 2) {
                slider.scrollLeft = 0;
            }
        }
        animationFrameId = requestAnimationFrame(autoScrollSlider);
    }

    function pauseAutoScroll() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
        isDragging = false;
        slider.classList.remove('cursor-grabbing');
    }

    function updateDragOrigin(event) {
        dragStartX = event.pageX - slider.offsetLeft;
        dragStartScrollLeft = slider.scrollLeft;
    }

    function startDragging(event) {
        isDragging = true;
        slider.classList.add('cursor-grabbing');
        updateDragOrigin(event);
        sliderWidth = slider.scrollWidth;
        cancelAnimationFrame(animationFrameId);
    }

    function stopDragging() {
        isDragging = false;
        slider.classList.remove('cursor-grabbing');
        animationFrameId = requestAnimationFrame(autoScrollSlider);
    }

    function dragSlider(event) {
        if (!isDragging) return;
        event.preventDefault();
        const pointerX = event.pageX - slider.offsetLeft;
        const dragDistance = (pointerX - dragStartX) * dragSensitivity;
        slider.scrollLeft = dragStartScrollLeft - dragDistance;

        if (slider.scrollLeft >= sliderWidth / 2) {
            slider.scrollLeft -= sliderWidth / 2;
            updateDragOrigin(event);
        } else if (slider.scrollLeft <= 0) {
            slider.scrollLeft += sliderWidth / 2;
            updateDragOrigin(event);
        }
    }

    function resumeAutoScroll() {
        isHovered = false;
    }

    autoScrollSlider();
    slider.addEventListener('mouseenter', pauseAutoScroll);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mousedown', startDragging);
    slider.addEventListener('mouseup', stopDragging);
    slider.addEventListener('mousemove', dragSlider);
    slider.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    slider.addEventListener('touchend', resumeAutoScroll, { passive: true });
}
