

const initPageLogic = () => {

    const dropDownButton = document.querySelector('.dropdown__button');
    const dropDownList = document.querySelector('.dropdown__list');
    const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
    const dropDownInput = document.querySelector('.dropdown__input-heddin');

    dropDownButton.addEventListener('click', () => {
        dropDownList.classList.toggle('dropdown__list--visible');
    });

    dropDownListItems.forEach( (Item) => {
        Item.addEventListener('click', (elem) => {
            elem.stopPropagation();
            dropDownButton.innerHTML = elem.target.innerText; 
            dropDownInput.value = elem.target.dataset.value;
            dropDownList.classList.remove('dropdown__list--visible');
        })
    })

    // Click outside of dropdown - close dropdown

    document.addEventListener('click', (elem) => {
        if (elem.target !== dropDownButton) {
            dropDownList.classList.remove('dropdown__list--visible');
        }
    })
}

document.addEventListener('DOMContentLoaded', initPageLogic,);