import { updateCartCount } from "./cart.js";
import { setupPurchaseConfirmation } from "./forms.js";

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  setupPurchaseConfirmation();
});
