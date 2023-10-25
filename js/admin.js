
const initPageLogic = () => {

    document.querySelectorAll('.dropddown').forEach((dropDownWrap) => {
            
            const dropDownButton = dropDownWrap.querySelector('.dropdown__button');
            const dropDownList = dropDownWrap.querySelector('.dropdown__list');
            const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
            const dropDownInput = dropDownWrap.querySelector('.dropdown__input-heddin');

            dropDownButton.addEventListener('click', () => {
                dropDownList.classList.toggle('dropdown__list--visible');
            });

            dropDownListItems.forEach((Item) => {
                Item.addEventListener('click', (elem) => {
                    elem.stopPropagation();
                    dropDownButton.innerHTML = elem.target.innerText;
                    dropDownInput.value = elem.target.dataset.value;
                    console.log(elem.target);
                    console.log(elem.target.dataset.value);
                    console.log(dropDownInput.value);
                    console.log(dropDownInput);
                    dropDownList.classList.remove('dropdown__list--visible');
                })
            })

            // Click outside of dropdown - close dropdown

            document.addEventListener('click', (elem) => {
                if (elem.target !== dropDownButton) {
                    dropDownList.classList.remove('dropdown__list--visible');
                }
            })

        })

       
        
}

document.addEventListener('DOMContentLoaded', initPageLogic,);