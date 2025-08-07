import {
  getCart,
  getTotalWithShipping,
  clearCart,
  updateCartCount,
} from "./cart.js";
import { showToast } from "./toast.js";

export function setupPurchaseForm() {
  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");
  const buyButton = document.getElementById("buyButton");
  const verifyButton = document.getElementById("verify-answer");
  const form = document.querySelector(".buy-form");

  if (!provinceSelect || !citySelect) return;

  // تعریف شهرهای هر استان
  const cities = {
    tehran: [
      { value: "tehran", text: "تهران" },
      { value: "shemiranat", text: "شمیرانات" },
      { value: "rey", text: "ری" },
    ],
    isfahan: [
      { value: "isfahan", text: "اصفهان" },
      { value: "kashan", text: "کاشان" },
      { value: "najafabad", text: "نجف‌آباد" },
    ],
    fars: [
      { value: "shiraz", text: "شیراز" },
      { value: "marvdasht", text: "مرودشت" },
      { value: "jahrom", text: "جهرم" },
    ],
  };

  // تنظیم شهرها بر اساس استان انتخاب شده
  provinceSelect.addEventListener("change", () => {
    citySelect.innerHTML = '<option value="">انتخاب کنید</option>';
    citySelect.disabled = !provinceSelect.value;
    if (provinceSelect.value) {
      const selectedCities = cities[provinceSelect.value] || [];
      selectedCities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.value;
        option.textContent = city.text;
        citySelect.appendChild(option);
      });
      validateField("province", provinceSelect.value);
    } else {
      citySelect.innerHTML =
        '<option value="">ابتدا استان را انتخاب کنید</option>';
      showError("province", "لطفاً استان را انتخاب کنید");
    }
    citySelect.value = "";
    validateField("city", ""); // پاک کردن اعتبارسنجی شهر
  });

  // ایجاد المان‌های خطا برای فیلدها اگر وجود ندارند
  const formFields = [
    "name",
    "phone",
    "province",
    "city",
    "address",
    "shipping",
  ];
  formFields.forEach((field) => {
    if (!document.getElementById(`${field}-error`)) {
      const errorSpan = document.createElement("span");
      errorSpan.id = `${field}-error`;
      errorSpan.className = "error-msg";
      errorSpan.style.display = "none";
      errorSpan.style.color = "red";
      errorSpan.style.fontSize = "14px";
      errorSpan.style.marginTop = "5px";
      errorSpan.style.display = "block";

      if (field === "shipping") {
        const fieldset = document.querySelector("fieldset");
        if (fieldset) fieldset.appendChild(errorSpan);
      } else {
        const inputElement = document.getElementById(field);
        if (inputElement && inputElement.parentNode) {
          inputElement.parentNode.appendChild(errorSpan);
        }
      }
    }
  });

  // افزودن راهنما به فیلدها
  addFieldHint("name", "نام باید بین ۳ تا ۵۰ کاراکتر باشد");
  addFieldHint(
    "phone",
    "شماره تلفن همراه باید ۱۱ رقم باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"
  );
  addFieldHint("address", "آدرس باید حداقل ۱۰ کاراکتر باشد");

  // اضافه کردن event listener برای اعتبارسنجی در زمان تایپ
  formFields.forEach((field) => {
    if (field !== "shipping") {
      const element = document.getElementById(field);
      if (element) {
        element.addEventListener("input", function () {
          validateField(field, this.value);
        });

        // برای اعتبارسنجی در زمان از دست دادن فوکوس
        element.addEventListener("blur", function () {
          validateField(field, this.value, true);
        });
      }
    }
  });

  // اعتبارسنجی برای گزینه‌های روش ارسال
  const shippingOptions = document.querySelectorAll('input[name="shipping"]');
  shippingOptions.forEach((option) => {
    option.addEventListener("change", function () {
      validateField("shipping", this.checked ? this.value : "");
    });
  });

  if (buyButton) {
    buyButton.addEventListener("click", (e) => {
      e.preventDefault();

      // پاک کردن همه پیام‌های خطا
      formFields.forEach((field) => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.style.display = "none";
        }
      });

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const province = document.getElementById("province").value;
      const city = document.getElementById("city").value;
      const address = document.getElementById("address").value.trim();
      const shippingMethod = document.querySelector(
        'input[name="shipping"]:checked'
      );

      // اعتبارسنجی همه فیلدها
      const nameValid = validateField("name", name, true);
      const phoneValid = validateField("phone", phone, true);
      const provinceValid = validateField("province", province, true);
      const cityValid = validateField("city", city, true);
      const addressValid = validateField("address", address, true);
      const shippingValid = validateField(
        "shipping",
        shippingMethod ? shippingMethod.value : "",
        true
      );

      const isValid =
        nameValid &&
        phoneValid &&
        provinceValid &&
        cityValid &&
        addressValid &&
        shippingValid;
      const emptyFields = [];

      // جمع‌آوری فیلدهای خالی برای نمایش پیام
      if (!name) emptyFields.push("نام خریدار");
      if (!phone) emptyFields.push("شماره تلفن");
      if (!province) emptyFields.push("استان");
      if (!city) emptyFields.push("شهر");
      if (!address) emptyFields.push("آدرس");
      if (!shippingMethod) emptyFields.push("نوع ارسال");

      if (emptyFields.length > 0) {
        const message =
          emptyFields.length === 1
            ? `فیلد "${emptyFields[0]}" باید تکمیل شود`
            : `فیلدهای زیر باید تکمیل شوند:<br>• ${emptyFields.join("<br>• ")}`;

        showToast(message, "warning");
      }

      if (isValid) {
        showSecurityQuestion();
      }
    });
  }

  if (verifyButton) {
    verifyButton.addEventListener("click", () => {
      const securityQuestionDiv = document.getElementById("security-question");
      const answerInput = document.getElementById("security-answer");
      const userAnswerValue = answerInput.value.trim();

      const oldError = document.querySelector("#security-question .error-msg");
      if (oldError) {
        oldError.remove();
      }

      if (!userAnswerValue) {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "لطفاً پاسخ صحیح را وارد نمایید.";
        errorMsg.style.color = "red";
        errorMsg.classList.add("error-msg");
        securityQuestionDiv.appendChild(errorMsg);
        return;
      }

      const userAnswer = parseInt(userAnswerValue);
      const num1 = parseInt(securityQuestionDiv.dataset.num1);
      const num2 = parseInt(securityQuestionDiv.dataset.num2);
      const correctAnswer = num1 + num2;

      if (userAnswer === correctAnswer) {
        finalizePurchase();
      } else {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "پاسخ نادرست است.";
        errorMsg.style.color = "red";
        errorMsg.classList.add("error-msg");
        securityQuestionDiv.appendChild(errorMsg);

        answerInput.value = "";
        showSecurityQuestion();
      }
    });
  }

  // اعتبارسنجی فیلدها با قوانین خاص
  function validateField(fieldName, value, showErrorMessage = false) {
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (!value) {
          isValid = false;
          errorMessage = "لطفاً نام خریدار را وارد کنید";
        } else if (value.length < 3) {
          isValid = false;
          errorMessage = "نام باید حداقل ۳ کاراکتر باشد";
        } else if (value.length > 50) {
          isValid = false;
          errorMessage = "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد";
        } else if (
          !/^[\u0600-\u06FF\s]+$/.test(value) &&
          !/^[a-zA-Z\s]+$/.test(value)
        ) {
          isValid = false;
          errorMessage = "نام باید شامل حروف فارسی یا انگلیسی باشد";
        }
        break;

      case "phone":
        if (!value) {
          isValid = false;
          errorMessage = "لطفاً شماره تلفن را وارد کنید";
        } else if (!/^09\d{9}$/.test(value)) {
          isValid = false;
          errorMessage =
            "شماره تلفن باید به فرمت صحیح (مثال: ۰۹۱۲۳۴۵۶۷۸۹) باشد";
        }
        break;

      case "province":
        if (!value) {
          isValid = false;
          errorMessage = "لطفاً استان را انتخاب کنید";
        }
        break;

      case "city":
        if (!value) {
          isValid = false;
          errorMessage = "لطفاً شهر را انتخاب کنید";
        }
        break;

      case "address":
        if (!value) {
          isValid = false;
          errorMessage = "لطفاً آدرس را وارد کنید";
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = "آدرس باید حداقل ۱۰ کاراکتر باشد";
        } else if (value.length > 200) {
          isValid = false;
          errorMessage = "آدرس نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد";
        }
        break;

      case "shipping":
        if (!value) {
          isValid = false;
          errorMessage = "لطفاً نوع ارسال را انتخاب کنید";
        }
        break;
    }

    // نمایش یا مخفی کردن پیام خطا
    const inputElement = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (errorElement) {
      if (!isValid && showErrorMessage) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = "block";
        if (inputElement) {
          inputElement.classList.add("input-error");
        }
      } else {
        errorElement.style.display = "none";
        if (inputElement) {
          inputElement.classList.remove("input-error");
        }
      }
    }

    // نمایش بصری وضعیت اعتبارسنجی
    if (inputElement && value) {
      if (isValid) {
        inputElement.style.borderColor = "#28a745";
        inputElement.style.boxShadow = "0 0 0 3px rgba(40, 167, 69, 0.1)";
      } else {
        inputElement.style.borderColor = "#dc3545";
        inputElement.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.1)";
      }
    } else if (inputElement) {
      inputElement.style.borderColor = "";
      inputElement.style.boxShadow = "";
    }

    return isValid;
  }

  // اضافه کردن راهنما به فیلدها
  function addFieldHint(fieldName, hintText) {
    const inputElement = document.getElementById(fieldName);
    if (!inputElement) return;

    const hintSpan = document.createElement("span");
    hintSpan.className = "field-hint";
    hintSpan.textContent = hintText;
    hintSpan.style.color = "#6c757d";
    hintSpan.style.fontSize = "12px";
    hintSpan.style.marginTop = "2px";
    hintSpan.style.display = "block";

    inputElement.parentNode.insertBefore(hintSpan, inputElement.nextSibling);
  }

  // نمایش پیام خطا
  function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }
}

