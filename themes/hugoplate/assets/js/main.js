// main script
(function () {
  "use strict";

  // Mobile Menu Toggle
  // ----------------------------------------
  let navToggle = document.querySelector("#nav-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navLabel = document.querySelector("label[for='nav-toggle']");

  // Function to check if we're on mobile
  const isMobile = () => window.innerWidth <= 991;

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
    if (checked) {
      navMenu?.classList.add('navbar-active');
      document.body.style.overflow = 'hidden';
      closeAllSubmenus();
      ensureBackButtons();
    } else {
      navMenu?.classList.remove('navbar-active');
      document.body.style.overflow = '';
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
      toggler.addEventListener('click', (e) => {
        if (isMobile()) return; // ignore on mobile
        e.preventDefault();
        e.stopPropagation();
        const current = e.currentTarget.closest('.nav-dropdown');
        const was = current.classList.contains('active');
        closeAllDropdowns();
        if (!was) current.classList.add('active');
      });
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
})();
