


const slider = (elem) => {

    const subject = 'female' //<--- задаем пол по которму выставлять карточки

    let quoteCardsFemale = [0, 3, 4, 1, 2]; //<--- порядок карточек если пол ЖЕНСКИЙ
    let quoteCardsMale = [2, 0, 1, 3, 4]; //<--- порядок карточек если пол МУЖСКОЙ
    
    const cards = document.querySelectorAll('.reviews__slider');
    
    if (subject === 'female') {
        quoteCardsFemale.forEach((element, index) => cards[index]['id'] = (element));
    }

    if (subject === 'male') {
        quoteCardsMale.forEach((element, index) => cards[index]['id'] = (element));
    }
  
    if (elem.target.id == 'prev-slide') {
        slideIndex = slideIndex - 1;
    } else {
        slideIndex = slideIndex + 1;
    }

    if (slideIndex < 0) {
        slideIndex = 0;
    }

    if (slideIndex > 4) {
        slideIndex = 4;
    }
    console.log(slideIndex);

    const slides = document.querySelectorAll('.reviews__slider');
    const cirles = document.querySelectorAll('.reviews__slider-bar-checkboxes-circle');

    for (let i = 0; i < slides.length; i++) {
        if (slides[i].id == slideIndex) {   
            slides[i].setAttribute('class', 'reviews__slider');
        } else {
            slides[i].setAttribute('class', 'reviews__slider slider-hide');
        }
    } 
    
    for (let i = 0; i < slides.length; i++) {
        if (cirles[i].id == slideIndex) {
            cirles[i].setAttribute('class', 'reviews__slider-bar-checkboxes-circle checked');
        } else {
            cirles[i].setAttribute('class', 'reviews__slider-bar-checkboxes-circle');
        }
    }
}

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

    if (window.innerWidth < 769) {
        document.addEventListener('touchstart', touchStart);
        document.addEventListener('touchmove', touchMove);
    }
}

let slideIndex = 0;
let xDown = null;
let yDown = null;

document.addEventListener('DOMContentLoaded', initPageLogic,);

