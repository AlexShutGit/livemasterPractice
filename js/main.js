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
}

document.addEventListener('DOMContentLoaded', initPageLogic);

