jQuery(document).ready(function($) {
	$("span#secondary-menu-button").click(function() {
		if ($(window).width() < 768) {
			$("div.container-sidebar").toggleClass("-expanded-submenu");
		}
	});

	getNavbarOffset = function() {
		return $("#banner").height();
	};

	$("#navbar").affix({
		offset: { top: getNavbarOffset }
	});

	$(window).resize(function() {
		$("#navbar").affix("checkPosition");
	});
});

function manageDocSidebar() {
	if (window.matchMedia("(max-width: 992px)").matches) {
		// menu above content
		$("#docSidebar").css("height", "initial");
		$("#docSidebar").css("overflow-y", "initial");
	} else {
		// side by side - menu + content
		var sidebarHeight = $("#docSidebar").height();
		console.log("sidebar at " + sidebarHeight);

		var visibleHeight = $(window).height() - $("#navbar").height();
		console.log("visible at " + visibleHeight);

		// Fix the sidebar height to the visible window
		$("#docSidebar").css("height", visibleHeight);

		// If the sidebar content is larger than visible height give it scrollability.
		if (sidebarHeight <= visibleHeight) {
			$("#docSidebar").css("overflow-y", "hidden");
		} else {
			$("#docSidebar").css("overflow-y", "scroll");
		}
	}
}

$(document).ready(function() {
	$("#docSidebar").css("overflow-x", "hidden");
	manageDocSidebar();
	$(window).on("resize", manageDocSidebar);
});

(function(document, history, location) {
	var HISTORY_SUPPORT = !!(history && history.pushState);

	var anchorScrolls = {
		ANCHOR_REGEX: /^#[^ ]+$/,
		OFFSET_HEIGHT_PX: 60,

		/**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
		init: function() {
			this.scrollToCurrent();
			$(window).on("hashchange", $.proxy(this, "scrollToCurrent"));
			$("body").on("click", "a", $.proxy(this, "delegateAnchors"));
		},

		/**
     * Return the offset amount to deduct from the normal scroll position.
     * Modify as appropriate to allow for dynamic calculations
     */
		getFixedOffset: function() {
			return this.OFFSET_HEIGHT_PX;
		},

		/**
     * If the provided href is an anchor which resolves to an element on the
     * page, scroll to it.
     * @param  {String} href
     * @return {Boolean} - Was the href an anchor.
     */
		scrollIfAnchor: function(href, pushToHistory) {
			var match, anchorOffset;

			if (!this.ANCHOR_REGEX.test(href)) {
				return false;
			}

			match = document.getElementById(href.slice(1));

			if (match) {
				anchorOffset = $(match).offset().top - this.getFixedOffset();
				$("html, body").animate({ scrollTop: anchorOffset });

				// Add the state to history as-per normal anchor links
				if (HISTORY_SUPPORT && pushToHistory) {
					history.pushState({}, document.title, location.pathname + href);
				}
			}

			return !!match;
		},

		/**
     * Attempt to scroll to the current location's hash.
     */
		scrollToCurrent: function(e) {
			if (this.scrollIfAnchor(window.location.hash) && e) {
				e.preventDefault();
			}
		},

		/**
     * If the click event's target was an anchor, fix the scroll position.
     */
		delegateAnchors: function(e) {
			var elem = e.target;

			if (this.scrollIfAnchor(elem.getAttribute("href"), true)) {
				e.preventDefault();
			}
		}
	};

	$(document).ready($.proxy(anchorScrolls, "init"));
})(window.document, window.history, window.location);
