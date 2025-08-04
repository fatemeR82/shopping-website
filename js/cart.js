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
    cartItemsContainer.innerHTML = "<p>سبد خرید شما خالی است.</p>";

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
      cartItem.innerHTML = `
        <p>${item.name}</p>
        <p class="price">${item.price.toLocaleString()} تومان</p>
        <button class="remove-item" data-index="${index}">حذف</button>
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
