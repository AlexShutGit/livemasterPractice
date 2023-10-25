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
                <a class="header__bar-menu-link" href="/">О Livemaster</a>
                <a class="header__bar-menu-btn" href="/">Записаться на курс</a>
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
                    <span>Developer</span>
                    <div class="card__content">
                        <p>
                            Здесь вы сможете овладеть навыками
                            программирования, разработкой прототипов
                            и управлением жизненным циклом продукта
                            для успешной работы в сфере продуктовой
                            разработки.
                        </p>
                        <img
                            class="card__content__image-mobile"
                            src="../img/direction-block/develop mobile.png"
                            alt=""
                        />
                        <img
                            class="card__content__image-desktop"
                            src="../img/direction-block/develop desktop.png"
                            alt=""
                        />
                    </div>
                </div>

                <div class="card">
                    <span>Quality Assurance</span>
                    <div class="card__content">
                        <p class="card__content-paragraph">
                            Этот курс поможет вам освоить основы контроля
                            качества программного обеспечения.
                        </p>
                        <p class="card__content-paragraph">
                            Вы научитесь тестированию продукта
                            на соответствие требованиям, выявлению ошибок
                            и дефектов.
                        </p>
                        <img
                            class="card__content__image-mobile"
                            src="../img/direction-block/watch mobile.png"
                            alt=""
                        />
                        <img
                            class="card__content__image-desktop"
                            src="../img/direction-block/watch desktop.png"
                            alt=""
                        />
                    </div>
                </div>

                <div class="card">
                    <span>Project Manager</span>
                    <div class="card__content">
                        <p class="card__content-paragraph">
                            Этот курс поможет освоить навыки планирования,
                            организации и коммуникации.
                        </p>

                        <p class="card__content-paragraph">
                            Вы научитесь управлять ресурсами, распределять
                            задачи, решать проблемы и управлять рисками.
                        </p>
                        <img
                            class="card__content__image-mobile"
                            src="../img/direction-block/manage mobile.png"
                            alt=""
                        />
                        <img
                            class="card__content__image-desktop"
                            src="../img/direction-block/manage desktop.png"
                            alt=""
                       />
                    </div>
                </div>
            </div>
        </div>

    <div class="main">
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
                        <a href="" class="product-button">Начать покупки</a>
                    </div>
                    <div class="product second">
                        <div class="product__text">
                            <h1>Журнал</h1>
                            <p>
                                Онлайн-вебинары по рукоделию, искусству
                                и ведению бизнеса в креативной индустрии
                            </p>
                        </div>
                        <a href="" class="product-button">Читать статьи</a>
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
                        <a href="" class="product-button">
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
                        <a href="" class="product-button">Разместить заказ</a>
                    </div>
                    <div class="product fifth">
                        <div class="product__text">
                            <h1>Академия</h1>
                            <p>
                                Онлайн-вебинары по рукоделию, искусству
                                и ведению бизнеса в креативной индустрии
                            </p>
                        </div>
                        <a href="" class="product-button">
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

    <div class="register-block">
            <div class="block">
                <h1>Оставьте заявку<br/> на участие в <br/>Практикуме*</h1>
                <h3>Заявок оставлено</h3>
                <p>*Количество мест ограничено</p>
            </div>
            <div class="block">
                <form class="register-form" id="register-form">
                    <input value="12"/>
                    
                    <input/>
                    <input/>
                    <input/>
                    <label></label>
                    <input/>
                    <button>Принять участие</button>
                </form>
            </div>
        </div>

        <footer>
        
        <div class="footer-top">
            <div class="block">
                <img src="../img/header/logo.svg" alt="logo"/>
            </div>
            <div class="block"> 
                <h1>+ 7 (930) 304 17 19 </h1>
                <p>whatsapp/viber/telegram</p>
            </div>
            <div class="block">
                <p>г. Смоленск, улица Тенишевой, д. 15, помещ. 3</p>
                <p>© 2023 ООО «Ливмастер»</p>
            </div>
            <div class="block">
                <div class="social">
                    <a href="#" class="icon vk"></a>     
                    <a href="#" class="icon pin"></a>
                    <a href="#" class="icon ok"></a>
                    <a href="#" class="icon youtube"></a>
                </div>
                
            </div>
        </div>
        <div class="footer-bottom">
            <p>Сделано студентами Практикума Start 2023</p>
        </div>
    </footer>
{% endblock %}

{% block scripts %}
	<script id="client-data" type="text/json">{{ clientData }}</script>
	<script src="{{ webpackAsset('home.js') }}"></script>
{% endblock %}