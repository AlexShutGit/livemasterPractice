
export const slider = (elem) => {

    console.log(123);

    const subject = 'female' //<--- задаем пол по которму выставлять карточки

    const quoteCardsFemale = [0, 3, 4, 1, 2]; //<--- порядок карточек если пол ЖЕНСКИЙ
    const quoteCardsMale = [2, 0, 1, 3, 4]; //<--- порядок карточек если пол МУЖСКОЙ
    
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