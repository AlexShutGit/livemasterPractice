const initPageLogica = () => {
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
                console.log(alert.innerHTML)
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

document.addEventListener('DOMContentLoaded', initPageLogica)