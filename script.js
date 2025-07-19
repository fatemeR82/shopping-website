let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCounts = document.querySelectorAll("#cart-count");
  cartCounts.forEach((count) => {
    count.textContent = cart.length;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const [name, price] = button.dataset.product.split("|");
    cart.push({ name, price: parseInt(price) });
    saveCart();
    updateCartCount();
    const modal = document.getElementById("add-to-cart-modal");
    modal.style.display = "block";
    setTimeout(() => (modal.style.display = "none"), 2000);
  });
});

if (document.getElementById("cart-items")) {
  function renderCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
        <p>${item.name}</p>
        <p class="price">${item.price.toLocaleString()} تومان</p>
        <button data-index="${index}">حذف</button>
      `;
      cartItemsDiv.appendChild(itemDiv);
      total += item.price;
    });
    document.getElementById(
      "total-price"
    ).textContent = `جمع کل: ${total.toLocaleString()} تومان`;
  }

  document.getElementById("cart-items").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      saveCart();
      updateCartCount();
      renderCart();
    }
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
  });

  renderCart();
}

const commentForm = document.getElementById("comment-form");
if (commentForm) {
  const productId = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  let comments =
    JSON.parse(localStorage.getItem(`comments-${productId}`)) || [];
  const commentsList = document.getElementById("comments-list");

  function renderComments() {
    commentsList.innerHTML = "";
    comments.forEach((comment) => {
      const li = document.createElement("li");
      li.textContent = comment;
      commentsList.appendChild(li);
    });
  }

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value.trim();
    if (text) {
      comments.push(text);
      localStorage.setItem(`comments-${productId}`, JSON.stringify(comments));
      renderComments();
      commentForm.reset();
    }
  });

  renderComments();
}

// زوم لنز
const imageWrapper = document.querySelector(".image-wrapper");
if (imageWrapper) {
  const img = imageWrapper.querySelector(".product-image-fixed");
  const lens = imageWrapper.querySelector(".zoom-lens");

  imageWrapper.addEventListener("mouseenter", () => {
    lens.style.display = "block";
  });

  imageWrapper.addEventListener("mousemove", (e) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;
    lens.style.backgroundImage = `url(${img.src})`;
    lens.style.backgroundPosition = `${posX}% ${posY}%`;
    lens.style.backgroundSize = "200% 200%";
  });

  imageWrapper.addEventListener("mouseleave", () => {
    lens.style.display = "none";
  });
}

// فرم خرید
const buyForm = document.getElementById("buyForm");
if (buyForm) {
  function getTotalWithShipping(shippingType) {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    if (shippingType === "سریع") total += 50000;
    return total;
  }

  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");
  provinceSelect.addEventListener("change", () => {
    citySelect.disabled = false;
    citySelect.innerHTML = '<option value="">انتخاب کنید</option>';
    if (provinceSelect.value === "tehran") {
      citySelect.innerHTML += '<option value="tehran">تهران</option>';
    } else if (provinceSelect.value === "isfahan") {
      citySelect.innerHTML += '<option value="isfahan">اصفهان</option>';
    } else if (provinceSelect.value === "shiraz") {
      citySelect.innerHTML += '<option value="shiraz">شیراز</option>';
    }
  });

  document.getElementById("buyButton").addEventListener("click", () => {
    if (buyForm.checkValidity()) {
      const shipping = document.querySelector(
        'input[name="shipping"]:checked'
      ).value;
      const total = getTotalWithShipping(shipping);
      alert(
        `خرید موفق! جمع کل با ارسال ${shipping}: ${total.toLocaleString()} تومان`
      );
    } else {
      alert("لطفا تمام فیلدها را پر کنید.");
    }
  });
}
