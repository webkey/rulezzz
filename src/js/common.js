/**
 * !Resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).on('debouncedresize', function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !Detected touchscreen devices
 * */
var TOUCH = Modernizr.touchevents;
var DESKTOP = !TOUCH;

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Show print page by click on the button
 * */
function printShow() {
  $('.view-print').on('click', function (e) {
    e.preventDefault();
    window.print();
  })
}

/**
 * !Equal height of blocks by maximum height of them
 */
function equalHeight() {
  // equal height of elements
  var $equalHeight = $('.equal-height-js');

  if($equalHeight.length) {
    $equalHeight.children().matchHeight({
      byRow: true, property: 'height', target: null, remove: false
    });
  }
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
  var $nav = $('.nav');

  if ($nav.length) {
    var label = $nav.attr('data-btn-more') || 'More...';

    var navigation = $nav.okayNav({
      // align_right: true
      // toggle_icon_content: '<span /><span /><span />'
      toggle_icon_content: '<span>' + label + '</span><i>&nbsp;</i>'
    });

    if (navigation.length) {
      $nav.addClass('ready');
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
 * !Detect scroll page
 */
function detectScroll() {
  // external js:
  // 1) resizeByWidth (resize only width);

  var $page = $('html'),
      // $fixedElement = $('.main-nav'),
      // var minScrollTop = $fixedElement.offset().top,
      minScrollTop = 100,
      currentScrollTop = $(window).scrollTop();

  $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));

  $(window).on('load resizeByWidth scroll', function () {

    // minScrollTop = $fixedElement.offset().top;
    currentScrollTop = $(window).scrollTop();
    $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));
  })
}

/**
 * !Toggle class on a form elements on focus
 * */
