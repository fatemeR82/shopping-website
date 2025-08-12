import { updateCartCount, addToCart } from "./cart.js";
import { setupImageZoom } from "./image-zoom.js";
import { setupComments } from "./comments.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    showProductError("شناسه محصول یافت نشد!");
    return;
  }

  loadProductData(productId);
});

async function loadProductData(productId) {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error("خطا در بارگذاری اطلاعات محصولات");
    }

    const data = await response.json();
    const product = data.products.find((p) => p.id === productId);

    if (!product) {
      showProductError("محصول مورد نظر یافت نشد!");
      return;
    }

    renderProductDetail(product);

    document.title = `${product.name} | وبسایت خرید کالا`;
    setupImageZoom();
    setupComments();

    const addToCartButton = document.querySelector(".add-to-cart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", function () {
        addToCart(
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          },
          showToast
        );
      });
    }
  } catch (error) {
    console.error("خطا:", error);
    showProductError("خطا در بارگذاری اطلاعات محصول");
  }
}

function renderProductDetail(product) {
  const productDetailSection = document.getElementById("product-detail");
  productDetailSection.innerHTML = `
        <h2>جزئیات محصول: ${product.name}</h2>
        
        <div class="product-detail-images">
            <div class="product-main-image">
                <img src="${product.image}" alt="${
    product.name
  }" id="mainImage">
            </div>
            <div class="product-zoom-container">
                <div id="zoomResult"></div>
            </div>
        </div>
        
        <p><strong>قیمت:</strong> ${new Intl.NumberFormat("fa-IR").format(
          product.price
        )} تومان</p>
        <p><strong>برند:</strong> ${product.brand}</p>
        <p>${product.description}</p>
        
         <button class="add-to-cart" data-product="${product.name}|${
    product.price
  }" data-id="${product.id}">
      <i class="fas fa-shopping-cart"></i> افزودن به سبد خرید
    </button>
    `;
}

function showProductError(message) {
  const productDetailSection = document.getElementById("product-detail");
  productDetailSection.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <a href="index.html" class="button">بازگشت به صفحه اصلی</a>
        </div>
    `;
}
