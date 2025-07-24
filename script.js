// JavaScript for Star Rating and Website Functionality

// سبد خرید
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ذخیره‌سازی سبد خرید
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// به‌روزرسانی تعداد محصولات در سبد خرید
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

// فانکشن اضافه کردن افکت موج (ripple) به دکمه‌های افزودن به سبد خرید
function addRippleEffect() {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// نمایش مودال با انیمیشن
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "block";

  // اضافه کردن کلاس active برای انیمیشن
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);

  // حذف مودال بعد از 2 ثانیه
  setTimeout(() => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // مدت زمان انیمیشن
  }, 2000);
}

// اضافه کردن انیمیشن به کارت‌های محصول
function animateProductCards() {
  const products = document.querySelectorAll(".product");

  products.forEach((product, index) => {
    setTimeout(() => {
      product.style.opacity = "1";
      product.style.transform = "translateY(0)";
    }, index * 100); // تاخیر متوالی برای هر محصول
  });
}

// مدیریت افزودن به سبد خرید
function addToCart(product) {
  cart.push(product);
  saveCart();
  updateCartCount();

  // نمایش مودال با استفاده از تابع showModal
  showModal("add-to-cart-modal");
}

// Star Rating System Functions
function setupStarRatingSystem() {
  // Find all rating containers
  const ratingContainers = document.querySelectorAll(".product-rating");

  ratingContainers.forEach((container) => {
    const productId = container.getAttribute("data-product-id");
    const stars = container.querySelectorAll(".rating-stars .star");
    const ratingMessage = container.querySelector(".rating-message");

    // Load existing product rating data (would come from server in real implementation)
    loadProductRatings(productId, container);

    // Add event listeners for user rating
    stars.forEach((star) => {
      // Hover effect
      star.addEventListener("mouseenter", function () {
        const value = parseInt(this.getAttribute("data-value"));
        highlightStars(stars, value);
      });

      // Mouse leave - reset to active state
      star.addEventListener("mouseleave", function () {
        const activeValue = getUserRating(productId) || 0;
        highlightStars(stars, activeValue);
      });

      // Click to rate
      star.addEventListener("click", function () {
        const value = parseInt(this.getAttribute("data-value"));
        saveUserRating(productId, value);
        highlightStars(stars, value);
        ratingMessage.textContent = "با تشکر از امتیاز شما!";
        ratingMessage.style.color = "#4CAF50";

        // In a real implementation, you would send this to the server
        // and update the average and distribution
        submitRatingToServer(productId, value);
      });
    });
  });
}

// Highlight stars up to the specified value
function highlightStars(stars, value) {
  stars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"));
    if (starValue <= value) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

// Get user's previous rating for this product
function getUserRating(productId) {
  return parseInt(localStorage.getItem(`user_rating_${productId}`)) || 0;
}

// Save user's rating
function saveUserRating(productId, value) {
  localStorage.setItem(`user_rating_${productId}`, value);
}

// Load product ratings (average, count, distribution)
function loadProductRatings(productId, container) {
  // In a real implementation, this data would come from your server
  // Here we'll use mock data stored in localStorage

  // For demo purposes, create mock data if it doesn't exist
  if (!localStorage.getItem(`product_ratings_${productId}`)) {
    const mockData = {
      average: 4.7,
      count: 23,
      distribution: {
        5: 16,
        4: 5,
        3: 1,
        2: 1,
        1: 0,
      },
    };
    localStorage.setItem(
      `product_ratings_${productId}`,
      JSON.stringify(mockData)
    );
  }

  // Load the data
  const data = JSON.parse(localStorage.getItem(`product_ratings_${productId}`));

  // Update average and count display
  container.querySelector(".rating-average").textContent =
    data.average.toFixed(1);
  container.querySelector(".rating-count").textContent = `(${data.count} نظر)`;

  // Update stars display (filled, half-filled)
  updateStarsDisplay(container, data.average);

  // Update distribution bars
  updateDistributionBars(container, data.distribution, data.count);

  // Set user's previous rating if any
  const userRating = getUserRating(productId);
  if (userRating > 0) {
    highlightStars(
      container.querySelectorAll(".rating-stars .star"),
      userRating
    );
    container.querySelector(".rating-message").textContent =
      "امتیاز شما ثبت شده است";
    container.querySelector(".rating-message").style.color = "#4CAF50";
  }
}

// Update the star display based on average rating
function updateStarsDisplay(container, average) {
  const starsDisplay = container.querySelectorAll(
    ".rating-stars-display .star"
  );
  const fullStars = Math.floor(average);
  const hasHalfStar = average - fullStars >= 0.25 && average - fullStars < 0.75;
  const hasFullStar = average - fullStars >= 0.75;

  starsDisplay.forEach((star, index) => {
    star.classList.remove("filled", "half-filled");
    if (index < fullStars) {
      star.classList.add("filled");
    } else if (index === fullStars && hasHalfStar) {
      star.classList.add("half-filled");
    } else if (index === fullStars && hasFullStar) {
      star.classList.add("filled");
    }
  });
}

// Update the distribution bars
function updateDistributionBars(container, distribution, totalCount) {
  for (let i = 5; i >= 1; i--) {
    const count = distribution[i] || 0;
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

    const barElement = container.querySelector(
      `.rating-bar:nth-child(${6 - i}) .bar`
    );
    const countElement = container.querySelector(
      `.rating-bar:nth-child(${6 - i}) .count`
    );

    barElement.style.width = `${percentage}%`;
    countElement.textContent = count;
  }
}

// Submit rating to server (mock implementation)
function submitRatingToServer(productId, value) {
  // In a real implementation, this would be an API call
  console.log(`Submitting rating ${value} for product ${productId}`);

  // For demo purposes, update the local mock data
  const data = JSON.parse(localStorage.getItem(`product_ratings_${productId}`));

  // Check if user already rated and update accordingly
  const oldRating = getUserRating(productId);
  if (oldRating > 0) {
    // Remove old rating from distribution
    data.distribution[oldRating]--;
    data.count--;
  }

  // Add new rating
  data.distribution[value] = (data.distribution[value] || 0) + 1;
  data.count++;

  // Recalculate average
  let sum = 0;
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    sum += i * (data.distribution[i] || 0);
    total += data.distribution[i] || 0;
  }
  data.average = sum / total;

  // Save updated data
  localStorage.setItem(`product_ratings_${productId}`, JSON.stringify(data));

  // Update the display
  updateStarsDisplay(
    document.querySelector(`[data-product-id="${productId}"]`),
    data.average
  );
  document.querySelector(
    `[data-product-id="${productId}"] .rating-average`
  ).textContent = data.average.toFixed(1);
  document.querySelector(
    `[data-product-id="${productId}"] .rating-count`
  ).textContent = `(${data.count} نظر)`;
  updateDistributionBars(
    document.querySelector(`[data-product-id="${productId}"]`),
    data.distribution,
    data.count
  );
}

