{% extends "base.tpl" %}

{% block styles %}
	<link rel="stylesheet" href="{{ webpackAsset('home.css') }}">
{% endblock %}

{% block content %}
<div class="header">

        <div class="header__bar" id="header">
            <img class="header__bar-img-mobile-white" src="../img/header/logo.svg" alt="Логотип">
            <img class="header__bar-img-mobile-black" src="../img/header/logo_mobile_black.svg" alt="Логотип">
            <img class="header__bar-img-desc-white" src="../img/header/logo_desc.svg" alt="Логотип">
            <img class="header__bar-img-desc-black" src="../img/header/logo_desc_black.svg" alt="Логотип">
            
            <div class="header__bar-menu">
                <a class="header__bar-menu-link" href="/">Контакты</a>
                <a class="header__bar-menu-link" href="#aboutCompany">О Livemaster</a>
                <a class="header__bar-menu-btn" href="#form">Записаться на курс</a>
            </div>
        </div>

        <div class="header__text">
            <div>
                <p class="header__text-main">Livemaster<br>Практикум Start</p>
                <p class="header__text-disc">Станьте востребованным<br>специалистом в IT</p>
            </div>

            <img class="header__img" src="../img/header/bust.svg" alt="Каменный бюст">
        </div>
    </div>

	<div class="direction-block">
        <h3>Направления обучения</h3>
        <div class="cards">
            <div class="card">
                <div class="card-header">
                    <span>Developer</span>
                </div>
                <div class="card__content">
                    <p>
                        Здесь вы сможете овладеть навыками программирования, разработкой прототипов и управлением жизненным циклом продукта для успешной работы в сфере продуктовой разработки.
                    </p>
                    <img class="card__content-image-mobile" src="../img/direction-block/develop mobile.png" alt="" />
                    <img class="card__content-image-desktop" src="../img/direction-block/develop desktop.png" alt="" />
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span>Quality Assurance</span>
                </div>
                <div class="card__content">
                    <p class="card__content-paragraph">
                        Этот курс поможет вам освоить основы контроля качества программного обеспечения.
                    </p>
                    <p class="card__content-paragraph">
                        Вы научитесь тестированию продукта на соответствие требованиям, выявлению ошибок и дефектов.
                    </p>
                    <img class="card__content-image-mobile" src="../img/direction-block/watch mobile.png" alt="" />
                    <img class="card__content-image-desktop" src="../img/direction-block/watch desktop.png" alt="" />
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span>Project Manager</span>
                </div>
                <div class="card__content">
                    <p class="card__content-paragraph">
                        Этот курс поможет освоить навыки планирования, организации и коммуникации.
                    </p>

                    <p class="card__content-paragraph">
                        Вы научитесь управлять ресурсами, распределять задачи, решать проблемы и управлять рисками.
                    </p>
                    <img class="card__content-image-mobile" src="../img/direction-block/manage mobile.png" alt="" />
                    <img class="card__content-image-desktop" src="../img/direction-block/manage desktop.png" alt="" />
                </div>
            </div>
        </div>
    </div>

    <div id="aboutCompany" class="main">
        <div class="statistic">
            <div class="containerInfo">
                <div class="containerInfo__infoUSer">
                    <div class="text__numberWithAge">
                        <span class="text__numbers">17</span>
                        <span class="text__age">лет</span>
                    </div>
                    <p id="text__info" class="text__info">
                        развиваемся и растём
                    </p>
                </div>
                <div class="containerInfo__infoUSer">
                    <span class="text__numbers">8 500 000</span>
                    <p class="text__info">клиентов в месяц</p>
                </div>
                <div class="containerInfo__infoUSer">
                    <span class="text__numbers">3 000 000</span>
                    <p class="text__info">дизайнерских товаров</p>
                </div>
            </div>
        </div>
    </div>

    <div class="company-mission">
            <div class="text">
                <h1>Миссия компании</h1>
                <p>
                    помогать людям реализовывать себя через творчество.
                    Мы объединили мастеров handmade, признанные российские
                    бренды и предприятия народных художественных промыслов,
                    чтобы вы могли совершать покупки по самым выгодным ценам
                </p>
            </div>
            <div class="image">
                <img src="../img/company-misson/livemaster.png" alt="" />
            </div>
        </div>

        <div class="products-block">
            <h1>Продукты компании</h1>
            <div class="products">
                <div class="products__top">
                    <div class="product first">
                        <div class="product__text">
                            <h1>Маркетплейс</h1>
                            <p>
                                Онлайн-маркет товаров ручной работы, винтажа,
                                дизайнерских вещей от локальных брендов
                                и материалов для творчества
                            </p>
                        </div>
                        <a href="https://www.livemaster.ru" class="product-button">Начать покупки</a>
                    </div>
                    <div class="product second">
                        <div class="product__text">
                            <h1>Журнал</h1>
                            <p>
                                Онлайн-вебинары по рукоделию, искусству
                                и ведению бизнеса в креативной индустрии
                            </p>
                        </div>
                        <a href="https://www.livemaster.ru/zhurnal" class="product-button">Читать статьи</a>
                    </div>
                </div>
                <div class="products__bot">
                    <div class="product third">
                        <div class="product__text">
                            <h1>Приложения</h1>
                            <p>
                                Онлайн-вебинары по рукоделию, искусству
                                и ведению бизнеса в креативной индустрии
                            </p>
                        </div>
                        <a href="https://www.livemaster.ru/landings/apps" class="product-button">
                            Скачать приложение
                        </a>
                    </div>
                    <div class="product fourth">
                        <div class="product__text">
                            <h1>Ярмарка Талантов</h1>
                            <p>
                                Сервис по подбору талантливых исполнителей
                                для самых необычных идей
                            </p>
                        </div>
                        <a href="https://talents.livemaster.ru/" class="product-button">Разместить заказ</a>
                    </div>
                    <div class="product fifth">
                        <div class="product__text">
                            <h1>Академия</h1>
                            <p>
                                Онлайн-вебинары по рукоделию, искусству
                                и ведению бизнеса в креативной индустрии
                            </p>
                        </div>
                        <a href="https://www.livemaster.ru/onlineacademy" class="product-button">
                            Смотреть вебинары
                        </a>
                    </div>
                </div>
            </div>
        </div>

    <div class="reviews">
        <p class="reviews__head">Отзывы выпускников</p>

        <div class="reviews__slider-box">

            <img class="reviews__slider-box-arrow" id="prev-slide" data-next="prev" src="../img/slider/left_arrow_slider.svg" alt="">

            <div class="reviews__slider" id="0">
                <div class="reviews__slider-bar">

                    <img class="reviews__slider-bar-head-img-big" src="../img/slider/julia_hq.svg" alt="">

                    <div class="reviews__slider-bar-box">
                        <div class="reviews__slider-bar-head">
                            <img class="reviews__slider-bar-head-img" src="../img/slider/julia.png" alt="">

                            <div class="reviews__slider-bar-head-text">
                                <p class="reviews__slider-bar-head-text-name">Юлия</p>
                                <span class="reviews__slider-bar-head-text-discription">Курс "Разработчики", 2019 год</span>
                            </div>

                        </div>

                        <div class="reviews__slider-bar-main">

                            <div class="reviews__slider-bar-main-text">Практикум открыл для меня невероятно интересный мир web-разработки, позволил на 3 недели погрузиться в жизнь настоящей IT-компании. 
                            Практикум — это непростой путь, но прошедшего его всё самое интересное ждёт впереди:)
                            </div>
                            <div class="reviews__slider-bar-main-text">
                                Я до сих пор с теплотой вспоминаю это время и благодарю всех причастных за предоставленную мне возможность по завершении Практикума стать частью крутой команды.
                            </div>
                    </div>

                    </div>
                </div>
            </div>

            <div class="reviews__slider slider-hide"  id="1" >
                <div class="reviews__slider-bar">

                    <img class="reviews__slider-bar-head-img-big" src="../img/slider/mihail_hq.svg" alt="">

                    <div class="reviews__slider-bar-box">
                        <div class="reviews__slider-bar-head">
                            <img class="reviews__slider-bar-head-img" src="../img/slider/mihail_hq.svg" alt="">

                            <div class="reviews__slider-bar-head-text">
                                <p class="reviews__slider-bar-head-text-name">Михаил</p>
                                <span class="reviews__slider-bar-head-text-discription">Курс "Разработчики", 2022 год</span>
                            </div>

                        </div>

                        <div class="reviews__slider-bar-main">

                            <div class="reviews__slider-bar-main-text">Практикум стал хорошим местом, чтобы закрепить знания, которые у меня были до этого и узнать что‑то новое.
                                 Интересные лекции и отзывчивые кураторы подогревали интерес к новым знаниям и преподносили материал очень понятно и развёрнуто.
                            </div>
                            <div class="reviews__slider-bar-main-text">
                                Считаю, что практикум является хорошим стартом в компании и открывает путь к новым интересным испытания.
                            </div>
                    </div>

                    </div>
                </div>
            </div>

            <div class="reviews__slider slider-hide" id="2">
                <div class="reviews__slider-bar">

                    <img class="reviews__slider-bar-head-img-big" src="../img/slider/artem_hq.svg" alt="">

                    <div class="reviews__slider-bar-box">
                        <div class="reviews__slider-bar-head">
                            <img class="reviews__slider-bar-head-img" src="../img/slider/artem_hq.svg" alt="">

                            <div class="reviews__slider-bar-head-text">
                                <p class="reviews__slider-bar-head-text-name">Артем</p>
                                <span class="reviews__slider-bar-head-text-discription">Курс "Разработчики", 2022 год</span>
                            </div>

                        </div>

                        <div class="reviews__slider-bar-main">

                            <div class="reviews__slider-bar-main-text">Понравилась атмосфера внутри Практикума и командная работа при выполнении дипломного проекта. На протяжении всего практикума была поддержка среди преподавателей, они старались максимально объяснить для нас каждую тему и поддержка среди ребят.
                            </div>
                            <div class="reviews__slider-bar-main-text">
                                Рад, что распределили по наставникам, которые помогали нам сделать первые шаги в проекте и были на протяжении всего этого времени.
                            </div>
                    </div>

                    </div>
                </div>
            </div>

            <div class="reviews__slider slider-hide" id="3">
                <div class="reviews__slider-bar">

                    <img class="reviews__slider-bar-head-img-big" src="../img/slider/elizaveta_hq.svg" alt="">

                    <div class="reviews__slider-bar-box">
                        <div class="reviews__slider-bar-head">
                            <img class="reviews__slider-bar-head-img" src="../img/slider/elizaveta_hq.svg" alt="">

                            <div class="reviews__slider-bar-head-text">
                                <p class="reviews__slider-bar-head-text-name">Елизавета</p>
                                <span class="reviews__slider-bar-head-text-discription">Курс "Разработчики", 2019 год</span>
                            </div>

                        </div>

                        <div class="reviews__slider-bar-main">

                            <div class="reviews__slider-bar-main-text">Участие в Практикуме выглядело для меня возможностью попробовать ту профессию, о которой на тот момент я могла только мечтать.
                            </div>
                            <div class="reviews__slider-bar-main-text">
                                Погружение было сразу и с головой: минимум теории, максимум самостоятельной работы и задачи, приближенные к реальным.

                            </div>
                            <div class="reviews__slider-bar-main-text">А после... уже 4 года года профессионального роста, новых свершений, удивительных историй и приключений вместе с командой Livemaster
                            </div>
                    </div>

                    </div>
                </div>
            </div>

            <div class="reviews__slider slider-hide" id="4">
                <div class="reviews__slider-bar">

                    <img class="reviews__slider-bar-head-img-big" src="../img/slider/sofia_hq.svg" alt="">

                    <div class="reviews__slider-bar-box">
                        <div class="reviews__slider-bar-head">
                            <img class="reviews__slider-bar-head-img" src="../img/slider/sofia_hq.svg" alt="">

                            <div class="reviews__slider-bar-head-text">
                                <p class="reviews__slider-bar-head-text-name">София</p>
                                <span class="reviews__slider-bar-head-text-discription">Курс "Разработчики", 2019 год</span>
                            </div>

                        </div>

                        <div class="reviews__slider-bar-main">

                            <div class="reviews__slider-bar-main-text">Практикум от Ярмарки Мастеров помог мне с нуля подняться до уровня Junior всего за 3 недели. Хотя другие курсы заняли бы минимум 3 месяца, и платно. 
                            </div>
                            <div class="reviews__slider-bar-main-text">
                                Структурированная информация, практические задания на закрепление знаний и ответы на возникшие вопросы от опытных специалистов, которые работают в сфере уже много лет.
                            </div>
                            <div class="reviews__slider-bar-main-text">Нисколько не пожалела, что когда‑то решилась попробовать пройти обучение. Это безумно крутой опыт.
                            </div>
                    </div>

                    </div>
                </div>
            </div>

            <img class="reviews__slider-box-arrow" id="next-slide" src="../img/slider/right_arrow_slider.svg" alt="">

        </div>
        
        <div class="reviews__slider-bar-checkboxes">
            <div class="reviews__slider-bar-checkboxes-circle checked" id="0"></div>
            <div class="reviews__slider-bar-checkboxes-circle" id="1"></div>
            <div class="reviews__slider-bar-checkboxes-circle" id="2"></div>
            <div class="reviews__slider-bar-checkboxes-circle" id="3"></div>
            <div class="reviews__slider-bar-checkboxes-circle" id="4"></div>
        </div>
    </div>

    <div class="register-form">
        <div class="register-application">
            <h1>Оставьте заявку на участие в Практикуме*</h1>
            <form class="form">
                <div class="form__data">
                    <div class="name-block">
                        <input data-input class="name" placeholder="Имя" type="text" required />
                        <div class="alert"></div>
                    </div>
                    <div class="number-sex">
                        <div class="sex-block">
                            <div class="dropddown-sex">
                                <button class="dropdown__button-sex">
                                        Пол
                                    </button>
                                <ul class="dropdown__list">
                                    <li class="dropdown__list-item" data-value="new">
                                        Женский
                                    </li>
                                    <li class="dropdown__list-item" data-value="processing">
                                        Мужской
                                    </li>
                                    <li class="dropdown__list-item" data-value="denied">
                                        Не указан
                                    </li>
                                </ul>
                                <input id="dropdown__input-heddin" type="text" name="select-status" value="" class="dropdown__input-heddin" />
                            </div>
                        </div>
                        <div class="number-block">
                            <input data-input class="number" placeholder="+7 (___) ___-__-__" type="tel" maxlength="17" required />
                            <div class="alert"></div>
                        </div>
                    </div>
                    <div class="email-block">
                        <input data-input class="email" placeholder="Электронная почта" type="email" required />
                        <div class="alert"></div>
                    </div>
                </div>
                <div class="form__direction">
                    <h3>Выберите интересующие курсы:</h3>
                    <button class="dropdown__button-direction">
                            Выберите курсы
                        </button>
                    <ul class="dropdown__list-direction">
                        <li class="dropdown__list-item-direction" data-value="dev">
                            <input type="checkbox" name="developer" id="developer" data-value="dev" />
                            <span for="developer" data-value="dev">Developer</span
                                >
                            </li>
                            <li
                                class="dropdown__list-item-direction"
                                data-value="QA"
                            >
                                <input
                                    type="checkbox"
                                    name="QA"
                                    id="QA"
                                    data-value="QA"
                                />
                                <span for="QA">QA</span>
                        </li>
                        <li class="dropdown__list-item-direction" data-value="PM">
                            <input type="checkbox" name="PM" id="PM" data-value="PM" />
                            <span for="PM" data-value="PM">PM</span>
                        </li>
                    </ul>
                    <div class="alert"></div>
                    <input id="dropdown__input-direction-heddin" type="text" name="select-status" value="" class="dropdown__input-direction-heddin" />
                </div>
                <button class="button">Принять участие</button>
            </form>
            <p class="register-application-paragraph">
                *Количество мест ограничено
            </p>
            <div class="application-count">
                <div class="count">
                    <p class="blink">15</p>
                </div>
                <h1>Заявок оставлено</h1>
            </div>
        </div>
        <hr />
    </div>

    <div class="footer">
        <div class="footer__description">
            <div class="footer__image">
                <img src="../img/footer/logolivemaster.png" alt="">
            </div>
                <div class="footer__phoneNumber">
                    + 7 (930) 304 17 19
                    <p>whatsapp/viber/telegram</p>
                </div>
                    <div class="footer__adress_mob">
                        г. Смоленск, улица Тенишевой, д. 15, пом.
                        <p>© 2023 ООО «Ливмастер»</p>
                    </div>
                    <div class="footer__adress">
                        г. Смоленск, улица Тенишевой, д. 15, помещ. 3
                        <p>© 2023 ООО «Ливмастер»</p>
                    </div>
                        <div class="footer__icons">
                            <a href="https://vk.com/livemaster" target="_blank"><img  src="../img/footer/VK.svg" alt=""> </a>
                            <a href="https://ok.ru/livemaster" target="_blank"><img src="../img/footer/OK.svg" alt=""> </a>
                            <a href="https://ru.pinterest.com/livemaster/" target="_blank"><img src="../img/footer/Pintrest.svg" alt=""> </a>
                            <a href="https://www.youtube.com/user/livemasterru" target="_blank"><img src="../img/footer/Youtube.svg" alt=""> </a>
                        </div>
        </div>
        <div class="footer__students">Сделано студентами Практикума Start 2023</div>
    </div>

    <div class="modal-background">
        <div class="modal-active">
            <div class="modal-close">
                <div>X</div>
            </div>
            <div class="modalWindow">

                <div class="register-form-modal">
                    <div class="register-application-modal">

                        <h1 class="register-application-modal-head">Оставьте заявку <br>на участие <br>в Практикуме*</h1>

                        <form class="form-modal">
                            <div class="form-modal__data">

                                <div class="name-block-modal">
                                    <input data-input class="name-modal" placeholder="Имя" type="text" required />
                                    <div class="alert-modal"></div>
                                </div>

                                <div class="number-sex-modal">
                                    <div class="sex-block">
                                        <div class="dropddown-sex-modal">
                                            <div class="dropdown__button-sex-modal">Пол</div>
                                            <ul class="dropdown__list-modal">
                                                <li class="dropdown__list-modal-item" data-value="new">
                                                    Женский
                                                </li>
                                                <li class="dropdown__list-modal-item" data-value="processing">
                                                    Мужской
                                                </li>
                                                <li class="dropdown__list-modal-item" data-value="denied">
                                                    Не указан
                                                </li>
                                            </ul>
                                            <input id="dropdown__input-heddin" type="text" name="select-status" value="" class="dropdown__input-heddin" />
                                        </div>
                                    </div>

                                    <div class="number-block-modal">
                                        <input data-input class="number-modal" placeholder="+7 (___) ___-__-__" type="tel" maxlength="17" required />
                                        <div class="alert-modal"></div>
                                    </div>

                                </div>

                                <div class="email-block-modal">
                                    <input data-input class="email-modal" placeholder="Электронная почта" type="email" required />
                                    <div class="alert-modal"></div>
                                </div>
                            </div>

                            <div class="form__direction-modal">
                                <h3 class="form__direction-modal-head">Выберите интересующие курсы:</h3>

                                <div class="dropdown__button-direction-modal">Выберите курсы</div>

                                <ul class="dropdown__list-direction-modal">
                                    <li class="dropdown__list-item-direction-modal" data-value="dev">
                                        <input type="checkbox" name="developer" id="developer" data-value="dev" class="input-direction"/>
                                        <span for="developer" data-value="dev">Developer</span>
                                    </li>

                                    <li class="dropdown__list-item-direction-modal" data-value="QA">
                                        <input type="checkbox" name="QA" id="QA" data-value="QA"  class="input-direction"/>
                                        <span for="QA">QA</span>
                                    </li>

                                    <li class="dropdown__list-item-direction-modal" data-value="PM">
                                        <input type="checkbox" name="PM" id="PM" data-value="PM" class="input-direction"/>
                                        <span for="PM" data-value="PM">PM</span>
                                    </li>
                                </ul>

                                <div class="alert-modal"></div>
                                <input id="dropdown__input-direction-heddin" type="text" name="select-status" value="" class="dropdown__input-direction-heddin" />
                            </div>

                            <button class="button-modal">Принять участие</button>
                        </form>

                        <p class="register-application-modal-paragraph">*Количество мест ограничено</p>

                        <div class="application-count-modal">
                            <div class="count-modal">
                                <p class="blink-modal">15</p>
                            </div>
                            <h1 class="application-count-head">Заявок оставлено</h1>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

{% endblock %}

{% block scripts %}
	<script id="client-data" type="text/json">{{ clientData }}</script>
	<script src="{{ webpackAsset('home.js') }}"></script>
{% endblock %}