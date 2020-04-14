(function ($) {

	$("#contact-form").on('submit',
		function (e) {
			e.preventDefault();
			var action = "contact";
			var $form = $(this);
			$("button[type=submit]", $form).prop("disabled", true);
			var widgetId = $("#recaptcha-badge").data("widget-id");
			grecaptcha.execute(widgetId, { action: action }).then(function (token) {
				$("input[name=g-recaptcha-response-token]", $form).val(token);
				$("input[name=g-recaptcha-action]", $form).val(action);
			}).then(function () {
				var data = $form.serialize();
				var url = $form.prop("action");

				return $.post(url, data);

			}).then(function (resp) {
				$("button[type=submit]", $form).prop("disabled", false);
				resp.success == true
					? $.alert({ content: "Your message was successfully sent. We will write your back soon!", theme: "my-theme", title: "" })
					: $.alert({ content: "Sorry, we couldn't send your message. Try later!", theme: "my-theme", title: "" });

				$form.trigger("reset");
			});
		});



	/* ---------------------------------------------- /*
	 * Preloader
	/* ---------------------------------------------- */

	$(window).on('load', function () {
		$('.loader').fadeOut();
		$('.page-loader').delay(350).fadeOut('slow');

		$("#menu li").removeClass("active");
		$("#menu a[href$='" + window.location.pathname + "']").closest("li").addClass("active");
		/* ---------------------------------------------- /*
		 * Initialization General Scripts for all pages
		/* ---------------------------------------------- */

		var moduleHero = $('.module-hero'),
			module = $('.module-hero, .module, .module-small'),
			navbar = $('.navbar-custom'),
			navHeight = navbar.height(),
			worksgrid = $('#works-grid'),
			width = Math.max($(window).width(), window.innerWidth),
			mobileTest;

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			mobileTest = true;
		}


		buildModuleHero(moduleHero);
		navbarCheck(navbar);
		navbarAnimation(navbar, moduleHero, navHeight);
		navbarSubmenu(width);
		hoverDropdown(width, mobileTest);

		$(window).resize(function () {
			var width = Math.max($(window).width(), window.innerWidth);
			buildModuleHero(moduleHero);
			hoverDropdown(width);
		});

		$(window).scroll(function () {
			effectsModuleHero(moduleHero, this);
			navbarAnimation(navbar, moduleHero, navHeight);
		});



	    /* ---------------------------------------------- /*
         * Full height module
        /* ---------------------------------------------- */

		function buildModuleHero(moduleHero) {


			//if (moduleHero.length > 0) {
			//	if (moduleHero.hasClass('module-full-height')) {
			//		moduleHero.height($(window).height());
			//	} else {
			//		moduleHero.height($(window).height() * 0.85);
			//	}
			//}
		};

		/* ---------------------------------------------- /*
		 * Hero module parallax, fade
		/* ---------------------------------------------- */

		function effectsModuleHero(moduleHero, scrollTopp) {
			if (moduleHero.length > 0) {
				var homeSHeight = moduleHero.height();
				var topScroll = $(document).scrollTop();
				if ((moduleHero.hasClass('module-parallax')) && ($(scrollTopp).scrollTop() <= homeSHeight)) {
					moduleHero.css('top', (topScroll * 0.55));
				}
				if (moduleHero.hasClass('module-fade') && ($(scrollTopp).scrollTop() <= homeSHeight)) {
					moduleHero.css('opacity', (1 - topScroll / moduleHero.height() * 1));
				}
			}
		};

		/* ---------------------------------------------- /*
		 * Hero slider setup
		/* ---------------------------------------------- */

		if (mobileTest != true) {
			directionNav = true;
		} else {
			directionNav = false;
		}

		if ($('.hero-slider').length > 0) {
			$('.hero-slider').flexslider({
				animation: 'fade',
				animationSpeed: 1000,
				animationLoop: true,
				directionNav: directionNav,
				prevText: '',
				nextText: '',
				start: function (slider) {
					heroSliderLight();
				},
				before: function (slider) {
					if (mobileTest != true) {
						$('.hs-caption').fadeOut().animate({ top: '-80px' }, { queue: false, easing: 'swing', duration: 700 });
						slider.slides.eq(slider.currentSlide).delay(500);
						slider.slides.eq(slider.animatingTo).delay(500);
					}
				},
				after: function (slider) {
					heroSliderLight();
					if (mobileTest != true) {
						$('.hs-caption').fadeIn().animate({ top: '0' }, { queue: false, easing: 'swing', duration: 700 });
					}
				},
				useCSS: true
			});
		};

		/* ---------------------------------------------- /*
		 * Change color on light slide
		/* ---------------------------------------------- */

		function heroSliderLight() {
			if ($('li.bg-light').hasClass('flex-active-slide')) {
				navbar.addClass('nabar-dark');
				$('.hero-slider').addClass('hero-slider-dark');
			} else {
				navbar.removeClass('nabar-dark');
				$('.hero-slider').removeClass('hero-slider-dark');
			}
		}

		/* ---------------------------------------------- /*
		 * Hero slider pause on scroll
		/* ---------------------------------------------- */

		if ($('.hero-slider').length > 0) {
			$(window).scroll(function () {
				var st = $(window).scrollTop();
				if (st > 0) {
					$('.hero-slider').flexslider('pause');
				}
			});
		}

		/* ---------------------------------------------- /*
		 * Transparent navbar animation
		/* ---------------------------------------------- */

		function navbarCheck() {
			if (navbar.length > 0 && navbar.hasClass('navbar-transparent')) {
				navbatTrans = true;
			} else {
				navbatTrans = false;
			}
		}

		function navbarAnimation(navbar, moduleHero, navHeight) {
			var topScroll = $(window).scrollTop();
			if (navbar.length > 0 && navbatTrans != false) {
				if (topScroll >= navHeight) {
					navbar.removeClass('navbar-transparent');
				} else {
					navbar.addClass('navbar-transparent');
				}
			}
		};

		/* ---------------------------------------------- /*
		 * Navbar collapse on click
		/* ---------------------------------------------- */

		$(document).on('click', '.navbar-collapse.in', function (e) {
			if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
				$(this).collapse('hide');
			}
		});

		/* ---------------------------------------------- /*
		 * Navbar submenu
		/* ---------------------------------------------- */

		function navbarSubmenu(width) {
			if (width > 767) {
				$('.navbar-custom .navbar-nav > li.dropdown').hover(function () {
					var MenuLeftOffset = $('.dropdown-menu', $(this)).offset().left;
					var Menu1LevelWidth = $('.dropdown-menu', $(this)).width();
					if (width - MenuLeftOffset < Menu1LevelWidth * 2) {
						$(this).children('.dropdown-menu').addClass('leftauto');
					} else {
						$(this).children('.dropdown-menu').removeClass('leftauto');
					}
					if ($('.dropdown', $(this)).length > 0) {
						var Menu2LevelWidth = $('.dropdown-menu', $(this)).width();
						if (width - MenuLeftOffset - Menu1LevelWidth < Menu2LevelWidth) {
							$(this).children('.dropdown-menu').addClass('left-side');
						} else {
							$(this).children('.dropdown-menu').removeClass('left-side');
						}
					}
				});
			}
		};

		/* ---------------------------------------------- /*
		 * Navbar hover dropdown on desktop
		/* ---------------------------------------------- */

		function hoverDropdown(width, mobileTest) {
			if ((width > 767) && (mobileTest != true)) {
				$('.navbar-custom .navbar-nav > li.dropdown, .navbar-custom li.dropdown > ul > li.dropdown').removeClass('open');
				var delay = 0;
				var setTimeoutConst;
				$('.navbar-custom .navbar-nav > li.dropdown, .navbar-custom li.dropdown > ul > li.dropdown').hover(function () {
					var $this = $(this);
					setTimeoutConst = setTimeout(function () {
						$this.addClass('open');
						$this.find('.dropdown-toggle').addClass('disabled');
					}, delay);
				},
					function () {
						clearTimeout(setTimeoutConst);
						$(this).removeClass('open');
						$(this).find('.dropdown-toggle').removeClass('disabled');
					});
			} else {
				$('.navbar-custom .navbar-nav > li.dropdown, .navbar-custom li.dropdown > ul > li.dropdown').unbind('mouseenter mouseleave');
				$('.navbar-custom [data-toggle=dropdown]').not('.binded').addClass('binded').on('click', function (event) {
					event.preventDefault();
					event.stopPropagation();
					$(this).parent().siblings().removeClass('open');
					$(this).parent().siblings().find('[data-toggle=dropdown]').parent().removeClass('open');
					$(this).parent().toggleClass('open');
				});
			}
		};


		/* ---------------------------------------------- /*
		 * Portfolio
		/* ---------------------------------------------- */

		var worksgrid_mode;
		if (worksgrid.hasClass('works-grid-masonry')) {
			worksgrid_mode = 'masonry';
		} else {
			worksgrid_mode = 'fitRows';
		}

		worksgrid.each(function () {
			var update = function () {
				worksgrid.isotope({
					layoutMode: worksgrid_mode,
					itemSelector: '.work-item',
				});
			};

			// Note: Instead of waiting for all images until we initialize the widget
			// we use event capturing to update the widget's layout progressively.
			this.addEventListener('load', update, true);
		});


		$('#filters a').click(function () {
			$('#filters .current').removeClass('current');
			$(this).addClass('current');
			var selector = $(this).attr('data-filter');

			worksgrid.isotope({
				filter: selector,
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});

			return false;
		});

		/* ---------------------------------------------- /*
		 * Post slider
		/* ---------------------------------------------- */

		$('.post-images-slider').flexslider({
			animation: 'slide',
			smoothHeight: true,
		});


		/* ---------------------------------------------- /*
		 * Progress bars, counters animations
		/* ---------------------------------------------- */

		$('.progress-bar').each(function (i) {
			$(this).appear(function () {
				var percent = $(this).attr('aria-valuenow');
				$(this).animate({ 'width': percent + '%' });
				$(this).find('span').animate({ 'opacity': 1 }, 900);
				$(this).find('span').countTo({ from: 0, to: percent, speed: 900, refreshInterval: 30 });
			});
		});

		$('.counter-item').each(function (i) {
			$(this).appear(function () {
				var number = $(this).find('.counter-number').data('number');
				$(this).find('.counter-number span').countTo({ from: 0, to: number, speed: 1200, refreshInterval: 30 });
			});
		});

		/* ---------------------------------------------- /*
		 * WOW Animation When You Scroll
		/* ---------------------------------------------- */

		wow = new WOW({
			mobile: false
		});
		wow.init();

		/* ---------------------------------------------- /*
		 * Popup images
		/* ---------------------------------------------- */

		$('a.popup').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0, 1]
			},
			image: {
				titleSrc: 'title',
				tError: 'The image could not be loaded.',
			}
		});

		/* ---------------------------------------------- /*
		 * Rotate
		/* ---------------------------------------------- */

		$(".rotate").textrotator({
			animation: "dissolve",
			separator: "|",
			speed: 3000
		});

		/* ---------------------------------------------- /*
		 * A jQuery plugin for fluid width video embeds
		/* ---------------------------------------------- */

		$('body').fitVids();

		/* ---------------------------------------------- /*
		 * Scroll Animation
		/* ---------------------------------------------- */

		$('.section-scroll').bind('click', function (e) {
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top
			}, 1000);
			e.preventDefault();
		});

		/* ---------------------------------------------- /*
		 * Scroll top
		/* ---------------------------------------------- */

		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('.scroll-up').fadeIn();
			} else {
				$('.scroll-up').fadeOut();
			}
		});

		$('a[href="#totop"]').click(function () {
			$('html, body').animate({ scrollTop: 0 }, 'slow');
			return false;
		});

	});

	document.addEventListener('lazybeforeunveil', function (e) {
		var bgbuf = e.target.getAttribute('data-bgset');
		var onlybg = e.target.getAttribute('data-bg');
		if (bgbuf) {
			var bg = bgbuf.split(',');
			var bg1 = "";
			if ($('html').hasClass("webp") && $(window).width() > 767) {
				bg1 = bg[0].replace(/\.[^/.]+$/, ".webp");
				e.target.style.backgroundImage = 'url(' + bg1 + ')';
			}
			else if ($(window).width() > 767) {
				bg1 = bg[0];
				e.target.style.backgroundImage = 'url(' + bg1 + ')';
			} else if ($('html').hasClass("webp")) {
				bg1 = bg[1].replace(/\.[^/.]+$/, ".webp");
				e.target.style.backgroundImage = 'url(' + bg1 + ')';
			}
			else {
				bg1 = bg[1];
				e.target.style.backgroundImage = 'url(' + bg1 + ')';
			}
		}
		if (onlybg) {
			if ($('html').hasClass("webp")) {
				onlybg = onlybg.replace(/\.[^/.]+$/, ".webp");

			}
			e.target.style.backgroundImage = 'url(' + onlybg + ')';

		}
	});

})(jQuery);