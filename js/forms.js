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

  if (!provinceSelect || !citySelect) return;

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
    } else {
      citySelect.innerHTML =
        '<option value="">ابتدا استان را انتخاب کنید</option>';
    }
    citySelect.value = "";
  });

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

  if (buyButton) {
    buyButton.addEventListener("click", () => {
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

      let isValid = true;
      let emptyFields = [];

      if (!name) {
        document.getElementById("name-error").textContent =
          "لطفاً نام خریدار را وارد کنید";
        document.getElementById("name-error").style.display = "block";
        emptyFields.push("نام خریدار");
        isValid = false;
      }

      if (!phone) {
        document.getElementById("phone-error").textContent =
          "لطفاً شماره تلفن را وارد کنید";
        document.getElementById("phone-error").style.display = "block";
        emptyFields.push("شماره تلفن");
        isValid = false;
      }

      if (!province) {
        document.getElementById("province-error").textContent =
          "لطفاً استان را انتخاب کنید";
        document.getElementById("province-error").style.display = "block";
        emptyFields.push("استان");
        isValid = false;
      }

      if (!city) {
        document.getElementById("city-error").textContent =
          "لطفاً شهر را انتخاب کنید";
        document.getElementById("city-error").style.display = "block";
        emptyFields.push("شهر");
        isValid = false;
      }

      if (!address) {
        document.getElementById("address-error").textContent =
          "لطفاً آدرس را وارد کنید";
        document.getElementById("address-error").style.display = "block";
        emptyFields.push("آدرس");
        isValid = false;
      }

      if (!shippingMethod) {
        document.getElementById("shipping-error").textContent =
          "لطفاً نوع ارسال را انتخاب کنید";
        document.getElementById("shipping-error").style.display = "block";
        emptyFields.push("نوع ارسال");
        isValid = false;
      }

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