function showSecurityQuestion() {
  const securityQuestionDiv = document.getElementById("security-question");
  const num1Span = document.getElementById("num1");
  const num2Span = document.getElementById("num2");

  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;

  num1Span.textContent = num1;
  num2Span.textContent = num2;

  securityQuestionDiv.style.display = "block";
  document.getElementById("buyButton").style.display = "none";

  securityQuestionDiv.dataset.num1 = num1;
  securityQuestionDiv.dataset.num2 = num2;

  // فوکوس روی فیلد پاسخ امنیتی
  setTimeout(() => {
    document.getElementById("security-answer").focus();
  }, 100);
}

function finalizePurchase() {
  const cart = getCart();
  const buyerName = document.getElementById("name").value;
  const buyerPhone = document.getElementById("phone").value;
  const buyerProvince =
    document.getElementById("province").options[
      document.getElementById("province").selectedIndex
    ].text;
  const buyerCity =
    document.getElementById("city").options[
      document.getElementById("city").selectedIndex
    ].text;
  const buyerAddress = document.getElementById("address").value;
  const shipping = document.querySelector(
    'input[name="shipping"]:checked'
  ).value;
  const total = getTotalWithShipping(shipping);

  const trackingNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  const purchaseInfo = {
    buyer: {
      name: buyerName,
      phone: buyerPhone,
      province: buyerProvince,
      city: buyerCity,
      address: buyerAddress,
    },
    shipping: shipping,
    total: total,
    products: cart,
    trackingNumber: trackingNumber,
    date: new Date().toLocaleDateString("fa-IR"),
  };

  localStorage.setItem("purchaseInfo", JSON.stringify(purchaseInfo));

  clearCart();
  updateCartCount();

  window.location.href = "confirmation.html";
}