// اضافه کردن رویداد کلیک به دکمه‌های افزودن به سبد خرید
document.addEventListener("DOMContentLoaded", function () {
  // اضافه کردن این خط برای راه‌اندازی ویژگی بزرگنمایی تصویر
  setupImageZoom();

  // راه‌اندازی سیستم ستاره‌دهی
  setupStarRatingSystem();

  // فراخوانی‌های جدید
  addRippleEffect();
  animateProductCards();

  // مدیریت دکمه‌های افزودن به سبد خرید در صفحات محصول
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productData = this.getAttribute("data-product").split("|");
      const productName = productData[0];
      const productPrice = parseInt(productData[1]);

      addToCart({
        name: productName,
        price: productPrice,
      });
    });
  });

  // مدیریت صفحه سبد خرید
  const cartItemsContainer = document.getElementById("cart-items");
  if (cartItemsContainer) {
    renderCart();

    // دکمه حذف همه اقلام
    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
      clearCartButton.addEventListener("click", function () {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
      });
    }
  }

  // رویداد کلیک برای حذف محصول از سبد خرید
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      saveCart();
      updateCartCount();
      renderCart();
    }
  });

  // مدیریت فرم خرید
  setupPurchaseForm();

  // مدیریت صفحه تأیید خرید
  setupPurchaseConfirmation();
});

// نمایش محصولات در سبد خرید
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>سبد خرید شما خالی است.</p>";
    const proceedButton = document.getElementById("proceed-to-buy");
    if (proceedButton) {
      proceedButton.style.display = "none";
    }
  } else {
    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <p>${item.name}</p>
        <p class="price">${item.price.toLocaleString()} تومان</p>
        <button class="remove-item" data-index="${index}">حذف</button>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price;
    });

    // نمایش جمع کل
    document.getElementById(
      "total-price"
    ).textContent = `جمع کل: ${total.toLocaleString()} تومان`;

    const proceedButton = document.getElementById("proceed-to-buy");
    if (proceedButton) {
      proceedButton.style.display = "block";
    }
  }
}

