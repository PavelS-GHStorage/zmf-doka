"use strict";

function debounce(func, wait, immediate) {
	if (!func) return;
	var timeout;
	return function executedFunction() {
		var context = this;
		var args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

const body = document.querySelector("body");

window.onload = () => body.classList.add("page-loaded");

$(function () {
	const headerBottom = $(".header__bottom");
	let myMap;

	window.doka = {};

	window.doka.form = {
		checkForm: function checkForm(form) {
			let checkResult = true;

			form.find(".error").removeClass("error");

			form.find("input, textarea, select").each(function () {
				if ($(this).data("req")) {
					switch ($(this).data("type")) {
						case "phone":
							const regexForPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
							if (!regexForPhone.test($(this).val())) {
								$(this).parent().addClass("error");
								checkResult = false;
							}
							break;
						case "email":
							const regexpForRmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
							if (!regexpForRmail.test($(this).val())) {
								$(this).parent().addClass("error");
								checkResult = false;
							}
							break;
						default:
							if ($(this).val().trim() === "") {
								$(this).parent().addClass("error");
								checkResult = false;
							}
							break;
					}
				}
			});

			return checkResult;
		},

		init: function init() {
			const _th = this;
			var formFields = $(".form__field-input, .form__field-textarea, .form-callback__field-input");
			var formFieldPhone = $(".js-phone");


			if (formFieldPhone.length) {
				formFieldPhone.mask("+7(999) 999-9999");
			}

			if (formFields.length) {
				formFields.each(function () {
					const _t = $(this);
					const _tParent = _t.parents('[class*="__field"]');

					if (_t.val().trim() === "") {
						_tParent.removeClass("not-empty");
						
						return;
					}

					_tParent
						.removeClass("error")
						.addClass("not-empty");
				});

				formFields.on("blur keyup", function () {
					const _t = $(this);
					const _tParent = _t.parents('[class*="__field"]');
					
					setTimeout(function () {
						if (_t.val().trim() === "") {
							_tParent.removeClass("not-empty");
							
							return;
						}

						_tParent
							.removeClass("error")
							.addClass("not-empty");
					}, 50);
				});
			}

			
			$("form").on("submit", function () {
				if (!_th.checkForm($(this))) {
					return false;
				}
			});

			return this;
		},
	}.init();

	window.doka.constructor = {
		init: function init() {
			if ($('.js-constructor').length) {
				const selectedOptionsData = {};

				const constructor = $('.js-constructor');
				const creditMonths = constructor.data('credit-months');
				const creditPercent = constructor.data('credit-percent');
				
				const indicator = constructor.find('.section-constructor__indicator');
				const indicatorItems = constructor.find('.section-constructor__indicator-items');
				const indicatorNumberActive = constructor.find('.section-constructor__indicator-number--active');
				const indicatorNumberAll = constructor.find('.section-constructor__indicator-number--all');
				
				const info = constructor.find('.section-constructor__info');
				const infoTotalPrice = constructor.find('.section-constructor__info-total-price');
				const infoCreditPrice = constructor.find('.section-constructor__info-credit-price');

				const slider = constructor.find('.section-constructor__steps .swiper');
				const sliderButtons = constructor.find('.section-constructor__controls');
				const sliderButton = constructor.find('.section-constructor__controls-button');
				const sliderButtonPrev = constructor.find('.section-constructor__controls-button[data-direction="prev"]');
				const sliderButtonNext = constructor.find('.section-constructor__controls-button[data-direction="next"]');

				const table = constructor.find('.section-constructor__table');

				const stepOption = constructor.find('.section-constructor__option-input');
				const inputForSendFormData = constructor.find('.form-callback__field-input[data-id="selected-options-data"]');

				function generateSelectedOptionsData(swiper) {
					swiper.slides.forEach(function(slide) {
						const step = $(slide).data('step');

						if (step) {
							selectedOptionsData[step] = [];
						}
					})
				}

				function generateIndicatorItemsHtml(swiper) {
					const numbersSlides = swiper.slides.length;
							
					indicatorNumberActive.text(swiper.activeIndex + 1);
					indicatorNumberAll.text(numbersSlides);

					for(let i = 0; i <= numbersSlides - 1; i++) {
						const activeClass = i === 0 ? 'section-constructor__indicator-item--active' : '';
						const indicatorItemHtml = `<div class="section-constructor__indicator-item ${activeClass}" data-indicator="${i}"></div>`

						indicatorItems.append(indicatorItemHtml)
					}

					indicator.fadeIn(300).css('display', 'grid');
				}

				function changeIndicatorItemActive(swiper) {
					const activeIndex = swiper.activeIndex;

					if (indicatorItems.find('.section-constructor__indicator-item').length)
					indicatorItems.find('.section-constructor__indicator-item').removeClass('section-constructor__indicator-item--active')

					if (indicatorItems.find(`.section-constructor__indicator-item[data-indicator="${activeIndex}"]`).length) {
						indicatorItems.find(`.section-constructor__indicator-item[data-indicator="${activeIndex}"]`).addClass('section-constructor__indicator-item--active')
					}
					
					indicatorNumberActive.text(activeIndex + 1);
				}

				function generateTableHtml(swiper) {
					if (swiper.activeIndex === swiper.slides.length - 1) {
						Object.keys(selectedOptionsData).forEach(function(key) {
							selectedOptionsData[key].forEach(function(option) {
								const tableRow = `<div class="section-constructor__table-row">
									<div class="section-constructor__table-cell section-constructor__table-cell--title">${option.title}</div>
									<div class="section-constructor__table-cell section-constructor__table-cell--price">${option.price}</div>
								</div>`;

								table.append(tableRow);
							})
						})
					}
				}

				function setValueInInputForSendFormData(swiper) {
					if (swiper.activeIndex === swiper.slides.length - 1) {
						inputForSendFormData.val(JSON.stringify(selectedOptionsData));
					}
				}

				function changeAttributeDisabledSliderButtonPrev(swiper) {
					if (swiper.activeIndex > 0) {
						sliderButtonPrev.attr('disabled', false);
						
						return;
					}

					sliderButtonPrev.attr('disabled', true);
				}

				function changeAttributeDisabledSliderButtonNext() {
					const activeSlide = slider.find('.swiper-slide-active');
					const activeSlideStep = activeSlide.data('step');
					
					if (activeSlideStep && !selectedOptionsData[activeSlideStep].length) {
						sliderButtonNext.attr('disabled', true);

						return;
					}

					sliderButtonNext.attr('disabled', false);
				}

				function hideSliderButtons(swiper) {
					if (swiper.activeIndex === 3) {
						sliderButtons.fadeOut(0);
					}
				}

				function costCalculation() {
					let totalPrice = 0;

					Object.keys(selectedOptionsData).forEach(function(key) {
						selectedOptionsData[key].forEach(function(option) {
							if (option.price) {
								totalPrice += Number(option.price.replace(/\s/g,''));
							}
						})
					})

					if (!totalPrice) {
						info.fadeOut(300);

						return;
					}

					const calcCreditPercent = creditPercent ? (totalPrice * Number(creditPercent)) / 100 : 0;
					const calcCreditMonths = creditMonths ? Number(creditMonths) : 6;

					let creditPrice = parseInt(((totalPrice + calcCreditPercent) / calcCreditMonths));

					if (totalPrice > 999) {
						totalPrice = totalPrice.toLocaleString();
					}

					if (creditPrice > 999) {
						creditPrice = creditPrice.toLocaleString();
					}

					infoTotalPrice.text(totalPrice);
					infoCreditPrice.text(creditPrice);

					if (!info.is(":visible")) {
						info.fadeIn(300);
					}
				}

				const swiperConstructor = new Swiper(slider[0], {
					speed: 400,
					navigation: false,
					autoHeight: true,
					allowTouchMove: false,
					noSwiping: true,
					effect: "fade",
					fadeEffect: {
						crossFade: true
					},
					on: {
						init: function () {
							generateSelectedOptionsData(this)
							generateIndicatorItemsHtml(this)
						},
						slideChangeTransitionStart: function () {
							changeIndicatorItemActive(this)
							generateTableHtml(this)
							setValueInInputForSendFormData(this)
							changeAttributeDisabledSliderButtonPrev(this)
							changeAttributeDisabledSliderButtonNext()
							hideSliderButtons(this)
						},
					}
				});

				sliderButton.on('click', function(e) {
					e.preventDefault()

					const direction = $(this).data('direction');

					if (direction === 'prev') {
						if (swiperConstructor.activeIndex > 0) {
							swiperConstructor.slidePrev();
						}
						
						return
					}

					if (swiperConstructor.activeIndex + 1 < swiperConstructor.slides.length) {
						swiperConstructor.slideNext();
					}
				});

				stepOption.on('change', function() {
					const _t = $(this);
					const _tType = _t.attr('type');
					const _tId = _t.attr('id');
					const _tName = _t.attr('name');
					const _tTitle = _t.data('title');
					const _tPrice = _t.data('price');

					if (_tType === 'radio') {
						selectedOptionsData[_tName] = [];
						selectedOptionsData[_tName].push({
							id: _tId,
							title: _tTitle,
							price: _tPrice,
						});

						costCalculation();
						changeAttributeDisabledSliderButtonNext()

						return;
					}

					if (_t.is(':checked')) {
						const hasInArray = selectedOptionsData[_tName].find(function(item) {
							if (item.id === _tId) {
								return item;
							}
						});
	
						if (!hasInArray) {
							selectedOptionsData[_tName].push({
								id: _tId,
								title: _tTitle,
								price: _tPrice,
							})

							costCalculation();
							changeAttributeDisabledSliderButtonNext()
						}

						return;
					}

					selectedOptionsData[_tName] = selectedOptionsData[_tName].filter(function(item) {
						if (item.id !== _tId) {
							return item;
						}

						return null;
					});

					costCalculation();
					changeAttributeDisabledSliderButtonNext()
				});
			}
		},
	}.init();

	window.doka.obj = {
		nav: function nav() {
			var nav = $(".js-nav");
			var navToggle = $(".js-nav-toggle");
			var navList = nav.find("> .nav__list");
			var navSecondLevel = nav.find(".nav__second-level");
			var navSecondList = navSecondLevel.find(".nav__list");
			var navSecondListToggle = navList.find(".nav__list-item--button");

			var lastWidthX = window.innerWidth;

			if (navSecondLevel.length && navSecondList.length && navToggle.length) {
				navToggle.on("click", function (e) {
					e.preventDefault();
					$(this).toggleClass("active");
					navSecondLevel.toggleClass("open");
				});

				var navDebounce = debounce(function () {
					var navListItems = navList.find(
						".nav__list-item:not(.nav__list-item--button)"
					);
					var navSecondListItem = navSecondList.find(".nav__list-item");

					var diffWidthX = window.innerWidth - lastWidthX;
					var widthNav = parseInt(nav.width() - 58, 10);
					var widthNavItems = 0;

					lastWidthX = window.innerWidth;

					if (navListItems.length) {
						var indexLastItem = navListItems.length;
						for (var i = 0; i < navListItems.length; i++) {
							widthNavItems += parseInt(navListItems[i].offsetWidth, 10);
							if (widthNav < widthNavItems) {
								indexLastItem = i;
								break;
							}
						}

						for (var y = navListItems.length - 1; y >= indexLastItem; y--) {
							navSecondList.prepend(navListItems[y]);
						}
					}

					if (diffWidthX > 0 && navSecondListItem.length) {
						for (var z = 0; z < navSecondListItem.length; z++) {
							widthNavItems += parseInt(navSecondListItem[z].offsetWidth, 10);
							if (widthNav > widthNavItems) {
								navList.append(navSecondListItem[z]);
							}
						}
					}

					if (navSecondList.children().length) {
						navSecondListToggle.fadeIn(0);
					} else {
						navSecondListToggle.fadeOut(0);
					}
				}, 250);

				$(window).on("resize", navDebounce);
			}
		},

		burger: function burger() {
			const burger = $(".js-burger");
			const navMobile = $(".nav-mobile");
			const closeNav = $(".js-close-nav");
			const backNav = $(".js-back-nav");
			const btnShowSublist = $(".js-show-sublist");

			if (burger.length) {
				burger.on("click", function () {
					navMobile.fadeIn(350);
					$(body).addClass("open-mobile-menu");
					return false;
				});
			}

			if (closeNav.length) {
				closeNav.on("click", function () {
					navMobile.fadeOut(350);
					$(".nav-mobile__sublist.show").removeClass("show");
          backNav.removeClass("show");
					$(body).removeClass("open-mobile-menu");
					return false;
				});
			}

      if (btnShowSublist.length) {
        btnShowSublist.on("click", function () {
          $(this).siblings(".nav-mobile__sublist").addClass("show");
          backNav.addClass("show");
          return false;
        });
      }

      if (backNav.length) {
        backNav.on("click", function () {
          $(".nav-mobile__sublist.show").removeClass("show");
          backNav.removeClass("show");
          return false;
        });
      }
		},
		
		yaMap: function yaMap() {
			function init(idMap = 'yaMap_1', coords = ['55.194203', '61.418238']) {
				ymaps.ready(function () {
					myMap = new ymaps.Map(idMap, {
						center: [coords[0].trim(), coords[1].trim()],
						zoom: 14,
						controls: ["largeMapDefaultSet"],
					});

					myMap.controls.add("zoomControl", {
						size: "small",
					});

					myMap.behaviors.disable("scrollZoom");

					const myPlacemark = new ymaps.Placemark(
						coords,
						{},
						{
							iconLayout: "default#image",
							iconImageHref: "static/images/pin.png",
							iconImageSize: [47, 54],
						}
					);

					myMap.geoObjects.add(myPlacemark);
					
					return myMap
				});
			}
			
			function destroy() {
				if (myMap) {
					myMap.destroy()
				}
			}
			
			return {
				init, 
				destroy
			}
		},
		
		jqMfp: function mfp() {
			$(".js-mfp").magnificPopup({
				type: "inline",
				mainClass: "mfp-fade",
				closeOnBgClick: false,
			});

			$(".js-mfp-close").on("click", function (e) {
				$.magnificPopup.close();
				e.preventDefault();
			});
		},

		jqVideoMfp: function jqVideoMfp() {
			$(".js-video-mfp").magnificPopup({
				disableOn: 700,
				type: "iframe",
				mainClass: "mfp-fade",
				closeOnBgClick: false,
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false,
				callbacks: {
					open: function () {
						$("body").addClass("open-video-popup");
					},
					close: function () {
						$("body").removeClass("open-video-popup");
					},
				},
			});
		},

		jqMfpGallery: function jqMfpGallery() {
			$(".js-mfp-gallery").magnificPopup({
				delegate: "a",
				type: "image",
				tLoading: "Loading image #%curr%...",
				mainClass: "mfp-img",
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0, 1],
				},
			});
		},
		
		init: function init() {
			const _self = this;

			if ($(".js-nav").length) {
				_self.nav();
			}

			if ($(".js-burger").length) {
				_self.burger();
			}

			if ($(".js-mfp").length) {
				_self.jqMfp();
			}

			if ($(".js-video-mfp").length) {
				_self.jqVideoMfp();
			}

			if ($(".js-mfp-gallery").length) {
				_self.jqMfpGallery();
			}

			if ($(".js-yaMap").length) {
				_self.yaMap().init();
			}
			
			if ($('.js-tabs-contacts').length) {
				$('.js-tabs-contacts').on('click', function (e) {
					e.preventDefault();

					const _t = $(this);
					const _tData = _t.data('btn');
					const _tParents = _t.parents('.section-contacts__tabs');
					const _tTabsBtns = _tParents.find('.section-contacts__tabs-controls-btn');
					const _tTabsItems = _tParents.find('.section-contacts__tabs-item');
					const nextTab = _tParents.find('.section-contacts__tabs-item[data-tab="'+ _tData +'"]');
					const tabMap = nextTab.find('.section-contacts__map');
					const tabMapId = tabMap.attr('id');
					const tabMapIdCoords = tabMap.data('coords').split(',');
					
					if (!_t.hasClass('active') && nextTab && tabMap) {
						_tTabsBtns.removeClass('active');
						_tTabsItems.removeClass('active');
						_t.addClass('active')
						_self.yaMap().destroy();

						setTimeout(function () {
							nextTab.addClass('active')
							_self.yaMap().init(tabMapId, tabMapIdCoords);
						}, 300);
					}
				})
			}
			
			if ($('.js-swiper-promotions').length) {
				let swiperPromotions;

				$(window).on("resize", function () {
					const windowWidth = $(window).width();
	
					if (windowWidth > 767 && !$('.js-swiper-promotions').hasClass('swiper-initialized')) {
						swiperPromotions = new Swiper('.js-swiper-promotions', {
							init: false,
							speed: 400,
							spaceBetween: 24,
							slidesPerView: 1,
							navigation: {
								nextEl: '.section-promotions .swiper-button-next',
								prevEl: '.section-promotions .swiper-button-prev',
							},
							pagination: {
								el: '.section-promotions .swiper-pagination',
								type: 'bullets',
								clickable: true,
							},
							breakpoints: {
								992: {
									slidesPerView: 2,
								},
							}
						});

						swiperPromotions.init();
					} else if (windowWidth <= 767 && $('.js-swiper-promotions').hasClass('swiper-initialized')) {
						swiperPromotions.destroy(true, true);
					}
				});
			}
			
			if ($('.js-swiper-specialists').length) {
				let swiperSpecialists;

				$(window).on("resize", function () {
					const windowWidth = $(window).width();
	
					if (windowWidth > 767 && !$('.js-swiper-specialists').hasClass('swiper-initialized')) {
						swiperSpecialists = new Swiper('.js-swiper-specialists', {
							init: false,
							speed: 400,
							spaceBetween: 24,
							slidesPerView: 1,
							navigation: {
								nextEl: '.section-specialists .swiper-button-next',
								prevEl: '.section-specialists .swiper-button-prev',
							},
							pagination: {
								el: '.section-specialists .swiper-pagination',
								type: 'bullets',
								clickable: true,
							},
							breakpoints: {
								992: {
									slidesPerView: 2,
								},
								1240: {
									slidesPerView: 2,
									spaceBetween: 70,
								},
							}
						});

						swiperSpecialists.init('.js-swiper-specialists');
					} else if (windowWidth <= 767 && $('.js-swiper-specialists').hasClass('swiper-initialized')) {
						swiperSpecialists.destroy(true, true);
					}
				});
			}

			if ($('.js-swiper-seo').length) {
				const swiperSeo = new Swiper('.js-swiper-seo', {
					speed: 400,
					spaceBetween: 24,
					slidesPerView: 1,
					navigation: {
						nextEl: '.section-seo .swiper-button-next',
						prevEl: '.section-seo .swiper-button-prev',
					},
					breakpoints: {
						768: {
							slidesPerView: 2,
						},
						1240: {
							slidesPerView: 3,
						},
					}
				});
			}

			if ($('.js-swiper-history-gallery-thumbs').length && $('.js-swiper-history-gallery-big').length) {
				const swiperHistoryGalleryThumbs = new Swiper('.js-swiper-history-gallery-thumbs', {
					loop: true,
					speed: 400,
					spaceBetween: 6,
					slidesPerView: 3,
					freeMode: true,
					watchSlidesProgress: true,
					breakpoints: {
						480: {
							slidesPerView: 4,
							spaceBetween: 12,
						},
					}
				});

				const swiperHistoryGalleryBig = new Swiper('.js-swiper-history-gallery-big', {
					loop: true,
					speed: 400,
					// thumbs: {
					// 	swiper: swiperHistoryGalleryThumbs,
					// },
					navigation: {
						nextEl: '.section-history .swiper-button-next',
						prevEl: '.section-history .swiper-button-prev',
					},
				});
			}

			if ($('.js-swiper-card-gallery-big').length && $('.js-swiper-card-gallery-thumbs').length) {
				const swiperCardGalleryThumbs = new Swiper('.js-swiper-card-gallery-thumbs', {
					loop: true,
					speed: 400,
					spaceBetween: 8,
					slidesPerView: 4,
					freeMode: true,
					watchSlidesProgress: true,
				});

				const swiperCardGalleryBig = new Swiper('.js-swiper-card-gallery-big', {
					loop: true,
					speed: 400,
					thumbs: {
						swiper: swiperCardGalleryThumbs,
					},
					navigation: {
						nextEl: '.section-card .swiper-button-next',
						prevEl: '.section-card .swiper-button-prev',
					},
				});
			}
			
			if ($('.js-datepicker').length) {
				new AirDatepicker('.js-datepicker')
			}

			if ($(".js-faq-toggle").length) {
				$(".js-faq-toggle").on("click", function (e) {
					e.preventDefault();

					const _t = $(this);
					const _tParents = _t.parents(".section-faq__item");
					const _tAccordionItemActive = _t
						.parents(".section-faq__items")
						.find(".section-faq__item.active");
					
					if (_tParents.hasClass("active")) {
						_tParents.removeClass("active");
						_tParents.find(".section-faq__item-dropdown").slideUp(350);

						return;
					}
					
					if (_tAccordionItemActive.length) {
						_tAccordionItemActive.removeClass("active");
						_tAccordionItemActive
							.find(".section-faq__item-dropdown")
							.slideUp(350);
					}

					_tParents.addClass("active");
					_tParents.find(".section-faq__item-dropdown").slideDown(350);
				});
			}

			if ($('.js-component-toggle').length) {
				$('.js-component-toggle').on('click', function(e) {
					e.preventDefault();

					const _t = $(this);
					const _tParents = _t.parents(".section-components__item");
					const _tItemActive = _t
						.parents(".section-components")
						.find(".section-components__item.active");
					
					if (_tParents.hasClass("active")) {
						_tParents.removeClass("active");
						_tParents.find(".section-components__item-body").slideUp(350);

						return;
					}
					
					if (_tItemActive.length) {
						_tItemActive.removeClass("active");
						_tItemActive
							.find(".section-components__item-body")
							.slideUp(350);
					}

					_tParents.addClass("active");
					_tParents.find(".section-components__item-body").slideDown(350);
				})
			}

			if ($('.js-tabs-card').length) {
				let isTabsAnim = true;

				$('.js-tabs-card').on('click', function (e) {
					e.preventDefault();

					const _t = $(this);
					const _tData = _t.data('tab-btn');
					const _tParents = _t.parents('.section-card__tabs');
					const _tTabsBtns = _tParents.find('.section-card__tabs-controls-button');
					const _tTabsItems = _tParents.find('.section-card__tabs-item');
					const nextTab = _tParents.find('.section-card__tabs-item[data-tab-item="'+ _tData +'"]');
					
					if (!_t.hasClass('active') && nextTab && isTabsAnim) {
						isTabsAnim = false;
						_tTabsBtns.removeClass('active');
						_tTabsItems.removeClass('active');
						_t.addClass('active')

						setTimeout(function () {
							nextTab.addClass('active')

							setTimeout(function () {
								isTabsAnim = true;
							}, 300);
						}, 300);

						
					}
				})
			}

			$(window).on("scroll", function () {
				const scrollTop = $(window).scrollTop();
				const windowHeight = $(window).height();

				if (headerBottom.length) {
					if (scrollTop >= headerBottom.offset().top) {
						headerBottom.addClass("fixed");
						return;
					}

					headerBottom.removeClass("fixed");
				}
			});

			$(window).trigger('scroll').trigger('resize');
			
			return this
		},
	}.init();
});