export function setupPurchaseConfirmation() {
  const purchaseConfirmation = document.getElementById("purchase-confirmation");
  if (!purchaseConfirmation) return;

  const purchaseInfo = JSON.parse(localStorage.getItem("purchaseInfo"));
  if (!purchaseInfo) {
    window.location.href = "index.html";
    return;
  }

  const trackingNumberElement = document.getElementById("tracking-number");
  if (trackingNumberElement) {
    trackingNumberElement.textContent = purchaseInfo.trackingNumber;
  }

  const buyerInfoDiv = document.getElementById("buyer-info");
  if (buyerInfoDiv) {
    buyerInfoDiv.innerHTML = `
      <p><strong>نام:</strong> ${purchaseInfo.buyer.name}</p>
      <p><strong>شماره تماس:</strong> ${purchaseInfo.buyer.phone}</p>
      <p><strong>آدرس:</strong> ${purchaseInfo.buyer.province}، ${purchaseInfo.buyer.city}، ${purchaseInfo.buyer.address}</p>
    `;
  }

  const productsListDiv = document.getElementById("products-list");
  if (productsListDiv) {
    let productsHTML = "<ul>";
    purchaseInfo.products.forEach((product) => {
      productsHTML += `<li>${
        product.name
      } - ${product.price.toLocaleString()} تومان</li>`;
    });
    productsHTML += "</ul>";
    productsListDiv.innerHTML = productsHTML;
  }

  const shippingPaymentDiv = document.getElementById("shipping-payment-info");
  if (shippingPaymentDiv) {
    shippingPaymentDiv.innerHTML = `
      <p><strong>روش ارسال:</strong> ${purchaseInfo.shipping}</p>
      <p><strong>تاریخ سفارش:</strong> ${purchaseInfo.date}</p>
      <p><strong>مبلغ کل:</strong> ${purchaseInfo.total.toLocaleString()} تومان</p>
    `;
  }
}
