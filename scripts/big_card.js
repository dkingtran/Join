function getInitials(name) {
  const parts = name.trim().split(" ");
  let initials = "";
  for (let i = 0; i < parts.length && i < 2; i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0].toUpperCase();
    }
  }
  return initials;
}

// bigCards.js
window.toggleSubtaskDone = function (el) {
  const taskId = el.getAttribute("data-task-id");
  const subId  = el.getAttribute("data-subtask-id");
  const done   = el.checked;
  patchSubtaskDone(taskId, subId, done).catch(() => { el.checked = !done; });
};


async function patchSubtaskDone(taskId, subtaskId, done) {
  const path = `tasks/${taskId}/subtasks/${subtaskId}.json`;
  const res = await fetch(BASE_URL + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done })
  });
  if (!res.ok) throw new Error("Patch failed: " + res.status);
  return res.json();
}


function getPriorityIcon(prio) {
  const p = (prio || "").toLowerCase();
  if (p === "low") {
    return `<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"/>
<path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
</svg>
`;
  }
  if (p === "medium") {
    return `<svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_156_1170)">
<path d="M19.7596 7.91717H1.95136C1.66071 7.91717 1.38197 7.80087 1.17645 7.59386C0.970928 7.38685 0.855469 7.10608 0.855469 6.81332C0.855469 6.52056 0.970928 6.23979 1.17645 6.03278C1.38197 5.82577 1.66071 5.70947 1.95136 5.70947H19.7596C20.0502 5.70947 20.329 5.82577 20.5345 6.03278C20.74 6.23979 20.8555 6.52056 20.8555 6.81332C20.8555 7.10608 20.74 7.38685 20.5345 7.59386C20.329 7.80087 20.0502 7.91717 19.7596 7.91717Z" fill="#FFA800"/>
<path d="M19.7596 2.67388H1.95136C1.66071 2.67388 1.38197 2.55759 1.17645 2.35057C0.970928 2.14356 0.855469 1.86279 0.855469 1.57004C0.855469 1.27728 0.970928 0.996508 1.17645 0.789496C1.38197 0.582485 1.66071 0.466187 1.95136 0.466187L19.7596 0.466187C20.0502 0.466187 20.329 0.582485 20.5345 0.789496C20.74 0.996508 20.8555 1.27728 20.8555 1.57004C20.8555 1.86279 20.74 2.14356 20.5345 2.35057C20.329 2.55759 20.0502 2.67388 19.7596 2.67388Z" fill="#FFA800"/>
</g>
<defs>
<clipPath id="clip0_156_1170">
<rect width="20" height="7.45098" fill="white" transform="translate(0.855469 0.466187)"/>
</clipPath>
</defs>
</svg>`;
  }
  if (p === "urgent") {
    return `<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"/>
<path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"/>
</svg>`;
  }
  return "";
}


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


function editBigCard(){
overlayAddTask = document.getElementById("add-task-overlay");
 overlayAddTask.classList.toggle('d-none');
};