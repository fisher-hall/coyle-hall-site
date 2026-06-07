// main script
(function () {
  "use strict";

  // Mobile Menu Toggle
  // ----------------------------------------
  let navToggle = document.querySelector("#nav-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navLabel = document.querySelector("label[for='nav-toggle']");

  // Function to check if we're on mobile
  const isMobile = () => window.innerWidth < 1024;

  // Close all submenus
  const closeAllSubmenus = () => {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("mobile-submenu-active");
    });
    navMenu?.classList.remove("submenu-open");
  };

  // Create back button for mobile submenus
  const createBackButton = (title) => {
    const backButton = document.createElement("button");
    backButton.className = "mobile-back-button";
    backButton.innerHTML = `
      <i class="fa-solid fa-angle-left text-2xl"></i>
      Back
    `; // Font Awesome icon
    return backButton;
  };

  // --- Simplified Reliable Mobile Submenu Logic ---
  const handleNavToggleChange = (checked) => {
    const root = document.documentElement;
    if (checked) {
      document.body.style.overflow = 'hidden';
      root.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
      root.classList.add('mobile-menu-open');
      closeAllSubmenus();
      ensureBackButtons();
    } else {
      document.body.style.overflow = '';
      root.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
      root.classList.remove('mobile-menu-open');
      closeAllSubmenus();
    }
  };

  const ensureBackButtons = () => {
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const list = dropdown.querySelector('.nav-dropdown-list');
      if (!list) return;
      if (!list.querySelector('.mobile-back-button')) {
        const backBtn = createBackButton('Back');
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.remove('mobile-submenu-active');
          if (!document.querySelector('.nav-dropdown.mobile-submenu-active')) {
            navMenu?.classList.remove('submenu-open');
          }
        });
        list.insertBefore(backBtn, list.firstChild);
      }
      // Submenu anchor clicks: allow navigation, then close menu
      list.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (isMobile()) {
            if (navToggle) navToggle.checked = false;
            handleNavToggleChange(false);
          }
        }, { once: false });
      });
    });
  };

  const bindMobileTopLevel = () => {
    document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
      if (link.dataset.mobileBound === '1') return; // already bound
    // Accessibility semantics for mobile
    link.setAttribute('role', 'button');
    link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        if (!isMobile()) return; // desktop handled elsewhere
        if (!navToggle?.checked) return; // menu closed
        e.preventDefault();
        e.stopPropagation();
        const parent = link.closest('.nav-dropdown');
        const was = parent.classList.contains('mobile-submenu-active');
        closeAllSubmenus();
        if (!was) {
          parent.classList.add('mobile-submenu-active');
          navMenu?.classList.add('submenu-open');
      // rotate arrow if present
      const svg = link.querySelector('svg');
      if (svg) svg.style.transform = 'rotate(-90deg)';
        } else {
          navMenu?.classList.remove('submenu-open');
        }
      });
      link.dataset.mobileBound = '1';
    });
    // Capture taps on the LI padding (outside the span)
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
      if (dd.dataset.mobileProxy === '1') return;
      dd.addEventListener('click', (e) => {
        if (!isMobile()) return;
        if (!navToggle?.checked) return;
        if (e.target.closest('.nav-link')) return; // already handled
        const link = dd.querySelector(':scope > .nav-link');
        if (link) link.click();
      });
      dd.dataset.mobileProxy = '1';
    });
  };

  const initializeMobileMenu = () => {
    navToggle = document.querySelector('#nav-toggle'); // refresh reference in case of re-render
    navToggle?.addEventListener('change', (e) => handleNavToggleChange(e.target.checked));
    bindMobileTopLevel();

    // Outside click (only when open)
    document.addEventListener('click', (e) => {
      if (isMobile() && navToggle?.checked && !e.target.closest('.navbar')) {
        navToggle.checked = false;
        handleNavToggleChange(false);
      }
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) {
        if (navToggle?.checked) navToggle.checked = false;
        handleNavToggleChange(false);
        document.querySelectorAll('.nav-dropdown.mobile-submenu-active').forEach(d => d.classList.remove('mobile-submenu-active'));
  // Remove any residual mobile back buttons when moving to desktop
  document.querySelectorAll('.mobile-back-button').forEach(btn => btn.remove());
      } else {
        bindMobileTopLevel();
      }
    });
  };

  // Desktop dropdown functionality (still applies on desktop sizes)
  const desktopSetup = () => {
    const dropdownMenuToggler = document.querySelectorAll('.nav-dropdown > .nav-link');
    const dropdownItems = document.querySelectorAll('.nav-dropdown');
    const closeAllDropdowns = () => dropdownItems.forEach(i => i.classList.remove('active'));
    
    dropdownMenuToggler.forEach(toggler => {
      // Remove any existing desktop listener first
      if (toggler.dataset.desktopBound === '1') return;
      
      const dropdown = toggler.closest('.nav-dropdown');
      
      // Click handler for desktop
      const desktopClickHandler = (e) => {
        if (isMobile()) return; // ignore on mobile
        e.preventDefault();
        e.stopPropagation();
        const current = e.currentTarget.closest('.nav-dropdown');
        const was = current.classList.contains('active');
        closeAllDropdowns();
        if (!was) current.classList.add('active');
      };
      
      // Hover handlers for desktop
      const mouseEnterHandler = () => {
        if (isMobile()) return; // ignore on mobile
        closeAllDropdowns();
        dropdown.classList.add('active');
      };
      
      const mouseLeaveHandler = () => {
        if (isMobile()) return; // ignore on mobile
        dropdown.classList.remove('active');
      };
      
      toggler.addEventListener('click', desktopClickHandler);
      dropdown.addEventListener('mouseenter', mouseEnterHandler);
      dropdown.addEventListener('mouseleave', mouseLeaveHandler);
      toggler.dataset.desktopBound = '1';
    });
    
    document.addEventListener('click', (e) => {
      if (isMobile()) return;
      if (!e.target.closest('.nav-dropdown')) closeAllDropdowns();
    });
  };
  desktopSetup();

  // Initialize mobile menu functionality
  initializeMobileMenu();

  // Testimonial Slider
  // ----------------------------------------
  new Swiper(".testimonial-slider", {
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: ".testimonial-slider-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });


  // Inline Search Bar Toggle
  // ----------------------------------------
  const searchButton = document.querySelector('[data-target="search-modal"]');
  const searchNavMenu = document.querySelector('#nav-menu');
  const navbar = document.querySelector('.header .navbar');
  const mobileSearchSlot = document.querySelector('#mobile-search-slot');
  let isSearchActive = false;
  let searchContainer = null;

  const createSearchBar = () => {
    const container = document.createElement('div');
    container.className = 'inline-search-container';
    container.innerHTML = `
      <i class="fa-solid fa-search search-icon-inside"></i>
      <input 
        type="text" 
        id="inline-search-input"
        class="inline-search-input" 
        placeholder="Search..."
        autocomplete="off"
      />
    `;
    
    // Make clicking anywhere in the container focus the input
    container.addEventListener('click', (e) => {
      const input = document.getElementById('inline-search-input');
      if (input) {
        input.focus();
      }
    });
    
    return container;
  };

  const createInlineResultsContainer = () => {
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'inline-search-results';
    resultsDiv.className = 'inline-search-results';
    return resultsDiv;
  };

  const displayInlineResults = (results, query, resultsDiv) => {
    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="p-4 text-white">No results found</div>';
      resultsDiv.style.display = 'block';
      return;
    }

    const highlightText = (text, query) => {
      if (!text || !query) return text;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-300 text-gray-900 px-1 rounded">$1</mark>');
    };

    const html = results.slice(0, 10).map(page => {
      if (!page) return '';
      const title = highlightText(page.title, query);
      const description = highlightText(page.description || '', query);
      
      return `
        <a href="${page.url}" class="search-result-item">
          <div class="search-result-title">${title}</div>
          ${description ? `<div class="search-result-description">${description}</div>` : ''}
        </a>
      `;
    }).join('');

    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
  };

  const showInlineSearch = () => {
    if (isSearchActive) return;
    isSearchActive = true;

    // Morph search icon to X
    const searchIcon = searchButton.querySelector('i');
    searchIcon.style.transform = 'rotate(90deg) scale(0)';
    searchIcon.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
      searchIcon.classList.remove('fa-search');
      searchIcon.classList.add('fa-times');
      searchIcon.style.transform = 'rotate(0deg) scale(1)';
    }, 150);

    searchContainer = createSearchBar();
    const isDesktop = window.innerWidth >= 1024;

    // Create results container
    const resultsContainer = createInlineResultsContainer();
    document.body.appendChild(resultsContainer);

    if (!isDesktop) {
      // Mobile: slide in the search bar below the navbar via CSS (mobile-search-active class)
      document.body.classList.add('mobile-search-active');
      if (mobileSearchSlot) {
        mobileSearchSlot.appendChild(searchContainer);
      } else {
        searchNavMenu.parentElement.insertBefore(searchContainer, searchNavMenu);
      }
    } else {
      // Desktop: hide the element BEFORE inserting so the browser never renders it visible
      searchContainer.style.opacity = '0';

      navbar?.classList.add('desktop-search-active');
      searchNavMenu.parentElement.insertBefore(searchContainer, searchNavMenu);

      // Fix width so left:50% + translateX(-50%) works correctly
      const searchWidth = Math.min(900, window.innerWidth * 0.6);
      searchContainer.style.width = `${searchWidth}px`;

      // Force a synchronous reflow so opacity:0 is committed as the "before" state,
      // then add the transition — only future changes will animate, not the insertion.
      void searchContainer.offsetWidth;
      searchContainer.style.transition = 'opacity 0.2s ease';
    }

    // Animate nav menu out on desktop
    if (isDesktop) {
      searchNavMenu.style.opacity = '0';
      searchNavMenu.style.transform = 'translateX(-20px)';
      searchNavMenu.style.transition = 'opacity 0.1s ease, transform 0.3s ease';
    }

    setTimeout(() => {
      if (isDesktop) searchNavMenu.style.display = 'none';

      // Fade in — element is already centered via CSS, just reveal it
      requestAnimationFrame(() => {
        if (isDesktop) searchContainer.style.opacity = '1';
        // Focus the input
        const input = document.getElementById('inline-search-input');
        const resultsDiv = document.getElementById('inline-search-results');
        
        if (input) {
          input.focus();
          
          // Trigger search on input
          input.addEventListener('input', async function(e) {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
              resultsDiv.innerHTML = '';
              resultsDiv.style.display = 'none';
              return;
            }
            
            // Load and search
            try {
              const response = await fetch('/searchindex.json');
              const searchData = await response.json();
              
              // Simple search
              const results = searchData.filter(page => {
                const searchText = (page.title + ' ' + (page.description || '') + ' ' + (page.content || '')).toLowerCase();
                return searchText.includes(query.toLowerCase());
              });
              
              displayInlineResults(results, query, resultsDiv);
            } catch (error) {
              console.error('Search error:', error);
              resultsDiv.innerHTML = '<div class="p-4 text-white">Search error occurred</div>';
              resultsDiv.style.display = 'block';
            }
          });
          
          // Add blur handler to refocus on container click
          searchContainer.addEventListener('click', () => {
            input.focus();
          });
          
          // Prevent input blur when clicking inside container
          input.addEventListener('blur', (e) => {
            // Small delay to allow click to register first
            setTimeout(() => {
              if (isSearchActive && document.activeElement !== input) {
                input.focus();
              }
            }, 100);
          });
        }
      }); // end requestAnimationFrame
    }, 300);
  };

  const hideInlineSearch = () => {
    if (!isSearchActive) return;
    isSearchActive = false;

    // Hide and remove inline search results
    const resultsDiv = document.getElementById('inline-search-results');
    if (resultsDiv) {
      resultsDiv.style.display = 'none';
      resultsDiv.innerHTML = '';
      resultsDiv.remove();
    }

    // Morph X back to search icon
    const searchIcon = searchButton.querySelector('i');
    searchIcon.style.transform = 'rotate(90deg) scale(0)';
    searchIcon.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
      searchIcon.classList.remove('fa-times');
      searchIcon.classList.add('fa-search');
      searchIcon.style.transform = 'rotate(0deg) scale(1)';
    }, 150);

    // Fade out (transition was set at show-time; no-op on mobile where opacity isn't managed here)
    if (searchContainer.style.transition) searchContainer.style.opacity = '0';
    const wasDesktop = window.innerWidth >= 1024;
    document.body.classList.remove('mobile-search-active');
    navbar?.classList.remove('desktop-search-active');

    setTimeout(() => {
      searchContainer.remove();
      searchContainer = null;

      // Only restore nav menu inline styles on desktop; on mobile the CSS
      // checkbox-hack controls nav menu visibility — don't override it.
      if (wasDesktop) {
        searchNavMenu.style.display = '';
        searchNavMenu.style.opacity = '0';
        searchNavMenu.style.transform = 'translateX(-20px)';
        searchNavMenu.style.transition = 'opacity 0.2s ease, transform 0.3s ease';
        setTimeout(() => {
          searchNavMenu.style.opacity = '1';
          searchNavMenu.style.transform = 'translateX(0)';
        }, 10);
      }
    }, 300);
  };

  // Hide the old search modal permanently
  const searchModal = document.getElementById('search-modal');
  if (searchModal) {
    searchModal.style.display = 'none !important';
    searchModal.remove();
  }

  // Intercept search button click
  if (searchButton) {
    searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (isSearchActive) {
        hideInlineSearch();
      } else {
        showInlineSearch();
      }
      return false;
    }, true);
  }

  // On mobile: if search is active, hamburger first closes search, then opens menu
  if (navLabel && navToggle) {
    navLabel.addEventListener('click', (e) => {
      if (!isMobile() || !isSearchActive) return;
      e.preventDefault();
      e.stopPropagation();
      hideInlineSearch();
      navToggle.checked = true;
      handleNavToggleChange(true);
    });
  }

  // Close search on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSearchActive) {
      hideInlineSearch();
    }
  });

  // Automatically apply .interactive-tilt to all non-banner images
  document.querySelectorAll('img:not([id*="banner"]):not([class*="banner"]):not(.no-tilt)').forEach((img) => {
    img.classList.add('interactive-tilt');
  });

  // Interactive Image Lift Effect with Smooth Entry and Corner Lift
  // ----------------------------------------
  document.querySelectorAll('.interactive-tilt').forEach((img) => {
    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;

      const rotateX = yPercent * -3; // tilt up/down toward cursor (was -6)
      const rotateY = xPercent * 3;  // tilt left/right toward cursor (was 6)
      const lift = 3; // how much it moves forward slightly (was 5)

      img.style.transition = 'transform 0.05s ease-out';
      img.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translate(${xPercent * lift}px, ${yPercent * lift}px)
        scale(1.015)
      `;
      img.style.boxShadow = `${-xPercent * 4}px ${-yPercent * 4}px 15px rgba(0,0,0,0.15)`;
    });

    img.addEventListener('mouseenter', () => {
      // Ensure transition includes scale (transform covers scale)
      img.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    img.addEventListener('mouseleave', () => {
      // Ensure transition includes scale (transform covers scale)
      img.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out';
      img.style.transform = '';
      img.style.boxShadow = '';
    });
  });
})();
// --- SIMPLE NAVBAR SCROLL FADE (WINDOW-LEVEL) ---
document.addEventListener("DOMContentLoaded", function () {
  function updateNavbarBackground() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollTop > 10) {
      document.body.classList.add("scrolled-navbar");
    } else {
      document.body.classList.remove("scrolled-navbar");
    }
  }

  updateNavbarBackground();
  window.addEventListener("scroll", updateNavbarBackground, { passive: true });
});
