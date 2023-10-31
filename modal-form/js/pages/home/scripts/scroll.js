// --------------- скролл ----------------- //
export const Scroll = () => {
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        if (pageYOffset > document.querySelector(".header").clientHeight) {
            header.setAttribute("class", "header__bar scroll");
        }

        if (pageYOffset < document.querySelector(".header").clientHeight) {
            header.setAttribute("class", "header__bar");
        }
    });
};