// تنظیم فرم خرید
function setupPurchaseForm() {
  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");
  const buyButton = document.getElementById("buyButton");
  const verifyButton = document.getElementById("verify-answer");

  if (!provinceSelect || !citySelect) return;

  // اطلاعات شهرها
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

  // مدیریت تغییر استان و به‌روزرسانی شهرها
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

  // کلیک روی دکمه خرید
  if (buyButton) {
    buyButton.addEventListener("click", () => {
      // جمع‌آوری تمام فیلدهای ضروری
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const province = document.getElementById("province").value;
      const city = document.getElementById("city").value;
      const address = document.getElementById("address").value;
      const shippingMethod = document.querySelector(
        'input[name="shipping"]:checked'
      );

      // بررسی دستی تمام فیلدها
      if (name && phone && province && city && address && shippingMethod) {
        // نمایش سوال امنیتی
        showSecurityQuestion();
      } else {
        // نمایش پیام خطا با مشخص کردن فیلدهای خالی
        let missingFields = [];
        if (!name) missingFields.push("نام خریدار");
        if (!phone) missingFields.push("شماره تلفن");
        if (!province) missingFields.push("استان");
        if (!city) missingFields.push("شهر");
        if (!address) missingFields.push("آدرس");
        if (!shippingMethod) missingFields.push("نوع ارسال");

        alert(
          `لطفا تمام فیلدها را پر کنید. فیلدهای خالی: ${missingFields.join(
            ", "
          )}`
        );
      }
    });
  }

  // مدیریت سوال امنیتی
  if (verifyButton) {
    verifyButton.addEventListener("click", () => {
      const securityQuestionDiv = document.getElementById("security-question");
      const userAnswer = parseInt(
        document.getElementById("security-answer").value
      );

      // دریافت اعداد از ویژگی‌های داده
      const num1 = parseInt(securityQuestionDiv.dataset.num1);
      const num2 = parseInt(securityQuestionDiv.dataset.num2);

      // محاسبه پاسخ صحیح
      const correctAnswer = num1 + num2;

      // حذف پیام خطای قبلی (اگر وجود داشته باشد)
      const oldError = document.querySelector("#security-question .error-msg");
      if (oldError) {
        oldError.remove();
      }

      if (userAnswer === correctAnswer) {
        // در صورت صحیح بودن پاسخ، خرید را نهایی کن
        finalizePurchase();
      } else {
        // در صورت اشتباه بودن پاسخ، سوال جدید تولید کن
        // نمایش پیام خطا
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "پاسخ نادرست است. لطفاً به سوال جدید پاسخ دهید.";
        errorMsg.style.color = "red";
        errorMsg.classList.add("error-msg");
        securityQuestionDiv.appendChild(errorMsg);

        // پاک کردن فیلد پاسخ
        document.getElementById("security-answer").value = "";

        // تولید سوال جدید
        showSecurityQuestion();
      }
    });
  }
}

// نمایش سوال امنیتی
function showSecurityQuestion() {
  const securityQuestionDiv = document.getElementById("security-question");
  const num1Span = document.getElementById("num1");
  const num2Span = document.getElementById("num2");

  // تولید دو عدد تصادفی بین 1 تا 10
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;

  // نمایش اعداد
  num1Span.textContent = num1;
  num2Span.textContent = num2;

  // نمایش بخش سوال امنیتی
  securityQuestionDiv.style.display = "block";

  // پنهان کردن دکمه خرید
  document.getElementById("buyButton").style.display = "none";

  // تنظیم داده‌های سوال امنیتی به عنوان ویژگی داده
  securityQuestionDiv.dataset.num1 = num1;
  securityQuestionDiv.dataset.num2 = num2;
}

// محاسبه جمع کل با هزینه ارسال
function getTotalWithShipping(shippingType) {
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  if (shippingType === "سریع") total += 50000;
  return total;
}

// نهایی کردن خرید
function finalizePurchase() {
  // جمع‌آوری اطلاعات خرید
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

  // تولید شماره پیگیری تصادفی (10 رقمی)
  const trackingNumber = Math.floor(1000000000 + Math.random() * 9000000000);

  // ایجاد آبجکت اطلاعات خرید
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

  // ذخیره اطلاعات خرید در localStorage
  localStorage.setItem("purchaseInfo", JSON.stringify(purchaseInfo));

  // پاک کردن سبد خرید
  cart = [];
  saveCart();
  updateCartCount();

  // هدایت به صفحه تأیید خرید
  window.location.href = "confirmation.html";
}

