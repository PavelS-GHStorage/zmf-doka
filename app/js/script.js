"use strict";

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

			$("form").on("submit", function () {
				if (!_th.checkForm($(this))) {
					return false;
				}
			});

			if ($(".js-phone").length) {
				$(".js-phone").mask("+7(999) 999-9999");
			}

			return this;
		},
	}.init();

	window.doka.obj = {
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

			if ($(".js-nav-toggle").length) {
				$(".js-nav-toggle").on("click", function (e) {
					$(this).toggleClass("active");

					if ($(".nav__second-level").length) {
						$(".nav__second-level").toggleClass("open");
					}

					e.preventDefault();
				});
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

					e.preventDefault()
				})
			}
			
			if ($('.js-swiper-promotions').length) {
				const swiperPromotions = new Swiper('.js-swiper-promotions', {
					speed: 400,
					spaceBetween: 24,
					slidesPerView: 2,
					navigation: {
						nextEl: '.section-promotions .swiper-button-next',
						prevEl: '.section-promotions .swiper-button-prev',
					},
					pagination: {
						el: '.section-promotions .swiper-pagination',
						type: 'bullets',
						clickable: true,
					},
				});
			}
			
			if ($('.js-swiper-specialists').length) {
				const swiperPromotions = new Swiper('.js-swiper-specialists', {
					speed: 400,
					spaceBetween: 70,
					slidesPerView: 2,
					navigation: {
						nextEl: '.section-specialists .swiper-button-next',
						prevEl: '.section-specialists .swiper-button-prev',
					},
					pagination: {
						el: '.section-specialists .swiper-pagination',
						type: 'bullets',
						clickable: true,
					},
				});
			}

			if ($('.js-swiper-seo').length) {
				const swiperSeo = new Swiper('.js-swiper-seo', {
					speed: 400,
					spaceBetween: 24,
					slidesPerView: 3,
					navigation: {
						nextEl: '.section-seo .swiper-button-next',
						prevEl: '.section-seo .swiper-button-prev',
					},
				});
			}

			if ($('.js-swiper-history-gallery-thumbs').length && $('.js-swiper-history-gallery-big'.length)) {
				const swiperHistoryGalleryThumbs = new Swiper('.js-swiper-history-gallery-thumbs', {
					loop: true,
					speed: 400,
					spaceBetween: 8,
					slidesPerView: 4,
					freeMode: true,
					watchSlidesProgress: true,
				});

				const swiperHistoryGalleryBig = new Swiper('.js-swiper-history-gallery-big', {
					loop: true,
					speed: 400,
					// thumbs: {
					// 	swiper: swiperHistoryGalleryThumbs,
					// },
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
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
			
			return this
		},
	}.init();
});
