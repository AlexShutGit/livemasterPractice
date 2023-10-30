const initPageLogic = () => {
    //-----------------обработка для слайдера-------------------//

    const slider = (elem) => {
        const subject = 'default' //<--- задаем пол по которму выставлять карточки

        const quoteCardsFemale = [0, 3, 4, 1, 2] //<--- порядок карточек если пол ЖЕНСКИЙ
        const quoteCardsMale = [2, 0, 1, 3, 4] //<--- порядок карточек если пол МУЖСКОЙ

        const cards = document.querySelectorAll('.reviews__slider')

        if (subject === 'female') {
            quoteCardsFemale.forEach(
                (element, index) => (cards[index]['id'] = element)
            )
        }

        if (subject === 'male') {
            quoteCardsMale.forEach(
                (element, index) => (cards[index]['id'] = element)
            )
        }

        if (elem.target.id == 'prev-slide') {
            slideIndex = slideIndex - 1
        } else {
            slideIndex = slideIndex + 1
        }

        if (slideIndex < 0) {
            slideIndex = 0
        }

        if (slideIndex > 4) {
            slideIndex = 4
        }
        console.log(slideIndex)

        const slides = document.querySelectorAll('.reviews__slider')
        const cirles = document.querySelectorAll(
            '.reviews__slider-bar-checkboxes-circle'
        )

        for (let i = 0; i < slides.length; i++) {
            if (slides[i].id == slideIndex) {
                slides[i].setAttribute('class', 'reviews__slider')
            } else {
                slides[i].setAttribute('class', 'reviews__slider slider-hide')
            }
        }

        for (let i = 0; i < slides.length; i++) {
            if (cirles[i].id == slideIndex) {
                cirles[i].setAttribute(
                    'class',
                    'reviews__slider-bar-checkboxes-circle checked'
                )
            } else {
                cirles[i].setAttribute(
                    'class',
                    'reviews__slider-bar-checkboxes-circle'
                )
            }
        }
    }

    const touchStart = (event) => {
        xDown = event.touches[0].clientX
        yDown = event.touches[0].clientY
    }

    const touchMove = (event) => {
        if (!xDown || !yDown) {
            return
        }

        let xUp = event.touches[0].clientX
        let yUp = event.touches[0].clientY

        let xDiff = xDown - xUp
        let yDiff = yDown - yUp

        const slides = document.querySelectorAll('.reviews__slider')
        const cirles = document.querySelectorAll(
            '.reviews__slider-bar-checkboxes-circle'
        )

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                console.log('left swipe')
                slideIndex = slideIndex + 1

                if (slideIndex > 4) {
                    slideIndex = 4
                }

                console.log(slideIndex)
            } else {
                console.log('right swipe')
                slideIndex = slideIndex - 1

                if (slideIndex < 0) {
                    slideIndex = 0
                }
                console.log(slideIndex)
            }
        }

        for (let i = 0; i < slides.length; i++) {
            if (slides[i].id == slideIndex) {
                slides[i].setAttribute('class', 'reviews__slider')
                cirles[i].setAttribute(
                    'class',
                    'reviews__slider-bar-checkboxes-circle checked'
                )
            } else {
                slides[i].setAttribute('class', 'reviews__slider slider-hide')
                cirles[i].setAttribute(
                    'class',
                    'reviews__slider-bar-checkboxes-circle'
                )
            }
        }

        xDown = null
        yDown = null
    }

    //---------------валидация--------------------//

    const validate = (input, alert, text, validate = true) => {
        if (!validate) {
            input.classList.add('validate')
            alert.innerHTML = text
        } else {
            alert.innerHTML = ''
            input.classList.remove('validate')
            alert.style.display = 'none'
        }
    }

    const validateName = (event) => {
        const input = event.target
        let alert = input.nextSibling.nextSibling

        validate(input, alert, 'Заполните поле', input.value != '')
    }

    const nameInput = document.querySelector('.name')
    nameInput.addEventListener('blur', validateName)
    nameInput.addEventListener('keypress', (event) => {
        if (event.which < 49 || event.which > 185) {
            event.preventDefault()
        }
    })

    const numberValidate = (event) => {
        const input = event.target
        if (
            event.inputType == 'deleteContentBackward' &&
            input.value.length <= 3
        ) {
            input.value = ''
            return
        }
        input.value = phoneMask(input.value)
    }

    const numberValidateCorrect = (event) => {
        const input = event.target
        let alert = input.nextSibling.nextSibling
        const reg = /^\+?[7][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/
        const valid = reg.test(phoneMask(input.value).replaceAll(' ', ''))

        validate(input, alert, 'Заполните поле', valid)
    }

    const numberInput = document.querySelector('.number')
    numberInput.addEventListener('blur', numberValidateCorrect)
    numberInput.addEventListener('input', numberValidate, false)
    numberInput.addEventListener('keypress', (event) => {
        if (event.which < 48 || event.which > 57) {
            event.preventDefault()
        }
    })

    const phoneMask = (phone) => {
        if (phone.startsWith('+7 ')) {
            let number = phone.slice(3, phone.length)
            return (
                '+7 ' +
                number.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4')
            )
        }

        return (phone =
            '+7 ' +
            phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7($1) $2-$3-$4'))
    }

    const emailEvent = (event) => {
        const input = event.target
        const email = input.value
        let alert = input.nextSibling.nextSibling
        if (email == '') {
            validate(input, alert, 'Заполните поле', emailValidate(email))
        } else {
            validate(input, alert, 'Некорректные символы', emailValidate(email))
        }
    }

    const emailInput = document.querySelector('.email')
    emailInput.addEventListener('blur', emailEvent)

    const emailValidate = (email) => {
        const regular = /\S+@\S+\.\S+/
        return regular.test(email)
    }

    // --------------- скролл ----------------- //

    const header = document.getElementById('header')

    window.addEventListener('scroll', () => {
        if (pageYOffset > document.querySelector('.header').clientHeight) {
            header.setAttribute('class', 'header__bar scroll')
        }

        if (pageYOffset < document.querySelector('.header').clientHeight) {
            header.setAttribute('class', 'header__bar')
        }
    })

    //------------слайдер-----------------//

    const prevButton = document.getElementById('prev-slide')
    const nextButton = document.getElementById('next-slide')
    prevButton.addEventListener('click', slider)
    nextButton.addEventListener('click', slider)

    if (window.innerWidth < 769) {
        document.addEventListener('touchstart', touchStart)
        document.addEventListener('touchmove', touchMove)
    }

    let slideIndex = 0
    let xDown = null
    let yDown = null

    //-----------------------селекторы???------------------//

    const dropDownButton = document.querySelector('.dropdown__button-sex')
    const dropDownButtonDirection = document.querySelector(
        '.dropdown__button-direction'
    )

    const dropDownList = document.querySelector('.dropdown__list')
    const dropDownListDirection = document.querySelector(
        '.dropdown__list-direction'
    )

    const dropDownListItemsDirection = dropDownListDirection.querySelectorAll(
        '.dropdown__list-item-direction'
    )
    const dropDownListItems = dropDownList.querySelectorAll(
        '.dropdown__list-item'
    )

    const dropDownInput = document.querySelector('.dropdown__input-heddin')
    const dropDownInputDirection = document.querySelector(
        '.dropdown__input-direction-heddin'
    )

    dropDownButton.addEventListener('click', (event) => {
        event.preventDefault()
        dropDownList.classList.toggle('dropdown__list--visible')
    })

    dropDownButtonDirection.addEventListener('click', (event) => {
        event.preventDefault()
        dropDownListDirection.classList.toggle(
            'dropdown__list-direction--visible'
        )
    })

    dropDownListItems.forEach((Item) => {
        Item.addEventListener('click', (elem) => {
            elem.stopPropagation()
            dropDownButton.innerHTML = elem.target.innerText
            dropDownButton.classList.add('picked')
            dropDownInput.value = elem.target.dataset.value
            dropDownList.classList.remove('dropdown__list--visible')
        })
    })
    let courses = []
    dropDownListItemsDirection.forEach((Item) => {
        Item.addEventListener('click', (elem) => {
            elem.stopPropagation()
            const input = elem.currentTarget.querySelector('input')
            const labelText = elem.currentTarget.querySelector('span').innerText
            const alert =
                elem.currentTarget.offsetParent.offsetParent.querySelector(
                    'div'
                )
            if (elem.target !== input) input.checked = !input.checked

            if (!courses.includes(labelText)) courses.push(labelText)
            else courses = courses.filter((elem) => elem !== labelText)

            if (dropDownButtonDirection.innerHTML.includes('Выберите курсы'))
                dropDownButtonDirection.classList.add('picked')

            let string = ''
            courses.forEach((course) => {
                if (string === '') string = string.concat(course)
                else string = string.concat(', ' + course)
            })

            if (string !== '') {
                dropDownButtonDirection.innerHTML = string
                dropDownButtonDirection.classList.remove('validate')
                alert.innerHTML = ''
            } else {
                dropDownButtonDirection.innerHTML = 'Выберите курсы'
                dropDownButtonDirection.classList.remove('picked')
                alert.innerHTML = 'Выберите хотя бы один курс'
                dropDownButtonDirection.classList.add('validate')
                    // alert
            }
            dropDownInputDirection.value = string
        })
    })

    // Click outside of dropdown - close dropdown

    document.addEventListener('click', (elem) => {
        if (elem.target !== dropDownButton) {
            dropDownList.classList.remove('dropdown__list--visible')
        }
    })

    document.addEventListener('click', (elem) => {
        if (elem.target !== dropDownButtonDirection) {
            dropDownListDirection.classList.remove(
                'dropdown__list-direction--visible'
            )
        }
    })
}

document.addEventListener('DOMContentLoaded', initPageLogic, () => {
    $.ajax({
        url: '/home/name',
        method: 'GET',
        data: {
            val: dropDownInput.value,
            id: dataInput,
        },
        success: function() {
            console.log('sent')
        },
    })
})