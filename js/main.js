


const slider = (elem) => {
    if (elem.target.id == 'prev-slide') {
        slideIndex = slideIndex - 1;
    } else {
        slideIndex = slideIndex + 1;
    }

    if (slideIndex < 0) {
        slideIndex = 0;
    }

    if (slideIndex > 2) {
        slideIndex = 2;
    }
    console.log(slideIndex);

    const slides = document.querySelectorAll('.reviews__slider');
    const currSlide = document.getElementById(slideIndex); 

    for (let i = 0; i < slides.length; i++) {
        if (slides[i].id == slideIndex) {   
            slides[i].setAttribute('class', 'reviews__slider');
        } else {
            slides[i].setAttribute('class', 'reviews__slider slider-hide');
        }
    }   
}





const initPageLogic = () => {

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (pageYOffset > '100') {
            header.setAttribute('class','header__bar scroll')
        }

        if (pageYOffset < '100') {
            header.setAttribute('class','header__bar')
        }
    })

    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    prevButton.addEventListener('click', slider)
    nextButton.addEventListener('click', slider)
}

let slideIndex = 0;
document.addEventListener('DOMContentLoaded', initPageLogic,);

