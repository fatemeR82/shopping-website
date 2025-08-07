let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    const count = cart.length;
    if (count > 9) {
      cartCountElement.textContent = "9+";
    } else {
      cartCountElement.textContent = count;
    }
  }
}

export function addToCart(product, showToastCallback) {
  cart.push(product);
  saveCart();
  updateCartCount();

  if (showToastCallback) {
    showToastCallback("محصول با موفقیت به سبد خرید اضافه شد!", "success");
  }
}

export function removeFromCart(index, showToastCallback) {
  if (index >= 0 && index < cart.length) {
    const removedProduct = cart[index];
    cart.splice(index, 1);
    saveCart();
    updateCartCount();

    if (showToastCallback) {
      showToastCallback(
        `"${removedProduct.name}" از سبد خرید حذف شد`,
        "success"
      );
    }

    return removedProduct;
  }
  return null;
}

export function clearCart(showToastCallback) {
  cart = [];
  saveCart();
  updateCartCount();

  if (showToastCallback) {
    showToastCallback("همه محصولات از سبد خرید حذف شدند", "success");
  }
}

export function getCart() {
  return cart;
}

export function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  const totalPriceElement = document.getElementById("total-price");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="empty-cart-message">
      <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 15px; color: #ccc;"></i>
      <p>سبد خرید شما خالی است.</p>
    </div>`;

    if (totalPriceElement) {
      totalPriceElement.textContent = "جمع کل: 0 تومان";
    }

    const proceedButton = document.getElementById("proceed-to-buy");
    if (proceedButton) {
      proceedButton.style.display = "none";
    }
  } else {
    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      let imageSrc = item.image;
      if (!imageSrc || imageSrc === "") {
        // اگر آیدی محصول موجود است از آن استفاده کنیم، در غیر این صورت از نام محصول
        const imageId = item.id || item.name.replace(/\s+/g, "-").toLowerCase();
        // بررسی چند مسیر مختلف برای یافتن تصویر
        imageSrc = `images/products/${imageId}.webp`;

        // اگر در مرورگر هستیم، می‌توانیم وجود تصویر را بررسی کنیم
        const img = new Image();
        img.onerror = function () {
          // اگر تصویر یافت نشد، از تصویر پیش‌فرض استفاده کنیم
          this.src = "images/products/default.webp";
        };
        img.src = imageSrc;
      }
      cartItem.innerHTML = `
        <div class="item-info">
          <img src="${imageSrc}" alt="${item.name}" class="item-thumbnail">
          <div class="item-details">
            <p class="item-name">${item.name}</p>
          </div>
        </div>
        <div class="item-actions">
          <span class="item-price">${item.price.toLocaleString()} تومان</span>
          <button class="remove-item" data-index="${index}">حذف</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price;
    });

    if (totalPriceElement) {
      totalPriceElement.textContent = `جمع کل: ${total.toLocaleString()} تومان`;
    }

    const proceedButton = document.getElementById("proceed-to-buy");
    if (proceedButton) {
      proceedButton.style.display = "block";
    }
  }
}

export function getTotalWithShipping(shippingType) {
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  if (shippingType === "سریع") total += 50000;
  return total;
}
