export function setupImageZoom() {
  const mainImage = document.getElementById("mainImage");
  const zoomResult = document.getElementById("zoomResult");
  const zoomContainer = document.querySelector(".product-zoom-container");

  if (!mainImage || !zoomResult || !zoomContainer) return;

  mainImage.addEventListener("mouseenter", function () {
    zoomContainer.style.display = "block";
    zoomResult.style.backgroundImage = `url(${this.src})`;
    zoomResult.style.backgroundSize = "300% 300%";
  });

  mainImage.addEventListener("mouseleave", function () {
    zoomContainer.style.display = "none";
  });

  mainImage.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  });
}
