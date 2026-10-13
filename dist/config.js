window.ilfConfig = {
  url: "https://mufiksoft.com/shopifyband/amo-panel/forms.php",
  presets: {
    form: {
      title: "{{currentDate}} Заявка на {{pack}} з сайту AI Creator (без оплати)",
      stage: "105820611",
      product: "Ai-creator",
      type_lead: "Теплый",
      tag: "Заявка;packagesai;без оплати",
      currency: "EUR",
      req: "etsy_no_pay_4"
    }
  }
};

window.IlPrepareForm = function (data) {
  data.tp = "https://www.kovalenko-ai.com/packagesai/ua";
  data.source = "packagesai_no_payment";

  return data;
};

window.IlAfterForm = function (formData) {
  var status = document.getElementById("form-status");
  var button = document.querySelector(".submit-button");

  if (button) button.disabled = false;

  if (formData && formData.error) {
    if (status) {
      status.hidden = false;
      status.className = "form-status form-status--error";
      status.textContent = "Не вдалося надіслати заявку. Перевірте дані та спробуйте ще раз.";
    }
    return false;
  }

  if (status) {
    status.hidden = false;
    status.className = "form-status form-status--success";
    status.textContent = "Дякуємо! Заявку передано менеджеру. Ми зв’яжемося з вами найближчим часом.";
  }

  if (button) {
    button.textContent = "ЗАЯВКУ НАДІСЛАНО";
    button.disabled = true;
  }

  // Заявка вже створена в CRM. Зупиняємо будь-який платіжний редирект.
  return false;
};
