const initPageLogic = () => {
    const validate = (input, alert, text, validate = true) => {
        if (!validate) {
            input.classList.add('validate')
            alert.innerHTML = text
            // alert.style.display = 'block'
            // alert.style.color = 'red'
            // alert.style.marginTop = '5px'
            // alert.style.fontSize = '12px'
            // alert.style.fontWeight = 'bold'
            // alert.style.textAlign = 'left'
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

    const validateSelect = () => {
        const select = document.querySelector('.dropdown__list-direction')
        const options = select.querySelectorAll(
            'input[type="checkbox"]:checked'
        )
        // const alert = select.previousSibling.previousSibling

        if (options.length === 0) {
            // validate(select, alert, 'Выберите хоть один курс', false)
            // alert.style.marginTop = '10px'
        } else {
            // validate(select, alert, '', true)
        }
    }

    const checkboxes = document.querySelectorAll(
        '.dropdown__list-direction input[type="checkbox"]'
    )
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', validateSelect)
    })
}

document.addEventListener('DOMContentLoaded', initPageLogic)
