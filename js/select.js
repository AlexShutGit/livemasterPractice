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

    dropDownButton.addEventListener('click', () => {
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
            console.log(elem.target)
            dropDownButton.innerHTML = elem.target.innerText
            dropDownButton.classList.add('picked')
            dropDownInput.value = elem.target.dataset.value
            dropDownList.classList.remove('dropdown__list--visible')
        })
    })

    dropDownListItemsDirection.forEach((Item) => {
        Item.addEventListener('click', (elem) => {
            elem.stopPropagation()
            dropDownButtonDirection.innerHTML =
                elem.target.offsetParent.querySelector('label').innerText
            dropDownButtonDirection.classList.add('picked')
            console.log(elem.target.dataset.value)
            dropDownInputDirection.value = elem.target.dataset.value
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