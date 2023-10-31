//---------------валидация--------------------//

export const ValidationModal = () => {
    const validate = (input, alert, text, validate = true) => {
        if (!validate) {
            input.classList.add("validate");
            alert.innerHTML = text;
        } else {
            alert.innerHTML = "";
            input.classList.remove("validate");
        }
    };

    const validateName = (event) => {
        const input = event.target;
        let alert = input.nextSibling.nextSibling;

        validate(input, alert, "Заполните поле", input.value != "");
    };

    const nameInput = document.querySelector(".name-modal");
    nameInput.addEventListener("blur", validateName);
    nameInput.oninput = (event) => {
        const name = event.target;
        const regex = /[0-9-A-Za-z\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\"\:\;\.\/\>\<\?\'\,\[\]]|\./g;

        name.value = name.value.replace(regex, "");
    };
    nameInput.onpaste = (event) => event.preventDefault();

    const numberValidate = (event) => {
        const input = event.target;
        if (event.inputType == "deleteContentBackward" && input.value.length <= 3) {
            input.value = "";
            return;
        }
        input.value = phoneMask(input.value);
    };

    const numberValidateCorrect = (event) => {
        const input = event.target;
        let alert = input.nextSibling.nextSibling;
        const reg = /^\+?[7][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/;
        const valid = reg.test(phoneMask(input.value).replaceAll(" ", ""));

        validate(input, alert, "Заполните поле", valid);
    };

    const numberInput = document.querySelector(".number-modal");
    numberInput.addEventListener("blur", numberValidateCorrect);
    numberInput.addEventListener("input", numberValidate, false);
    numberInput.addEventListener("keypress", (event) => {
        if (event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
    });
    numberInput.onpaste = (event) => event.preventDefault();

    const phoneMask = (phone) => {
        if (phone.startsWith("+7 ")) {
            let number = phone.slice(3, phone.length);
            return (
                "+7 " + number.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "($1) $2-$3-$4")
            );
        }

        return (phone =
            "+7 " + phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "+7($1) $2-$3-$4"));
    };

    const emailEvent = (event) => {
        const input = event.target;
        const email = input.value;
        let alert = input.nextSibling.nextSibling;
        if (email == "") {
            validate(input, alert, "Заполните поле", emailValidate(email));
        } else {
            validate(input, alert, "Некорректные символы", emailValidate(email));
        }
    };

    const emailInput = document.querySelector(".email-modal");
    emailInput.addEventListener("blur", emailEvent);

    const emailValidate = (email) => {
        const regular = /\S+@\S+\.\S+/;
        return regular.test(email);
    };

    const dropDownButtonDirection = document.querySelector(
        ".dropdown__button-direction"
    );
    const button = document.querySelector(".button-modal");

    button.addEventListener("click", (event) => {
        event.preventDefault();
        button.classList.remove("animate");
        const alert = event.target.offsetParent
            .querySelector(".form__direction-modal")
            .querySelector(".alert-modal");

        numberInput.focus();
        nameInput.focus();
        emailInput.focus();
        if (dropDownButtonDirection.innerHTML.includes("Выберите курсы"))
            dropDownButtonDirection.classList.add("validate");
        alert.innerHTML = "Выберите хотя бы один курс";
        button.focus()
        nameInput.focus()


        const validations = document.querySelectorAll(".validate");
        if (validations.length) {
            button.classList.add("animate");
        } else {
            button.classList.remove("animate");
        }
    });
};