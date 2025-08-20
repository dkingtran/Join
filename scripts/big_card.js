let _currentTaskId = null; // merkt sich die zuletzt geöffnete Big Card

function getCategoryClass(category) {
  switch (category) {
    case "Technical Task":
      return "category-technical";
    case "User Story":
      return "category-userstory";
    default:
      return "category-default";
  }
}

// Global, damit der inline-Handler sie findet
window.deleteTaskBigCard = function (taskId) {
  if (!taskId) return;
  if (!confirm("Willst du diese Task wirklich löschen?")) return;
  if (!confirm("Letzte Bestätigung: Diese Aktion kann nicht rückgängig gemacht werden.")) return;
  deleteTaskFromFirebase(taskId)
    .then(() => {
      const card = document.getElementById(`big-card-${taskId}`);
      if (card) card.remove();
    })
    .catch(() => alert("Löschen fehlgeschlagen. Bitte erneut versuchen."));
};

async function deleteTaskFromFirebase(taskId) {
  const url = `${BASE_URL}tasks/${taskId}.json`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE failed: " + res.status);
}



function closeBigCard() {
  const overlay = document.getElementById("big-card-list");
  if (!overlay) return;
  overlay.innerHTML = '<div class="big-card-content"></div>';
  overlay.classList.add("d-none");
  overlay.removeEventListener("click", closeBigCard);
  document.removeEventListener("keydown", escCloseBigCard);
  document.body.style.overflow = "";
  initRender();
}

