// Contact form validation:
//  - no field may be empty
//  - email must be in a valid format
//  - phone number must contain only digits

const contactForm = document.querySelector("#contact-form");
const successMessage = document.querySelector("#form-success");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_ONLY = /^\d+$/;

// Each rule returns an error message, or "" when the value is fine.
const rules = {
  name: function (value) {
    if (value === "") return "Enter your name.";
    return "";
  },
  email: function (value) {
    if (value === "") return "Enter your email address.";
    if (!EMAIL_PATTERN.test(value)) return "Enter a valid email, like name@example.com.";
    return "";
  },
  phone: function (value) {
    if (value === "") return "Enter your phone number.";
    if (!DIGITS_ONLY.test(value)) return "Use digits only, with no spaces or symbols.";
    if (value.length < 7 || value.length > 15) return "Phone number should be 7 to 15 digits.";
    return "";
  },
  message: function (value) {
    if (value === "") return "Write a message.";
    return "";
  }
};

function validateField(input) {
  const message = rules[input.name](input.value.trim());
  const field = input.closest(".field");
  field.classList.toggle("invalid", message !== "");
  field.querySelector(".error").textContent = message;
  input.setAttribute("aria-invalid", String(message !== ""));
  return message === "";
}

const inputs = Array.from(contactForm.querySelectorAll("input, textarea"));

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  successMessage.hidden = true;

  // Validate every field so all errors show at once.
  const results = inputs.map(validateField);
  const firstInvalid = inputs[results.indexOf(false)];

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const firstName = contactForm.elements.name.value.trim().split(" ")[0];
  successMessage.textContent = "Thanks, " + firstName + ". Your message has been received.";
  successMessage.hidden = false;
  contactForm.reset();
});

// Re-check a field as soon as the user corrects it.
inputs.forEach(function (input) {
  input.addEventListener("blur", function () { validateField(input); });
  input.addEventListener("input", function () {
    if (input.closest(".field").classList.contains("invalid")) validateField(input);
  });
});
