/**
 * !Resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).on('debouncedresize', function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('debouncedresizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !Detects overlay scrollbars (when scrollbars on overflowed blocks are visible). This is found most commonly on mobile and OS X.
 * */
var HIDDEN_SCROLL = Modernizr.hiddenscroll;
var NO_HIDDEN_SCROLL = !HIDDEN_SCROLL;

/**
 * !Detect desktop and devices
 * */

/**
 * !Load images on load page or scroll page
 * Add to image class '.lozad'
 * */
var observer = lozad();
observer.observe();

function preloadOtherImages() {
  // Catalog
  var $imgCatalog = $('img', '.products__list');
  $.each($imgCatalog, function (index, element) {
    var observer = lozad(element);
    observer.observe();
  });

  // Favorite
  var $imgFavourite = $('img', '.f-products__list');
  $.each($imgFavourite, function (index, element) {
    var observer = lozad(element);
    observer.observe();
  });

  // All images lazy load
  var $lazyImages = $('img', '.lazy-images-js');
  $.each($lazyImages, function (index, element) {
    var observer = lozad(element);
    observer.observe();
  });
}

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Change cookies
 */
function setCookie(name, value, options) {
  /**
   * @param name - name of cookie
   * @param value - value of cookie (string)
   * @param options - object with additional properties
   * @param options.expires - time life cookie
   * @param options.path - path/url
   * @param options.domain - domain
   * @param options.secure - only secure protocol
   */
  // https://learn.javascript.ru/cookie
  options = options || {};

  var expires = options.expires;

  if (typeof expires === "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function getCookie(name) {
  // https://learn.javascript.ru/cookie
  var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
  // https://learn.javascript.ru/cookie
  setCookie(name, "", {
    expires: -1
  })
}

/**
 * !Equal height of blocks by maximum height of them
 */
function equalHeight() {
  // equal height of elements
  var $equalHeight = $('.equal-height-js');

  $equalHeight.children().not(':hidden').matchHeight({
    byRow: true, property: 'height', target: null, remove: false
  });
}

/**
 * !Show elements on scroll
 */
function showOnScroll() {
  var $topicItem = $('.topics__item');

  if ($topicItem.length) {
    ScrollReveal().reveal($topicItem, {
      scale: 0.85,
      interval: 50
    });
  }

  var $quickLinksItem = $('.quick-links__item');

  if ($quickLinksItem.length) {
    ScrollReveal().reveal($quickLinksItem, {
      scale: 0.85,
      interval: 50
    });
  }

  var $gameZoneItem = $('.gz-tiles__item');

  if ($gameZoneItem.length) {
    ScrollReveal().reveal($gameZoneItem, {
      scale: 0.85,
      interval: 50
    });
  }
}

/**
 * !Expand navigation
 */
function navExpander() {
  var $navExpander = $('.nav-expander-js');

  if ($navExpander.length) {
    var label = $navExpander.attr('data-btn-more') || 'More...';

    var navigation = $navExpander.okayNav({
      // align_right: true
      // toggle_icon_content: '<span /><span /><span />'
      toggle_icon_content: '<span>' + label + '</span><i>&nbsp;</i>'
    });

    if (navigation.length) {
      $navExpander.addClass('ready');
    }
  }

  var $page = $('html'), classResize = 'resizing', timeout;

  $(window).on('resize', function () {
    $page.addClass(classResize);
  }).on('debouncedresize', function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      $page.removeClass(classResize);
    }, 50);
  });
}

/**
 * !Tooltip
 * */
function initTooltip() {
  var $elements = $('.user-options__item a, .cart-link');
  $.each($elements, function () {
    var $curElem = $(this);
    $curElem.attr('data-title', $curElem.attr('title')).attr('title','');
  })
}

/**
 * !Custom srollbar
 */
function initCustomScrollBar() {
  if (NO_HIDDEN_SCROLL) {
    $('.quick-cart__list').each(function (index, element) {
      new SimpleBar(element);
    });

    $('.consist__list').each(function (index, element) {
      new SimpleBar(element);
    });
  }
}

/**
 * !Detect scroll page and transform header
 */
function detectScroll() {
  var $page = $('html'),
      $header = $('.header'),
      minScrollTop = 130,
      timeoutChanged, timeoutShow,
      headerIsChanged;

  function toggleClassOnScroll(topPos) {
    minScrollTop = $header.outerHeight();
    $page.toggleClass('page-scrolled', (topPos > minScrollTop));
  }

  function changeHeightOnScroll(topPos, hideDelay, changeDelay) {
    /**
     * hideDelay - С какой задержкой происходит скрытие шапки после остановки скролла.
     * Задержка нужна, чтобы не происходило моргание в точке изменения шапки.
     *
     * changeDelay - С какой задержкой добавляется класс изменения шапки на уменшеный вариант.
     * Задежка нужна, чтобы успела отработать анимация скрытия шапки.
     */

    minScrollTop = $header.outerHeight();
    
    if (topPos <= minScrollTop && !headerIsChanged) {
      clearTimeout(timeoutChanged);
      $header.removeClass('start-hidden');
    }

    if (topPos > minScrollTop && headerIsChanged) {
      clearTimeout(timeoutChanged);
      $header.removeClass('start-hidden');
    }

    clearTimeout(timeoutShow);

    timeoutShow = setTimeout(function () {
      if (topPos > minScrollTop && !headerIsChanged) {
        $header.addClass('start-hidden');

        clearTimeout(timeoutChanged);

        timeoutChanged = setTimeout(function () {
          headerIsChanged = true;
          $header.addClass('header-changed');
          $header.removeClass('start-hidden');
        }, changeDelay);
      }

      if (topPos <= minScrollTop && headerIsChanged) {
        $header.addClass('start-hidden');

        timeoutChanged = setTimeout(function () {
          headerIsChanged = false;
          $header.removeClass('header-changed');
          $header.removeClass('start-hidden');
        }, changeDelay);
      }
    }, hideDelay);
  }

  $(window).on('debouncedresizeByWidth scroll', function () {
    var scrollTop = $(window).scrollTop();
    toggleClassOnScroll(scrollTop);
    changeHeightOnScroll(scrollTop, 100, 250);
  });

  setTimeout(function () {
    $header.addClass('header-ready');
  }, 200);

  var scrollTop = $(window).scrollTop();
  changeHeightOnScroll(scrollTop, 0, 0);
  toggleClassOnScroll(scrollTop);
}

/**
 * !Input file simple
 */
function inputFileSimple() {
  $('input[type=file]', '.input-file-js').on('change', function () {
    var $curInput = $(this);
    var val = $curInput.val().replace(/C:\\fakepath\\/i, '');

    $curInput.closest('.input-file-js').find('.input-file-label-js').html(val);
  })
}

/**
 * !Toggle class on a form elements on focus
 * */
function inputFocusClass() {
  // var $inputs = $('.field-js');
  var $inputs = $('label.input-wrap input, .field-js');

  if ($inputs.length) {
    var $fieldWrap = $('.input-wrap'),
        $selectWrap = $('.select'),
        classFocus = 'focused';

    $inputs.focus(function () {
      var $currentField = $(this),
          $currentFieldWrap = $currentField.closest($fieldWrap);

      $currentField.addClass(classFocus);
      $currentField.prev('label').addClass(classFocus);
      $currentField.closest($selectWrap).prev('label').addClass(classFocus);
      $currentFieldWrap.addClass(classFocus);
      $currentFieldWrap.find('label').addClass(classFocus);
    }).blur(function () {
      var $currentField = $(this),
          $currentFieldWrap = $currentField.closest($fieldWrap);

      $currentField.removeClass(classFocus);
      $currentField.prev('label').removeClass(classFocus);
      $currentField.closest($selectWrap).prev('label').removeClass(classFocus);
      $currentFieldWrap.removeClass(classFocus);
      $currentFieldWrap.find('label').removeClass(classFocus);
    });
  }
}

/**
 * !Toggle class on a form elements if this one has a value
 * */
function inputHasValueClass() {
  // var $inputs = $('.field-js');
  var $inputs = $('label.input-wrap input, .field-js');

  if ($inputs.length) {
    var $fieldWrap = $('.input-wrap');
    var $selectWrap = $('.select');
    var classHasValue = 'filled';

    $.each($inputs, function () {
      switchHasValue.call(this);
    });

    $inputs.on('keyup change', function () {
      switchHasValue.call(this);
    });

    function switchHasValue() {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      //first element of the select must have a value empty ("")
      if ($currentField.val().length === 0) {
        $currentField.removeClass(classHasValue);
        $currentField.prev('label').removeClass(classHasValue);
        $currentField.closest($selectWrap).prev('label').removeClass(classHasValue);
        $currentFieldWrap.removeClass(classHasValue);
        $currentFieldWrap.find('label').removeClass(classHasValue);
      } else if (!$currentField.hasClass(classHasValue)) {
        $currentField.addClass(classHasValue);
        $currentField.prev('label').addClass(classHasValue);
        $currentField.closest($selectWrap).prev('label').addClass(classHasValue);
        $currentFieldWrap.addClass(classHasValue);
        $currentFieldWrap.find('label').addClass(classHasValue);
      }
    }
  }
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect() {
  var select = $('select.cselect');
  $.each(select, function () {
    var $thisSelect = $(this);
    // var placeholder = $thisSelect.attr('data-placeholder') || '';
    $thisSelect.select2({
      language: "ru",
      width: '100%',
      containerCssClass: 'cselect-head',
      dropdownCssClass: 'cselect-drop',
      minimumResultsForSearch: Infinity,
      // allowClear: true
      // , placeholder: placeholder
    });
  })
}

/**
 * !Add classes on elements near banners (in products)
 */
function bannersSiblings() {
  var $banner = $('.banner_in-products-js');

  if ($banner.length) {
    // Клонируем первый перед баннером элемет
    // Вставляем клон первым после баннера
    $banner
        .prev().addClass('step-1').clone().addClass('clone').insertAfter($banner);
    // Клонируем второй перед баннером элемет
    // Вставляем клон вторым после баннера
    $banner
        .prev().prev().addClass('step-2').clone().addClass('clone').insertAfter($banner);
    // Клонируем третий перед баннером элемет
    // Вставляем клон третим после баннера
    $banner
        .prev().prev().prev().addClass('step-3').clone().addClass('clone').insertAfter($banner);
  }

  var $productsList = $('.products__list');
  if($productsList.length) {
    $productsList.children().matchHeight({
      byRow: true, property: 'height', target: null, remove: false
    });
  }
}

/**
 * !Initial sliders on the project
 * */
function slidersInit() {
  /**images gallery*/
  var $imagesGallery = $('.images-gallery-js');
  if ($imagesGallery.length) {
    $imagesGallery.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider),
          imagesGalleryJs;

      imagesGalleryJs = new Swiper($thisSlider, {
        init: false,
        centeredSlides: true,
        spaceBetween: 10,
        loop: true,
        loopedSlides: 3,
        // loopAdditionalSlides: 5,
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        longSwipesRatio: 0.05,
        longSwipesMs: 200
      });

      imagesGalleryJs.on('init', function() {
        $(imagesGalleryJs.el).closest($thisSlider).addClass('is-loaded');
      });

      imagesGalleryJs.init();
    });
  }

  /**review article gallery*/
  var $reviewArticleGallery = $('.review-article-gallery-js');
  if ($reviewArticleGallery.length) {
    $reviewArticleGallery.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider),
          reviewArticleGalleryJs;

      reviewArticleGalleryJs = new Swiper($thisSlider, {
        init: false,
        centeredSlides: true,
        spaceBetween: 10,
        loop: true,
        loopedSlides: 3,
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        longSwipesRatio: 0.05,
        longSwipesMs: 200
      });

      reviewArticleGalleryJs.on('init', function() {
        $(reviewArticleGalleryJs.el).closest($thisSlider).addClass('is-loaded');
      });

      reviewArticleGalleryJs.init();
    });
  }

  /**promo slider*/
  var $promoSlider = $('.promo-slider-js');
  if ($promoSlider.length) {
    var $thisBtnNext = $('.slider-arrow_next-js', $promoSlider),
        $thisBtnPrev = $('.slider-arrow_prev-js', $promoSlider),
        $thisPag = $('.swiper-pagination', $promoSlider),
        $thisWordImg = $('.word-img-parallax-js', $promoSlider),
        promoSliderJs;

    function initPromoSlider() {
      promoSliderJs = new Swiper($promoSlider, {
        init: false,
        speed: 900,

        // Optional parameters
        loop: true,
        // Keyboard
        keyboardControl: true,
        // Parallax
        parallax: true,

        // Navigation arrows
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        },

        // Pagination
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        longSwipesRatio: 0.05,
        longSwipesMs: 200,
      });

      promoSliderJs.on('init', function() {
        $(promoSliderJs.el).closest($promoSlider).addClass('is-loaded');
      });

      promoSliderJs.init();
    }

    var layoutWidth = window.innerWidth,
        addSpace = Math.round(layoutWidth / 4);

    $promoSlider.imagesLoaded(function () {
      $thisWordImg.each(function(i, el) {
        var $curImg = $(this),
            $parallaxElem = $curImg.parent();

        // Определения размера смещения изображения
        // Размер смещения равен сумме:
        // 1/ ширина страницы
        // 2/ минус расстояние от левого края слайда до обертки изображения (елемет, которы будет параллакситься)
        // 3/ минус ширина изображения
        // 4/ минус дополнительный отступ в "px" (addSpace),
        // который равен запланированному расстоянию
        // от правого края изображения до правого края слайда
        // в момет, когда слайд полностью скрывается или начинает появляться
        var translate = layoutWidth - $curImg.width() - $parallaxElem.position().left - addSpace;
        // Добавить на родительский контейнер data-swiper-parallax с определенным выше смещением
        $parallaxElem.attr('data-swiper-parallax', translate);
      });

      initPromoSlider();
    });
  }

  /**topics slider*/
  var $topicsSlider = $('.topics-slider-js');
  if ($topicsSlider.length) {
    $topicsSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $('.swiper-button-prev', $thisSlider),
          $thisBtnPrev = $('.swiper-button-next', $thisSlider),
          topicsSliderJs;

      topicsSliderJs = new Swiper($thisSlider, {
        init: false,
        loop: false,
        slidesPerView: 'auto',
        allowTouchMove: false,
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        },
        breakpoints: {
          991: {
            allowTouchMove: false
          }
        }
      });

      topicsSliderJs.on('init', function() {
        $(topicsSliderJs.el).closest($thisSlider).addClass('is-loaded');
        // .not(':hidden') необходим для того,
        // чтобы скрытые элементы не учитывались при определении высоты
        $(topicsSliderJs.slides).not(':hidden').matchHeight({
          byRow: true, property: 'height', target: null, remove: false
        });
      });

      topicsSliderJs.init();
    });
  }

  /**card gallery*/
  var $cardGallery = $('.p-card-gallery-js');
  if($cardGallery.length){
    var cardGalleryThumbsTpl = $('<div class="p-card-gallery-thumbs"><div class="p-card-gallery-thumbs__arrow-prev arrow-prev-js"></div><div class="swiper-container"><div class="swiper-wrapper"></div></div><div class="p-card-gallery-thumbs__arrow-next arrow-next-js"></div></div>');

    $cardGallery.each(function () {
      var $curSlider = $(this),
          $imgList = $curSlider.find('.p-card-gallery-images-js'),
          $imgListItem = $imgList.find('img').parent();

      // create thumbs
      $imgList.after(cardGalleryThumbsTpl.clone());

      var $galleryThumbs = $curSlider.find('.p-card-gallery-thumbs'),
          $galleryThumbsArrPrev = $galleryThumbs.find('.arrow-prev-js'),
          $galleryThumbsArrNext = $galleryThumbs.find('.arrow-next-js');

      $.each($imgListItem, function () {
        var $this = $(this);
        $galleryThumbs.find('.swiper-wrapper').append($('<div class="swiper-slide p-card-gallery-thumbs__item"><img src="' + $this.find('img').attr('data-thumb') + '" alt="' + $this.find('img').attr('alt') + '"></div>'));
      });

      var cardImgSlider = new Swiper ($imgList, {
        init: false,
        spaceBetween: 20,
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
          loadOnTransitionStart: true
        },
        thumbs: {
          swiper: {
            el: $galleryThumbs.find('.swiper-container'),
            direction: 'vertical',
            slidesPerView: 'auto',
            spaceBetween: 14,
            freeMode: true,
            slideToClickedSlide: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            navigation: {
              nextEl: $galleryThumbsArrNext,
              prevEl: $galleryThumbsArrPrev,
            },
            breakpoints: {
              767: {
                direction: 'horizontal'
              }
            }
          },
        },
        on: {
          lazyImageReady: function (slide, image) {
            objectFitImages($(image));
          }
        }
      });

      cardImgSlider.on('init', function() {
        $curSlider.addClass('is-loaded');
        // object-fit for non-support browsers
        objectFitImages($('img', $(cardImgSlider.el)));
      });

      cardImgSlider.init();

      $().fancybox({
        selector : '.p-card-gallery-js a:visible',
        infobar: true,
        baseClass: 'white-spaces',
        buttons: [
          "zoom",
          //"share",
          // "slideShow",
          //"fullScreen",
          //"download",
          // "thumbs",
          "close"
        ],
        beforeClose: function (instance, current) {
          cardImgSlider.slideTo(current.index);
        }
      });
    });
  }

  /**tape slider*/
  var $tapeSlider = $('.tape-slider-js');
  if ($tapeSlider.length) {
    $tapeSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $('.tape-slider__next-js', $thisSlider),
          $thisBtnPrev = $('.tape-slider__prev-js', $thisSlider),
          tapeSliderInited;

      tapeSliderInited = new Swiper($thisSlider, {
        init: false,
        loop: false,
        keyboardControl: true,
        slidesPerView: 5,
        spaceBetween: 12,

        // Navigation arrows
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        },
        breakpoints: {
          1599: {
            slidesPerView: 4
          },
          1199: {
            slidesPerView: 3
          },
          879: {
            slidesPerView: 2
          },
          639: {
            slidesPerView: 2,
            spaceBetween: 0
          }
        }

      });

      tapeSliderInited.on('init', function() {
        $(tapeSliderInited.slides).matchHeight({
          byRow: true, property: 'height', target: null, remove: false
        });
        $(tapeSliderInited.el).closest($thisSlider).addClass('is-loaded');
      });

      tapeSliderInited.init();
    });

  }

  /**cart similar slider*/
  var $cartSimilarSlider = $('.cart-similar-slider-js');
  if ($cartSimilarSlider.length) {
    $cartSimilarSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $('.cart-similar-slider__next-js', $thisSlider),
          $thisBtnPrev = $('.cart-similar-slider__prev-js', $thisSlider),
          cartSimilarSliderJs;

      cartSimilarSliderJs = new Swiper($thisSlider, {
        init: false,
        loop: false,
        keyboardControl: true,
        slidesPerView: 6,
        spaceBetween: 10,

        // Navigation arrows
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        },
        breakpoints: {
          1599: {
            slidesPerView: 5
          },
          1279: {
            slidesPerView: 4
          },
          1099: {
            slidesPerView: 3
          },
          991: {
            slidesPerView: 4
          },
          819: {
            slidesPerView: 3
          },
          649: {
            slidesPerView: 2
          }
        }
      });

      cartSimilarSliderJs.on('init', function() {
        $(cartSimilarSliderJs.slides).matchHeight({
          byRow: true, property: 'height', target: null, remove: false
        });
        $(cartSimilarSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      cartSimilarSliderJs.init();
    });

  }

  /**article offer slider*/
  var $articleOfferSlider = $('.article-offer-slider-js');
  if ($articleOfferSlider.length) {
    $articleOfferSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $('.cart-similar-slider__next-js', $thisSlider),
          $thisBtnPrev = $('.cart-similar-slider__prev-js', $thisSlider),
          articleOfferSliderJs;

      articleOfferSliderJs = new Swiper($thisSlider, {
        init: false,
        loop: false,
        keyboardControl: true,
        slidesPerView: 5,
        spaceBetween: 10,

        // Navigation arrows
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        },
        breakpoints: {
          1599: {
            slidesPerView: 4
          },
          1099: {
            slidesPerView: 3
          },
          991: {
            slidesPerView: 4
          },
          819: {
            slidesPerView: 3
          },
          649: {
            slidesPerView: 2
          }
        }
      });

      articleOfferSliderJs.on('init', function() {
        $(articleOfferSliderJs.slides).matchHeight({
          byRow: true, property: 'height', target: null, remove: false
        });
        $(articleOfferSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      articleOfferSliderJs.init();
    });

  }

  /**credit cards slider*/
  var $cardsSlider = $('.cards-slider-js');
  if ($cardsSlider.length) {
    $cardsSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $thisSlider.next('.cards-slider-nav').find('.cards-slider__next-js'),
          $thisBtnPrev = $thisSlider.next('.cards-slider-nav').find('.cards-slider__prev-js'),
          $thisContainer = $thisSlider.closest('.cards-js'),
          $cardTitleEl = $thisContainer.find('.card-info__title-js'),
          $cardTextEl = $thisContainer.find('.card-info__text-js'),
          currentClass = 'current-card',
          cardsSliderJs;

      cardsSliderJs = new Swiper($thisSlider, {
        init: false,
        slidesPerView: 'auto',
        // centeredSlides: true,
        // slideToClickedSlide: true,
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        }
      });

      var changeInfo = function ($slide) {
        $(cardsSliderJs.slides).removeClass(currentClass);
        $slide.addClass(currentClass);
        // cardsSliderJs.slideTo($slide.index(), 500);

        var title = $slide.data('card-title'),
            text = $slide.data('card-text');

        $cardTitleEl.html(title);
        $cardTextEl.html(text);
      };

      cardsSliderJs.on('init', function() {
        $(cardsSliderJs.el).closest($thisSlider).addClass('is-loaded');
        changeInfo($(cardsSliderJs.slides).eq(cardsSliderJs.activeIndex));
      });

      cardsSliderJs.init();

      $(cardsSliderJs.slides).on('click mouseenter', function () {
        var $slider = $(this);
        changeInfo($slider);
        // changeInfo($(cardsSliderJs.clickedSlide));
      });
    });

  }

  /**sets slider*/
  var $setsSlider = $('.sets-slider-js');
  if ($setsSlider.length) {
    $setsSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $thisSlider.find('.sets-slider__next-js'),
          $thisBtnPrev = $thisSlider.find('.sets-slider__prev-js'),
          setsSliderJs;

      setsSliderJs = new Swiper($thisSlider, {
        init: false,
        spaceBetween: 20,
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        }
      });

      setsSliderJs.on('init', function() {
        $(setsSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      setsSliderJs.init();
    });
  }
}

