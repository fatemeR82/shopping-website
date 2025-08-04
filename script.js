import {
  updateCartCount,
  addToCart,
  removeFromCart,
  clearCart,
  renderCart,
} from "./js/cart.js";

import { showToast } from "./js/toast.js";
import { setupPurchaseForm, setupPurchaseConfirmation } from "./js/forms.js";
import { setupImageZoom } from "./js/image-zoom.js";
import { setupComments } from "./js/comments.js";

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  setupImageZoom();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productData = this.getAttribute("data-product").split("|");
      const productName = productData[0];
      const productPrice = parseInt(productData[1]);

      addToCart(
        {
          name: productName,
          price: productPrice,
        },
        showToast
      );
    });
  });

  const cartItemsContainer = document.getElementById("cart-items");
  if (cartItemsContainer) {
    renderCart();

    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
      clearCartButton.addEventListener("click", function () {
        clearCart(showToast);
        renderCart();
      });
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.dataset.index);
      removeFromCart(index, showToast);
      renderCart();
    }
  });

  setupPurchaseForm();

  setupPurchaseConfirmation();

  setupComments();
});
