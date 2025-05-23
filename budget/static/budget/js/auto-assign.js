document.addEventListener("DOMContentLoaded", () => {
  const assignModal = document.querySelector(".assign-modal");

  document.querySelector(".underfunded-bloc").addEventListener("click", (e) => {
    assignModal.classList.remove("hidden");
  });

  document.querySelector(".close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    assignModal.classList.add("hidden");
  });

  document.querySelector(".assign-button").addEventListener("click", (e) => {
    assignModal.classList.add("hidden");
  });
});