/**
 * !Grid layout
 */
function gridLayout() {
  $.each($('.grid-js'), function () {
    var $thisGrids = $(this);
    var $grid = $thisGrids.imagesLoaded( function() {
      // init Isotope after all images have loaded
      $grid.isotope({
        layoutMode: 'packery',
        itemSelector: '.grid-item-js',
        percentPosition: true
      });
    });

    $grid.on( 'arrangeComplete', function( event, filteredItems ) {
      $(event.target).addClass('grid-completed');
    });
  });

}

/**
 * ! jquery.ms-tabs.js
 * Version: 2019.1.2
 * Author: Astronim*
 * Description: Extended toggle class
 */

(function ($) {
  'use strict';

  var MsTabs = function (element, config) {
    var self,
        $element = $(element),
        $anchor = $element.find(config.anchor),
        $panels = $element.find(config.panels),
        $panel = $element.find(config.panel),
        $select = $element.find(config.compactView.elem),
        $selectDrop = $element.find(config.compactView.drop),
        $html = $('html'),
        isAnimated = false,
        activeId,
        isOpen = false,
        isSelectOpen = false,
        collapsible = $element.data('tabs-collapsible') || config.collapsible,
        pref = 'ms-tabs',
        pluginClasses = {
          initialized: pref + '_initialized',
          active: 'tabs-active',
          collapsible: pref + '_is-collapsible',
          selectOpen: pref + '_select-open'
        },
        mixedClasses = {
          initialized: pluginClasses.initialized + ' ' + (config.modifiers.initClass || ''),
          active: pluginClasses.active + ' ' + (config.modifiers.activeClass || ''),
          collapsible: pluginClasses.collapsible + ' ' + (config.modifiers.collapsibleClass || ''),
          selectOpen: pluginClasses.selectOpen + ' ' + (config.compactView.openClass || '')
        };

    var callbacks = function () {
      /** track events */
      $.each(config, function (key, value) {
        if (typeof value === 'function') {
          $element.on('msTabs.' + key, function (e, param) {
            return value(e, $element, param);
          });
        }
      });
    }, prevent = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }, changeSelect = function () {
      // Изменить контент селекта при изменении активного таба
      $select.html($anchor.filter('[href="#' + activeId + '"]').html() + config.compactView.arrowTpl);
      $element.trigger('msTabs.afterSelectValChange');
    }, eventsSelect = function () {
      // Открыть переключатели табов
      $select.on('click', function () {
        // $element.add($select).toggleClass(mixedClasses.selectOpen);
        if (isSelectOpen) {
          closeSelect();
        } else {
          openSelect();
        }

        prevent(event);
      })
    }, openSelect = function () {
      isSelectOpen = true;
      $element.add($select).add($selectDrop).addClass(mixedClasses.selectOpen);
      $element.trigger('msTabs.afterSelectOpen');
    }, closeSelect = function () {
      isSelectOpen = false;
      $element.add($select).add($selectDrop).removeClass(mixedClasses.selectOpen);
      $element.trigger('msTabs.afterSelectClose');
    }, closeSelectByClickOutside = function () {
      $html.on('click', function (event) {
        if (isSelectOpen && config.compactView.closeByClickOutside && !$(event.target).closest($selectDrop).length) {
          closeSelect();
        }
      });
    }, closeSelectByClickEsc = function () {
      $html.keyup(function (event) {
        if (isSelectOpen && config.compactView.closeByClickEsc && event.keyCode === 27) {
          closeSelect();
        }
      });
    }, show = function () {
      // Определяем текущий таб
      var $activePanel = $panel.filter('[id="' + activeId + '"]'),
          $otherPanel = $panel.not('[id="' + activeId + '"]'),
          $activeAnchor = $anchor.filter('[href="#' + activeId + '"]');

      if (!isAnimated) {
        isAnimated = true;

        // Удалить активный класс со всех элементов
        $panel.add($anchor).removeClass(mixedClasses.active);

        // Добавить класс на каждый активный элемент
        $activePanel.add($activeAnchor).addClass(mixedClasses.active);

        // Анимирование высоты табов
        $panels
            .css('overflow', 'hidden')
            .animate({
              'height': $activePanel.outerHeight()
            }, config.animationSpeed);

        // Скрыть все табы, кроме активного
        hideTab($otherPanel);

        // Показать активный таб
        $activePanel
            .css({
              'z-index': 2,
              'visibility': 'visible'
            })
            .animate({
              'opacity': 1
            }, config.animationSpeed, function () {
              $activePanel
                  .css({
                    'position': 'relative',
                    'left': 'auto',
                    'top': 'auto',
                    'pointer-events': ''
                  });
              // .attr('tabindex', 0);

              $panels.css({
                'height': '',
                'overflow': ''
              });

              // Анимация полностью завершена
              isOpen = true;
              isAnimated = false;
            });
      }

      // callback after showed tab
      var eventData = {
        '$tabs': $element,
        '$anchor': $anchor,
        'activeId': activeId,
        '$activeAnchor': $activeAnchor,
        '$panels': $panels,
        '$panel': $panel,
        '$activePanel': $activePanel
      };
      $element.trigger('msTabs.afterOpen', eventData);
      $element.trigger('msTabs.afterChange', eventData);
    }, hide = function () {
      // Определить текущий таб
      var $activePanel = $panel.filter('[id="' + activeId + '"]');

      if (!isAnimated) {

        isAnimated = true;

        // Удалить активный класс со всех элементов
        $panel.add($anchor).removeClass(mixedClasses.active);

        // Анимирование высоты табов
        $panels
            .css('overflow', 'hidden')
            .animate({
              'height': 0
            }, config.animationSpeed);

        hideTab($activePanel, function () {
          $panels.css({
            'height': ''
          });

          isOpen = false;
          isAnimated = false;
        });
      }

      // callback after tab hidden
      var eventData = {
        '$tabs': $element,
        '$anchor': $anchor,
        '$panels': $panels,
        '$panel': $panel,
        '$activePanel': $activePanel
      };
      $element.trigger('msTabs.afterClose', eventData);
      $element.trigger('msTabs.afterChange', eventData);
    }, hideTab = function ($_panel) {
      var callback = arguments[1];
      $_panel
          .css({
            'z-index': -1
          })
          // .attr('tabindex', -1)
          .animate({
            'opacity': 0
          }, config.animationSpeed, function () {
            $_panel.css({
              'position': 'absolute',
              'left': 0,
              'top': 0,
              'visibility': 'hidden',
              'pointer-events': 'none'
            });

            // Анимация полностью завершена
            if (typeof callback === "function") {
              callback();
            }
          });
    }, events = function () {
      $anchor.on('click', function (event) {
        event.preventDefault();

        var curId = $(this).attr('href').substring(1);

        if (isAnimated || !collapsible && curId === activeId) {
          closeSelect();
          return false;
        }

        if (collapsible && isOpen && curId === activeId) {
          hide();
        } else {
          activeId = curId;
          show();
        }

        // Изменить контент селекта
        if (config.compactView) {
          changeSelect();
          closeSelect();
        }
      });
    }, init = function () {
      activeId = $anchor.filter('.' + pluginClasses.active).length && $anchor.filter('.' + pluginClasses.active).attr('href').substring(1);
      var $activeAnchor = $anchor.filter('[href="#' + activeId + '"]'),
          $activePanel;

      $anchor.filter('.' + pluginClasses.active).addClass(mixedClasses.active);

      $panels.css({
        'display': 'block',
        'position': 'relative'
      });

      $panel
          .css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'opacity': 0,
            'width': '100%',
            'visibility': 'hidden',
            'z-index': -1,
            'pointer-events': 'none'
          });
      // .attr('tabindex', -1);

      if (activeId) {
        $activePanel = $panel.filter('[id="' + activeId + '"]');

        // Добавить класс на каждый элемен
        $activePanel.addClass(mixedClasses.active);

        // Показать активный таб
        $activePanel
            .css({
              'position': 'relative',
              'left': 'auto',
              'top': 'auto',
              'opacity': 1,
              'visibility': 'visible',
              'z-index': 2,
              'pointer-events': ''
            });
        // .attr('tabindex', 0);

        isOpen = true;
      }

      // Изменить контент селекта
      if (config.compactView.elem) {
        changeSelect();
        // !Предупреждение, если не задан элемент, котрый будет выполнять роль опшинов
        if (!config.compactView.drop) {
          console.warn('You must choose a DOM element as select drop! Pun in a compactView.drop');
        }
      }

      // Добавить специальный класс, если включена возможность
      // разворачивать/сворачивать активный таб
      if (collapsible) {
        $element.addClass(mixedClasses.collapsible);
      }

      // После инициализации плагина добавить внутренний класс и,
      // если указан в опициях, пользовательский класс
      $element.addClass(mixedClasses.initialized);

      var eventData = {
        '$tabs': $element,
        '$anchor': $anchor,
        'activeId': activeId,
        '$activeAnchor': $activeAnchor,
        '$panels': $panels,
        '$panel': $panel,
        '$activePanel': $activePanel
      };
      $element.trigger('msTabs.afterInit', [$element, eventData]);
    };

    self = {
      callbacks: callbacks,
      eventsSelect: eventsSelect,
      closeSelectByClickOutside: closeSelectByClickOutside,
      closeSelectByClickEsc: closeSelectByClickEsc,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.msTabs = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].msTabs = new MsTabs(_[i], $.extend(true, {}, $.fn.msTabs.defaultOptions, opt));
        _[i].msTabs.init();
        _[i].msTabs.callbacks();
        _[i].msTabs.eventsSelect();
        _[i].msTabs.closeSelectByClickOutside();
        _[i].msTabs.closeSelectByClickEsc();
        _[i].msTabs.events();
      } else {
        ret = _[i].msTabs[opt].apply(_[i].msTabs, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.msTabs.defaultOptions = {
    anchor: '.tabs__anchor-js',
    panels: '.tabs__panels-js',
    panel: '.tabs__panel-js',
    animationSpeed: 300,
    collapsible: false,
    compactView: {
      elem: null, // Элемент, который будет селектом
      drop: null, // Элемент, который будет выпадающим списком селекта
      arrowTpl: '<i>&#9660;</i>',
      closeByClickOutside: true, // Закрывать выпадающий список селекта по клику на "пустом" месте
      closeByClickEsc: true, // Закрывать выпадающий список селекта по клавише Esc
      openClass: null // Класс, который добавляется после открытия списка селекта
    },
    modifiers: {
      initClass: null,
      collapsibleClass: null,
      activeClass: null
    }
  };

})(jQuery);
/**
 * !Tabs
 */