function inputFocusClass() {
  var $inputs = $('.field-js');

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
  var $inputs = $('.field-js');

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
function customSelect(select) {
  $.each(select, function () {
    var $thisSelect = $(this);
    // var placeholder = $thisSelect.attr('data-placeholder') || '';
    $thisSelect.select2({
      language: "ru",
      width: '100%',
      containerCssClass: 'cselect-head',
      dropdownCssClass: 'cselect-drop'
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

  /**images gallery*/
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
    $promoSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $('.slider-arrow_next-js', $thisSlider),
          $thisBtnPrev = $('.slider-arrow_prev-js', $thisSlider),
          $thisPag = $('.swiper-pagination', $thisSlider);
      var promoSliderJs;

      promoSliderJs = new Swiper($thisSlider, {
        init: false,

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

        breakpoints: {
          768: {
            parallax: false
          }
        },

        // Events
        on: {
          slideChange: function (e) {
            // changeBgColor(promoSliderJs.activeIndex);
          }
        }
      });

      promoSliderJs.on('init', function() {
        $(promoSliderJs.el).closest($thisSlider).addClass('is-loaded');
        // changeBgColor(promoSliderJs.activeIndex);
      });

      promoSliderJs.init();

      function changeBgColor(index) {
        var bgColor = $(promoSliderJs.slides).eq(index).css('background-color');
        $('.header-bg').css('background-color', bgColor);
      }
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

  /**tape slider*/
  var $cartSimilarSlider = $('.cart-similar-slider-js');
  if ($cartSimilarSlider.length) {
    $cartSimilarSlider.each(function () {
      var $thisSlider = $(this),
          $thisBtnNext = $('.cart-similar-slider__next-js', $thisSlider),
          $thisBtnPrev = $('.cart-similar-slider__prev-js', $thisSlider),
          cartSimilarSliderInited;

      cartSimilarSliderInited = new Swiper($thisSlider, {
        init: false,
        loop: false,
        keyboardControl: true,
        slidesPerView: 5,
        spaceBetween: 10,

        // Navigation arrows
        navigation: {
          nextEl: $thisBtnNext,
          prevEl: $thisBtnPrev,
        }
      });

      cartSimilarSliderInited.on('init', function() {
        $(cartSimilarSliderInited.slides).matchHeight({
          byRow: true, property: 'height', target: null, remove: false
        });
        $(cartSimilarSliderInited.el).closest($thisSlider).addClass('is-loaded');
      });

      cartSimilarSliderInited.init();
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
 * Version: 2019.1.0
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
        isAnimated = false,
        activeId,
        isOpen = false,
        collapsed = $element.data('tabs-collapsed') || config.collapsed;

    var callbacks = function () {
      /** track events */
      $.each(config, function (key, value) {
        if (typeof value === 'function') {
          $element.on('msTabs.' + key, function (e, param) {
            return value(e, $element, param);
          });
        }
      });
    }, show = function () {
      // Определяем текущий таб
      var $activePanel = $panel.filter('[id="' + activeId + '"]'),
          $otherPanel = $panel.not('[id="' + activeId + '"]'),
          $activeAnchor = $anchor.filter('[href="#' + activeId + '"]');

      if (!isAnimated) {
        // console.log('Показать таб:', activeId);
        isAnimated = true;

        // Удалить активный класс со всех элементов
        $panel.add($anchor).removeClass(config.modifiers.activeClass);

        // Добавить класс на каждый активный элемент
        $activePanel.add($activeAnchor).addClass(config.modifiers.activeClass);

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
              $activePanel.css({
                'position': 'relative',
                'left': 'auto',
                'top': 'auto',
                'pointer-events': ''
              }).attr('tabindex', 0);

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
      $element.trigger('msTabs.afterShowed');
    }, hide = function () {
      // Определить текущий таб
      var $activePanel = $panel.filter('[id="' + activeId + '"]');

      if (!isAnimated) {
        // console.log("Скрыть таб: ", activeId);

        isAnimated = true;

        // Удалить активный класс со всех элементов
        $panel.add($anchor).removeClass(config.modifiers.activeClass);

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
      $element.trigger('msTabs.afterHidden');
    }, hideTab = function (tab) {
      var callback = arguments[1];
      tab
          .css({
            'z-index': -1
          })
          .attr('tabindex', -1)
          .animate({
            'opacity': 0
          }, config.animationSpeed, function () {
            tab.css({
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
        // console.log("Таб анимируется?: ", isAnimated);
        // console.log("Текущий таб открыт?: ", isOpen);
        // console.log("Таб нужно закрывать, если открыт?: ", collapsed);
        // console.log("activeId (Предыдущий): ", activeId);

        if (isAnimated || !collapsed && curId === activeId) {
          return false;
        }

        if (collapsed && isOpen && curId === activeId) {
          hide();
        } else {
          activeId = curId;
          // console.log("activeId (Текущий): ", activeId);
          show();
        }
      });
    }, init = function () {
      activeId = $anchor.filter('.' + config.modifiers.activeClass).length && $anchor.filter('.' + config.modifiers.activeClass).attr('href').substring(1);

      // console.log("activeId (сразу после инициализации): ", !!activeId);

      $panels.css({
        'display': 'block',
        'position': 'relative'
      });

      $panel.css({
        'position': 'absolute',
        'left': 0,
        'top': 0,
        'opacity': 0,
        'width': '100%',
        'visibility': 'hidden',
        'pointer-events': 'none',
        'z-index': -1
      }).attr('tabindex', -1);

      if (activeId) {
        var $activePanel = $panel.filter('[id="' + activeId + '"]');

        // Добавить класс на каждый элемен
        $activePanel.addClass(config.modifiers.activeClass);

        // Показать активный таб
        $activePanel
            .css({
              'position': 'relative',
              'left': 'auto',
              'top': 'auto',
              'opacity': 1,
              'visibility': 'visible',
              'pointer-events': '',
              'z-index': 2
            })
            .attr('tabindex', 0);

        isOpen = true;
      }

      $element.addClass(config.modifiers.init);

      $element.trigger('msTabs.afterInit');
    };

    self = {
      callbacks: callbacks,
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
    collapsed: false,
    modifiers: {
      init: 'tabs-initialized',
      activeClass: 'tabs-active'
    }
  };

})(jQuery);

/**
 * !Tabs
 */
function tabs() {
  var $tabs = $('.tabs-js');
  if ($tabs.length) {
    var $tabsPanels = $('.tabs__panels-js');
    $tabs.msTabs({
      anchor: $('.tabs__thumbs-js').find('a'),
      panels: $tabsPanels,
      panel: $tabsPanels.children(),
      modifiers: {
        init: 'tabs-initialized',
        activeClass: 'tabs-active'
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
      modifiers: {
        init: 'tabs-nested-initialized',
        activeClass: 'tabs-active'
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
 * !Toggle shutters panel, like a search panel, a catalog shutter etc.
 */
function toggleShutters() {
  // Toggle contacts in header
  var $hContactsSwitcher = $('.h-contacts__opener-js'),
      hContactsDropJs;
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
  var $catalogSwitcher = $('.catalog-opener-js'), catalogShutterJs;
  if ($catalogSwitcher.length) {
    catalogShutterJs = $catalogSwitcher.switchClass({
      switchClassTo: $('.catalog-shutter-js').add('.catalog-overlay-js').add('body')
      , modifiers: {
        activeClass: 'catalog-is-open'
      }
      , cssScrollFixed: false
    });
  }

  // Toggle a filters shutter
  var $filtersSwitcher = $('.btn-filters-js'), filtersShutterJs;
  if ($filtersSwitcher.length) {
    filtersShutterJs = $filtersSwitcher.switchClass({
      switchClassTo: $('.shutter--filters-js').add('.p-filters-results-js')
      , modifiers: {
        activeClass: 'active'
      }
      , cssScrollFixed: false
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

  function searchPopupRemoveClass() {
    searchPanelJs && searchPanelJs.switchClass('remove');
  }

  // Вызывать метод удаления классов другими
  if (hContactsDropJs) {
    hContactsDropJs.on('switchClass.beforeAdded', function () {
      searchPopupRemoveClass();
      catalogShutterRemoveClass();
      filtersShutterRemoveClass();
      addFormPopupRemoveClass();
    });
  }

  if (searchPanelJs) {
    searchPanelJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      catalogShutterRemoveClass();
      filtersShutterRemoveClass();
      addFormPopupRemoveClass();
    });
  }

  if (catalogShutterJs) {
    catalogShutterJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      addFormPopupRemoveClass();
    });
  }

  if (filtersShutterJs) {
    filtersShutterJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      catalogShutterRemoveClass();
      addFormPopupRemoveClass();
    });
  }

  if (addFormPopupJs) {
    addFormPopupJs.on('switchClass.beforeAdded', function () {
      hContactsSwitcherRemoveClass();
      searchPopupRemoveClass();
      filtersShutterRemoveClass();
      catalogShutterRemoveClass();
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

    var $cutBtn = $(this),
        countLength = +$cartCounter.text();

    $cartKeeper.removeClass(pushClass).removeClass(pickClass);

    if (!$cutBtn.hasClass(addedClass)) {
      // Change a button
      $cutBtn.addClass(addedClass);

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
      $cutBtn.removeClass(addedClass);

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
              console.log(1);
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

          $panel.wrap($panelWrap);

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
    $defautlRolls.msRolls()
  }

  /** Catalog links */
  var $catalogLinks = $('.catalog-links-js');

  if ($catalogLinks.length) {
    $catalogLinks.msRolls({
      item: 'li',
      header: 'li > em',
      hand: 'li > em',
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
      switcher: 'data-toggle-view-switcher',
      panel: 'data-toggle-view-panels'
    };

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

    var activeAnchor = self.anchor.filter('.' + self.config.activeClass),
        mod = activeAnchor.attr('data-mod');

    var id = activeAnchor.closest(self.element).attr(self.data.switcher);
    // Add modifier to a panel
    $('[' + self.data.panel + '="' + id + '"]').attr('data-view', mod);
    // Add modifier to a switcher
    $(self.element).attr('data-view', mod);

    self.element.addClass(self.config.initClass);
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
        $.fn.matchHeight._update()
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
      filter: null, // checkbox => filter: checkbox, select or range slider
      labelText: null,
      btnReset: null,
      btnResetAll: null,
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

      dataGroup: 'data-filter-group',
      dataDefaultValue: 'data-filter-default',
      dataSelect: 'data-filter-select', // добавлять этот атрибут, если можно выбирать из нескольких вариантов, например select или slider
      dataTag: 'data-filter-tag',
      dataName: 'data-filter-name',
      dataType: 'data-filter-type',
      dataPrefix: 'data-filter-value-prefix',
      dataPostfix: 'data-filter-value-postfix'
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
    this.tagsItemTpl = !options.tagsItemTpl ?
        '<div class="' + options.tagsItem.substring(1) + '"><i>Удалить</i><span class="' + options.tagTextContainer.substring(1) + '"></span></div>' :
        options.tagsItemTpl ;

    this.modifiers = {
      dropIsOpened: options.dropOpenClass,
      filtersOn: options.filtersOnClass,
      showResultsPanel: options.showResultsPanelClass,
      showSelected: options.showSelectedClass,
      showPlaceholder: options.showPlaceholderClass,
      filterActive: options.filterActiveClass,
    };

    this.attributes = {
      dataGroup: options.dataGroup,
      dataDefaultValue: options.dataDefaultValue,
      dataSelect: options.dataSelect,
      dataTag: options.dataTag,
      dataName: options.dataName,
      dataType: options.dataType,
      dataPrefix: options.dataPrefix,
      dataPostfix: options.dataPostfix
    };

    this.changeFilters();
    this.bindTagsEvents();
    this.toggleDrop();
    this.resetFiltersInGroup();
    this.resetAllFilters();
    // this.initRangeSlider();

  };

  // MultiFilters.prototype.dropIsOpened = false;

  MultiFilters.prototype.initRangeSlider = function () {
    var self = this,
        $rangeSlider = $(".range-slider-js"),
        $rangeSliderValue = $('.range-slider-value-js');

    self.priceSlider = {};

    $.each($rangeSlider, function (i, el) {
      var $curSlider = $(this),
          $curSliderValue = $curSlider.closest('li').find($rangeSliderValue);

      $curSlider.ionRangeSlider({
        onStart: function (data) {
          getValue(data, $curSliderValue)
        },
        onChange: function (data) {
          getValue(data, $curSliderValue);
        }
      });

      self.priceSlider[i] = $curSlider.data('ionRangeSlider');
    });

    function getValue(data, $elem) {
      var from = data.from, to = data.to;

      if (data.input.attr('data-type') === "double") {
        $elem.html(from + " - " + to);
      } else {
        $elem.html(from);
      }
    }
  };

  MultiFilters.prototype.changeFilters = function () {
    var self = this;

    self.$container.on('change', self.options.filter, function () {
      var $curFilter = $(this);
      var $curContainer = $curFilter.closest(self.$container);
      var $curItem = $curFilter.closest(self.$item);
      var $curGroup = $curFilter.closest(self.$group);
      // label text for tag
      var $curLabel = $curFilter.closest('label');
      var $curLabelText = $curLabel.find(self.$labelText);
      // buttons
      var $curBtnReset = $curItem.find(self.$btnReset);
      var $curBtnResetAll = $curContainer.find(self.$btnResetAll);

      // на li добвить класс, если чекбокс отмечен
      $curFilter.is(':checkbox') &&
      $curFilter.closest('li').toggleClass(self.modifiers.filterActive, self.getFilterState($curFilter));

      // отключить кнопку очистки чекбоксов в ГРУППЕ
      self.disabledButton($curBtnReset);

      // удалить класс наличия отмеченных чекбоксов в ГРУППЕ
      self.removeClassCustom($curItem, self.modifiers.filtersOn);

      // отключить кнопку очистки ВСЕХ чекбоксов
      self.disabledButton($curBtnResetAll);

      // удалить класс отображения панели результатов фильтрации
      $curContainer.removeClass(self.modifiers.showResultsPanel);

      // если есть активные фильтры в ГРУППЕ
      if (self.countActivateFilters($curFilter, $curGroup)) {
        // включить кнопку очистки чекбоксов в ГРУППЕ
        self.enabledButton($curBtnReset);
        // добавить класс наличия отмеченных чекбоксов на фильтры в ГРУППЕ
        self.addClassCustom($curItem, self.modifiers.filtersOn);
      }

      // если есть активные фильтры
      // (проверяем ВСЕ группы фильтров)
      if (self.countActivateFilters($curContainer.find(self.$filter), $curContainer.find(self.$group))) {
        // включить кнопку очистки ВСЕХ чекбоксов
        self.enabledButton($curBtnResetAll);
        // добавить класс отображения панели результатов фильтрации
        $curContainer.addClass(self.modifiers.showResultsPanel);
      }

      // определить количество отмеченных фильтров в ГРУППЕ
      // изменить значение в соответствующем элементе DOM
      self.setLengthActiveFilters($curFilter, $curGroup);

      // определить количество ГРУПП, в которых есть отмеченные фильтры
      // изменить значение в соответствующий элемент DOM
      var activeGroupLength = $curContainer.find('.' + self.modifiers.filtersOn).length;
      $curContainer.find(self.$activatedFilters).html(activeGroupLength).toggleClass('hide', !activeGroupLength);

      // attributes
      var curAttrGroup = $curGroup.attr(self.attributes.dataGroup);
      var curAttrSelect = $curFilter.attr(self.attributes.dataSelect);
      var curAttrName = $curFilter.attr(self.attributes.dataName) || $('option:selected', $curFilter).attr(self.attributes.dataName);
      var curAttrTag = $curFilter.attr(self.attributes.dataTag) || $('option:selected', $curFilter).attr(self.attributes.dataTag);

      var dataGroup = "[" + self.attributes.dataGroup + "=" + curAttrGroup + "]",
          dataName = "[" + self.attributes.dataName + "=" + curAttrName + "]",
          dataSelect = "[" + self.attributes.dataSelect + "=" + curAttrSelect + "]";

      // добавить/удалить тэг
      if(self.getFilterState($curFilter)) {
        // добавить тэг фильтра
        var textInsideTag = curAttrTag || $curLabelText.text() || curAttrName;
        var $tagClone = $(self.tagsItemTpl).clone()
            .find(self.tagTextContainer)
            .html(textInsideTag)
            .end()
            .attr(self.attributes.dataGroup, curAttrGroup)
            .attr(self.attributes.dataName, curAttrName);

        switch (true) {
          case $curFilter.is(':checkbox'):
            $tagClone.appendTo($curContainer.find(self.$tagsContainer));
            break;

          case $curFilter.attr(self.attributes.dataType) === 'range-slider':
            $curContainer.find(self.tagsItem).filter(dataSelect).remove();
            var val = $curFilter.val().split(';');
            $(self.tagsItemTpl).clone()
                .find(self.tagTextContainer)
                .html(val[0] + " - " + val[1])
                .end()
                .attr(self.attributes.dataGroup, curAttrGroup)
                .attr(self.attributes.dataName, curAttrName)
                .attr(self.attributes.dataSelect, curAttrSelect)
                .appendTo($curContainer.find(self.$tagsContainer));

            break;

          default:
            $curContainer.find(self.tagsItem).filter(dataSelect).remove();
            $tagClone
                .attr(self.attributes.dataSelect, curAttrSelect)
                .appendTo($curContainer.find(self.$tagsContainer));
        }
      } else {
        // удалить тэг
        if($curFilter.is(':checkbox')) {
          $curContainer.find(self.tagsItem).filter(dataGroup + dataName).remove();
        } else {
          $curContainer.find(self.tagsItem).filter(dataSelect).remove();
        }
      }
    });

    $.each(self.$filter, function () {
      var $thisFilter = $(this);
      self.getFilterState($thisFilter) && $thisFilter.trigger('change');
    });

    // self.$filter.filter(':checked').trigger('change');
  };

  MultiFilters.prototype.setLengthActiveFilters = function ($filter, $container) {
    var self = this;
    var $curItem = $container.closest(self.$item);

    var lengthChecked = self.countActivateFilters($filter, $container);

    $curItem.find(self.$placeholder).toggleClass(self.modifiers.showPlaceholder, !lengthChecked > 0);
    $curItem.find(self.$selected).toggleClass(self.modifiers.showSelected, lengthChecked > 0);

    var textPrefix = $curItem.find(self.$selected).attr(self.attributes.dataPrefix) || "",
        textPostfix = $curItem.find(self.$selected).attr(self.attributes.dataPostfix) || "";

    $curItem.find(self.$selected).html(textPrefix + " " + lengthChecked + " " + textPostfix);
  };

  // MultiFilters.prototype.checkPropAll = function ($filter, $container) {
  // 	// если отмеченны ВСЕ фильтры в группе, возвращает true, иначе false
  //
  // 	return $container.find(':checkbox').length === this.countActivateFilters($filter, $container);
  // };

  MultiFilters.prototype.countActivateFilters = function ($filter, $container) {
    // возвращает количество отмеченных (активных) фильтров
    var self = this;

    var $curFilters = $filter.closest($container).find(self.$filter),
        lengthActivateFilters = 0;

    $.each($curFilters, function () {
      var $thisFilter = $(this);
      self.getFilterState($thisFilter) && lengthActivateFilters++
    });

    return lengthActivateFilters;

    // if only checkbox
    // return $container.find('input:checkbox:checked').length;
  };

  MultiFilters.prototype.bindTagsEvents = function () {
    var self = this;

    self.$container.on('click', self.tagsItem, function (e) {
      var $curTag = $(this);
      var dataGroup = "[" + self.attributes.dataGroup + "=" + $curTag.attr(self.attributes.dataGroup) + "]",
          dataName = "[" + self.attributes.dataName + "=" + $curTag.attr(self.attributes.dataName) + "]";
      var $curFiltersGroup = $curTag.closest(self.$container).find(self.$group).filter(dataGroup);

      // отключить соответствующий фильтр
      if($curTag.attr(self.attributes.dataSelect)){
        var dataSelect = "[" + self.attributes.dataSelect + "=" + $curTag.attr(self.attributes.dataSelect) + "]";

        $curFiltersGroup
            .find(dataSelect)
            .prop('selectedIndex', 0)
            .trigger('change');

        var priceSliderObj = self.priceSlider,
            key;

        for (key in priceSliderObj) {
          priceSliderObj[key].reset();
        }
      } else {
        $curFiltersGroup
            .find(dataName)
            .prop('checked', false)
            .trigger('change');
      }

      e.preventDefault();
    });
  };

  MultiFilters.prototype.resetFiltersInGroup = function () {
    var self = this;

    self.$btnReset.on('click', function (e) {
      var $currentBtn = $(this);

      self.resetFilters($currentBtn.closest(self.$item));

      e.preventDefault();

      self.$container.trigger('resetFiltersInGroup');
    });
  };

  MultiFilters.prototype.resetAllFilters = function () {
    var self = this;

    self.$btnResetAll.on('click', function (e) {
      e.preventDefault();

      var $currentBtn = $(this);

      self.resetFilters($currentBtn.closest(self.$container).find(self.$group));

      self.$container.trigger('resetAllFilters');
    });
  };

  MultiFilters.prototype.resetFilters = function ($container) {
    $container.find(':checked').prop('checked', false).trigger('change');
    $container.find('select').prop('selectedIndex', false).trigger('change');

    var priceSliderObj = this.priceSlider,
        key;

    for (key in priceSliderObj) {
      priceSliderObj[key].reset();
    }
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

    // $(document).on('click', function () {
    // 	closeVisibleDrop();
    // });

    // $(document).keyup(function(e) {
    // 	// console.log('Is drop opened? - ', self.dropIsOpened);
    // 	if (self.dropIsOpened && e.keyCode === 27) {
    // 		closeVisibleDrop();
    // 		// console.log('Drop closed!');
    // 	}
    // });

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

  MultiFilters.prototype.getFilterState = function ($thisFilter) {
    // возвращает true, если фильтр отмечен, или выбрано значение отличное от дефолтного
    return $thisFilter.prop('checked') || $thisFilter.attr(this.attributes.dataDefaultValue) !== undefined && $thisFilter.val() !== $thisFilter.attr(this.attributes.dataDefaultValue);
  };

  // MultiFilters.prototype.addTag = function ($tagsContainer, attrGroup, attrName, tag) {
  // 	var self = this;
  // 	var attributes = self.attributes;
  //
  // 	$(self.tagsItemTpl).clone()
  // 		.find(self.tagTextContainer)
  // 		.html(tag)
  // 		.end()
  // 		.attr(attributes.group, attrGroup)
  // 		.attr(attributes.name, attrName)
  // 		.appendTo($tagsContainer);
  // };

  // MultiFilters.prototype.removeTag = function ($tagsContainer, attrGroup, attrName) {
  // 	var self = this;
  //
  // 	var dataGroup = "[" + self.attributes.dataGroup + "=" + attrGroup + "]",
  // 		dataName = "[" + self.attributes.dataName + "=" + attrName + "]",
  // 		$currentTag = $tagsContainer.find(self.tagsItem).filter(dataGroup + dataName);
  //
  // 	// отключить соответствующий чекбокс
  // 	$currentTag.closest(self.$container)
  // 		.find(self.$group).filter(dataGroup)
  // 		.find(dataName)
  // 		.find(self.$filter).filter(':checked')
  // 		.prop('checked', false)
  // 		.trigger('change');
  //
  // 	// удалить тэг
  // 	$currentTag.remove();
  // };

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
      filter: '.p-filters-drop-list input[type="checkbox"], .p-filters-drop-list select, .p-filters-drop-list .range-slider-js',
      // filter: '.p-filters-drop-list input[type="checkbox"], .p-filters-drop-list select',
      // filter: '.p-filters-drop-list input[type="checkbox"]',
      labelText: '.p-filters-label-text-js',
      btnReset: '.btn-reset-js',
      btnResetAll: '.btn-clear-filters-js',
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
function sortingState() {
  var $sortingContainer = $('.p-sorting-js'),
      _ascending = 'order-top',
      _descending = 'order-bottom',
      activeClass = 'active';

  var $sortingItems = $('a', $sortingContainer);

  $sortingItems.on('click', function (e) {
    var $this = $(this);
    if (!$this.hasClass(activeClass)) {
      $sortingItems.removeClass(activeClass);
      $this.addClass(activeClass);
      return;
    }

    if (!$this.hasClass(_ascending) && !$this.hasClass(_descending)) {
      $this.addClass(_ascending);
    } else {
      $this.toggleClass(_ascending + ' ' + _descending);
    }
  })
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
 * Popups
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
 * !Form validation
 * */
function formValidation() {
  $.validator.setDefaults({
    submitHandler: function() {
      alert('Форма находится в тестовом режиме. Чтобы закрыть окно, нажмите ОК.');
      return false;
    }
  });

  // $("#commentForm").validate();

  var $form = $('.validate-js');

  if ($form.length) {
    var changeClasses = function (elem, remove, add) {
      console.log('changeClasses');
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

$(document).ready(function () {
  // showOnScroll();
  objectFitImages(); // object-fit-images initial
  placeholderInit();
  navExpander();
  initTooltip();
  detectScroll();
  printShow();
  equalHeight();
  inputFocusClass();
  inputHasValueClass();
  customSelect($('select.cselect'));
  // bannersSiblings();
  slidersInit();
  gridLayout();
  tabs();
  toggleShutters();
  changeState();
  addToCarAnimation();
  rollsInit();
  toggleViewInit();
  multiFiltersInit();
  sortingState();
  initSpinner($('.spinner-js'));
  onlyNumberInput();
  popupsInit();
  formValidation();
});