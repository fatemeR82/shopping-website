import { updateCartCount } from "./cart.js";
import { loadProducts, renderProducts } from "./index.js";

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  loadProducts();
});
