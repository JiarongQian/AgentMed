window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    $('.navbar-burger').on('click', function() {
        var target = $(this).attr('data-target');
        $(this).toggleClass('is-active');
        $('#' + target).toggleClass('is-active');
    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 5000,
			navigation: true,
			navigationKeys: true,
			navigationSwipe: true,
			pagination: false
    }

    // Function to initialize carousel by ID
    function initCarouselById(carouselId) {
        if (!carouselId) return;
        
        var selector = '#' + carouselId;
        
        // Destroy existing carousel if it exists
        if (bulmaCarousel.instances && bulmaCarousel.instances[carouselId]) {
            try {
                bulmaCarousel.instances[carouselId].destroy();
                delete bulmaCarousel.instances[carouselId];
            } catch(e) {
                // Ignore destroy errors
            }
        }
        
        // Initialize carousel using selector
        setTimeout(function() {
            try {
                bulmaCarousel.attach(selector, options);
                console.log('Carousel initialized:', carouselId);
            } catch(e) {
                console.log('Carousel init error for', carouselId, ':', e);
                // Retry once
                setTimeout(function() {
                    try {
                        bulmaCarousel.attach(selector, options);
                    } catch(e2) {
                        console.log('Carousel retry error:', e2);
                    }
                }, 300);
            }
        }, 200);
    }

    // Initialize all carousels on page load
    setTimeout(function() {
        // Initialize all carousels that are not inside tab-content (like dataset)
        $('.carousel').not('.tab-content .carousel').each(function() {
            var carouselId = $(this).attr('id');
            if (carouselId) {
                try {
                    bulmaCarousel.attach('#' + carouselId, options);
                    console.log('Initialized carousel:', carouselId);
                } catch(e) {
                    console.log('Error initializing carousel:', carouselId, e);
                }
            }
        });
        
        // Initialize carousel for the first visible tab
        var firstTabContent = $('.tab-content:visible');
        if (firstTabContent.length > 0) {
            var firstCarousel = firstTabContent.find('.carousel');
            if (firstCarousel.length > 0) {
                var firstCarouselId = firstCarousel.attr('id');
                if (firstCarouselId) {
                    try {
                        bulmaCarousel.attach('#' + firstCarouselId, options);
                        console.log('Initialized first tab carousel:', firstCarouselId);
                    } catch(e) {
                        console.log('Error initializing first tab carousel:', e);
                    }
                }
            }
        }
    }, 500);
	
    bulmaSlider.attach();

    // Tab switching functionality
    $('.tab-item').on('click', function() {
        var tabId = $(this).attr('data-tab');
        
        // Remove active class from all tabs and content
        $('.tab-item').removeClass('is-active');
        $('.tab-content').hide();
        
        // Stop only tab carousels before switching (not dataset carousel)
        $('.tab-content .carousel').each(function() {
            var carouselId = $(this).attr('id');
            if (carouselId && bulmaCarousel.instances && bulmaCarousel.instances[carouselId]) {
                try {
                    bulmaCarousel.instances[carouselId].destroy();
                    delete bulmaCarousel.instances[carouselId];
                } catch(e) {
                    // Ignore errors
                }
            }
        });
        
        // Add active class to clicked tab and show corresponding content
        $(this).addClass('is-active');
        var activeContent = $('#' + tabId);
        activeContent.show();
        
        // Reinitialize carousel in the active tab
        setTimeout(function() {
            var activeCarousel = activeContent.find('.carousel');
            if (activeCarousel.length > 0) {
                var activeCarouselId = activeCarousel.attr('id');
                if (activeCarouselId) {
                    try {
                        bulmaCarousel.attach('#' + activeCarouselId, options);
                        console.log('Initialized tab carousel:', activeCarouselId);
                    } catch(e) {
                        console.log('Error initializing tab carousel:', e);
                    }
                }
            }
        }, 300);
    });

})
