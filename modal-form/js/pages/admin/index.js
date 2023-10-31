import 'css/pages/admin/index.scss';


const charListener = (input) => {
    //let goodTask = [];
    let inputValue = input.target.value;
    console.log(inputValue);
    inputValue = inputValue.toLowerCase();

    const nameUsers = document.querySelectorAll('#name');

    for (let i = 0; i < nameUsers.length; i++) {
        if (!nameUsers[i].innerHTML.toLowerCase().includes(inputValue)) {
            nameUsers[i].closest('#row-item').classList.add('filtred')
        } else {
            if (nameUsers[i].closest('#row-item').classList.contains('filtred')) {
                nameUsers[i].closest('#row-item').classList.remove('filtred')
            }
        }
    }
}

const initPageLogic = () => {

    document.querySelectorAll('.dropddown').forEach((dropDownWrap) => {

        const dropDownButton = dropDownWrap.querySelector('.dropdown__button');
        const dropDownList = dropDownWrap.querySelector('.dropdown__list');
        const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
        const dropDownInput = dropDownWrap.querySelector('.dropdown__input-heddin');

        if (dropDownButton.innerHTML == 'Отказ') {
            document.getElementById(dropDownInput.id).src = '/img/select/status-red.svg';
        } else if (dropDownButton.innerHTML == 'Принят(а)') {
            document.getElementById(dropDownInput.id).src = '/img/select/status-green.svg';
        } else if (dropDownButton.innerHTML == 'Новая') {
            document.getElementById(dropDownInput.id).src = '/img/select/status-blue.svg';
        } else {
            document.getElementById(dropDownInput.id).src = '/img/select/status-grey.svg';
        }

        dropDownButton.addEventListener('click', () => {
            dropDownList.classList.toggle('dropdown__list--visible');
        });

        dropDownListItems.forEach((Item) => {
            Item.addEventListener('click', (elem) => {
                elem.stopPropagation();
                dropDownButton.innerHTML = elem.target.innerText;
                dropDownInput.value = elem.target.dataset.value;
                const dataInput = dropDownInput.id
                    //   console.log(dataInput);
                    //   console.log(elem.target.dataset.value);
                    //   console.log(dropDownInput.value);
                    //   console.log(dropDownInput);
                dropDownList.classList.remove('dropdown__list--visible');

                if (dropDownButton.innerHTML == 'Отказ') {
                    document.getElementById(dropDownInput.id).src = '/img/select/status-red.svg';
                } else if (dropDownButton.innerHTML == 'Принят(а)') {
                    document.getElementById(dropDownInput.id).src = '/img/select/status-green.svg';
                } else if (dropDownButton.innerHTML == 'Новая') {
                    document.getElementById(dropDownInput.id).src = '/img/select/status-blue.svg';
                } else {
                    document.getElementById(dropDownInput.id).src = '/img/select/status-grey.svg';
                }

                $.ajax({
                    url: '/admin/name',
                    method: 'POST',
                    data: {
                        'val': dropDownInput.value,
                        'id': dataInput
                    },
                    success: function() {
                        console.log('sent');
                    }
                })
            })
        })

        // Click outside of dropdown - close dropdown

        document.addEventListener('click', (elem) => {
            if (elem.target !== dropDownButton) {
                dropDownList.classList.remove('dropdown__list--visible');
            }
        })
    })


    // Поиск 

    const searchInput = document.querySelector('.admin__header-input');
    searchInput.addEventListener('input', charListener);
}

document.addEventListener('DOMContentLoaded', initPageLogic, );