// تنظیم صفحه تأیید خرید
function setupPurchaseConfirmation() {
  const purchaseConfirmation = document.getElementById("purchase-confirmation");
  if (!purchaseConfirmation) return;

  // دریافت اطلاعات خرید از localStorage
  const purchaseInfo = JSON.parse(localStorage.getItem("purchaseInfo"));
  if (!purchaseInfo) {
    window.location.href = "index.html";
    return;
  }

  // نمایش شماره پیگیری
  const trackingNumberElement = document.getElementById("tracking-number");
  if (trackingNumberElement) {
    trackingNumberElement.textContent = purchaseInfo.trackingNumber;
  }

  // نمایش اطلاعات خریدار
  const buyerInfoDiv = document.getElementById("buyer-info");
  if (buyerInfoDiv) {
    buyerInfoDiv.innerHTML = `
      <p><strong>نام:</strong> ${purchaseInfo.buyer.name}</p>
      <p><strong>شماره تماس:</strong> ${purchaseInfo.buyer.phone}</p>
      <p><strong>آدرس:</strong> ${purchaseInfo.buyer.province}، ${purchaseInfo.buyer.city}، ${purchaseInfo.buyer.address}</p>
    `;
  }

  // نمایش محصولات
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

  // نمایش اطلاعات ارسال و پرداخت
  const shippingPaymentDiv = document.getElementById("shipping-payment-info");
  if (shippingPaymentDiv) {
    shippingPaymentDiv.innerHTML = `
      <p><strong>روش ارسال:</strong> ${purchaseInfo.shipping}</p>
      <p><strong>تاریخ سفارش:</strong> ${purchaseInfo.date}</p>
      <p><strong>مبلغ کل:</strong> ${purchaseInfo.total.toLocaleString()} تومان</p>
    `;
  }
}

// مدیریت کامنت‌ها
document.addEventListener("DOMContentLoaded", function () {
  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("comment-text").value;
      if (!text) return;

      const comment = {
        text: text,
        date: new Date().toLocaleDateString("fa-IR"),
      };

      // دریافت کامنت‌های موجود
      let comments = JSON.parse(localStorage.getItem("comments")) || [];

      // افزودن کامنت جدید
      comments.push(comment);

      // ذخیره کامنت‌ها
      localStorage.setItem("comments", JSON.stringify(comments));

      // نمایش کامنت‌ها
      displayComments();

      // پاک کردن فرم
      commentForm.reset();
    });

    // نمایش کامنت‌ها در بارگذاری صفحه
    displayComments();
  }
});

// نمایش کامنت‌ها
function displayComments() {
  const commentsList = document.getElementById("comments-list");
  if (!commentsList) return;

  // دریافت کامنت‌ها
  const comments = JSON.parse(localStorage.getItem("comments")) || [];

  // نمایش کامنت‌ها
  commentsList.innerHTML = "";

  if (comments.length === 0) {
    commentsList.innerHTML = "<li>هنوز نظری ثبت نشده است.</li>";
  } else {
    comments.forEach((comment) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p>${comment.text}</p>
        <small>${comment.date}</small>
      `;
      commentsList.appendChild(li);
    });
  }
}

// تنظیم قابلیت زوم تصویر - کد جدید جایگذاری شده
function setupImageZoom() {
  const mainImage = document.getElementById("mainImage");
  const zoomContainer = document.querySelector(".product-zoom-container");
  const zoomResult = document.getElementById("zoomResult");

  if (mainImage && zoomContainer && zoomResult) {
    mainImage.addEventListener("mouseover", function () {
      zoomContainer.style.display = "block";
    });

    mainImage.addEventListener("mouseout", function () {
      zoomContainer.style.display = "none";
    });

    mainImage.addEventListener("mousemove", function (e) {
      // محاسبه موقعیت نسبی ماوس در تصویر
      const rect = mainImage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // محاسبه درصد موقعیت
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // تنظیم پس‌زمینه با موقعیت مناسب
      zoomResult.style.backgroundImage = `url('${mainImage.src}')`;
      zoomResult.style.backgroundSize = "250%";
      zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    });
  }

  // حفظ عملکرد قبلی برای ساختار قدیمی به منظور پشتیبانی از عقب‌گرد
  const imageWrappers = document.querySelectorAll(".image-wrapper");

  imageWrappers.forEach((wrapper) => {
    const img = wrapper.querySelector(".product-image-fixed");
    const zoomLens = wrapper.querySelector(".zoom-lens");

    if (!img || !zoomLens) return;

    // Set the background image of the zoom lens
    const largeImageSrc = img.src;
    zoomLens.style.backgroundImage = `url(${largeImageSrc})`;

    // Add mouse event listeners
    img.addEventListener("mousemove", handleMouseMove);
    img.addEventListener("mouseenter", () => {
      zoomLens.style.display = "block";
    });
    img.addEventListener("mouseleave", () => {
      zoomLens.style.display = "none";
    });

    function handleMouseMove(e) {
      // Get the dimensions and position of the image
      const rect = img.getBoundingClientRect();

      // Calculate mouse position relative to the image (as a percentage)
      const xPos = ((e.clientX - rect.left) / rect.width) * 100;
      const yPos = ((e.clientY - rect.top) / rect.height) * 100;

      // Ensure the position is within bounds (0-100%)
      const boundedX = Math.min(Math.max(xPos, 0), 100);
      const boundedY = Math.min(Math.max(yPos, 0), 100);

      // Update the background position of the zoom lens
      zoomLens.style.backgroundPosition = `${boundedX}% ${boundedY}%`;
    }
  });
}

// به‌روزرسانی اولیه تعداد محصولات سبد خرید
updateCartCount();
