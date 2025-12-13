/**
 * WooCommerce Docs Japanese - Documentation Template Scripts
 *
 * @package WooCommerce_Docs_JA
 */

(function () {
	'use strict';

	/**
	 * Initialize all documentation template features
	 */
	function initDocsTemplate() {
		initCategoryToggle();
		initTableOfContents();
		initSmoothScroll();
		initTOCActiveState();
	}

	/**
	 * Initialize category tree toggle functionality
	 */
	function initCategoryToggle() {
		const toggleButtons = document.querySelectorAll('.wc-docs-category-toggle');

		toggleButtons.forEach(function (button) {
			button.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();

				const listItem = button.closest('.wc-docs-category-item');
				const childList = listItem.querySelector('.wc-docs-category-list');

				if (!childList) return;

				const isExpanded = button.getAttribute('aria-expanded') === 'true';
				button.setAttribute('aria-expanded', !isExpanded);

				if (isExpanded) {
					childList.style.display = 'none';
				} else {
					childList.style.display = 'block';
				}
			});
		});

		// Auto-expand current categories
		const currentItems = document.querySelectorAll('.wc-docs-category-link.current, .wc-docs-post-item.current-post');
		currentItems.forEach(function (item) {
			let parent = item.closest('.wc-docs-category-item');
			while (parent) {
				const toggle = parent.querySelector(':scope > .wc-docs-category-toggle');
				if (toggle) {
					toggle.setAttribute('aria-expanded', 'true');
					const childList = parent.querySelector(':scope > .wc-docs-category-list');
					if (childList) {
						childList.style.display = 'block';
					}
				}
				parent = parent.parentElement.closest('.wc-docs-category-item');
			}
		});
	}

	/**
	 * Generate Table of Contents from heading tags
	 */
	function initTableOfContents() {
		const tocContainer = document.getElementById('wc-docs-toc');
		if (!tocContainer) return;

		const content = document.querySelector('.wc-docs-content');
		if (!content) return;

		const headings = content.querySelectorAll('h2, h3, h4');
		if (headings.length === 0) return;

		const tocList = document.createElement('ul');

		headings.forEach(function (heading, index) {
			// Add ID to heading if it doesn't have one
			if (!heading.id) {
				heading.id = 'heading-' + index;
			}

			const listItem = document.createElement('li');
			const link = document.createElement('a');

			link.href = '#' + heading.id;
			link.textContent = heading.textContent;

			// Add level class
			const level = heading.tagName.toLowerCase();
			listItem.className = 'toc-' + level;

			link.addEventListener('click', function (e) {
				e.preventDefault();
				heading.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
				// Update URL without jumping
				history.pushState(null, null, '#' + heading.id);
			});

			listItem.appendChild(link);
			tocList.appendChild(listItem);
		});

		tocContainer.appendChild(tocList);
	}

	/**
	 * Initialize smooth scrolling for anchor links
	 */
	function initSmoothScroll() {
		const links = document.querySelectorAll('a[href^="#"]');

		links.forEach(function (link) {
			link.addEventListener('click', function (e) {
				const href = link.getAttribute('href');
				if (href === '#') return;

				const target = document.querySelector(href);
				if (!target) return;

				e.preventDefault();
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});

				// Update URL
				history.pushState(null, null, href);
			});
		});
	}

	/**
	 * Update TOC active state based on scroll position
	 */
	function initTOCActiveState() {
		const tocLinks = document.querySelectorAll('.wc-docs-toc a');
		if (tocLinks.length === 0) return;

		const headings = document.querySelectorAll('.wc-docs-content h2, .wc-docs-content h3, .wc-docs-content h4');
		if (headings.length === 0) return;

		function updateActiveTOC() {
			let currentHeading = null;
			const scrollPosition = window.scrollY + 100; // Offset for better UX

			headings.forEach(function (heading) {
				if (heading.offsetTop <= scrollPosition) {
					currentHeading = heading;
				}
			});

			// Remove all active classes
			tocLinks.forEach(function (link) {
				link.classList.remove('active');
			});

			// Add active class to current heading
			if (currentHeading) {
				const activeLink = document.querySelector('.wc-docs-toc a[href="#' + currentHeading.id + '"]');
				if (activeLink) {
					activeLink.classList.add('active');
				}
			}
		}

		// Throttle scroll event
		let ticking = false;
		window.addEventListener('scroll', function () {
			if (!ticking) {
				window.requestAnimationFrame(function () {
					updateActiveTOC();
					ticking = false;
				});
				ticking = true;
			}
		});

		// Initial check
		updateActiveTOC();
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initDocsTemplate);
	} else {
		initDocsTemplate();
	}
})();
