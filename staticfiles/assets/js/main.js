(function ($) {
    "use strict";

    /*--
        Commons Variables
    -----------------------------------*/
    var $window = $(window),
        $body = $('body');

    /*--
        Custom script to call Background
        Image & Color from html data attribute
    -----------------------------------*/
    $('[data-bg-image]').each(function () {
        var $this = $(this),
            $image = $this.data('bg-image');
        $this.css('background-image', 'url(' + $image + ')');
    });
    $('[data-bg-color]').each(function () {
        var $this = $(this),
            $color = $this.data('bg-color');
        $this.css('background-color', $color);
    });

    /*--
        Header Sticky
    -----------------------------------*/
    $window.on('scroll', function () {
        if ($window.scrollTop() > 350) {
            $('.sticky-header').addClass('is-sticky');
        } else {
            $('.sticky-header').removeClass('is-sticky');
        }
    });

    /*--
        Sub Menu & Mega Menu Alignment
    -----------------------------------*/
    var subMenuMegaMenuAlignment = () => {
        var $this,
            $subMenu,
            $megaMenu,
            $siteMainMenu = $('.site-main-menu');

        $siteMainMenu.each(function () {
            $this = $(this);
            if ($this.is('.site-main-menu-left, .site-main-menu-right') && $this.closest('.section-fluid').length) {
                $megaMenu = $this.find('.mega-menu');
                $this.css("position", "relative");
                if ($this.hasClass('site-main-menu-left')) {
                    $megaMenu.css({
                        "left": "0px",
                        "right": "auto"
                    });
                } else if ($this.hasClass('site-main-menu-left')) {
                    $megaMenu.css({
                        "right": "0px",
                        "left": "auto"
                    });
                }
            }
        });
        $subMenu = $('.sub-menu');
        if ($subMenu.length) {
            $subMenu.each(function () {
                $this = $(this);
                var $elementOffsetLeft = $this.offset().left,
                    $elementWidth = $this.outerWidth(true),
                    $windowWidth = $window.outerWidth(true) - 10,
                    isElementVisible = ($elementOffsetLeft + $elementWidth < $windowWidth);
                if (!isElementVisible) {
                    if ($this.hasClass('mega-menu')) {
                        var $this = $(this),
                            $thisOffsetLeft = $this.parent().offset().left,
                            $widthDiff = $windowWidth - $elementWidth,
                            $left = $thisOffsetLeft - ($widthDiff / 2);
                        $this.attr("style", "left:" + -$left + "px !important").parent().css("position", "relative");
                    } else {
                        $this.parent().addClass('align-left');
                    }
                } else {
                    $this.removeAttr('style').parent().removeClass('align-left');
                }
            });
        }
    }

    /*--
        Off Canvas Function
    -----------------------------------*/
    (function () {
        var $offCanvasToggle = $('.offcanvas-toggle'),
            $offCanvas = $('.offcanvas'),
            $offCanvasOverlay = $('.offcanvas-overlay'),
            $mobileMenuToggle = $('.mobile-menu-toggle');
        $offCanvasToggle.on('click', function (e) {
            e.preventDefault();
            var $this = $(this),
                $target = $this.attr('href');
            $body.addClass('offcanvas-open');
            $($target).addClass('offcanvas-open');
            $offCanvasOverlay.fadeIn();
            if ($this.parent().hasClass('mobile-menu-toggle')) {
                $this.addClass('close');
            }
        });
        $('.offcanvas-close, .offcanvas-overlay').on('click', function (e) {
            e.preventDefault();
            $body.removeClass('offcanvas-open');
            $offCanvas.removeClass('offcanvas-open');
            $offCanvasOverlay.fadeOut();
            $mobileMenuToggle.find('a').removeClass('close');
        });
    })();

    /*--
        Off Canvas Menu
    -----------------------------------*/
    function mobileOffCanvasMenu() {
        var $offCanvasNav = $('.offcanvas-menu, .overlay-menu'),
            $offCanvasNavSubMenu = $offCanvasNav.find('.sub-menu');

        /*Add Toggle Button With Off Canvas Sub Menu*/
        $offCanvasNavSubMenu.parent().prepend('<span class="menu-expand"></span>');

        /*Category Sub Menu Toggle*/
        $offCanvasNav.on('click', 'li a, .menu-expand', function (e) {
            var $this = $(this);
            if ($this.attr('href') === '#' || $this.hasClass('menu-expand')) {
                e.preventDefault();
                if ($this.siblings('ul:visible').length) {
                    $this.parent('li').removeClass('active');
                    $this.siblings('ul').slideUp();
                    $this.parent('li').find('li').removeClass('active');
                    $this.parent('li').find('ul:visible').slideUp();
                } else {
                    $this.parent('li').addClass('active');
                    $this.closest('li').siblings('li').removeClass('active').find('li').removeClass('active');
                    $this.closest('li').siblings('li').find('ul:visible').slideUp();
                    $this.siblings('ul').slideDown();
                }
            }
        });
    }
    mobileOffCanvasMenu();

    /*--
        Header Category
    -----------------------------------*/
    $('.header-categories').on('click', '.category-toggle', function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('active')) {
            $this.removeClass('active').siblings('.header-category-list').slideUp();
        } else {
            $this.addClass('active').siblings('.header-category-list').slideDown();
        }
    })

    /*--
        Shop Toolbar
    -----------------------------------*/

    // Filter Toggle
    $('.product-filter-toggle').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
            $target = $this.attr('href');
        $this.toggleClass('active');
        $($target).slideToggle();
        $('.customScroll').perfectScrollbar('update');
    });

    // Column Toggle
    $('.product-column-toggle').on('click', '.toggle', function (e) {
        e.preventDefault();
        var $this = $(this),
            $column = $this.data('column'),
            $prevColumn = $this.siblings('.active').data('column');
        $this.toggleClass('active').siblings().removeClass('active');
        $('.products').removeClass('row-cols-xl-' + $prevColumn).addClass('row-cols-xl-' + $column);
        $.fn.matchHeight._update();
        $('.isotope-grid').isotope('layout');
    });

    /*--
        Custom Scrollbar (Perfect Scrollbar)
    -----------------------------------*/
    $('.customScroll').perfectScrollbar({
        suppressScrollX: !0
    });

    /*--
        Select2
    -----------------------------------*/

    // Basic
    $('.select2-basic').select2();
    // No Search Field
    $('.select2-noSearch').select2({
        minimumResultsForSearch: Infinity
    });

    // Custom Scrollbar For Select2 Result
    $('.select2-basic, .select2-noSearch').on('select2:open', function () {
        $('.select2-results__options').each(function () {
            var ps = new PerfectScrollbar($(this)[0], {
                suppressScrollX: true
            });
        });
    });

    /*--
        Nice Select
    -----------------------------------*/
    $('.nice-select').niceSelect();

    /*--
        Match Height
    -----------------------------------*/
    $('.isotope-grid .product').matchHeight();

    /*--
        ion Range Slider
    -----------------------------------*/
    $(".range-slider").ionRangeSlider({
        skin: "learts",
        hide_min_max: true,
        type: 'double',
        prefix: "$",
    });

    /*--
        Add To Wishlist
    -----------------------------------*/
    (function () {
        if (typeof mojs == 'undefined') {
            return;
        }
        var burst = new mojs.Burst({
            left: 0,
            top: 0,
            radius: {
                4: 32
            },
            angle: 45,
            count: 14,
            children: {
                radius: 2.5,
                fill: ['#F8796C'],
                scale: {
                    1: 0,
                    easing: 'quad.in'
                },
                pathScale: [.8, null],
                degreeShift: [13, null],
                duration: [500, 700],
                easing: 'quint.out'
            }
        });
        $(document).on('click', '.add-to-wishlist', function (e) {
            var $this = $(this),
                offset = $this.offset(),
                width = $this.width(),
                height = $this.height(),
                coords = {
                    x: offset.left + width / 2,
                    y: offset.top + height / 2
                };
            if (!$this.hasClass('wishlist-added')) {
                e.preventDefault();
                $this.addClass('wishlist-added').find('i').removeClass('far').addClass('fas');
                burst.tune(coords).replay();
            }
        });
    })();

    /*--
        Parallax
    -----------------------------------*/
    $.Scrollax();

    /*--
        Swipper Slider Activation
    -----------------------------------*/

    // Home 1 Slider
    var $home1Slider = new Swiper('.home1-slider', {
        loop: true,
        speed: 750,
        effect: 'fade',
        navigation: {
            nextEl: '.home1-slider-next',
            prevEl: '.home1-slider-prev',
        },
        autoplay: {},
    });

    // Home 2 Slider
    var $home2Slider = new Swiper('.home2-slider', {
        loop: true,
        speed: 750,
        effect: 'fade',
        navigation: {
            nextEl: '.home2-slider-next',
            prevEl: '.home2-slider-prev',
        },
        autoplay: {},
        on: {
            slideChange: function () {
                this.$el.find('.slide-product').removeClass('active');
            },
        }
    });
    $('.home2-slider').on('click', '.slide-pointer', function (e) {
        e.preventDefault();
        $(this).siblings('.slide-product').toggleClass('active');
    })

    // Home 3 Slider
    var $home3Slider = new Swiper('.home3-slider', {
        loop: true,
        speed: 750,
        effect: 'fade',
        navigation: {
            nextEl: '.home3-slider-next',
            prevEl: '.home3-slider-prev',
        },
        autoplay: {},
    });

    // Home 4 Slider
    var $home4Slider = new Swiper('.home4-slider', {
        loop: true,
        loopedSlides: 2,
        speed: 750,
        spaceBetween: 200,
        pagination: {
            el: '.home4-slider-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.home4-slider-next',
            prevEl: '.home4-slider-prev',
        },
        autoplay: {},
    });

    // Home 5 Slider
    var $home5Slider = new Swiper('.home5-slider', {
        loop: true,
        speed: 750,
        spaceBetween: 30,
        pagination: {
            el: '.home5-slider-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.home5-slider-next',
            prevEl: '.home5-slider-prev',
        },
        //autoplay: {},
    });

    // Home 7 Slider
    var $home7Slider = new Swiper('.home7-slider', {
        loop: true,
        speed: 750,
        spaceBetween: 30,
        effect: 'fade',
        pagination: {
            el: '.home7-slider-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.home7-slider-next',
            prevEl: '.home7-slider-prev',
        },
        //autoplay: {},
    });

    // Home 8 Slider
    var $home8Slider = new Swiper('.home8-slider', {
        loop: true,
        speed: 750,
        spaceBetween: 30,
        effect: 'fade',
        pagination: {
            el: '.home8-slider-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.home8-slider-next',
            prevEl: '.home8-slider-prev',
        },
        //autoplay: {},
    });

    // Home 12 Slider
    var $home12Slider = new Swiper('.home12-slider', {
        loop: true,
        speed: 750,
        spaceBetween: 30,
        effect: 'fade',
        pagination: {
            el: '.home12-slider-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.home12-slider-next',
            prevEl: '.home12-slider-prev',
        },
        //autoplay: {},
    });

    /*--
        Slick Slider Activation
    -----------------------------------*/

    // Product Slider
    $('.product-carousel').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
                breakpoint: 991,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Product List Slider
    $('.product-list-slider').slick({
        rows: 3,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>'
    });

    // Single Product Slider
    $('.product-gallery-slider').slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.product-thumb-slider, .product-thumb-slider-vertical',
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>'
    });
    $('.product-thumb-slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        asNavFor: '.product-gallery-slider',
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>'
    });
    $('.product-thumb-slider-vertical').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        focusOnSelect: true,
        asNavFor: '.product-gallery-slider',
        prevArrow: '<button class="slick-prev"><i class="ti-angle-up"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-down"></i></button>'
    });

    // Blog Carousel
    $('.blog-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Brand Carousel
    $('.brand-carousel').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
            breakpoint: 1199,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 991,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 2
            }
        }, {
            breakpoint: 575,
            settings: {
                slidesToShow: 1
            }
        }]
    });

    // Testimonial SLider/Carousel
    $('.testimonial-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>'
    });
    $('.testimonial-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Category Banner Slider/Carousel
    $('.category-banner1-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev"><i class="fas fa-long-arrow-alt-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fas fa-long-arrow-alt-right"></i></button>',
        responsive: [{
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });



    /*--
        Isotpe
    -----------------------------------*/
    var $isotopeGrid = $('.isotope-grid');
    var $isotopeFilter = $('.isotope-filter');
    $isotopeGrid.imagesLoaded(function () {
        $isotopeGrid.isotope({
            itemSelector: '.grid-item',
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
    });
    $isotopeFilter.on('click', 'button', function () {
        var $this = $(this),
            $filterValue = $this.attr('data-filter'),
            $targetIsotop = $this.parent().data('target');
        $this.addClass('active').siblings().removeClass('active');
        $($targetIsotop).isotope({
            filter: $filterValue
        });
    });

    /*--
        MailChimp
    -----------------------------------*/
    $('#mc-form').ajaxChimp({
        language: 'en',
        callback: mailChimpResponse,
        // ADD YOUR MAILCHIMP URL BELOW HERE!
        url: 'http://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef'

    });

    function mailChimpResponse(resp) {
        if (resp.result === 'success') {
            $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
            $('.mailchimp-error').fadeOut(400);
        } else if (resp.result === 'error') {
            $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
        }
    }

    /*--
        Instagram
    -----------------------------------*/
    /* Instafeed Carousel */
    $('.instafeed-carousel1').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
            breakpoint: 119,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 991,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 2
            }
        }, {
            breakpoint: 479,
            settings: {
                slidesToShow: 1
            }
        }]
    })
    $('.instafeed-carousel2').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
            breakpoint: 767,
            settings: {
                slidesToShow: 2
            }
        }, {
            breakpoint: 479,
            settings: {
                slidesToShow: 1
            }
        }]
    });
    
    /*--
        CountDown
    -----------------------------------*/
    $('[data-countdown]').each(function () {
        var $this = $(this),
            $finalDate = $this.data('countdown');
        $this.countdown($finalDate, function (event) {
            $this.html(event.strftime('<div class="count"><span class="amount">%-D</span><span class="period">Days</span></div><div class="count"><span class="amount">%-H</span><span class="period">Hours</span></div><div class="count"><span class="amount">%-M</span><span class="period">Minutes</span></div><div class="count"><span class="amount">%-S</span><span class="period">Seconds</span></div>'));
        });
    });

    /*--
        Bootstrap
    -----------------------------------*/

    /* Accordion/Collapse */
    $('.collapse').on('show.bs.collapse', function (e) {
        $(this).closest('.card').addClass('active').siblings().removeClass('active');
    });
    $('.collapse').on('hide.bs.collapse', function (e) {
        $(this).closest('.card').removeClass('active');
    });

    /* Modal */
    $('#quickViewModal').on('shown.bs.modal', function () {
        const $slider = $('.product-gallery-slider-quickview');
        if ($slider.length && !$slider.hasClass('slick-initialized')) {
            $slider.slick({
                dots: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
                nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>'
            });
        }
    });

    /*--
        Product Quantity
    -----------------------------------*/
    $(document).on('click', '.qty-btn', function () {
        var $this = $(this);
        var $input = $this.siblings('.input-qty');
        var oldValue = parseInt($input.val()) || 1;

        if ($this.hasClass('plus')) {
            $input.val(oldValue + 1);
        } else {
            if (oldValue > 1) {
                $input.val(oldValue - 1);
            }
        }
    });

    /*--
        Post Share
    -----------------------------------*/
    $('.post-share').on('click', ".toggle", function () {
        var $this = $(this),
            $target = $this.parent();
        $target.hasClass('active') ? $target.removeClass('active') : $target.addClass('active');
    });

    /*--
        Magnific Popup
    -----------------------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });
    $('.image-gallery').magnificPopup({
        delegate: 'a',
		type: 'image',
        fixedContentPos: false,
		gallery: {
			enabled: true,
		}
    });

    /*--
        Scroll Up
    -----------------------------------*/
    $.scrollUp({
        scrollText: '<i class="fas fa-long-arrow-alt-up"></i>',
    });


    /*--
        Single Product Gallery Popup
    -----------------------------------*/
    $(document).on('click', '.product-gallery-popup', function (e) {
        e.preventDefault();
        const pswpElement = document.querySelector('.pswp');
        const images = $(this).data('images') || [];

        if (!pswpElement || !images.length) return;

        const options = {
            history: false,
            focus: false,
            closeOnScroll: false,
            showAnimationDuration: 0,
            hideAnimationDuration: 0
        };

        new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, images, options).init();
    });

    document.querySelectorAll('.product-gallery-popup').forEach(button => {
        button.addEventListener('click', () => {
            const container = button.closest('.product-images');
            if (!container) return;

            const allZooms = container.querySelectorAll('.product-gallery-slider .product-zoom');
            const originalZooms = Array.from(allZooms).filter(zoom => {
                return !zoom.closest('.slick-cloned');
            });

            const galleryItems = originalZooms.map(zoom => {
                const img = zoom.querySelector('img');
                return {
                    src: img?.getAttribute('src'),
                    w: img?.naturalWidth || 800,
                    h: img?.naturalHeight || 1000
                };
            }).filter(item => item.src);

            if (!galleryItems.length) return;

            const pswpElement = document.querySelector('.pswp');
            const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryItems, {
                index: 0,
                bgOpacity: 0.9,
                showHideOpacity: true
            });

            gallery.init();
        });
    });

    $('.product-zoom').each(function () {
        var $this = $(this),
            $image = $this.data('image');
        $this.zoom({
            url: $image
        });
    });

    /*--
        Sticky Sidebar
    -----------------------------------*/
    $('.sticky-sidebar').stickySidebar({
        topSpacing: 60,
        bottomSpacing: 60,
        containerSelector: '.sticky-sidebar-container',
        innerWrapperSelector: '.sticky-sidebar-inner',
        minWidth: 992
    });



    /*--
        Ajax Contact Form
    -----------------------------------*/
    $(function () {
        // Get the form.
        var form = $('#contact-form');
        // Get the messages div.
        var formMessages = $('.form-messege');
        // Set up an event listener for the contact form.
        $(form).submit(function (e) {
            // Stop the browser from submitting the form.
            e.preventDefault();
            // Serialize the form data.
            var formData = $(form).serialize();
            // Submit the form using AJAX.
            $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: formData
                })
                .done(function (response) {
                    // Make sure that the formMessages div has the 'success' class.
                    formMessages.removeClass('error text-danger').addClass('success text-success learts-mt-10').text(response);
                    // Clear the form.
                    form.find('input:not([type="submit"]), textarea').val('');
                })
                .fail(function (data) {
                    // Make sure that the formMessages div has the 'error' class.
                    formMessages.removeClass('success text-success').addClass('error text-danger mt-3');
                    // Set the message text.
                    if (data.responseText !== '') {
                        formMessages.text(data.responseText);
                    } else {
                        formMessages.text('Oops! An error occured and your message could not be sent.');
                    }
                });
        });
    });

    /*--
        On Load Function
    -----------------------------------*/
    $window.on('load', function () {
        subMenuMegaMenuAlignment();
    });

    /*--
        Resize Function
    -----------------------------------*/
    $window.resize(function () {
        subMenuMegaMenuAlignment();
   
        });

    /*--
        Quickview Modal
    -----------------------------------*/
    
    $(document).on('click', '[data-product-id]', async function (e) {
        e.preventDefault();

        const productId = $(this).data('product-id');
        const modal = document.getElementById('quickViewModal');
        const modalBody = modal.querySelector('.modal-body');

        try {
            const response = await fetch(`/ajax/quick-view/${productId}/`);
            const data = await response.json();

            const html = `
            <div class="row learts-mb-n30">
                <!-- Product Images Start -->
                <div class="col-lg-6 col-12 learts-mb-30">
                    <div class="product-images">           
                        <div class="product-gallery-slider-quickview">
                            ${data.imagenes.map(url => `
                                <div class="product-zoom" data-image="${url}">
                                    <img src="${url}" alt="${data.nombre}">
                                </div>
                            `).join('')}
                        </div>  
                    </div>
                </div>
                <!-- Product Images End -->

                <!-- Product Summery Start -->
                <div class="col-lg-6 col-12 overflow-hidden position-relative learts-mb-30">
                    <div class="product-summery customScroll">
                        <h3 class="product-title">${data.nombre}</h3>
                        <div class="product-price">$${Number(data.precio).toLocaleString('fr-FR')}</div>
                        <div class="product-description">
                            <p>${data.descripcion}</p>
                        </div>
                        <div class="product-variations">
                            <table>
                                <tbody>
                                    <tr>
                                        <td class="label"><span>Cantidad</span></td>
                                        <td class="value">
                                            <div class="product-quantity">
                                                <span class="qty-btn minus"><i class="ti-minus"></i></span>
                                                <input type="text" class="input-qty" value="1">
                                                <span class="qty-btn plus"><i class="ti-plus"></i></span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="product-buttons">
                            <a href="#" class="btn btn-icon btn-outline-body btn-hover-dark"><i class="ti-heart"></i></a>
                            <a href="#" class="btn btn-dark btn-hover-dark ml-4">Agregar al Carrito</a>
                        </div>
                        <div class="product-meta mb-0">
                            <table>
                                <tbody>
                                    <tr>
                                        <td class="label"><span>SKU</span></td>
                                        <td class="value">0404019</td>
                                    </tr>
                                    <tr>
                                        <td class="label"><span>Category</span></td>
                                        <td class="value">
                                            <ul class="product-category">
                                                <li><a href="/shop/${data.slug_categoria}/">${data.categoria}</a></li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="label"><span>Share on</span></td>
                                        <td class="va">
                                            <div class="product-share">
                                                <a href="#"><i class="fab fa-facebook-f"></i></a>
                                                <a href="#"><i class="fab fa-twitter"></i></a>
                                                <a href="#"><i class="fab fa-google-plus-g"></i></a>
                                                <a href="#"><i class="fab fa-pinterest"></i></a>
                                                <a href="#"><i class="far fa-envelope"></i></a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Product Summery End -->
            </div>
            `;

            modalBody.innerHTML = html;

            // Ocultamos el modal temporalmente
            modal.classList.remove('visible-quickview');
            modal.classList.add('invisible-quickview');

            // Esperamos que todas las imágenes del modal se carguen
            const images = modalBody.querySelectorAll('img');
            const promises = Array.from(images).map(img =>
                new Promise(resolve => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = img.onerror = resolve;
                    }
                })
            );

            Promise.all(promises).then(() => {
                const $slider = $('.product-gallery-slider-quickview');

                $slider.on('init', function () {
                    const instance = bootstrap.Modal.getOrCreateInstance(modal);
                    instance.show();

                    modal.classList.remove('invisible-quickview');
                    modal.classList.add('visible-quickview');
                });

                $slider.slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: true,
                    prevArrow: '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
                    nextArrow: '<button class="slick-next"><i class="ti-angle-right"></i></button>'
                });
            });

        } catch (error) {
            console.error('Error al cargar el quickview:', error);
        }
    });

})(jQuery);