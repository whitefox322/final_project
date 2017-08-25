(function ($) {
	$.fn.bcSwipe = function (settings) {
		var config = {threshold: 50};
		if (settings) {
			$.extend(config, settings);
		}

		this.each(function () {
			var stillMoving = false;
			var start;

			if ('ontouchstart' in document.documentElement) {
				this.addEventListener('touchstart', onTouchStart, false);
			}

			function onTouchStart(e) {
				if (e.touches.length == 1) {
					start = e.touches[0].pageX;
					stillMoving = true;
					this.addEventListener('touchmove', onTouchMove, false);
				}
			}

			function onTouchMove(e) {
				if (stillMoving) {
					var x = e.touches[0].pageX;
					var difference = start - x;
					if (Math.abs(difference) >= config.threshold) {
						cancelTouch();
						if (difference > 0) {
							$(this).carousel('next');
						}
						else {
							$(this).carousel('prev');
						}
					}
				}
			}

			function cancelTouch() {
				this.removeEventListener('touchmove', onTouchMove);
				start = null;
				stillMoving = false;
			}
		});

		return this;
	};
})(jQuery);

$(function () {

	var
		CAROUSEL_ACTIVE_INDICATOR_CLASSES = ["active", "news-slider__indicator--active"];
	$(".news-slider__slide").on('slid.bs.carousel', function (e) {
		var
			$root = $(this).parents(".news-slider"),
			$carousel = $root.find(".carousel-inner"),
			$indicatorsContainer = $root.find(".news-slider__indicators"),
			carouselChildren = $carousel.get(0).children,
			that = $root.find(".item.active"),
			index = whichChild(that.get(0)),
			indicatorToSelect = $indicatorsContainer.get(0).children.item(index);

		for (var i in CAROUSEL_ACTIVE_INDICATOR_CLASSES) {
			$($indicatorsContainer.get(0).children).removeClass(CAROUSEL_ACTIVE_INDICATOR_CLASSES[i]);
			$(indicatorToSelect).addClass(CAROUSEL_ACTIVE_INDICATOR_CLASSES[i]);
		}
	});

	$(".news-slider__indicator-wrapper").click(function () {
		location = this.href;
	});

	$(".news-slider__indicator-wrapper").hover(function () {
		$(".news-slider__slide").carousel(
			parseInt($(this).parents(".news-slider__indicator")
				.attr("data-slide-to")
			)
		);
	});

	$(".objects-filter-form__expand-btn").click(function () {
		var $form = $(this).parents(".objects-filter-form"),
			$fieldsets = $form.find(".objects-filter-form__fieldsets-container");

		$fieldsets.toggleClass("objects-filter-form__fieldsets-container--visible");

		return false;
	});

	$(".news-slider__item").click(function() {
		var href = $(this).attr("data-href");
		if (href) {
			location.assign(href);
		} else {
			console.log("no href specified. can't navigate");
		}
	});

	$('.carousel').bcSwipe({threshold: 50});
	// Hammer(".carousel").on("swipeleft", function () {
	// 	$(this).carousel('next');
	// });
	// Hammer(".carousel").on("swiperight", function () {
	// 	$(this).carousel('prev');
	// });

	// $(".carousel").swiperight(function() {
	// 	$(this).carousel('prev');
	// });
	// $(".carousel").swipeleft(function() {
	// 	$(this).carousel('next');
	// });

	var
		slider = document.querySelector(".objects-filter-form__range"),
		priceFrom = document.querySelector(".objects-filter-form__price-from"),
		priceTo = document.querySelector(".objects-filter-form__price-to");
	if (slider) {
		var
			fromValue = parseInt(priceFrom.value),
			toValue = parseInt(priceTo.value),
			min = parseInt(slider.dataset.min),
			max = parseInt(slider.dataset.max);
		noUiSlider.create(slider, {
			start: [fromValue, toValue],
			connect: true,
			range: {
				'min': [min],
				'max': [max]
			}
		});
		slider.noUiSlider.on('update', function (values, handle) {
			if (handle) {
				priceTo.value = values[handle];
			} else {
				priceFrom.value = values[handle];
			}
		});
	}
	var $objectRatingInput = $(".rating-value");
	$objectRatingInput.rating({
		size: "xs",
		step: 1,
		max: 5,
		min: 0,
		showCaption: false,
		showClear: false,
		containerClass: "star-rating"
	});
	$objectRatingInput.on('rating.change', function (event, value, caption) {
		var objectId = $("#current-object-id").val();
		var companyId = $("#current-company-id").val();
		$.post("/api/ratings", {
			objectId: objectId,
			companyId: companyId,
			value: value
		}).done(function (response) {
		}).error(function(e) {
			console.error(e);
		});
	});
	$(".object-gallery__pic-link").fancybox({

	});
});
function whichChild(elem) {
	var i = 0;
	while ((elem = elem.previousElementSibling) != null) ++i;
	return i;
}