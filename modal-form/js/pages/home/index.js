import "css/pages/home/index.scss";
import { Scroll } from "./scripts/scroll";
import { Selectors } from "./scripts/selectors";
import { SelectorsModal } from "./scripts/selectors-modal";
import { Slider } from "./scripts/slider";
import { Validation } from "./scripts/validate";
import { ValidationModal } from "./scripts/validate-modal";

const initPageLogic = () => {
    Slider();
    Validation();
    Scroll();
    Selectors();
    SelectorsModal();
    ValidationModal();

};

document.addEventListener("DOMContentLoaded", initPageLogic, () => {
    $.ajax({
        url: "/home/name",
        method: "GET",
        data: {
            val: dropDownInput.value,
            id: dataInput,
        },
        success: function() {
            console.log("sent");
        },
    });
});