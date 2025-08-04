export function showToast(message, type = "success") {
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach((toast) => toast.remove());

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  if (type === "success") {
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  } else if (type === "error") {
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  } else if (type === "warning") {
    toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
  }

  document.body.appendChild(toast);
  toast.style.display = "block";

  setTimeout(() => {
    toast.classList.add("active");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 4000);
}

export function showFormIncompleteToast(message) {
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach((toast) => toast.remove());

  const toast = document.createElement("div");
  toast.className = "toast toast-warning incomplete-form-toast";
  toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 5000);
}