function tabs() {
  var $tabs = $('.tabs-js');

  // Копировать ссылку на все товары из текущего таба,
  // и помещать ее в контейнер с переключателями
  function setLinkAll(tabs) {
    var $linkAll = $('.link-all', tabs.$activePanel),
        $captionBox = $('.caption-box', $(tabs.$tabs));

    // Удалить ранее добавленную ссылку
    $('.link-all', $captionBox).remove();

    if ($linkAll.length) {
      // Добавить ссылку с текущего таба
      $linkAll.clone().attr('data-id', tabs.activeId).appendTo($captionBox);
    }
  }

  function lazyLoadImages($_image) {
    // Подгрузить изображения после переключения таба
    $.each($_image, function (index, element) {
      var observer = lozad(element);
      observer.observe();
      // observer.triggerLoad(coolImage);
    });
  }

  if ($tabs.length) {
    var $tabsPanels = $('.tabs__panels-js');
    $tabs.on('msTabs.afterInit', function (e, el, tabs) {
      setLinkAll(tabs);
      // Подгрузить изображения в открытом табе сразу после инициализации плагина
      lazyLoadImages($('img', tabs.$activePanel));
    }).msTabs({
      anchor: $('.tabs__thumbs-js').find('a'),
      panels: $tabsPanels,
      panel: $tabsPanels.children(),
      compactView: {
        elem: '.tabs__select-js',
        drop: '.tabs__select-drop-js',
        arrowTpl: '<i><svg width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg"><path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L5 3.58579L8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893C10.0976 0.683417 10.0976 1.31658 9.70711 1.70711L5.70711 5.70711C5.31658 6.09763 4.68342 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"></path></svg></i>',
        openClass: 'tabs-select-open'
      },
      afterOpen: function (e, el, tabs) {
        setLinkAll(tabs);
        // Подгрузить изображения после открытия таба
        lazyLoadImages($('img', tabs.$activePanel));
      }
    });
  }

  var $tabsNested = $('.tabs-nested-js');
  if ($tabsNested.length) {
    var $tabsNestedPanels = $('.tabs-nested__panels-js');
    $tabsNested.msTabs({
      anchor: $('.tabs-nested__thumbs-js').find('a'),
      panels: $tabsNestedPanels,
      panel: $tabsNestedPanels.children(),
      compactView: {
        elem: '.tabs-nested__select-js',
        drop: '.tabs-nested__select-drop-js',
        arrowTpl: '<i><svg width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg"><path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L5 3.58579L8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893C10.0976 0.683417 10.0976 1.31658 9.70711 1.70711L5.70711 5.70711C5.31658 6.09763 4.68342 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"></path></svg></i>',
        openClass: 'tabs-select-open'
      }
    });
  }
}

/**
 * !jquery.ms-switch-class.js
 * Version: 2018.1.0
 * Author: *
 * Description: Extended toggle class
 */

(function ($) {
  'use strict';

  var countFixedScroll = 0;
  // Нужно для корректной работы с доп. классом фиксирования скролла

  var SwitchClass = function (element, config) {
    var self,
        $element = $(element),
        $html = $('html'),
        pref = 'jq-switch-class',
        pluginClasses = {
          initClass: pref + '_initialized'
        },
        mod = {
          scrollFixedClass: 'css-scroll-fixed'
        },
        $switchClassTo = $element.add(config.switcher).add(config.adder).add(config.remover).add(config.switchClassTo),
        classIsAdded = false; //Флаг отвечающий на вопрос: класс добавлен?

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('switchClass.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        prevent = function (event) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },
        toggleFixedScroll = function () {
          $html.toggleClass(mod.scrollFixedClass, !!countFixedScroll);
        },
        add = function () {
          if (classIsAdded) return;

          // Callback before added class
          $element.trigger('switchClass.beforeAdded');

          // Добавить активный класс на:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo.addClass(config.modifiers.activeClass);

          classIsAdded = true;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
            ++countFixedScroll;
            toggleFixedScroll();
          }

          // callback after added class
          $element.trigger('switchClass.afterAdded');
        },
        remove = function () {
          if (!classIsAdded) return;

          // callback beforeRemoved
          $element.trigger('switchClass.beforeRemoved');

          // Удалять активный класс с:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo.removeClass(config.modifiers.activeClass);

          classIsAdded = false;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
            --countFixedScroll;
            toggleFixedScroll();
          }

          // callback afterRemoved
          $element.trigger('switchClass.afterRemoved');
        },
        events = function () {
          $element.on('click', function (event) {
            if (classIsAdded) {
              remove();

              event.preventDefault();
              return false;
            }

            add();

            prevent(event);
          });

          $(config.switcher).on('click', function (event) {
            $element.click();
            prevent(event);
          });

          $(config.adder).on('click', function (event) {
            add();
            prevent(event);
          });

          $(config.remover).on('click', function (event) {
            remove();
            prevent(event);
          })

        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {
            if (classIsAdded && config.removeOutsideClick && !$(event.target).closest('.' + config.modifiers.stopRemoveClass).length) {
              remove();
              // event.stopPropagation();
            }
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (classIsAdded && config.removeEscClick && event.keyCode === 27) {
              remove();
            }
          });
        },
        init = function () {
          $element.addClass(pluginClasses.initClass).addClass(config.modifiers.initClass);
          $element.trigger('switchClass.afterInit');
        };

    self = {
      callbacks: callbacks,
      remove: remove,
      events: events,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  // $.fn.switchClass = function (options, params) {
  $.fn.switchClass = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].switchClass = new SwitchClass(_[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, opt));
        _[i].switchClass.callbacks();
        _[i].switchClass.events();
        _[i].switchClass.removeByClickOutside();
        _[i].switchClass.removeByClickEsc();
        _[i].switchClass.init();
      }
      else {
        ret = _[i].switchClass[opt].apply(_[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.switchClass.defaultOptions = {
    switcher: null,
    /**
     * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
     * @example {String}{JQ Object} null - '.switcher-js', или $('.switcher-js')
     */
    adder: null,
    /**
     * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
     * @example {String}{JQ Object} null - '.adder-js', или $('.adder-js')
     */
    remover: null,
    /**
     * @description - Дополнительный элемент, которым можно УДАЛЯТЬ класс
     * @example {String}{JQ Object} null - '.remover-js', или $('.remover-js')
     */
    switchClassTo: null,
    /**
     * @description - Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
     * @example {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
     * @example {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
     */
    removeOutsideClick: true,
    /**
     * @description - Удалать класс по клику по пустому месту на странице? Если по клику на определенный элемент удалять класс не нужно, то на этот элемент нужно добавить дата-антрибут [data-tc-stop]
     * @param {boolean} true - или false
     */
    removeEscClick: true,
    /**
     * @description - Удалять класс по клику на клавишу Esc?
     * @param {boolean} true - или false
     */
    cssScrollFixed: false,
    /**
     * @description - Добавлять на html дополнительный класс 'css-scroll-fixed'? Через этот класс можно фиксировать скролл методами css
     * @see - _mixins.sass =scroll-blocked()
     * @param {boolean} true - или false.
     */
    modifiers: {
      initClass: null,
      activeClass: 'active',
      stopRemoveClass: 'stop-remove-class' // Если кликнуть по елементу с этим классам, то событие удаления активного класса не будет вызвано
    }
    /**
     * @description - Список классов-модификаторов
     */
  };

})(jQuery);

/**
 * !Toggle popup, drop, submenu, options etc.
 */
function toggleDrop() {
  // var scrollFixedOnlyMobClass = 'css-scroll-fixed_only-mob';
  var showOnlyMobClass = 'open-only-mob';

  // Toggle contacts in header
  var $hContactsSwitcher = $('.h-contacts__opener-js'), hContactsDropJs;
  if ($hContactsSwitcher.length) {
    hContactsDropJs = $hContactsSwitcher.switchClass({
      switchClassTo: $('.h-contacts-js').add('.h-contacts__drop-js')
      , modifiers: {
        activeClass: 'is-open'
      }
      , cssScrollFixed: false
    });
  }

  // Toggle a search panel
  var $searchSwitcher = $('.toggle-search-js'), searchPanelJs;
  if ($searchSwitcher.length) {
    searchPanelJs = $searchSwitcher.switchClass({
      // switcher: '.tc__switcher-js'
      // , adder: '.tc__opener-js'
      // , remover: '.tc__remover-js'
      switchClassTo: $('.site-nav')
      , modifiers: {
        activeClass: 'search-is-open'
      }
      , cssScrollFixed: false
      , removeOutsideClick: true
      , afterAdded: function () {
        setTimeout(function () {
          $('.search-form__input').focus();
        }, 50);
      }
      , afterRemoved: function () {
        setTimeout(function () {
          $('.search-form__input').blur();
        }, 50);
      }
    });
  }

  // Toggle a catalog shutter
  var $catalogSwitcher = $('.catalog-opener-js'), catalogShutterJs, $html = $('html');
  if ($catalogSwitcher.length) {
    catalogShutterJs = $catalogSwitcher.switchClass({
      switchClassTo: $('.catalog-shutter-js').add('.catalog-overlay-js').add('body')
      , modifiers: {
        activeClass: 'catalog-is-open'
      }
      , cssScrollFixed: true
      // , afterAdded: function () {
      //   $html.addClass(scrollFixedOnlyMobClass);
      // }
      // , afterRemoved: function () {
      //   $html.removeClass(scrollFixedOnlyMobClass);
      // }
    });
  }

  // Toggle a filters shutter
  var $filtersSwitcher = $('.btn-filters-js'), filtersShutterJs;
  if ($filtersSwitcher.length) {
    filtersShutterJs = $filtersSwitcher.switchClass({
      switchClassTo: $('.shutter--filters-js').add('.p-filters-results-js').add('.filters-shutter-overlay')
      , remover: $('.js-btn-shutter-close')
      , modifiers: {
        activeClass: 'filters_is-open'
      }
      , cssScrollFixed: true
      , afterAdded: function () {
        $html.addClass(showOnlyMobClass);
      }
      , afterRemoved: function () {
        $html.removeClass(showOnlyMobClass);
      }
    });
  }

  // Toggle buy popup
  var $addFormPopupSwitcher = $('.open-p-add-form-popup-js'), addFormPopupJs;
  if ($addFormPopupSwitcher.length) {
    var $addFormPopup = $('.p-add-form-popup-js');
    addFormPopupJs = $addFormPopupSwitcher.switchClass({
      switchClassTo: $addFormPopup
      , remover: '.p-add-form-popup-close-js'
      , modifiers: {
        activeClass: 'p-add-form-popup_opened'
      }
      , cssScrollFixed: false
    });
  }

  // Toggle quick buy
  var $quickBuy = $('.quick-buy-open-js'), quickBuyJs;
  if ($quickBuy.length) {
    var $quickBuyPopup = $('.quick-buy-popup-js');
    quickBuyJs = $quickBuy.switchClass({
      switchClassTo: $quickBuyPopup
      , remover: '.quick-buy-close-js'
      , modifiers: {
        activeClass: 'quick-buy_open'
      }
      , cssScrollFixed: false
    });
  }

  // Toggle advise callback
  var $adviseCallback = $('.advise-callback-open-js'), adviseCallbackJs;
  if ($adviseCallback.length) {
    var $adviseCallbackPopup = $('.advise-callback-js');
    adviseCallbackJs = $adviseCallback.switchClass({
      switchClassTo: $adviseCallbackPopup
      , remover: '.advise-callback-close-js'
      , modifiers: {
        activeClass: 'advise-callback_open'
      }
      , cssScrollFixed: false
    });
  }

  // Toggle quick cart
  var $quickCartSwitcher = $('.cart-keeper-js'), quickCartJs;
  if ($quickCartSwitcher.length) {
    var $quickCart = $('.quick-cart-js');
    quickCartJs = $quickCartSwitcher.switchClass({
      switchClassTo: $quickCart
      , remover: '.quick-cart-close-js'
      , modifiers: {
        activeClass: 'quick-cart_opened'
      }
      , cssScrollFixed: true
      // , afterAdded: function () {
      //   $html.addClass(scrollFixedOnlyMobClass);
      // }
      // , afterRemoved: function () {
      //   $html.removeClass(scrollFixedOnlyMobClass);
      // }
    });
  }

  // Toggle contacts in header
  var $selectIn = $('.select-in-selector-js'), selectInJs;
  if ($selectIn.length) {
    selectInJs = $selectIn.switchClass({
      switchClassTo: $('.select-in-drop-js')
      , modifiers: {
        activeClass: 'is-open'
      }
      , cssScrollFixed: false
    });
  }

  var $subsBtn = $('.btn-subs-js');
  if ($subsBtn.length) {
    $subsBtn.switchClass({
      switchClassTo: $('.subs-js'),
      modifiers: {
        activeClass: 'active'
      },
      cssScrollFixed: false,
      afterAdded: function () {
        setTimeout(function () {
          $('.focus-field-js').focus();
        }, 50);
      },
      afterRemoved: function () {
        $('.focus-field-js').blur();
      }
    });
  }


  // При добавлении классов одним экземпляром плагина,
  // Удалять другие
  // todo Добавить в плагин этот кусок
  function hContactsSwitcherRemoveClass() {
    hContactsDropJs && hContactsDropJs.switchClass('remove');
  }

  function catalogShutterRemoveClass() {
    catalogShutterJs && catalogShutterJs.switchClass('remove');
  }

  function filtersShutterRemoveClass() {
    filtersShutterJs && filtersShutterJs.switchClass('remove');
  }

  function addFormPopupRemoveClass() {
    addFormPopupJs && addFormPopupJs.switchClass('remove');
  }

  function quickBuyRemoveClass() {
    quickBuyJs && quickBuyJs.switchClass('remove');
  }

  function adviseCallbackRemoveClass() {
    quickBuyJs && quickBuyJs.switchClass('remove');
  }

  function searchPopupRemoveClass() {
    searchPanelJs && searchPanelJs.switchClass('remove');
  }

  function quickCartRemoveClass() {
    quickCartJs && quickCartJs.switchClass('remove');
  }

  function selectInRemoveClass() {
    selectInJs && selectInJs.switchClass('remove');
  }

  // Вызывать метод удаления классов другими
  if (hContactsDropJs) {
    hContactsDropJs.on('switchClass.beforeAdded', function () {
      searchPopupRemoveClass();
      catalogShutterRemoveClass();
      filtersShutterRemoveClass();
      addFormPopupRemoveClass();
      quickBuyRemoveClass();
      adviseCallbackRemoveClass();
      quickCartRemoveClass();
      selectInRemoveClass();
    });
  }

  if (searchPanelJs) {
    searchPanelJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      catalogShutterRemoveClass();
      filtersShutterRemoveClass();
      addFormPopupRemoveClass();
      quickBuyRemoveClass();
      adviseCallbackRemoveClass();
      quickCartRemoveClass();
      selectInRemoveClass();
    });
  }

  if (catalogShutterJs) {
    catalogShutterJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      addFormPopupRemoveClass();
      quickBuyRemoveClass();
      adviseCallbackRemoveClass();
      quickCartRemoveClass();
      selectInRemoveClass();
    });
  }

  if (filtersShutterJs) {
    filtersShutterJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      catalogShutterRemoveClass();
      addFormPopupRemoveClass();
      quickBuyRemoveClass();
      adviseCallbackRemoveClass();
      quickCartRemoveClass();
      selectInRemoveClass();
    });
  }

  if (addFormPopupJs) {
    addFormPopupJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      catalogShutterRemoveClass();
      quickBuyRemoveClass();
      adviseCallbackRemoveClass();
      quickCartRemoveClass();
      selectInRemoveClass();
    });
  }

  if (quickBuyJs) {
    quickBuyJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      catalogShutterRemoveClass();
      quickCartRemoveClass();
      adviseCallbackRemoveClass();
      addFormPopupRemoveClass();
      selectInRemoveClass();
    });
  }

  if (adviseCallbackJs) {
    adviseCallbackJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      // filtersShutterRemoveClass(); // фильтры закрывать не нужно
      catalogShutterRemoveClass();
      quickCartRemoveClass();
      quickBuyRemoveClass();
      addFormPopupRemoveClass();
      selectInRemoveClass();
    });
  }

  if (quickCartJs) {
    quickCartJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      catalogShutterRemoveClass();
      addFormPopupRemoveClass();
      adviseCallbackRemoveClass();
      quickBuyRemoveClass();
      selectInRemoveClass();
    });
  }

  if (selectInJs) {
    selectInJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      catalogShutterRemoveClass();
      quickCartRemoveClass();
      addFormPopupRemoveClass();
      quickBuyRemoveClass();
      adviseCallbackRemoveClass();
    });
  }
}

/**
 * !Change visual state
 * */
