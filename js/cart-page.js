import {
  updateCartCount,
  renderCart,
  removeFromCart,
  clearCart,
} from "./cart.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  renderCart();

  const clearCartButton = document.getElementById("clear-cart");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
      clearCart(showToast);
      renderCart();
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.dataset.index);
      removeFromCart(index, showToast);
      renderCart();
    }
  });
});
