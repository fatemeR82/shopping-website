document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error("خطا در بارگذاری اطلاعات محصولات");
    }

    const data = await response.json();
    renderProducts(data.products);
  } catch (error) {
    console.error("خطا:", error);
    const productsGrid = document.querySelector(".product-grid");
    productsGrid.innerHTML =
      '<div class="error-message"><i class="fas fa-exclamation-circle"></i><p>خطا در بارگذاری محصولات</p></div>';
  }
}

function renderProducts(products) {
  const productsGrid = document.querySelector(".product-grid");
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";
    productElement.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-link">
                <div class="product-image-container">
                    ${
                      product.isNew
                        ? '<span class="product-badge">جدید</span>'
                        : ""
                    }
                    <div class="product-image-wrapper">
                        <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
                    </div>
                </div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <div class="product-meta">
                        <span>${
                          product.inStock ? "موجود در انبار" : "ناموجود"
                        }</span>
                        <span>${product.category}</span>
                    </div>
                    <p><strong>قیمت:</strong> ${new Intl.NumberFormat(
                      "fa-IR"
                    ).format(product.price)} تومان</p>
                </div>
            </a>
        `;
    productsGrid.appendChild(productElement);
  });
}
