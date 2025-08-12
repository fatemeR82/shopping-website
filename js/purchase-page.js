import { updateCartCount } from "./cart.js";
import { setupPurchaseForm } from "./forms.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  setupPurchaseForm();
});