function changeState() {
  function changeStateElement($_element) {
    $_element.on('click', function (e) {
      var $btn = $(this),
          $copyBtn = $btn.closest('.product-js').find($_element),
          classActive = 'added',
          activeText = $btn.data('active-text'),
          inactiveText = $btn.data('inactive-text');

      $btn.add($copyBtn).toggleClass(classActive);

      if ($btn.hasClass(classActive)) {
        $('span', $btn).add($('span', $copyBtn)).text(activeText);
        // if($btn.attr('title') !== undefined){
        //   $btn.attr('title', activeText);
        // }
        if ($btn.attr('data-title') !== undefined) {
          $btn.add($('span', $copyBtn)).attr('data-title', activeText);
        }
      } else {
        $('span', $btn).add($('span', $copyBtn)).text(inactiveText);
        // if($btn.attr('title') !== undefined){
        //   $btn.attr('title', inactiveText);
        // }
        if ($btn.attr('data-title') !== undefined) {
          $btn.add($('span', $copyBtn)).attr('data-title', inactiveText);
        }
      }

      e.preventDefault();
    });
  }

  changeStateElement($('.change-like-js'));
  changeStateElement($('.change-compare-js'));
}

/**
 * Add to car animation
 */
function addToCarAnimation() {
  var $btn = $('.add-to-cart-js'),
      $cartKeeper = $('.cart-keeper-js'),
      $cartCounter = $('.counter-js', $cartKeeper),
      addedClass = 'added',
      pushClass = 'push',
      pickClass = 'pick',
      activeText = $btn.data('active-text'),
      inactiveText = $btn.data('inactive-text'),
      animation = false,
      timeoutPush, timeoutPick
  ;

  $btn.on('click', function (event) {
    event.preventDefault();

    var $cutBtn = $(this);
    var $cutBtnSiblings = $cutBtn.closest('.flip-product-card').siblings('.flip-product-card').find($btn);
    var countLength = +$cartCounter.text();

    $cartKeeper.removeClass(pushClass).removeClass(pickClass);

    if (!$cutBtn.hasClass(addedClass)) {
      // Change a button
      $cutBtn.add($cutBtnSiblings).addClass(addedClass);

      if (animation) {
        // Remove a copy of product image
        $('#figureCopy').remove();
        // Animate a product added to a cart
        var $figure = $cutBtn.closest('.product-js').find('.product-figure-js');
        $figure.clone()
            .addClass('product-figure_copy-js').attr('id', 'figureCopy')
        // .removeClass('product-figure-js')
            .offset({top:$figure.offset().top, left:$figure.offset().left})
            .css({
              width: $figure.outerWidth(),
              height: $figure.outerHeight()
            })
            .appendTo('body');
      }

      // Animate a cart keeper (+ css styles)
      clearTimeout(timeoutPush);
      timeoutPush = setTimeout(function () {
        $cartCounter.removeClass('hide').text(++countLength);
        $cartKeeper.addClass(pushClass);
      }, 30)
    } else {
      // Change a button
      $cutBtn.add($cutBtnSiblings).removeClass(addedClass);

      // Remove a copy of product image
      // $('#figureCopy').remove();

      // Animate a cart keeper (+ css styles)
      clearTimeout(timeoutPick);
      timeoutPick = setTimeout(function () {
        $cartCounter.text(--countLength);
        if (!countLength) {
          $cartCounter.addClass('hide');
        }
        $cartKeeper.addClass(pickClass);
        // clearTimeout(timeout);
      }, 30);
    }
  })
}

/**
 * !jquery.ms-rolls.js
 * Version: 2019.1.0
 * Author: Astronim*
 */
