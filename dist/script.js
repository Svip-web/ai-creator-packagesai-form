(function () {
  const options = Array.from(document.querySelectorAll(".package-option"));
  const detailsCard = document.querySelector(".details-card");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => item.classList.remove("active"));
      option.classList.add("active");
      const input = option.querySelector('input[type="radio"]');
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));

      if (window.matchMedia("(max-width: 767px)").matches) {
        detailsCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const timerKey = "countdownEndTime";
  const initialDuration = 86400 * 1000;
  let endTime = Number(localStorage.getItem(timerKey));

  if (!endTime || endTime <= Date.now()) {
    endTime = Date.now() + initialDuration;
    localStorage.setItem(timerKey, String(endTime));
  }

  const pad = (value) => String(value).padStart(2, "0");

  function updateTimer() {
    let remaining = Math.max(0, endTime - Date.now());

    if (remaining === 0) {
      endTime = Date.now() + initialDuration;
      localStorage.setItem(timerKey, String(endTime));
      remaining = initialDuration;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    document.getElementById("hours").textContent = pad(Math.floor(totalSeconds / 3600));
    document.getElementById("minutes").textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    document.getElementById("seconds").textContent = pad(totalSeconds % 60);
  }

  updateTimer();
  window.setInterval(updateTimer, 1000);

  const phoneInput = document.getElementById("phone");
  if (phoneInput && window.intlTelInput) {
    phoneInput.removeAttribute("placeholder");
    const originalName = phoneInput.name;
    phoneInput.name = originalName + "_intlTelInput";

    const iti = window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      hiddenInput: originalName,
      preferredCountries: ["ua"],
      excludeCountries: ["ru", "by"],
      separateDialCode: true,
      formatOnDisplay: true,
      geoIpLookup: function (success) {
        if (!window.jQuery) return success("ua");
        window.jQuery.get("https://ipinfo.io", function () {}, "jsonp")
          .always(function (response) {
            success(response && response.country ? response.country : "ua");
          });
      }
    });

    const applyMask = function () {
      if (!window.jQuery || !window.jQuery.fn.mask) return;
      const placeholder = phoneInput.getAttribute("placeholder") || "50 123 4567";
      window.jQuery(phoneInput).mask(placeholder.replace(/[0-9]/g, "9"));
    };

    phoneInput.addEventListener("countrychange", function () {
      phoneInput.value = "";
      applyMask();
    });

    window.setTimeout(applyMask, 300);
    void iti;
  }

  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((name) => {
    const input = document.getElementById(name);
    if (input) input.value = params.get(name) || "";
  });
})();
