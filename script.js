/* ═══════════════════════════════════════
   LATEST UPDATES TICKER
════════════════════════════════════════ */
const tickerItems = document.querySelectorAll(".updates-bar__item");
const tickerTrack = document.querySelector(".updates-bar__ticker");
let tickerCurrent = 0;
let tickerTimer = null;

function getScrollDuration(overflowPx) {
  // 80px per second — adjust this number to control scroll speed
  return Math.max(3, overflowPx / 80);
}

function showTickerItem(index) {
  const item = tickerItems[index];

  // Reset position and classes
  item.style.transform = "";
  item.classList.remove("updates-bar__item--scrolling");
  item.classList.add("updates-bar__item--active");

  // After slide-in transition (500ms), check if text overflows
  setTimeout(() => {
    const containerWidth = tickerTrack.offsetWidth;
    const itemWidth = item.scrollWidth;
    const overflow = itemWidth - containerWidth;

    if (overflow > 10) {
      // Text is too long — scroll it to the left then swap
      const duration = getScrollDuration(overflow);
      item.style.setProperty("--scroll-distance", `-${overflow}px`);
      item.style.setProperty("--scroll-duration", `${duration}s`);
      item.classList.add("updates-bar__item--scrolling");

      // Wait for scroll to finish + small pause, then swap
      tickerTimer = setTimeout(() => swapTicker(), (duration + 3.5) * 1000);
    } else {
      // Text fits — just wait 5 seconds then swap
      tickerTimer = setTimeout(() => swapTicker(), 5000);
    }
  }, 550);
}

function swapTicker() {
  const current = tickerItems[tickerCurrent];

  // Exit current item upward
  current.classList.remove(
    "updates-bar__item--active",
    "updates-bar__item--scrolling",
  );
  current.classList.add("updates-bar__item--exit");
  current.style.transform = "";
  current.style.removeProperty("--scroll-distance");
  current.style.removeProperty("--scroll-duration");

  setTimeout(() => {
    current.classList.remove("updates-bar__item--exit");
  }, 550);

  // Move to next item
  tickerCurrent = (tickerCurrent + 1) % tickerItems.length;
  showTickerItem(tickerCurrent);
}

// Kick off
showTickerItem(0);

/* ═══════════════════════════════════════
   HERO SLIDER
════════════════════════════════════════ */
const slides = document.querySelectorAll(".hero__slide");
const dotsContainer = document.getElementById("heroDots");
const progressBar = document.getElementById("heroProgress");

const SLIDE_DURATION = 5000; // ms per slide
let currentSlide = 0;
let autoplayTimer = null;

// Dynamically build dot buttons
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "hero__dot" + (i === 0 ? " hero__dot--active" : "");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => {
    goToSlide(i);
    resetAutoplay();
  });
  dotsContainer.appendChild(dot);
});

// Sync dot active states with current slide
function updateDots() {
  document.querySelectorAll(".hero__dot").forEach((dot, i) => {
    dot.classList.toggle("hero__dot--active", i === currentSlide);
  });
}

// Navigate to a specific slide
function goToSlide(index) {
  // Remove active from the current slide
  slides[currentSlide].classList.remove("hero__slide--active");
  slides[currentSlide].classList.add("hero__slide--prev");

  const prevIndex = currentSlide;
  setTimeout(() => {
    slides[prevIndex].classList.remove("hero__slide--prev");
  }, 950);

  // Activate new slide
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("hero__slide--active");

  updateDots();
  resetProgress();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}
function prevSlide() {
  goToSlide(currentSlide - 1);
}

// Arrow listeners
document.getElementById("heroNext").addEventListener("click", () => {
  nextSlide();
  resetAutoplay();
});
document.getElementById("heroPrev").addEventListener("click", () => {
  prevSlide();
  resetAutoplay();
});

// Progress bar
function startProgress() {
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
      progressBar.style.width = "100%";
    });
  });
}

function resetProgress() {
  startProgress();
}

// Autoplay
function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(nextSlide, SLIDE_DURATION);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

// Initialise everything
startProgress();
startAutoplay();

/* ═══════════════════════════════════════
   MOBILE HAMBURGER (ready for you to expand)
════════════════════════════════════════ */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const hamburgerIcon = document.getElementById("hamburgerIcon");
const hamburgerClose = document.getElementById("hamburgerCloseIcon");
const navbarLinks = document.querySelector(".navbar__links");

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = navbarLinks.classList.toggle("navbar__links--open");

    // Swap icons based on menu state
    hamburgerIcon.style.display = isOpen ? "none" : "block";
    hamburgerClose.style.display = isOpen ? "block" : "none";
  });
}
/* ═══════════════════════════════════════
   MOBILE DROPDOWN TOGGLES
════════════════════════════════════════ */
const dropdownItems = document.querySelectorAll(".navbar__item--dropdown");

dropdownItems.forEach((item) => {
  const link = item.querySelector(".navbar__link");
  link.addEventListener("click", (e) => {
    // Only intercept clicks when hamburger menu is open (mobile/tablet)
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      item.classList.toggle("open");
    }
  });
});

/* ═══════════════════════════════════════
   CLOSE OTHER DROPDOWNS WHEN ONE OPENS
════════════════════════════════════════ */
const allDropdownItems = document.querySelectorAll(".navbar__item--dropdown");

allDropdownItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    // Close all other open dropdowns
    allDropdownItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove("open");
      }
    });
  });
});

// Close all dropdowns when clicking outside the navbar
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar")) {
    allDropdownItems.forEach((item) => item.classList.remove("open"));
  }
});

/* ═══════════════════════════════════════
   TESTIMONIALS SLIDER
════════════════════════════════════════ */
const testimonialsTrack = document.getElementById("testimonialsTrack");
const testimonialSlides = document.querySelectorAll(".testimonials__slide");
const testimonialDotsContainer = document.getElementById("testimonialsDots");
let currentTestimonial = 0;
let testimonialAutoplay = null;

const TESTIMONIAL_DURATION = 10000; // 10 seconds per slide

// Build dots
testimonialSlides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className =
    "testimonials__dot" + (i === 0 ? " testimonials__dot--active" : "");
  dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
  dot.addEventListener("click", () => {
    goToTestimonial(i);
    resetTestimonialAutoplay();
  });
  testimonialDotsContainer.appendChild(dot);
});

function updateTestimonialDots() {
  document.querySelectorAll(".testimonials__dot").forEach((dot, i) => {
    dot.classList.toggle("testimonials__dot--active", i === currentTestimonial);
  });
}

function goToTestimonial(index) {
  currentTestimonial =
    (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
  updateTestimonialDots();
}

function startTestimonialAutoplay() {
  clearInterval(testimonialAutoplay);
  testimonialAutoplay = setInterval(() => {
    goToTestimonial(currentTestimonial + 1);
  }, TESTIMONIAL_DURATION);
}

function resetTestimonialAutoplay() {
  clearInterval(testimonialAutoplay);
  startTestimonialAutoplay();
}

document.getElementById("testimonialsNext").addEventListener("click", () => {
  goToTestimonial(currentTestimonial + 1);
  resetTestimonialAutoplay();
});

document.getElementById("testimonialsPrev").addEventListener("click", () => {
  goToTestimonial(currentTestimonial - 1);
  resetTestimonialAutoplay();
});

// Start autoplay on load
startTestimonialAutoplay();
