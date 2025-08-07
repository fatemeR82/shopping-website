export function setupImageZoom() {
  const mainImage = document.getElementById("mainImage");
  const zoomResult = document.getElementById("zoomResult");

  if (!mainImage || !zoomResult) return;

  const productDetailImages = document.querySelector(".product-detail-images");
  if (!productDetailImages) return;

  const zoomContainer = document.querySelector(".product-zoom-container");
  if (zoomContainer) {
    zoomContainer.style.height = "400px";
    zoomContainer.style.display = "none";
    zoomContainer.style.border = "1px solid #e0e0e0";
    zoomContainer.style.borderRadius = "4px";
  }

  const zoomLens = document.createElement("div");
  zoomLens.id = "zoom-lens";
  zoomLens.style.position = "absolute";
  zoomLens.style.border = "2px solid #3a86ff";
  zoomLens.style.borderRadius = "2px";
  zoomLens.style.width = "100px";
  zoomLens.style.height = "100px";
  zoomLens.style.display = "none";
  zoomLens.style.cursor = "move";
  zoomLens.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  zoomLens.style.pointerEvents = "none";

  const productMainImage = document.querySelector(".product-main-image");
  if (productMainImage) {
    productMainImage.appendChild(zoomLens);
  }

  const zoomRatio = 3;

  function calculateLensSize() {
    if (!mainImage || !zoomContainer) return;

    const widthRatio =
      mainImage.offsetWidth / (zoomRatio * mainImage.offsetWidth);
    const heightRatio =
      mainImage.offsetHeight / (zoomRatio * mainImage.offsetHeight);

    zoomLens.style.width = `${mainImage.offsetWidth * widthRatio}px`;
    zoomLens.style.height = `${mainImage.offsetHeight * heightRatio}px`;
  }

  function moveLens(e) {
    if (!mainImage || !zoomLens || !zoomResult) return;

    e.preventDefault();

    const rect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensWidth = parseInt(zoomLens.style.width);
    const lensHeight = parseInt(zoomLens.style.height);
    const lensX = x - lensWidth / 2;
    const lensY = y - lensHeight / 2;

    let posX = Math.max(0, Math.min(lensX, mainImage.offsetWidth - lensWidth));
    let posY = Math.max(
      0,
      Math.min(lensY, mainImage.offsetHeight - lensHeight)
    );

    zoomLens.style.left = `${posX}px`;
    zoomLens.style.top = `${posY}px`;

    const xPercent = (posX / (mainImage.offsetWidth - lensWidth)) * 100;
    const yPercent = (posY / (mainImage.offsetHeight - lensHeight)) * 100;

    zoomResult.style.backgroundImage = `url(${mainImage.src})`;
    zoomResult.style.backgroundSize = `${mainImage.offsetWidth * zoomRatio}px ${
      mainImage.offsetHeight * zoomRatio
    }px`;
    zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  }

  mainImage.addEventListener("mouseenter", function () {
    if (!zoomContainer || !zoomLens) return;

    calculateLensSize();

    zoomLens.style.display = "block";
    zoomContainer.style.display = "block";

    if (zoomResult) {
      zoomResult.style.backgroundImage = `url(${this.src})`;
      zoomResult.style.backgroundSize = `${this.offsetWidth * zoomRatio}px ${
        this.offsetHeight * zoomRatio
      }px`;
    }
  });

  mainImage.addEventListener("mouseleave", function () {
    if (!zoomContainer || !zoomLens) return;

    zoomLens.style.display = "none";
    zoomContainer.style.display = "none";
  });

  mainImage.addEventListener("mousemove", moveLens);

  window.addEventListener("resize", calculateLensSize);
}

export function initImageZoom() {
  setupImageZoom();
}
