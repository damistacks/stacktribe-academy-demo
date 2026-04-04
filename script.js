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

/* ═══════════════════════════════════════
   CONTACT FORM — VALIDATION & SUBMISSION
════════════════════════════════════════ */
const contactForm = document.querySelector(".contact__form");
const submitBtn = document.querySelector(".contact__submit");

// ── Validation Rules ──
function validateName(value) {
  if (!value.trim()) return "Name is required.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "Email address is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim()))
    return "Please enter a valid email address.";
  return "";
}

function validatePhone(value) {
  if (!value.trim()) return "Phone number is required.";
  const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
  if (!phoneRegex.test(value.trim()))
    return "Please enter a valid phone number.";
  return "";
}

function validateInquiry(value) {
  if (!value) return "Please select an inquiry type.";
  return "";
}

function validateMessage(value) {
  if (!value.trim()) return "Message is required.";
  if (value.trim().length < 10)
    return "Message must be at least 10 characters.";
  return "";
}

// ── Show / Clear Error ──
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.classList.add("contact__input--error");

  let errorEl = field.parentElement.querySelector(".contact__error");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.className = "contact__error";
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  field.classList.remove("contact__input--error");
  field.classList.add("contact__input--valid");

  const errorEl = field.parentElement.querySelector(".contact__error");
  if (errorEl) errorEl.remove();
}

// ── Real-time Validation on Blur ──
document.getElementById("contact-name").addEventListener("blur", function () {
  const err = validateName(this.value);
  err ? showError("contact-name", err) : clearError("contact-name");
});

document.getElementById("contact-email").addEventListener("blur", function () {
  const err = validateEmail(this.value);
  err ? showError("contact-email", err) : clearError("contact-email");
});

document.getElementById("contact-phone").addEventListener("blur", function () {
  const err = validatePhone(this.value);
  err ? showError("contact-phone", err) : clearError("contact-phone");
});

document
  .getElementById("contact-inquiry")
  .addEventListener("change", function () {
    const err = validateInquiry(this.value);
    err ? showError("contact-inquiry", err) : clearError("contact-inquiry");
  });

document
  .getElementById("contact-message")
  .addEventListener("blur", function () {
    const err = validateMessage(this.value);
    err ? showError("contact-message", err) : clearError("contact-message");
  });

// ── Clear valid state on focus ──
[
  "contact-name",
  "contact-email",
  "contact-phone",
  "contact-inquiry",
  "contact-message",
].forEach((id) => {
  document.getElementById(id).addEventListener("focus", function () {
    this.classList.remove("contact__input--valid");
  });
});

// ── Form Submit ──
contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const phone = document.getElementById("contact-phone").value;
  const inquiry = document.getElementById("contact-inquiry").value;
  const message = document.getElementById("contact-message").value;

  // Validate all fields
  const errors = {
    "contact-name": validateName(name),
    "contact-email": validateEmail(email),
    "contact-phone": validatePhone(phone),
    "contact-inquiry": validateInquiry(inquiry),
    "contact-message": validateMessage(message),
  };

  let hasError = false;
  Object.entries(errors).forEach(([id, err]) => {
    if (err) {
      showError(id, err);
      hasError = true;
    } else {
      clearError(id);
    }
  });

  if (hasError) return;

  // Loading state
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://formspree.io/f/xpqyeboq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, phone, inquiry, message }),
    });

    if (response.ok) {
      // Store original form HTML
      const originalFormHTML = contactForm.innerHTML;

      // Success — show message
      contactForm.innerHTML = `
        <div class="contact__success">
          <div class="contact__success-icon">✓</div>
          <h3 class="contact__success-title">Message Sent!</h3>
          <p class="contact__success-text">
            Thank you for reaching out, <strong>${name}</strong>. 
            We'll get back to you within 24 hours.
          </p>
          <p class="contact__success-countdown">
            Form resets in <span id="countdownTimer">8</span> seconds...
          </p>
        </div>
      `;

      // Countdown then restore form
      let seconds = 8;
      const countdownInterval = setInterval(() => {
        seconds--;
        const timerEl = document.getElementById("countdownTimer");
        if (timerEl) timerEl.textContent = seconds;

        if (seconds <= 0) {
          clearInterval(countdownInterval);
          contactForm.innerHTML = originalFormHTML;
          reattachValidation(); // reattach event listeners
        }
      }, 1000);
    } else {
      throw new Error("Submission failed");
    }
  } catch (err) {
    submitBtn.textContent = "Send Message";
    submitBtn.disabled = false;

    // Show general error
    let generalError = contactForm.querySelector(".contact__general-error");
    if (!generalError) {
      generalError = document.createElement("p");
      generalError.className = "contact__general-error";
      contactForm.appendChild(generalError);
    }
    generalError.textContent =
      "Something went wrong. Please try again or contact us directly.";
  }

  function reattachValidation() {
    document
      .getElementById("contact-name")
      .addEventListener("blur", function () {
        const err = validateName(this.value);
        err ? showError("contact-name", err) : clearError("contact-name");
      });

    document
      .getElementById("contact-email")
      .addEventListener("blur", function () {
        const err = validateEmail(this.value);
        err ? showError("contact-email", err) : clearError("contact-email");
      });

    document
      .getElementById("contact-phone")
      .addEventListener("blur", function () {
        const err = validatePhone(this.value);
        err ? showError("contact-phone", err) : clearError("contact-phone");
      });

    document
      .getElementById("contact-inquiry")
      .addEventListener("change", function () {
        const err = validateInquiry(this.value);
        err ? showError("contact-inquiry", err) : clearError("contact-inquiry");
      });

    document
      .getElementById("contact-message")
      .addEventListener("blur", function () {
        const err = validateMessage(this.value);
        err ? showError("contact-message", err) : clearError("contact-message");
      });

    [
      "contact-name",
      "contact-email",
      "contact-phone",
      "contact-inquiry",
      "contact-message",
    ].forEach((id) => {
      document.getElementById(id).addEventListener("focus", function () {
        this.classList.remove("contact__input--valid");
      });
    });

    // Reattach submit listener
    contactForm.addEventListener("submit", handleSubmit);
  }
});
