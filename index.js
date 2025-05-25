const modalBackdrop = document.getElementById("modalBackdrop");
const modalContainer = document.getElementById("modalContainer");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalCategories = document.getElementById("modalCategories");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Get all product cards
const productCards = document.querySelectorAll(".product-card");

// Function to open modal with product data
function openModal(card) {
  // Get data from card
  const productId = card.dataset.id;
  const productTitle = card.dataset.title;
  const productDescription = card.dataset.description;
  const productImage = card.dataset.image;
  const productCategories = card.dataset.categories.split(",");

  // Set modal content
  modalImage.src = productImage;
  modalImage.alt = productTitle;
  modalTitle.textContent = productTitle;
  modalDescription.textContent = productDescription;

  // Clear and populate categories
  modalCategories.innerHTML = "";
  productCategories.forEach((category) => {
    const categoryTag = document.createElement("span");
    categoryTag.className =
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200";
    categoryTag.textContent = category;
    modalCategories.appendChild(categoryTag);
  });

  // Show modal with animation
  modalBackdrop.classList.remove("hidden");
  setTimeout(() => {
    modalContainer.classList.add("scale-100");
    modalContainer.classList.remove("scale-95", "opacity-0");
  }, 10);
}

// Function to close modal
function closeModal() {
  // Hide modal with animation
  modalContainer.classList.add("scale-95", "opacity-0");
  modalContainer.classList.remove("scale-100");

  setTimeout(() => {
    modalBackdrop.classList.add("hidden");
  }, 300);
}

// Add click event to product cards
productCards.forEach((card) => {
  card.addEventListener("click", () => {
    openModal(card);
  });
});

// Close modal when close button is clicked
modalCloseBtn.addEventListener("click", closeModal);

// Close modal when clicking outside
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) {
    closeModal();
  }
});

// Close modal when Escape key is pressed
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalBackdrop.classList.contains("hidden")) {
    closeModal();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const loadingEl = document.querySelector(".loading");
  const errorEl = document.querySelector(".error-message");
  const successEl = document.querySelector(".sent-message");

  // Telegram Bot Configuration
  const TELEGRAM_BOT_TOKEN = "7471873187:AAHyO1pnz30aXf-K7kJvKe3WsgPFdE4VyLE";
  const TELEGRAM_CHAT_ID = "7241567559";

  // Form submission handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      showError();
      autoHideMessages();
      return;
    }

    showLoading();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await sendTelegramMessage(data);
      showSuccess();
      form.reset();
      resetFloatingLabels();
      autoHideMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      showError();
      autoHideMessages();
    }
  });

  // Send message via Telegram Bot
  async function sendTelegramMessage(data) {
    const message = formatMessage(data);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to Telegram");
    }

    return response.json();
  }

  // Format form data into readable message
  function formatMessage(data) {
    return `
🔔 <b>New Partnership Request - AZB Dried Fruits</b>

👤 <b>Contact Information:</b>
• Name/Company: ${data.name || "Not provided"}
• Email: ${data.email || "Not provided"}
• Phone: ${data.phone || "Not provided"}
• Country: ${data.country || "Not provided"}

🏢 <b>Business Type:</b> ${
      data.business_type ? data.business_type.charAt(0).toUpperCase() + data.business_type.slice(1) : "Not specified"
    }

💬 <b>Message:</b>
${data.message || "No message provided"}

📅 <b>Submitted:</b> ${new Date().toLocaleString()}
        `.trim();
  }

  // Status display functions
  function showLoading() {
    hideAllMessages();
    loadingEl.classList.remove("hidden");
  }

  function showSuccess() {
    hideAllMessages();
    successEl.classList.remove("hidden");
  }

  function showError() {
    hideAllMessages();
    errorEl.classList.remove("hidden");
  }

  function hideAllMessages() {
    loadingEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    successEl.classList.add("hidden");
  }

  function autoHideMessages() {
    setTimeout(() => {
      hideAllMessages();
    }, 5000);
  }

  // Form validation
  function validateForm() {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }
    });

    // Email validation
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
      email.classList.add("error");
      isValid = false;
    }

    return isValid;
  }

  // Floating label functionality
  const inputs = document.querySelectorAll(".form-floating-label input, .form-floating-label textarea");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });

    // Check if input has value on load
    if (input.value) {
      input.parentElement.classList.add("focused");
    }
  });

  function resetFloatingLabels() {
    document.querySelectorAll(".form-floating-label").forEach((label) => {
      label.classList.remove("focused");
    });
  }

  // Real-time validation
  document.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.classList.add("error");
      } else {
        this.classList.remove("error");
      }
    });

    field.addEventListener("input", function () {
      if (this.classList.contains("error") && this.value.trim()) {
        this.classList.remove("error");
      }
    });
  });

  // Phone number formatting
  document.getElementById("phone").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length > 0) {
      if (value.length <= 3) {
        formattedValue = value;
      } else if (value.length <= 6) {
        formattedValue = value.slice(0, 3) + "-" + value.slice(3);
      } else {
        formattedValue = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 10);
      }
    }

    e.target.value = formattedValue;
  });

  // Keyboard navigation for radio buttons
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        this.checked = true;
      }
    });
  });

  // Staggered animation for form elements
  document.querySelectorAll(".staggered-animation").forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
  });

  // Smooth hover effects for buttons
  document.querySelectorAll(".neo-button").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Parallax effect for floating elements
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".floating-elements");

    parallaxElements.forEach((el, i) => {
      const speed = 0.5 + i * 0.1;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
