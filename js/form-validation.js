const initPageLogic = () => {
    const inputs = document.querySelectorAll('[data-input]')

    const validate = (event) => {
        let input = event.target
            // let div = input.closest('div')
            // let classes = Array.from(input.classList)
        let alert = input.nextSibling.nextSibling

        if (input.value == '') {
            input.classList.add('validate')
            alert.innerHTML = 'Заполните поле'
        }

        return
    }

    inputs.forEach((input) => input.addEventListener('blur', validate))
}
document.addEventListener('DOMContentLoaded', initPageLogic)