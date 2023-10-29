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

    dropDownListItemsDirection.forEach((Item) => {
        Item.addEventListener('click', (elem) => {
            elem.stopPropagation()
            input = elem.currentTarget.querySelector('input')
            input.checked = !input.checked
            labelText = elem.currentTarget.querySelector('label').innerText
            if (dropDownButtonDirection.innerHTML.includes('Выберите курсы')) {
                dropDownButtonDirection.innerHTML = labelText
            } else {
                dropDownButtonDirection.innerHTML =
                    dropDownButtonDirection.innerHTML.concat(', ' + labelText)
            }
            dropDownButtonDirection.classList.add('picked')
            dropDownInputDirection.value = elem.currentTarget.dataset.value
            // dropDownListDirection.classList.remove('dropdown__list--visible')
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
            dropDownListDirection.classList.remove('dropdown__list--visible')
        }
    })
}

document.addEventListener('DOMContentLoaded', initPageLogica)
