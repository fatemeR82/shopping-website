import { showToast } from "./toast.js";

export function setupComments() {
  const commentForm = document.getElementById("comment-form");
  if (!commentForm) return;

  // دریافت شناسه محصول از URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) return;

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

  if (comments.length === 0) {
    commentsList.innerHTML =
      "<li class='no-comments'>هنوز نظری ثبت نشده است.</li>";
    return;
  }

  comments.forEach((comment) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <p>${comment.text}</p>
            <small>تاریخ: ${comment.date}</small>
        `;
    commentsList.appendChild(li);
  });
}
