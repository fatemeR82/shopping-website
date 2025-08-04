import { showToast } from "./toast.js";

function getProductIdFromPage() {
  const title = document.title;
  if (title.includes("گوشی هوشمند سامسونگ")) return "product1";
  if (title.includes("لپ‌تاپ اپل")) return "product2";
  if (title.includes("هدفون بی‌سیم")) return "product3";
  if (title.includes("کتاب")) return "product4";
  return "unknown";
}

export function setupComments() {
  const commentForm = document.getElementById("comment-form");
  if (!commentForm) return;

  const productId = getProductIdFromPage();

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value;
    if (!text.trim()) return;

    const comment = {
      text: text,
      date: new Date().toLocaleDateString("fa-IR"),
    };

    const existingComments = JSON.parse(
      localStorage.getItem(`comments_${productId}`) || "[]"
    );
    existingComments.push(comment);
    localStorage.setItem(
      `comments_${productId}`,
      JSON.stringify(existingComments)
    );

    displayComments(productId);
    document.getElementById("comment-text").value = "";

    showToast("نظر شما با موفقیت ثبت شد!", "success");
  });

  displayComments(productId);
}

function displayComments(productId) {
  const commentsList = document.getElementById("comments-list");
  if (!commentsList) return;

  const comments = JSON.parse(
    localStorage.getItem(`comments_${productId}`) || "[]"
  );

  commentsList.innerHTML = "";
  comments.forEach((comment) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${comment.text}</p>
      <small>تاریخ: ${comment.date}</small>
    `;
    commentsList.appendChild(li);
  });
}