(function ($) {
  'use strict';

  var MsRolls = function (element, config) {
    var self,
        $element = $(element),
        $panel = $(config.panel, $element),
        isAnimated = false,
        pref = 'ms-rolls',
        pluginClasses = {
          initClass: pref + '_initialized'
        },
        focusElements = 'input, a, [tabindex], area, select, textarea, button, [contentEditable=true]' + config.hand,
        $panelWrap,
        relativeStyles = {
          position: '',
          left: '',
          top: '',
          width: ''
        },
        showStyles = {
          opacity: '',
          'user-select': '',
          'pointer-event': '',
          'z-index': ''
        },
        absoluteStyles = {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%'
        },
        hideStyles = {
          opacity: 0,
          'user-select': 'none',
          'pointer-event': 'none',
          'z-index': -1
        };

    var dataClpsd = $element.attr('data-rolls-collapsed');
    var collapsed = (dataClpsd === "true" || dataClpsd === "false") ? dataClpsd === "true" : config.collapsed;

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('msRolls.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        tabindexOn = function (_element) {
          // Все элементы _element поставить в фокус-очередь
          _element.attr('tabindex', '0');
        },
        tabindexOff = function (_element) {
          // Все элементы _element убрать с фокус-очереди
          _element.attr('tabindex', '-1');
        },
        open = function ($_panel) {
          if (!$_panel.length) {
            return false;
          }

          var $activePanelWrap = $_panel.parent(), // Ближайшая родительская обертка активной Панели
              $activeParentsPanels = $_panel.parentsUntil(element, config.panel), // Все родительские Панели активной Панели
              $otherActivePanelsWrap = $activeParentsPanels.parent(), // Все родительские Обертка активной Панели не включая ближайшую
              $otherActiveHeader = $otherActivePanelsWrap.prev(config.header), // Все родительские Обертка активной Панели не включая ближайшую
              $otherActiveParentsItems = $activeParentsPanels.parentsUntil(element, config.item) // Все родительские Элементы активной Панели
          ;

          // 1) Открыть все родительские Панели (без анимации)
          // Добавить класс на активные родительские (не ближайшие) элементы
          $activeParentsPanels.add($otherActiveParentsItems).add($otherActiveHeader).add($(config.hand, $otherActiveHeader)).addClass(config.modifiers.activeClass);

          // Открывать родительские Панели необходимо, если, например, открывается вложенная Панель методом "open"
          $activeParentsPanels
              .css(relativeStyles)
              .css(showStyles)
              .data('active', true).attr('data-active', true); // Указать в data-атрибуте, что Панель открыта;

          // 2) Открыть текущую панель (с анимацией)
          $element.trigger('msRolls.beforeOpen');// Вызов события перед открытием текущей панели

          var $activeItems = $_panel.closest(config.item), // Родительский Элемент активной Панели
              $activeHeader = $activePanelWrap.prev(config.header); // Шапка активной Панели

          // Добавить класс на активные элементы
          $_panel.add($activeItems).add($activeHeader).add($(config.hand, $activeHeader)).addClass(config.modifiers.activeClass);

          var callback = arguments[1];

          $_panel.css(showStyles); // Панель делаем видимой до начала анимации

          changeHeight($activePanelWrap, $_panel.outerHeight(), function () {
            $_panel
                .css(relativeStyles)
                .data('active', true).attr('data-active', true); // Указать в data-атрибуте, что Панель открыта

            $activePanelWrap.css({
              position: '',
              overflow: '',
              'height': ''
            });

            if (config.accessibility) {
              // Поставить в фокус-очередь все элементы с фокусировкой внутри активной Панели
              tabindexOn($(focusElements, $_panel));

              // В неактивных Панелях все элементы с фокусировкой убрать с фокус-очереди
              tabindexOff($(focusElements, $_panel.find(config.panel).filter(function () {
                return !$(this).data('active');
              })));
            }

            // Вызов события после открытия текущей панели
            $element.trigger('msRolls.afterOpen');

            // Вызов callback функции после открытия панели
            if (typeof callback === "function") {
              callback();
            }
          });

          if (collapsed) {
            // Проверить у соседей всех родительских Элементов наличие активных Панелей
            // Закрыть эти Панели
            var $siblingsPanel = $_panel.parentsUntil($element, config.item).siblings().find(config.panel).filter(function () {
              return $(this).data('active');
            });

            closePanel($siblingsPanel, function () {
              isAnimated = false; // Анимация завершена
            });
          }
        },
        close = function ($_panel) {
          if (!$_panel.length) {
            return false;
          }
          // Закрыть отдельно все вложенные активные панели,
          // И отдельно текущую панель.
          // Это сделано с целью определения события закрытия текущей панели отдельно.

          if (collapsed) {
            // Закрыть активные панели внутри текущей
            var $childrenOpenedPanel = $(config.panel, $_panel).filter(function () {
              return $(this).data('active');
            });

            closePanel($childrenOpenedPanel);
          }

          // Закрыть текущую панель
          $element.trigger('msRolls.beforeClose'); // Вызов события перед закрытием текущей панели
          var callback = arguments[1];

          closePanel($_panel, function () {
            $element.trigger('msRolls.afterClose'); // Вызов события после закрытия текущей панели

            // Вызов callback функции после закрытия панели
            if (typeof callback === "function") {
              callback();
            }
          });
        },
        closePanel = function ($_panel) {
          if (!$_panel.length) {
            return false;
          }

          var callback = arguments[1],
              $curPanelWrap = $_panel.parent(); // родительская обертка активной Панели

          var $curItems = $_panel.closest(config.item), // родительский Элемент активной Панели
              $curHeader = $curPanelWrap.prev(config.header); // Шапка активной Панели

          // Удалить активный класс со всех элементов
          $_panel.add($curItems).add($curHeader).add($(config.hand, $curHeader)).removeClass(config.modifiers.activeClass);

          // Закрыть панель
          changeHeight($curPanelWrap, 0, function () {
            $_panel
                .css(absoluteStyles)
                .css(hideStyles)
                .data('active', false).attr('data-active', false); // Указать в data-атрибуте, что панель закрыта

            $curPanelWrap.css('height', '');

            // Web accessibility
            if (config.accessibility) {
              // Убрать с фокус-очереди все элементы с фокусировкой внутри текущей Панели
              tabindexOff($(focusElements, $_panel));
            }

            // Вызов callback функции после закрытия панели
            if (typeof callback === "function") {
              callback();
            }
          });
        },
        changeHeight = function ($_wrap, _val) {
          var callback = arguments[2];

          $_wrap.css({
            position: 'relative',
            overflow: 'hidden'
          }).animate({
            'height': _val
          }, config.animationSpeed, function () {

            if (typeof callback === "function") {
              callback();
            }

            isAnimated = false;
          });
        },
        events = function () {
          $element.on(config.event, config.hand, function (event) {
            // Если панель во время клика находится в процессе анимации, то выполнение функции прекратится
            if (isAnimated) {
              event.preventDefault();
              return false;
            }

            var $currentHand = $(this);
            // Если текущий пункт не содержит панелей,
            // то выполнение функции прекратится
            if (!$currentHand.closest(config.item).has(config.panel).length) {
              return false;
            }

            // Начало анимирования панели
            // Включить флаг анимации
            isAnimated = true;

            event.preventDefault();

            var $currentPanel = $currentHand.closest(config.header).next().children(config.panel);

            if ($currentPanel.data('active')) {
              // Закрыть текущую панель
              close($currentPanel, function () {
                isAnimated = false; // Анимация завершина
              });
            } else {
              // Открыть текущую панель
              open($currentPanel, function () {
                isAnimated = false; // Анимация завершина
              });
            }
          });
        },
        init = function () {
          $panelWrap = $('<div/>', {
            class: 'rolls-panel-wrap-js',
            css: {
              position: 'relative',
              overflow: 'hidden'
            }
          });

          var $panel = $(config.panel, $element).not('.wrapped');

          $panel.wrap($panelWrap).addClass('wrapped');

          $panel
              .css(absoluteStyles)
              .css(hideStyles);

          var $activePanels = $panel.filter('.' + config.modifiers.activeClass);

          // Добавить класс на активные элементы
          var $activeItems = $activePanels.parents(config.item), // Все родительские Элементы активной Панели
              $activeHeaders = $activePanels.parentsUntil(element).prev(config.header), // Все Шапки в родительских Элементах
              $allActivePanels = $activeHeaders.next().children(config.panel); // Все родительские Панели

          $activePanels.add($activeItems).add($activeHeaders).add($allActivePanels).add($(config.hand, $activeHeaders)).addClass(config.modifiers.activeClass);

          // Открыть все родительские панели
          $activePanels.add($allActivePanels).css(relativeStyles).css(showStyles);

          // Удалить лишние внутренние стили у оберток активных Панелей
          $activePanels.add($allActivePanels).parent().css({
            // position: '',
            overflow: ''
          });

          // На активные панели установить дата-атрибут active сo заначением true
          $activePanels.add($allActivePanels).data('active', true).attr('data-active', true);

          // Web accessibility
          if (config.accessibility) {
            // Переключатель поставить в фокус-очередь
            tabindexOn($(config.hand, $element));
            // Все элементы с фокусировкой внутри панелей убрать с фокус-очереди
            tabindexOff($(focusElements, $panel));
            // Все элементы с фокусировкой внутри активных панелей поставить в фокус-очередь
            tabindexOn($(focusElements, $allActivePanels));
          }

          $element.addClass(pluginClasses.initClass);
          $element.trigger('msRolls.afterInit');
        };

    self = {
      callbacks: callbacks,
      open: open,
      close: close,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.msRolls = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].msRolls = new MsRolls(_[i], $.extend(true, {}, $.fn.msRolls.defaultOptions, opt));
        _[i].msRolls.init();
        _[i].msRolls.callbacks();
        _[i].msRolls.events();
      } else {
        ret = _[i].msRolls[opt].apply(_[i].msRolls, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.msRolls.defaultOptions = {
    item: '.rolls__item-js', // Общий ближайший родитель (Элемент) для переключателя и разворачивающейся панели (Далее Панель)
    header: '.rolls__header-js', // Обертка для переключателя (Шапка)
    hand: '.rolls__hand-js', // Переключатель
    panel: '.rolls__panel-js', // Панель
    event: 'click', // Событие, которое разворачивает/сворачивает Панель
    animationSpeed: 300, // Скорость анимации Панели
    collapsed: true, // Параметр, указывающий на необходимось сворачивать ранее открытые Панели
    accessibility: false, // Опримизировать переключение фокуса по табу (снижает скорость выполнения скрипта)
    modifiers: {
      activeClass: 'rolls-active' // Класс, который добавляется, на активный элементы
    }
  };

})(jQuery);

/**
 * !Rolls
 */
function rollsInit() {
  /** Default Rolls */
  var $defautlRolls = $('.rolls-js');

  if ($defautlRolls.length) {
    $defautlRolls.msRolls();
  }

  /** Catalog list */
  // Первый уровень меню каталога
  var $catalogList = $('.catalog-list-rolls-js'),
      $catalogListAngle = $('.catalog-list-angle-js');

  if ($catalogList.length) {
    $catalogList.msRolls({
      item: $catalogList.children(),
      header: $catalogListAngle.parent(),
      hand: '.catalog-list-angle-js',
      panel: '.catalog-links-rolls-js',
      animationSpeed: 200,
      collapsed: false,
      modifiers: {
        activeClass: 'active'
      }
    })
  }

  /** Catalog links */
  // Второй и ниже уровни меню каталога
  var $catalogLinks = $('.catalog-links-rolls-js');

  if ($catalogLinks.length) {
    $catalogLinks.msRolls({
      item: 'li',
      header: '.catalog-menu-angle-js',
      hand: '.catalog-menu-angle-js',
      panel: 'ul',
      animationSpeed: 200,
      collapsed: false,
      modifiers: {
        activeClass: 'active'
      }
    })
  }

  /** Devise (mobile) menu */
  // Второй и ниже уровни навигации
  var $navMob = $('.nav-mob-rolls-js');

  if ($navMob.length) {
    $navMob.msRolls({
      item: 'li',
      header: '.nav-mob-angle-js',
      hand: '.nav-mob-angle-js',
      panel: 'ul',
      animationSpeed: 200,
      collapsed: false,
      modifiers: {
        activeClass: 'active'
      }
    })
  }
}

/**
 * !Toggle view plugin
 * */
(function($){
  /**
   * @extends: setCookie(), getCookie(), deleteCookie()
   */

  var defaults = {
    anchor: 'a',
    initClass: 'toggle-view_initialized',
    activeClass: 'active'
  };

  function ToggleView(element, options) {
    var self = this;

    self.config = $.extend(true, {}, defaults, options);

    self.element = element;
    self.anchor = $(self.config.anchor, $(self.element));

    self.data = {
      switcher: 'data-toggle-view-for',
      panel: 'data-toggle-view-id'
    };

    self.productViewCookieName = 'productView';

    self.callbacks();
    self.event();
    self.init();
  }

  /** track events */
  ToggleView.prototype.callbacks = function () {
    var self = this;
    $.each(self.config, function (key, value) {
      if(typeof value === 'function') {
        self.element.on(key + '.toggleView', function (e, param) {
          return value(e, self.element, param);
        });
      }
    });
  };

  ToggleView.prototype.event = function () {
    var self = this;

    self.anchor.on('click', function (e) {
      e.preventDefault();

      var currentAnchor = $(this),
          mod = currentAnchor.attr('data-mod');

      if ( currentAnchor.hasClass(self.config.activeClass) ) return;

      // Записать значение mod в куку
      var date = new Date;
      setCookie(self.productViewCookieName, mod, {
        expires: date.setDate(date.getDate() + 365),
        // domain: ".domain.by",
        path: "/"
      });

      self.anchor.removeClass(self.config.activeClass);
      currentAnchor.addClass(self.config.activeClass);

      var id = currentAnchor.closest(self.element).attr(self.data.switcher);
      // Add modifier to a panel
      $('[' + self.data.panel + '="' + id + '"]').attr('data-view', mod);
      // Add modifier to a switcher
      $(self.element).attr('data-view', mod);

      self.element.trigger('changed.toggleView');
    });
  };

  ToggleView.prototype.init = function () {
    var self = this;
    var activeAnchor = self.anchor.filter('.' + self.config.activeClass);
    var id = activeAnchor.closest(self.element).attr(self.data.switcher);

    // Create individual cookie name
    self.productViewCookieName = self.productViewCookieName + id.charAt(0).toUpperCase() + id.slice(1);

    var cookieMod = getCookie(self.productViewCookieName);

    var mod = cookieMod || activeAnchor.attr('data-mod');

    // Add modifier to a panel
    $('[' + self.data.panel + '="' + id + '"]').attr('data-view', mod);
    // Add modifier to a switcher
    $(self.element).attr('data-view', mod);
    $(self.anchor).filter('[data-mod="' + mod + '"]').trigger('click');

    self.element.addClass(self.config.initClass);
    $('[' + self.data.panel + '="' + $(self.element).attr(self.data.switcher) + '"]').addClass(self.config.initClass);
    self.element.trigger('created.toggleView');
  };

  $.fn.toggleView = function (options) {
    'use strict';

    new ToggleView(this, options);

    return this;
  };
})(jQuery);

/**
 * !Toggle view initial
 * */
function toggleViewInit() {
  var $productsSwitcher = $('.view-switcher-products-js');
  if ( $productsSwitcher.length ) {
    $productsSwitcher.toggleView({
      'changed.toggleView': function () {
        $.fn.matchHeight._update();
      }
    });
  }
}

/**
 * !Multi filters jquery plugin
 * */
(function ($) {
  var MultiFilters = function (settings) {
    var options = $.extend({
      container: null,
      item: null,
      group: null,
      handler: null,
      placeholder: null,
      selected: null,
      drop: null,
      filter: null, // checkbox => filter: checkbox, select
      labelText: null,
      btnReset: null,
      btnResetAll: null,
      btnToggleMore: null,
      btnHideMore: null,
      tagsContainer: null,
      resultsPanel: null,
      activatedFilters: '.activated-js',
      tagsItem: ".tags-item-js",
      tagsItemTpl: null,
      tagTextContainer: ".tag-text-js",

      dropOpenClass: 'is-open',
      filtersOnClass: 'filters-on',
      showResultsPanelClass: 'filters-results-show',
      showSelectedClass: 'filters-selected-show',
      showPlaceholderClass: 'filters-placeholder-show',
      filterActiveClass: 'is-active',
      filterShowAllClass: 'is-show-all',
      filterHideAllClass: 'is-hide-all',
    }, settings || {});

    this.options = options;
    var container = $(options.container);

    this.$container = container;
    this.$item = $(options.item, container);
    this.$handler = $(options.handler, container);
    this.$placeholder = $(options.placeholder, container);
    this.$selected = $(options.selected, container);
    this.$drop = $(options.drop, container);
    this.$group = $(options.group, container);
    this.$filter = $(options.filter, container);
    this.$labelText = $(options.labelText, container);
    this.$btnReset = $(options.btnReset, container);
    this.$btnResetAll = $(options.btnResetAll, container);
    this.$tagsContainer = $(options.tagsContainer, container);
    this.$resultsPanel = $(options.resultsPanel, container);
    this.$activatedFilters = $(options.activatedFilters, container);
    this.tagsItem = options.tagsItem; // не jq-объект, чтобы можна было искать в DOM после добавления
    this.tagTextContainer = options.tagTextContainer; // не jq-объект, чтобы можна было искать в DOM после добавления
    this.tagVal = null;
    this.tagsItemTpl = !options.tagsItemTpl ?
        '<div class="' + options.tagsItem.substring(1) + '"><i>Удалить</i><span class="' + options.tagTextContainer.substring(1) + '"></span></div>' :
        options.tagsItemTpl;
    this.tagsListTpl = !options.tagsListTpl ?
        $('<div>', {
          class: 'p-filters-tags-list'
        }) :
        options.tagsListTpl;
    this.filtersObject = {
      filterGroups: {}
    };


    this.modifiers = {
      dropIsOpened: options.dropOpenClass,
      filtersOn: options.filtersOnClass,
      showResultsPanel: options.showResultsPanelClass,
      showSelected: options.showSelectedClass,
      showPlaceholder: options.showPlaceholderClass,
      filterActive: options.filterActiveClass,
      filterShowAll: options.filterShowAllClass,
      filterHideAll: options.filterHideAllClass
    };

    /**
      this.attributes = {
      dataGroup: 'data-filter-group',
      dataDefaultValue: 'data-filter-default',
      dataTag: 'data-filter-tag',
      dataName: 'data-filter-name',
      dataType: 'data-filter-type', // not used
      dataFrom: 'data-filter-from',
      dataTo: 'data-filter-to',
      dataSelectedPrefix: 'data-filter-selected-prefix',
      dataSelectedPostfix: 'data-filter-selected-postfix',
      dataTagPrefix: 'data-filter-tag-prefix',
      dataUnit: 'data-filter-unit'
    };
    */

    this.createFiltersObject();
    this.changeFilters();
    this.bindTagsEvents();
    this.toggleDrop();
    this.toggleMore();
    this.resetFiltersInGroup();
    this.resetAllFilters();
  };

  // MultiFilters.prototype.dropIsOpened = false;

  MultiFilters.prototype.createFiltersObject = function () {
    var self = this;
    var $group = self.$group;

    $.each($group, function (groupIndex, groupEl) {
      var $curGroup = $(this);
      var curGroupName = $curGroup.attr('data-filter-group');
      var $curFilter = $curGroup.find(self.$filter);

      self.filtersObject['filterGroups'][curGroupName] = {
        changedFiltersLengthInGroup: 0,
        el: groupEl,
        filters: {},
        isActive: false
      };

      self.filtersObject['changedFiltersLength'] = 0;

      $.each($curFilter, function (filterIndex, filterEl) {
        var $eachFilter = $(this);
        var filterName = $eachFilter.attr('data-filter-name');
        var isFrom = $eachFilter.attr('data-filter-from') !== undefined;
        var isTo = $eachFilter.attr('data-filter-to') !== undefined;

        // If filter has attribute data-filter-from or data-filter-to
        // And has not data-filter-name
        if (filterName === undefined && (isFrom || isTo)) {
          filterName = self.createFromToFilterName(curGroupName, isFrom, isTo);
        }

        self.filtersObject['filterGroups'][curGroupName].filters[filterName] = {
          el: filterEl,
          isActive: false,
          tag: null,
          prefix: null,
          unit: null
        };

        if (isFrom) {
          self.filtersObject['filterGroups'][curGroupName].filters[filterName].from = true;
        }

        if (isTo) {
          self.filtersObject['filterGroups'][curGroupName].filters[filterName].to = true;
        }

        var prefix = $eachFilter.attr('data-filter-tag-prefix');
        if (prefix !== undefined) {
          self.filtersObject['filterGroups'][curGroupName].filters[filterName].prefix = prefix;
        }

        var unit = $eachFilter.attr('data-filter-unit');
        if (unit !== undefined) {
          self.filtersObject['filterGroups'][curGroupName].filters[filterName].unit = unit;
        }
      });
    });
    console.info("Filters Object: ", self.filtersObject);
  };

  MultiFilters.prototype.createFromToFilterName = function (groupName, isFrom, isTo) {
    switch (true) {
      case isFrom:
        return groupName + '-from';

      case isTo:
        return groupName + '-to';
    }
  };

  MultiFilters.prototype.changeFilters = function () {
    var self = this;

    self.$container.on('change keyup', self.options.filter, function (event) {
      var $curFilter = $(this);
      var $curContainer = $curFilter.closest(self.$container);
      var $curItem = $curFilter.closest(self.$item);
      var $curGroup = $curFilter.closest(self.$group);
      // Buttons
      var $curBtnReset = $curItem.find(self.$btnReset);
      var $curBtnResetAll = $curContainer.find(self.$btnResetAll);

      // console.log('%c ~~~' + event.handleObj.origType + '~~~ ', 'background: #222; color: #bada55');
      // Change property "event" of a filtersObject
      self.filtersObject['event'] = event.handleObj.origType;
      // Get filter state
      var curFilterHasChanged = self.checkFilterChanged($curFilter);
      // Add active class on a parent li
      $curFilter.closest('li').toggleClass(self.modifiers.filterActive, curFilterHasChanged);
      // Disabled reset button in a group
      self.disabledButton($curBtnReset);
      // Remove class "Has active filters if Group"
      self.removeClassCustom($curItem, self.modifiers.filtersOn);
      // Disabled reset button of all filters
      self.disabledButton($curBtnResetAll);
      // Remove class "Show results panel"
      $curContainer.add($curContainer.find(self.$resultsPanel)).removeClass(self.modifiers.showResultsPanel);

      // If has active filter in a GROUP
      if (self.countActivateFilters($curFilter, $curGroup)) {
        // Enabled reset button in a group
        self.enabledButton($curBtnReset);
        // Add class "Has active filters if Group"
        self.addClassCustom($curItem, self.modifiers.filtersOn);
      }

      // If has active filter among ALL FILTERS
      if (self.countActivateFilters($curContainer.find(self.$filter), $curContainer.find(self.$group))) {
        // Enabled reset button of all filters
        self.enabledButton($curBtnResetAll);
        // Add class "Show results panel"
        $curContainer.add($curContainer.find(self.$resultsPanel)).addClass(self.modifiers.showResultsPanel);
      }

      // Change value of length active filter in a group on DOM
      self.setLengthActiveFilters($curFilter, $curGroup);

      // Change value of length groups with active filters on DOM
      var activeGroupLength = $curContainer.find('.' + self.modifiers.filtersOn).length;
      // Show/hide length group element
      $curContainer.find(self.$activatedFilters).html(activeGroupLength).toggleClass('hide', !activeGroupLength);



      var isFrom = $curFilter.attr('data-filter-from') !== undefined;
      var isTo = $curFilter.attr('data-filter-to') !== undefined;

      // attributes
      var curGroupName = $curGroup.attr('data-filter-group');

      // Get current filter name
      var curFilterName = $curFilter.attr('data-filter-name') || $('option:selected', $curFilter).attr('data-filter-name');
      // If current filter has an attribute "data-filter-from" or "data-filter-to" and has not an attribute "data-filter-name"
      if (curFilterName === undefined && (isFrom || isTo)) {
        curFilterName = self.createFromToFilterName(curGroupName, isFrom, isTo);
      }

      // Get current filter tag
      var curFilterTag = $curFilter.attr('data-filter-tag') || $('option:selected', $curFilter).attr('data-filter-tag');

      var fObjCurGroup = self.filtersObject['filterGroups'][curGroupName];
      var fObjCurFilter = fObjCurGroup['filters'][curFilterName];

      // Tag content
      var textInsideTag = curFilterTag || $curFilter.closest('label').find(self.$labelText).text() || curFilterName;

      switch (true) {
        case $curFilter.is(':checkbox') && event.handleObj.origType === 'change':
          self.tagVal = curFilterHasChanged ? textInsideTag : null;

          if (curFilterHasChanged) {
            fObjCurGroup['changedFiltersLengthInGroup']++;
            self.filtersObject['changedFiltersLength']++;
          } else {
            fObjCurGroup['changedFiltersLengthInGroup']--;
            self.filtersObject['changedFiltersLength']--;
          }

          updateFiltersObject();

          break;

        case $curFilter.is(':text') && event.handleObj.origType === 'keyup':
          self.tagVal = $curFilter.val();

          if (!fObjCurFilter.isActive && curFilterHasChanged) {
            fObjCurGroup['changedFiltersLengthInGroup']++;
            self.filtersObject['changedFiltersLength']++;
          }
          if (fObjCurFilter.isActive && !curFilterHasChanged) {
            fObjCurGroup['changedFiltersLengthInGroup']--;
            self.filtersObject['changedFiltersLength']--;
          }

          updateFiltersObject();

          break;

        case $curFilter[0].tagName.toLowerCase() === 'select' && event.handleObj.origType === 'change':
          self.tagVal = curFilterHasChanged ? $curFilter.val() : null;

          if (!fObjCurFilter.isActive && curFilterHasChanged) {
            fObjCurGroup['changedFiltersLengthInGroup']++;
            self.filtersObject['changedFiltersLength']++;
          }
          if (fObjCurFilter.isActive && !curFilterHasChanged) {
            fObjCurGroup['changedFiltersLengthInGroup']--;
            self.filtersObject['changedFiltersLength']--;
          }

          updateFiltersObject();

          break;
      }

      function updateFiltersObject() {
        fObjCurFilter.isActive = curFilterHasChanged;
        fObjCurGroup.isActive = !!fObjCurGroup['changedFiltersLengthInGroup'];
        fObjCurFilter.tag = self.tagVal;
        // console.log('Filter ' + curFilterName + ' is ' + fObjCurFilter.isActive + ' --> ' + curGroupName + ' group has ' + fObjCurGroup['changedFiltersLengthInGroup'] + ' active filters'); // For testing

        self.createTagsList(self.filtersObject, $curContainer);
        console.info("Filters Object: ", self.filtersObject);
      }
    });

    $.each(self.$filter, function () {
      var $thisFilter = $(this);
      self.checkFilterChanged($thisFilter) && $thisFilter.trigger('change').trigger('keyup');
    });
  };

  MultiFilters.prototype.setLengthActiveFilters = function ($filter, $container) {
    var self = this;
    var $curItem = $container.closest(self.$item);
    var lengthChecked = self.countActivateFilters($filter, $container) || '';

    $curItem.find(self.$placeholder).toggleClass(self.modifiers.showPlaceholder, !lengthChecked > 0);
    $curItem.find(self.$selected).toggleClass(self.modifiers.showSelected, lengthChecked > 0);

    var textPrefix = $curItem.find(self.$selected).attr('data-filter-selected-prefix') || '';
    var textPostfix = $curItem.find(self.$selected).attr('data-filter-selected-postfix') || '';

    $curItem.find(self.$selected).html(textPrefix + " " + lengthChecked + " " + textPostfix);
  };

  MultiFilters.prototype.countActivateFilters = function ($filter, $container) {
    // Return length of active filters in a group
    var self = this;

    var $curFilters = $filter.closest($container).find(self.$filter);
    var lengthActivateFilters = 0;

    $.each($curFilters, function () {
      var $thisFilter = $(this);
      self.checkFilterChanged($thisFilter) && lengthActivateFilters++
    });

    return lengthActivateFilters;
  };

  MultiFilters.prototype.bindTagsEvents = function () {
    var self = this;

    self.$container.on('click', self.tagsItem, function (e) {
      var $curTag = $(this);
      var dataGroupSelector = '[data-filter-group=' + $curTag.attr('data-filter-tag-group') + ']';
      var dataNameSelector = '[data-filter-name=' + $curTag.attr('data-filter-tag-name') + ']';
      var $filtersGroup = $curTag.closest(self.$container).find(dataGroupSelector);
      var attrComplete = $curTag.attr('data-filter-from-to-complete');

      if (attrComplete && attrComplete === 'true') {
        $.each($filtersGroup.find(self.$filter), function () {
          self.resetFilter($(this));
        })
      } else {
        self.resetFilter($filtersGroup.find(dataNameSelector));
      }

      e.preventDefault();
    });
  };

  MultiFilters.prototype.resetFiltersInGroup = function () {
    var self = this;
    self.$btnReset.on('click', function (e) {
      self.resetFilters($(this).closest(self.options.item));
      self.$container.trigger('resetFiltersInGroup');
      e.preventDefault();
    });
  };

  MultiFilters.prototype.resetAllFilters = function () {
    var self = this;
    self.$btnResetAll.on('click', function (e) {
      self.resetFilters($(this).closest(self.options.container));
      self.$container.trigger('resetAllFilters');
      e.preventDefault();
    });
  };

  MultiFilters.prototype.resetFilter = function ($filter) {
    switch (true) {
      case $filter.is(':checkbox'):
        $filter.prop('checked', false).trigger('change');
        break;

      case $filter.is(':text'):
        $filter.val('').trigger('keyup');
        break;

      case $filter[0].tagName.toLowerCase() === 'select':
        $filter.prop('selectedIndex', false).trigger('change');
        break;
    }
  };

  MultiFilters.prototype.resetFilters = function ($container) {
    var self = this;
    $.each($container.find(self.$filter), function () {
      var $filter = $(this);
      self.checkFilterChanged($filter) && self.resetFilter($filter);
    })
  };

  MultiFilters.prototype.enabledButton = function ($button) {
    $button.prop('disabled', false);
  };

  MultiFilters.prototype.disabledButton = function ($button) {
    $button.prop('disabled', true);
  };

  MultiFilters.prototype.toggleDrop = function () {
    var self = this;
    var $container = self.$container;
    var $item = self.$item;
    var $handler = self.$handler;
    var $drop = self.$drop;
    var dropIsOpenedClass = self.modifiers.dropIsOpened;
    // window.preventAction = true;

    $handler.on('click', function (e) {
      e.preventDefault();

      var $currentHandler = $(this);
      var $currentItem = $currentHandler.closest($item);

      if($currentItem.hasClass(dropIsOpenedClass)) {
        // closeVisibleDrop();
        closeCurrentDrop($currentItem);

        return;
      }

      // closeVisibleDrop();
      openCurrentDrop($currentItem);
    });

    $container.on('closeDrop', function () {
      closeVisibleDrop();
    });

    $($drop).on('click', function (e) {
      e.stopPropagation();
    });

    function openCurrentDrop($elements) {
      self.addClassCustom($elements, dropIsOpenedClass);
      $container.trigger('dropChange.multiFilters');
      $container.trigger('dropOpen.multiFilters');
    }

    function closeCurrentDrop($elements) {
      self.removeClassCustom($elements, dropIsOpenedClass);
      $container.trigger('dropChange.multiFilters');
      $container.trigger('dropClose.multiFilters');
    }

    function closeVisibleDrop() {
      self.removeClassCustom($item, dropIsOpenedClass);
      $container.trigger('dropChange.multiFilters');
      $container.trigger('dropClose.multiFilters');
    }
  };

  MultiFilters.prototype.toggleMore = function () {
    var self = this;
    var $item = self.$item;
    var $btnToggleMore = $(self.options.btnToggleMore);
    var $btnHideMore = $(self.options.btnHideMore);

    $.each($('[data-show-items]'), function () {
      var $cur = $(this);

      hideMoreFilters($cur.closest($item))
    });

    $btnToggleMore.on('click', function (e) {
      e.preventDefault();

      var $curBtn = $(this);
      var $currentItem = $curBtn.closest($item);

      if($currentItem.hasClass(self.modifiers.filterHideAll)) {
        showMoreFilters($currentItem);

        return;
      }

      hideMoreFilters($currentItem);
    });

    $btnHideMore.on('click', function (e) {
      e.preventDefault();

      hideMoreFilters($(this).closest($item));
    });

    function showMoreFilters(item) {
      var $elemWithData = $('[data-show-items]', item);
      var $filters = $elemWithData.find('li');
      var number = parseFloat($elemWithData.attr('data-show-items'));

      if ($filters.length <= number) {
        return;
      }

      item
          .addClass(self.modifiers.filterShowAll)
          .removeClass(self.modifiers.filterHideAll);

      $filters.show();

      item.find($btnToggleMore).hide();

      item.find($btnHideMore).show();
    }

    function hideMoreFilters(item) {
      var $elemWithData = $('[data-show-items]', item);
      var $filters = $elemWithData.find('li');
      var number = parseFloat($elemWithData.attr('data-show-items'));

      if ($filters.length <= number) {
        return;
      }

      item
          .removeClass(self.modifiers.filterShowAll)
          .addClass(self.modifiers.filterHideAll);

      $filters.slice(number).hide();

      item.find($btnToggleMore).show();

      item.find($btnHideMore).hide();
    }
  };

  MultiFilters.prototype.addClassCustom = function (elements, modifiersClass) {
    $.each(elements, function () {
      $(this).addClass(modifiersClass);
    });
  };

  MultiFilters.prototype.removeClassCustom = function (elements, modifiersClass) {
    $.each(elements, function () {
      $(this).removeClass(modifiersClass);
    });
  };

  MultiFilters.prototype.checkFilterChanged = function ($filter) {
    switch (true) {
      case $filter.is(':checkbox'):
        return $filter.prop('checked');

      case $filter.is(':text'):
        return !!$filter.val();

      case $filter[0].tagName.toLowerCase() === 'select':
        return $filter.val() !== $filter.attr('data-filter-default');
    }
  };

  MultiFilters.prototype.createTagsList = function (obj, $container) {
    var self = this;
    var $tagsContainer = $(self.$tagsContainer, $container);
    var filtersLoopBreak = false;

    self.tagsListTpl.contents().remove();

    $.each(obj.filterGroups, function(groupName, groupObj) {
      filtersLoopBreak = false;
      if (groupObj.isActive) {
        $.each(groupObj.filters, function(filterName, filterObj) {
          if (filtersLoopBreak) return;

          if (filterObj.isActive) {
            var filterTag = filterObj.tag;
            var fromToComplete = false;

            switch (true) {
              // Create tag with prefix if filter has data-filter-prefix
              case !filterObj.from && !filterObj.to && !!filterObj.prefix:
                filterTag = [filterObj.prefix, filterTag].join(' ');
              break;

              // Create tag with default prefix "from" if filter has data-filter-from,
              // but has not data-filter-prefix
              case filterObj.from && groupObj.changedFiltersLengthInGroup < 2:
                if (filterObj.prefix) {
                  filterTag = [filterObj.prefix, filterTag].join(' ');
                } else {
                  filterTag = 'from ' + filterTag;
                }
              break;

              // Create tag with default prefix "to" if filter has data-filter-to,
              // but has not data-filter-prefix
              case filterObj.to && groupObj.changedFiltersLengthInGroup < 2:
                if (filterObj.prefix) {
                  filterTag = [filterObj.prefix, filterTag].join(' ');
                } else {
                  filterTag = 'to ' + filterTag;
                }
              break;

              // Create tag from-to diapason,
              // if filter "from" and "to" are completed
              case filterObj.from || filterObj.to && groupObj.changedFiltersLengthInGroup > 1:
                var fromToArr = [];
                $.each(groupObj.filters, function (k, o) {
                  fromToArr.push(o.tag);
                });
                filterTag = fromToArr.join(' — ');
                filterName = 'from-to-complete';
                fromToComplete = true;
                filtersLoopBreak = true;
                break;
            }

            // Create tag with unit if filter has data-filter-unit
            if (filterObj.unit) {
              filterTag = filterTag + ' ' + filterObj.unit;
            }

            self.addTag($container, groupName, filterName, filterTag, fromToComplete);
          }
        });
      }
    });

    self.tagsListTpl.appendTo($tagsContainer);
  };

  MultiFilters.prototype.addTag = function ($container, groupName, filterName, filterTag, fromToComplete) {
    var self = this;

    var tag = $(self.tagsItemTpl).clone()
      .find(self.tagTextContainer)
      .html(filterTag)
      .end()
      .attr('data-filter-tag-group', groupName)
      .attr('data-filter-tag-name', filterName);

    if (fromToComplete) {
      tag.attr('data-filter-from-to-complete', true).addClass('data-filter-from-to-complete');
    }

    tag.appendTo(self.tagsListTpl);
  };

  window.MultiFilters = MultiFilters;
}(jQuery));

/**
 * !Multi filters initial
 * */
function multiFiltersInit() {
  var productFilters = '.p-filters-js';
  // var catalogMenuChangeTimeout;

  if ($(productFilters).length) {
    new MultiFilters({
      container: productFilters,
      item: '.p-filters-item-js',
      group: '.p-filters-group-js',
      handler: '.p-filters-select-js',
      placeholder: '.p-filters-placeholder-js',
      selected: '.p-filters-selected-js',
      drop: '.p-filters-drop-js',
      filter: '.p-filters-drop-list input[type="text"], .p-filters-drop-list input[type="checkbox"], .p-filters-drop-list select',
      labelText: '.p-filters-label-text-js',
      btnReset: '.btn-reset-js',
      btnResetAll: '.btn-filters-clear-js',
      btnToggleMore: '.p-filters-btn-more-js',
      btnHideMore: '.p-filters-btn-less-js',
      tagsContainer: '.p-filters-tags-js',
      tagsItem: '.p-filters-tags-item-js',
      tagTextContainer: '.p-filters-tag-text-js',
      resultsPanel: '.p-filters-results-js',
      tagsItemTpl: '<div class="p-filters-tags__item p-filters-tags-item-js"><span class="p-filters-tag-text-js"></span><i>x</i></div>',

      dropOpenClass: 'p-filters-is-open',
      filtersOnClass: 'p-filters-on',
      activatedFilters: '.p-filters-activated-js'
    });
  }
}

/**
 * !Fixed filters result
 * */
$(function () {
  // fixed filters result

  var $mContainer = $('.m-container');

  if ($mContainer.length) {
    $(window).on('load scroll resize', function () {
      addClassFixed();
    });
  }

  var mContainerOffset = 0,
      currentScrollTop,
      filterResultFixedClass = 'filters-result-fixed';

  function addClassFixed() {
    mContainerOffset = $mContainer.offset().top + $mContainer.outerHeight();
    currentScrollTop = $(window).scrollTop() + window.innerHeight;

    var cond = mContainerOffset < currentScrollTop;

    $('html').toggleClass(filterResultFixedClass, !cond);
  }
});

/**
 * !Change sorting state
 * */
(function ($) {
  'use strict';

  var MsControlSort = function (element, config) {
    var self,
        $element = $(element),
        $selector = $element.find(config.selector),
        $drop = $element.find(config.drop),
        $elemGroup = $element.find(config.elemGroup),
        $toggle = $element.find(config.toggleElem), // Переключатель для вида "list"
        $option = $element.find(config.optionElem), // Переключатель для вида "select"
        $html = $('html'),
        _isSelectOpen = false,
        pref = 'cs',
        pluginClasses = {
          initialized: pref + '_initialized',
          active: pref + '_active',
          desc: 'desc',
          asc: 'asc',
          selectOpen: pref + '_select-open'
        },
        mixedClasses = {
          initialized: pluginClasses.initialized + ' ' + (config.modifiers.initClass || ''),
          active: pluginClasses.active + ' ' + (config.modifiers.activeClass || ''),
          desc: pluginClasses.desc + ' ' + (config.modifiers.descendingClass || ''),
          asc: pluginClasses.asc + ' ' + (config.modifiers.ascendingClass || ''),
          // desc: pluginClasses.desc,
          // asc: pluginClasses.asc,
          selectOpen: pluginClasses.selectOpen + ' ' + (config.modifiers.openClass || '')
        };

    var callbacks = function () {
      /** track events */
      $.each(config, function (key, value) {
        if (typeof value === 'function') {
          $element.on('msControlSort.' + key, function (e, param) {
            return value(e, $element, param);
          });
        }
      });
    }, prevent = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }, eventsSelect = function () {
      $selector.on('click', function () {
        if (_isSelectOpen) {
          closeSelect();
        } else {
          openSelect();
        }

        prevent(event);
      })
    }, openSelect = function () {
      _isSelectOpen = true;
      $element.add($selector).add($drop).addClass(mixedClasses.selectOpen);
      $element.trigger('msTabs.afterSelectOpen');
    }, closeSelect = function () {
      _isSelectOpen = false;
      $element.add($selector).add($drop).removeClass(mixedClasses.selectOpen);
      $element.trigger('msTabs.afterSelectClose');
    }, closeSelectByClickOutside = function () {
      $html.on('click', function (event) {
        if (_isSelectOpen && config.closeByClickOutside && !$(event.target).closest($drop).length) {
          closeSelect();
        }
      });
    }, closeSelectByClickEsc = function () {
      $html.keyup(function (event) {
        if (_isSelectOpen && config.closeByClickEsc && event.keyCode === 27) {
          closeSelect();
        }
      });
    }, events = function () {
      $toggle.on('click', function (event) {
        // Если нужно параметр prevented имеет значение true,
        // то отключать нативное поведение ссылки переключателя
        if (config.prevented) {
          event.preventDefault();
        }

        var $curToggle = $(this),
            $curElemGroup = $curToggle.closest(config.elemGroup),
            hasActiveClass = $curElemGroup.hasClass(pluginClasses.active) || $curElemGroup.hasClass(config.modifiers.activeClass);

        if (hasActiveClass) {
          // 1. Текущий переключатель содержит активный класс.
          // (Текущий переключатель уже содержит один из классов сортировки)
          // 1.2. На переключателе и селекторе
          // переключить класс направления сотрировки на противоположный.
          $curElemGroup.add($selector).toggleClass(mixedClasses.asc + ' ' + mixedClasses.desc);
        } else if ($curElemGroup.hasClass(pluginClasses.asc)) {
          // 2. Текущий переключатель не содержит активный класс,
          // но содержит класс сортировки по возрастанию (asc).
          // 2.1. Со всех переключателей удалить активный класс,
          // но оставить класс направления сортировки.
          $elemGroup.removeClass(mixedClasses.active);
          // 2.2. На активный переключатель добавить активный класс.
          $curElemGroup.addClass(mixedClasses.active);
          // 2.3. На селектор добавить класс сортировки по возрастанию (asc),
          // и удалить класс соритровки по убыванию, если такой уже установлен.
          $selector.removeClass(mixedClasses.desc).addClass(mixedClasses.asc);
        } else {
          // 3. Текущий переключатель не содержит активный класс,
          // и не содержит класс сортировки по возрастанию (asc).
          // 3.2. Со всех переключателей удалить активный класс,
          // но оставить класс направления сортировки.
          $elemGroup.removeClass(mixedClasses.active);
          // 3.1. Добавить на текущий переключатель
          // активный класс и класс соритровки по убыванию (desc, этот класс является приоритетнее).
          $curElemGroup.addClass(mixedClasses.active).addClass(mixedClasses.desc);
          // 3.3. На селекторе удалить класс сортировки по возрастанию (asc), если такой есть,
          // и добавить класс соритровки по убыванию.
          $selector.removeClass(mixedClasses.asc).addClass(mixedClasses.desc);
        }

        $element.trigger('msControlSort.changeTrend');

        // Добавить в селектор опшины с текущей группы
        changeSelector($curToggle);
      });

      $option.on('click', function (event) {
        // Если нужно параметр prevented имеет значение true,
        // то отключать нативное поведение ссылки переключателя
        if (config.prevented) {
          event.preventDefault();
        }

        var $curOption = $(this),
            $curElemGroup = $curOption.closest(config.elemGroup),
            trend = $curOption.data('cs-trend'),
            hasActiveClass = $curElemGroup.hasClass(pluginClasses.active) || $curElemGroup.hasClass(config.modifiers.activeClass);

        // Если текущая группа активна, то выполнее функции прекратить
        // if ($curElemGroup.hasClass(pluginClasses.active)) {
        //   return false;
        // }

        function toggleActiveClass() {
          // Со всех групп удалить активный класс
          $elemGroup.removeClass(mixedClasses.active);
          // На текущую группу добавить активный класс
          $curElemGroup.addClass(mixedClasses.active);
        }

        // Закрыть меню селекта
        closeSelect();

        switch (trend) {
          case 'desc':
            // Если текущий опшин активен, то выполнее функции прекратить
            if (hasActiveClass && $curElemGroup.hasClass(pluginClasses.desc)) {
              event.preventDefault();
              return false;
            }

            $curElemGroup.add($selector)
                .addClass(mixedClasses.desc)
                .removeClass(mixedClasses.asc);

            toggleActiveClass();
            // Добавить в селектор опшины с текущей группы
            changeSelector($curOption);

            break;

          case 'asc':
            // Если текущий опшин активен, то выполнее функции прекратить
            if (hasActiveClass && $curElemGroup.hasClass(pluginClasses.asc)) {
              event.preventDefault();
              return false;
            }

            $curElemGroup.add($selector)
                .addClass(mixedClasses.asc)
                .removeClass(mixedClasses.desc);

            toggleActiveClass();
            // Добавить в селектор опшины с текущей группы
            changeSelector($curOption);

            break;

          default:
            $elemGroup.add($selector)
                .removeClass(mixedClasses.active)
                .removeClass(mixedClasses.desc)
                .removeClass(mixedClasses.asc);

            // Добавить в селектор опшины с текущей группы
            changeSelector($curOption);

            break;
        }

        $element.trigger('msControlSort.changeTrend');
      });

    }, changeSelector = function ($_item) {
      // Добавить в селектор опшины с текущей группы
      var $selectorContent = $selector.children('span');
      $selectorContent.empty(); // Перед добавлением удалить старое содержимое
      $.each($_item.closest(config.elemGroup).find(config.optionElem), function (index, el) {
        var content = $(el).html(),
            attr = $(el).attr('data-cs-trend');
        $('<span data-cs-trend="' + attr + '">' + content + '</span>').appendTo($selectorContent);
      });

      $element.trigger('msControlSort.changeSelector');
    }, init = function () {
      $elemGroup.filter('.' + pluginClasses.active).addClass(mixedClasses.active);
      $elemGroup.filter('.' + config.modifiers.activeClass).addClass(mixedClasses.active);

      var $activeElemGroup = $elemGroup.filter('.' + pluginClasses.active);

      changeSelector($activeElemGroup);

      var hasClassDesc = $activeElemGroup.hasClass(pluginClasses.desc),
          hasClassAsc = $activeElemGroup.hasClass(pluginClasses.asc),
          hasClassDescCustom = $activeElemGroup.hasClass(config.modifiers.descendingClass),
          hasClassAscCustom = $activeElemGroup.hasClass(config.modifiers.ascendingClass);

      if (!hasClassDesc && !hasClassDescCustom && !hasClassAsc && !hasClassAscCustom) {
        $activeElemGroup.addClass(mixedClasses.desc);
        $selector.removeClass(mixedClasses.asc);
        $selector.addClass(mixedClasses.desc);
      }

      if (hasClassDesc || hasClassDescCustom) {
        $activeElemGroup.addClass(mixedClasses.desc);
        $selector.removeClass(mixedClasses.asc);
        $selector.addClass(mixedClasses.desc);
      }

      if (hasClassAsc || hasClassAscCustom) {
        $activeElemGroup.addClass(mixedClasses.asc);
        $selector.removeClass(mixedClasses.desc);
        $selector.addClass(mixedClasses.asc);
      }

      // После инициализации плагина добавить внутренний класс и,
      // если указан в опициях, пользовательский класс
      $element.addClass(mixedClasses.initialized);

      $element.trigger('msControlSort.afterInit');
    };

    self = {
      callbacks: callbacks,
      eventsSelect: eventsSelect,
      closeSelectByClickOutside: closeSelectByClickOutside,
      closeSelectByClickEsc: closeSelectByClickEsc,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.msControlSort = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].msControlSort = new MsControlSort(_[i], $.extend(true, {}, $.fn.msControlSort.defaultOptions, opt));
        _[i].msControlSort.init();
        _[i].msControlSort.callbacks();
        _[i].msControlSort.eventsSelect();
        _[i].msControlSort.closeSelectByClickOutside();
        _[i].msControlSort.closeSelectByClickEsc();
        _[i].msControlSort.events();
      } else {
        ret = _[i].msControlSort[opt].apply(_[i].msControlSort, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.msControlSort.defaultOptions = {
    selector: '.cs__selector-js',
    drop: '.cs__drop-js',
    elemGroup: '.cs__item-js',
    toggleElem: '.cs__toggle-js',
    optionElem: '.cs__option-js',
    closeByClickOutside: true, // Закрывать выпадающий список селекта по клику на "пустом" месте
    closeByClickEsc: true, // Закрывать выпадающий список селекта по клавише Esc
    prevented: false,
    modifiers: {
      initClass: null,
      activeClass: null,
      descendingClass: null,
      ascendingClass: null,
      openClass: null
    }
  };

})(jQuery);

function sortProducts() {
  var $controlSort = $('.cs-js');

  if ($controlSort.length) {
    $controlSort.msControlSort({
      // modifiers: {
      //   initClass: 'INIT',
      //   activeClass: 'SELECTED',
      //   descendingClass: 'BOTTOM',
      //   ascendingClass: 'TOP',
      //   openClass: 'OPEN'
      // }
    });
  }
}

/**
 * !Only number input
 * */
function onlyNumberInput() {
  // link: https://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery

  $("[data-only-number]").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
}

/**
 * !Spinner init
 */
function initSpinner ($_elem) {
  if($_elem.length){
    $.each($_elem, function () {
      var $curSpinner = $(this),
          minVal = +$curSpinner.attr('min') || 0,
          maxVal = +$curSpinner.attr('max') || null;

      $curSpinner.on( "spincreate spinstop", function( event ) {
        var $curElem = $(event.currentTarget),
            $curSpin = $curElem.closest('.ui-spinner');

        $curSpin.find('.ui-spinner-down').toggleClass('disabled', +$curElem.val() <= minVal);
        $curSpin.find('.ui-spinner-up').toggleClass('disabled', +$curElem.val() >= maxVal);
      } );

      $curSpinner.spinner({
        min: minVal,
        max: maxVal,
        disabled: $curSpinner.data('disabled') || false
      });
    });
  }

  // Проверка на ввод значения из доступного диапазона
  // Если значение больше или меньше доступных значений,
  // то подставлять максимальное или минимальное доступное значение, соответственно
  $('input[type="number"]').on('change keyup', function(event) {
    // Во время удаления введенного или существующего значения
    // с помощью клавишь DELETE или BACKSPACE проверку не делать
    if(event.keyCode === 8 || event.keyCode === 46) {
      return false;
    }
    var max = parseInt($(this).attr('max')),
        min = parseInt($(this).attr('min'));
    if ($(this).val() > max) {
      $(this).val(max);
    }
    else if ($(this).val() < min) {
      $(this).val(min);
    }
  })
}

/**
 * !Compare products remove item
 * */
function removeItemCompare() {
  var $btnRemove = $('.products-compare__remove-js');

  if ($btnRemove.length) {
    $btnRemove.on('click', function (e) {
      e.preventDefault();
      var $curRemoveBtn = $(this),
          curIndex = $curRemoveBtn.closest('td').index(),
          $curCompareContainer = $curRemoveBtn.closest('.products-compare-js'),
          $curCompareTable = $curRemoveBtn.closest('.products-compare__table-js'),
          $curItem = $curCompareTable.find('tr');

      $.each($curItem, function (index, element) {
        var $sameElem = $('td', $(element)).eq(curIndex);

        $sameElem.stop().animate({'opacity': 0}, 200, function () {
          $sameElem.detach();
          if ($('td', $(element)).length < 2) {
            $('.products-compare__empty-js', $curCompareContainer).show();
            $curCompareTable.hide();
          }
        })

      });
    })
  }
}

/**
 * !Quick cart remove item (temporary, test)
 * */
function removeItemQuickCart() {
  var $btnRemove = $('.quick-cart__item-remove-js');

  if ($btnRemove.length) {
    $btnRemove.on('click', function (e) {
      e.preventDefault();
      var $curItem = $(this).closest('.quick-cart__item-js');
      $curItem.stop().animate({'opacity': 0}, 200, function () {
        var $curCart = $curItem.closest('.quick-cart-js');
        $curItem.detach();
        if (!$curCart.find('.quick-cart__item-js').length) {
          $('.quick-cart__empty-js', $curCart).show();
          $('.quick-cart__btn-js', $curCart).addClass('disabled');
          $('.cart-keeper-js').addClass('disabled').find('.counter').hide();
          setTimeout(function () {
            $('.cart-keeper-js').switchClass('remove');
          }, 800);
        }
      })
    })
  }
}

/**
 * !Calculation price order
 */

function calcPriceOrder() {
  var $spin = $('.p-add-form__counter-js').find('input[type="number"]');

  if ($spin.length) {
    $spin.on('change keyup spinstop', function (event) {
      var $curSpin = $(this),
          $curForm = $curSpin.closest('.p-add-form-js');

      var total = +$curForm.find('.p-add-form-price-js').attr('data-price') * +$curSpin.val();
      total = parseFloat(total).toFixed(2);

      $curForm.find('.p-add-form-total-js').html(total).attr('data-total', +total);
    });

    $spin.trigger('change');
  }
}

/**
 * !Calculation cart
 */
function calcCart() {
  var $spin = $('.cart-item__counter-js').find('input[type="number"]');

  if ($spin.length) {
    $spin.on('change keyup spinstop', function (event) {
      var $curSpin = $(this),
          curLength = +$curSpin.val(),
          $item = $('.cart-item-js'),
          $curCart = $curSpin.closest('.cart-js'),
          $curItem = $curSpin.closest($item),
          $curSum = $curItem.find('.cart-item__sum-js'),
          totalLength = 0, totalPrice = 0;

      if (curLength > 1) {
        $curSum.parent().show();
      } else {
        $curSum.parent().hide();
      }

      var total = +$curItem.find('.cart-item__price-js').attr('data-price') * curLength;
      total = parseFloat(total).toFixed(2);

      $curSum.html(total).attr('data-total', +total);

      $.each($item, function (index, elem) {
        var val = +$(elem).find($spin).val();
        totalLength += val;
        totalPrice += +$(elem).find('.cart-item__sum-js').attr('data-total');
      });

      // total length
      $('.cart__total-length-js', $curCart).html(totalLength).attr('data-total-length', totalLength);

      // total price (without deli+very)
      var totalPriceFloat = parseFloat(totalPrice).toFixed(2);
      $('.cart__total-price-js', $curCart).html(totalPriceFloat).attr('data-total-price', totalPriceFloat);

      // total price (with delivery)
      var resultPrice = totalPrice + +$('.cart__delivery-js', $curCart).attr('data-deliver');
      var resultPriceFloat = parseFloat(resultPrice).toFixed(2);
      $('.cart__result-price-js', $curCart).html(resultPriceFloat).attr('data-total-price', resultPriceFloat);
    });

    $spin.trigger('change');
  }

  // remove item
  var $btnRemove = $('.cart-item__remove-js');

  if ($btnRemove.length) {
    $btnRemove.on('click', function (e) {
      e.preventDefault();
      var $curItem = $(this).closest('.cart-item-js');
      $curItem.stop().animate({'opacity': 0}, 200, function () {
        var $curCart = $curItem.closest('.cart-js');

        // remove item
        $curItem.detach();

        // recalculation cart
        $curCart.find('.cart-item__counter-js').find('input[type="number"]').trigger('change');

        // if cart has any items
        if (!$curCart.find('.cart-item-js').length) {
          $('.cart__empty-js', $curCart).show();
          $('.cart__list-js', $curCart).hide();
          $('.cart__summary-js ', $curCart).hide();
          $('.cart__button-js', $curCart).addClass('disabled');
          $('.cart__quick-order-js', $curCart).prop('disabled', true);
          $('.cart__promo-code-js', $curCart).prop('disabled', true);
        }
      })
    })
  }
}

/**
 * !Popups
 */
function popupsInit() {

  var $openPopupDef = $('.open-popup-def-js');
  $openPopupDef.fancybox({
    autoFocus: true,
    closeExisting: true,
    baseClass: "popup-def-wrap",
    selectable: true,
    // Internationalization
    // ====================

    lang: $('html').attr('lang'),
    i18n: {
      ru: {
        CLOSE: "Закрыть",
        NEXT: "Вперед",
        PREV: "Назад",
        ERROR: "Ошибка загрузки. <br/> Повторите запрос позднее.",
        PLAY_START: "Начать демонстрацию",
        PLAY_STOP: "Приостановить демонстрацию",
        FULL_SCREEN: "На полный экран",
        THUMBS: "Миниатюры",
        DOWNLOAD: "Скачать",
        SHARE: "Поделиться",
        ZOOM: "Увеличить"
      }
    }
  });
}

/**
 * !Reviews gallery
 */
function reviewsGallery() {
  $().fancybox({
    selector : '.u-review-gallery-js a:visible',
    infobar: true,
    buttons: [
      "zoom",
      //"share",
      // "slideShow",
      //"fullScreen",
      //"download",
      // "thumbs",
      "close"
    ]
  });
}

/**
 * !Reviews voting
 */
function reviewsVoting() {
  var $votingBtn = $('.u-review__voting-btn-js');

  $votingBtn.on('click', function () {
    var $thisBtn = $(this), activeClass = 'active',
        $thisCounter = $thisBtn.find('.u-review__voting-count-js');

    if ($thisBtn.hasClass(activeClass)) {
      $thisBtn.removeClass(activeClass);

      var curDecr = +$thisCounter.attr('data-count') - 1;
      $thisCounter.attr('data-count', curDecr);
      $thisCounter.html(curDecr);
    } else {
      var $siblActive = $thisBtn.parent().find($votingBtn).filter('.' + activeClass);

      if ($siblActive.length) {
        $siblActive.removeClass(activeClass);

        var $siblCounter = $siblActive.find('.u-review__voting-count-js'),
            siblDecr = +$siblCounter.attr('data-count') - 1;

        $siblCounter.attr('data-count', siblDecr);
        $siblCounter.html(siblDecr);
      }

      $thisBtn.addClass(activeClass);
      var curIncr = +$thisCounter.attr('data-count') + 1;
      $thisCounter.attr('data-count', curIncr);
      $thisCounter.html(curIncr);
    }
  })
}

/**
 * !Toggle new review
 */
function toggleNewReview() {
  var $toggleBtn = $('.add-new-review-js');

  $toggleBtn.on('click', function (e) {
    e.preventDefault();
    var $form = $('.u-review-form-js');
    $form.toggle();

    if ($form.is(':visible') && !$(this).is(':animated')) {
      $('html,body').stop().animate({scrollTop: $form.offset().top - $('.header').outerHeight() - 15}, 300);
    }
  })
}

/**
 * !Stars Rating
 */
function starsRating() {
  var $starsRating = $('.stars-rating-js');
  if ($starsRating.length) {
    $.each($starsRating, function () {
      $(this).barrating({
        theme: 'css-stars',
        initialRating: 3
      });
    });
  }
}

/**
 * !Truncate text
 */
function truncateText() {
  var $textSlide = $('#truncateText');

  if (!$textSlide.length) return false;

  var $window = $(window),
      textFull = 'Далее',
      textShort = 'Скрыть',
      $tplBtn = $('<div class="read-more" style="display: none;"><a href="#?" class="btn-read-more tt__switcher-js"><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#6E52DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>' + textFull + '</span></a></div>'),
      $tplTextSlideInner = $('<div class="tt__inner" />'),
      $tplShadow = $('<div class="tt__shadow" >'),
      textSlideHeight = $textSlide.outerHeight(),
      _textIsFull = false,
      truncateHeight = parseInt($textSlide.css('line-height'), 10) * 20,
      dur = 300;

  $textSlide.addClass('tt tt_initialize');

  // Build structure
  $textSlide
      .wrapInner($tplTextSlideInner)
      .after($tplBtn)
      .append($tplShadow);

  function prepare() {
    var wrapInnerHeight = $('.tt__inner').outerHeight();

    $textSlide.css('max-height', 'none');

    if (wrapInnerHeight <= truncateHeight) {
      $textSlide.css({'height': 'auto'});
      $tplShadow.css({'opacity': 0});
      $tplBtn.hide();
    } else if (!_textIsFull) {
      $textSlide.css({'height': truncateHeight});
      $tplShadow.css({'opacity': 1});
      $tplBtn.show();

      textSlideHeight = $textSlide.outerHeight();
    }
  }

  $window.on('load debouncedresizeByWidth', function () {
    prepare();
  });

  $textSlide.parent().on('click', '.tt__switcher-js', function (e) {
    e.preventDefault();

    var wrapInnerHeight = $('.tt__inner').outerHeight();

    if (wrapInnerHeight <= truncateHeight) return false;

    var $this = $(this);

    if (_textIsFull) {

      $tplShadow.animate({
        'opacity': 1
      }, dur);

      $textSlide.animate({
        'height': textSlideHeight
      }, dur, function() {

        $textSlide.trigger('heightHeightChange');
      });

      $this.removeClass('active').children('span').text(textFull);

      _textIsFull = false;
    } else {

      $textSlide.animate({
        'height': wrapInnerHeight
      }, dur, function() {
        $textSlide.css({height: 'auto'});

        $textSlide.trigger('afterTextTruncated');

        _textIsFull = true;
      });

      $tplShadow.animate({
        'opacity': 0
      }, dur);

      $this.addClass('active').children('span').text(textShort);
    }
  });
}

/**
 * !Truncate features
 */
function truncateFeatures() {
  var $textSlide = $('#jsTruncateFeatures');

  if (!$textSlide.length) return false;

  var $window = $(window),
      textFull = 'Показать',
      textShort = 'Скрыть',
      $tplBtn = $('<div class="truncate-feature__control" style="display: none;"><a href="#?" class="truncate-feature__btn truncate-feature__switcher-js" title="' + textFull + '"><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>' + textFull + '</span></a></div>'),
      $tplTextSlideInner = $('<div class="truncate-feature__inner" />'),
      $tplShadow = $('<div class="truncate-feature__shadow" >'),
      textSlideHeight = $textSlide.outerHeight(),
      _textIsFull = false,
      truncateHeight = (parseInt($textSlide.css('line-height'), 10) + 3) * 5,
      dur = 300;

  $textSlide.addClass('truncate-feature truncate-feature_initialize');

  // Build structure
  $textSlide
      .wrapInner($tplTextSlideInner)
      .append($tplShadow)
      .append($tplBtn);

  function prepare() {
    var wrapInnerHeight = $('.truncate-feature__inner').outerHeight();

    $textSlide.css('max-height', 'none');

    if (wrapInnerHeight <= truncateHeight) {
      $textSlide.css({'height': 'auto'});
      $tplShadow.css({'opacity': 0});
      $tplBtn.hide();
    } else if (!_textIsFull) {
      $textSlide.css({'height': truncateHeight});
      $tplShadow.css({'opacity': 1});
      $tplBtn.show();

      textSlideHeight = $textSlide.outerHeight();
    }
  }

  $window.on('load debouncedresizeByWidth', function () {
    prepare();
  });

  $textSlide.parent().on('click', '.truncate-feature__switcher-js', function (e) {
    e.preventDefault();

    var wrapInnerHeight = $('.truncate-feature__inner').outerHeight();

    if (wrapInnerHeight <= truncateHeight) return false;

    var $this = $(this);

    if (_textIsFull) {

      $tplShadow.animate({
        'opacity': 1
      }, dur);

      $textSlide.animate({
        'height': textSlideHeight
      }, dur, function() {

        $textSlide.trigger('heightHeightChange');
      });

      $this.removeClass('active').attr('title', textFull).children('span').text(textFull);

      _textIsFull = false;
    } else {

      $textSlide.animate({
        'height': wrapInnerHeight
      }, dur, function() {
        $textSlide.css({height: 'auto'});

        $textSlide.trigger('afterTextTruncated');

        _textIsFull = true;
      });

      $tplShadow.animate({
        'opacity': 0
      }, dur);

      $this.addClass('active').attr('title', textShort).children('span').text(textShort);
    }
  });
}

/**
 * !Toggle subscribe form
 * */
function toggleSubsFrom() {
  $('.btn-subs-js').on('click', function (e) {
    e.preventDefault();
    var $curBtn = $(this),
    $curContainer = $curBtn.closest('.subs-js');
    if ($curBtn.hasClass('active')) {
      $curBtn.add($curContainer).removeClass('active');
      $curContainer.find('.focus-field-js').blur();
    } else {
      $curBtn.add($curContainer).addClass('active');
      setTimeout(function () {
        $curContainer.find('.focus-field-js').focus();
      }, 50)
    }
  })
}

/**
 * Installment plan
 */
(function (window, $) {
  // If there's no jQuery, nav plugin can't work
  // ====================================================

  if (!$) return;

  // Inner Plugin Modifiers
  // ====================================================
  var CONST_MOD = {
    initClass: 'installment-js-initialized',
    dataDef: 'data-installment-default',
  };

  var Installment = function (element, config) {
    var self,
        $element = $(element),
        checks = [config.termCheckEl, config.initialFeeCheckEl];

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('installment.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        getPrice = function () {
          // Получить ЦЕНУ
          return +$(config.priceInput, $element).val() || 0;
        },
        getInstallmentRateVal = function () {
          // Получить ПРОЦЕНТ по рассрочке
          var val;

          $.each($(config.termCheckEl, $element), function (i, el) {
            var $ch = $(el);
            if ($ch.prop('checked')) {
              val = +$ch.attr('data-installment-rate');
              return false;
            }
          });

          return val || 1;
        },
        getValue = function (el) {
          var val;

          $.each($(el, $element), function (i, el) {
            var $ch = $(el);
            if ($ch.prop('checked')) {
              val = +$ch.val();
              return false;
            }
          });

          return val;
        },
        getTerm = function () {
          // Получить ПЕРИОД выплаты по рассрочке
          return getValue(config.termCheckEl);
        },
        getInitialFee = function () {
          // Получить размер ПЕРВОНАЧАЛЬНОГО ВЗНОСА
          // var result = +parseFloat((getPrice() + getInstallmentRateVal()) * getValue(config.initialFeeCheckEl) / 100).toFixed(2) || 0;
          var result = +parseFloat(getPrice() * (getValue(config.initialFeeCheckEl) / 100)).toFixed(2) || 0;
          return result;
        },
        getValPerMonth = function () {
          // Получить размер ЕЖЕМЕСЯЧНОГО ВЗНОСА
          // var result = getTerm() ? +parseFloat((+getPrice() + +getInstallmentRateVal() - +getInitialFee()) / +getTerm()).toFixed(2) : null;
          var result = getTerm() ? +parseFloat((getPrice() - getInitialFee()) * getInstallmentRateVal() / getTerm()).toFixed(2) : null;
          return result;
        },
        setInitialFee = function () {
          var initialFee = getInitialFee();
          $(config.resultInitialFeeEl, $element).html(initialFee + ' ' + config.priceUnit).attr('data-installment-initial-fee', initialFee);
        },
        setTerm = function () {
          var term = getTerm() || '--';
          $(config.resultTermEl, $element).html(term + ' ' + config.termUnit).attr('data-installment-term', term);
        },
        setValPerMonth = function () {
          var valPerMonth = getValPerMonth() || '--';
          $(config.resultValPerMonthEl, $element).html(valPerMonth + ' ' + config.priceUnit).attr('data-installment-per-month', valPerMonth);
        },
        enableTerms = function () {
          $.each($(config.initialFeeCheckEl, $element).filter(':checked'), function () {
            var $ch = $(this);
            var $termCheck = $(config.termCheckEl, $element);

            $termCheck.filter('[data-installment-enable]').prop('disabled', true);

            $.each($termCheck, function () {
              var $term = $(this);

              // Если значение атрибута равно или больше размеру ПЕРВОНАЧАЛЬНОГО взноса,
              // то активировать соответствующие кнопки ПЕРИОДА рассрочки
              if ($term.attr('data-installment-enable') <= $ch.val()) {
                $term.prop('disabled', false);
              }

              // Если отмеченная кнопка оказывается заблокированной,
              // то с нее чеккед нужно перенести на последнюю активну кнопку ПЕРИОДА рассрочки
              if ($term.is(':checked:disabled')) {
                $term.prop('checked', false);
                $termCheck.not(':disabled').last().prop('checked', true);
              }
            });
          });
        },
        setFinPrice = function () {
          var finPrice = +parseFloat(getValPerMonth() * getTerm() + getInitialFee() || getPrice()).toFixed(2);
          $(config.finPriceInput, $element).val(finPrice);
        },
        setResults = function () {
          // Включить доступные ПЕРИОДЫ выплаты
          enableTerms();

          // Установить размер ПЕРВОНАЧАЛЬНОГО ВЗНОСА
          setInitialFee();

          // Установить ПЕРИОД выплаты по рассрочке
          setTerm();

          // Установить размер ЕЖЕМЕСЯЧНОГО ВЗНОСА
          setValPerMonth();

          // Финальная цена по кредиту
          setFinPrice()

          // console.log("Получить ЦЕНУ: ", getPrice());
          // console.log("Получить ПРОЦЕНТ по рассрочке: ", getInstallmentRateVal());
          // console.log("Получить ПЕРИОД выплаты по рассрочке: ", getTerm());
          // console.log("Получить размер ПЕРВОНАЧАЛЬНОГО ВЗНОСА: ", getInitialFee());
          // console.log("Получить размер ЕЖЕМЕСЯЧНОГО ВЗНОСА: ", getValPerMonth());
          //
          // console.log("Сумма, от которой считается кредит: ", getPrice() - getInitialFee() || getPrice());
          // console.log("Стоимость товара: ", +parseFloat(getValPerMonth() * getTerm() + getInitialFee() || getPrice()).toFixed(2));
          // console.log("Стоимость товара (проверка): ", +parseFloat((getPrice() - getInitialFee()) * getInstallmentRateVal() + getInitialFee() || getPrice()).toFixed(2));
          // console.log('========================================');
        },
        events = function () {
          $element.on('change', checks, function (event) {
            setResults();

            event.preventDefault();
          });

          $(config.resetEl).closest('form').on('reset', function () {
            setTimeout(function () {
              setResults();
            }, 1)
          });

          $(window).on('load', function () {
            setResults();
          });

          $element.on('recalc', function () {
            setResults();
          })
        },
        init = function () {
          $element.addClass(CONST_MOD.initClass);
          $element.trigger('installment.afterInit');
        };

    self = {
      callbacks: callbacks,
      events: events,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.installment.callbacks();
    el.installment.init();
    el.installment.events();
  }

  $.fn.installment = function () {
    var self = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    // Обойти все выбранные элементы по отдельности
    // и создань инстансы для каждого из них.
    // Косвенно for предохраняет от попытки
    // создания экземпляра объекта на несуществующем элементе,
    // так как l в таком случае будет равно 0, переменная i также равна 0,
    // следовательно условие i < l не выполнится
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        self[i].installment = new Installment(self[i], $.extend(true, {}, $.fn.installment.defaultOptions, opt));
        _run(self[i]);
      } else {
        ret = self[i].installment[opt].apply(self[i].installment, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.installment.defaultOptions = {
    // param: 'input:radio',
    priceInput: '.installment-price-js',
    finPriceInput: '.installment-fin-price-js',
    termCheckEl: '.installment-term-check-js',
    initialFeeCheckEl: '.installment-fee-check-js',
    resetEl: '.installment-reset-js',
    resultInitialFeeEl: '.installment-result-fee-js',
    resultValPerMonthEl: '.installment-result-val-js',
    resultTermEl: '.installment-result-term-js',
    priceUnit: 'руб.',
    termUnit: 'мес.'
  };

})(window, jQuery);

function instalmentPlan() {
  var $installment = $('.installment-js');
  if ($installment.length) {
    $installment.installment();

    // todo Delete after testing
    $('.installment-price-js, .installment-rate-js').on('keyup', function () {
      $installment.trigger('recalc');
    })
  }
}

/**
 * Datepicker (flatpickr)
 */
function datepickerInit() {
  $(".js-datepicker").flatpickr({
    // 'locale': 'ru'
  });
}

/**
 * Letter-icon for mobile in catalog headings
 */
function letterIcon() {
  var $item = $('.categories__inner');

  if ($item.length) {
    $.each($item, function () {
      var $curItem = $(this);
      var firstLetter = $curItem.children('span').text().charAt(0).toUpperCase();
      var $letter = $('<div class="categories__inner-mob-icon">'+ firstLetter +'</div>');
      $curItem.prepend($letter);
    });
  }
}

/**
 * !Scroll to anchor
 */
function scrollToAnchor() {
  $('body').on('click', '.js-scroll-to-anchor', function (e) {
    e.preventDefault();
    var $doc = $('html,body');
    var $this = $(this);
    if (!$doc.is(':animated')) {
      $('html, body').stop().animate({scrollTop: $($this.attr('href')).offset().top - $('.header').outerHeight() - 15}, 300);
    }
  });
}

/**
 * !Rulik bubble
 */
function rulikBubble() {
  var $rulikBubbleEl = $('.js-rulik-bubble');
  var delay = 6000;
  if ($rulikBubbleEl.length) {
    $.each($rulikBubbleEl, function () {
      var $el = $(this);
      var content = $el.attr('data-bubble')
      $el.tooltipster({
        content: content,
        animation: 'tada',
        functionAfter: function(instance) {
          instance.destroy();
        },
        theme: ['tooltipster-rulik']
      });
    })
  }

  function toggleBubble(box) {
    $(box).tooltipster('open');
    setTimeout(function () {
      if ($(box).hasClass('tooltipstered')) {
        $(box).tooltipster('close');
      }
    }, delay);
  }

  new WOW(
      {
        boxClass: 'js-rulik-bubble',
        animateClass: 'show-tooltip',
        offset: 0,
        callback: function (box) {
          var $tab = $(box).closest('[class*="tabs"]');
          if ($tab.length && $tab.hasClass('tabs-active') ) {
            toggleBubble(box);
          } else if (!$tab.length) {
            toggleBubble(box);
          }
        },
      }
  ).init();
}

/**
 * !Product flip
 */
function productFlip() {
  var $body = $('body');
  var $html = $('html');
  var flipProduct = '.js-flip-product';
  var $flipProduct = $(flipProduct);
  var rulikBubbleEl = '.js-rulik-bubble';

  // setTimeout(function () {
  //   $flipProduct.first($flipProduct).parent().clone().insertAfter($flipProduct.first($flipProduct).parent());
  //   rulikBubble();
  // }, 2000)

  $body.on('mouseenter', flipProduct, function () {
    var $curEl = $(this);

    $curEl.addClass('active');
    var $rBub = $curEl.find(rulikBubbleEl);
    if ($rBub.hasClass('tooltipstered')) {
      $rBub.tooltipster('close');
    }
  }).on('mouseleave', flipProduct, function () {
    var $curEl = $(this);

    $curEl.removeClass('active');
  })

  $body.on('click', '.js-flip-btn', function (e) {
    e.preventDefault();

    var $curBtn = $(this);
    var $curEl = $curBtn.closest(flipProduct);

    if ($curBtn.hasClass('js-rulik-bubble') && $curBtn.hasClass('tooltipstered')) {
      $curBtn.tooltipster('close');
    }

    if ($curEl.hasClass('active')) {
      $curEl.removeClass('active');
    } else {
      $curEl.addClass('active');
    }
  })

  $html.on('click', function (event) {
    if (!$(event.target).closest(flipProduct).length) {
      $flipProduct.removeClass('active');
    }
  });

  $html.keyup(function (event) {
    if (event.keyCode === 27) {
      $flipProduct.removeClass('active');
    }
  });
}


/**
 * !Form validation
 * */
function formValidation() {
  $.validator.setDefaults({
    submitHandler: function(form) {
      // alert('Форма находится в тестовом режиме. Чтобы закрыть окно, нажмите ОК.');
      // Subscribe form feedback for example
      var $form = $(form);
      if($form.hasClass('subs-form')) {
        setTimeout(function () {
          $('.btn-subs-js').switchClass('remove');
          $form.closest('.subs-js').addClass('completed');
        }, 50);
      }
      // return false;
    }
  });

  var $form = $('.validate-js');

  if ($form.length) {
    var changeClasses = function (elem, remove, add) {
      elem
          .removeClass(remove).addClass(add);
      elem
          .closest('form').find('label[for="' + elem.attr('id') + '"]')
          .removeClass(remove).addClass(add);
      elem
          .closest('.input-wrap')
          .removeClass(remove).addClass(add);
    };

    $.each($form, function (index, element) {
      $(element).validate({
        errorClass: "error",
        validClass: "success",
        errorElement: false,
        errorPlacement: function (error, element) {
          return true;
        },
        highlight: function (element, errorClass, successClass) {
          changeClasses($(element), successClass, errorClass);
        },
        unhighlight: function (element, errorClass, successClass) {
          changeClasses($(element), errorClass, successClass);
        }
      });
    });
  }
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
  rulikBubble();
})

$(document).ready(function () {
  if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touch";
  } else {
    document.documentElement.className += " touch";
  }
  // $('html').addClass('document-ready');
  // showOnScroll();
  objectFitImages(); // object-fit-images initial
  preloadOtherImages();
  placeholderInit();
  navExpander();
  initTooltip();
  initCustomScrollBar();
  detectScroll();
  equalHeight();
  inputFileSimple();
  inputFocusClass();
  inputHasValueClass();
  customSelect();
  // bannersSiblings();
  slidersInit();
  gridLayout();
  tabs();
  toggleDrop();
  changeState();
  addToCarAnimation();
  rollsInit();
  toggleViewInit();
  multiFiltersInit();
  sortProducts();
  initSpinner($('.spinner-js'));
  onlyNumberInput();
  removeItemCompare();
  removeItemQuickCart();
  calcPriceOrder();
  calcCart();
  popupsInit();
  reviewsGallery();
  reviewsVoting();
  toggleNewReview();
  starsRating();
  truncateText();
  truncateFeatures();
  instalmentPlan();
  datepickerInit();
  formValidation();
  letterIcon();
  scrollToAnchor();
  productFlip();

  /**
   * For example. Remove after programming a search form
   */
  function tempShowSearchFastResult() {
    var $elem = $('.search-form__input');

    if ($elem.length) {
      var timeout;

      function toggleStateClass(cond) {
        var $jsSearchFastResult = $('.js-search-fast-result');
        var $searchForm = $(this).closest('.search-form');

        $searchForm.toggleClass('loading', cond);

        clearTimeout(timeout);

        timeout = setTimeout(function () {
          $searchForm.removeClass('loading');

          $('html').toggleClass('css-scroll-fixed', cond);
          $jsSearchFastResult.toggleClass('s-result_show', cond);
        }, 2000);
      }

      $elem.on('keyup change', function () {
        toggleStateClass.call(this, $(this).val().length > 1);
      });
    }
  }

  tempShowSearchFastResult();
});