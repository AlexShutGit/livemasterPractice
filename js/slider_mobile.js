
const touchStart = (event) => {
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
}

const touchMove = (event) => {
    if (!xDown || !yDown) {
        return;
    }
    
    let xUp = event.touches[0].clientX;
    let yUp = event.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    const slides = document.querySelectorAll('.reviews__slider');
    const cirles = document.querySelectorAll('.reviews__slider-bar-checkboxes-circle');

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            console.log('left swipe');
            slideIndex = slideIndex + 1;

            if (slideIndex > 4) {
                slideIndex = 4;
            }

            console.log(slideIndex);
            
        } else {
            console.log('right swipe');
            slideIndex = slideIndex - 1;
            
            if (slideIndex < 0) {
                slideIndex = 0;
            }
            console.log(slideIndex);
        }
    }

    for (let i = 0; i < slides.length; i++) {
        if (slides[i].id == slideIndex) {   
            slides[i].setAttribute('class', 'reviews__slider');
            cirles[i].setAttribute('class', 'reviews__slider-bar-checkboxes-circle checked');
        } else {
            slides[i].setAttribute('class', 'reviews__slider slider-hide');
            cirles[i].setAttribute('class', 'reviews__slider-bar-checkboxes-circle');
        }
    } 

    xDown = null;
    yDown = null;
}