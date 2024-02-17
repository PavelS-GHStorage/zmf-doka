"use strict";

var body = document.querySelector("body");

window.onload = () => body.classList.add("page-loaded");

$(function () {
	var $body = $("body");

	window.doka = {};

	window.doka.obj = {
		init: function init() {
			var _self = this;
			var headerBottom = $(".header__bottom");

			if ($(".js-nav-toggle").length) {
				$(".js-nav-toggle").on("click", function (e) {
					$(this).toggleClass("active");
					if ($(".nav__second-level").length) {
						$(".nav__second-level").toggleClass("open");
					}

					e.preventDefault();
				});
			}

			const swiperPromotions = new Swiper('.js-swiper-promotions', {
				speed: 400,
				spaceBetween: 24,
				slidesPerView: 2,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				pagination: {
					el: '.swiper-pagination',
					type: 'bullets',
					clickable: true,
				},
			});


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

			$(window).on("scroll", function () {
				var scrollTop = $(window).scrollTop();
				var windowHeight = $(window).height();

				if (headerBottom.length) {
					if (scrollTop >= headerBottom.offset().top) {
						headerBottom.addClass("fixed");
						return;
					}

					headerBottom.removeClass("fixed");
				}
			});
		},
	}.init();
});

