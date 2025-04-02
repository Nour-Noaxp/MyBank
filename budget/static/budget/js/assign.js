const openModalBtn = document.querySelector(".assign-btn-modal");
const assignModalContainer = document.querySelector(".assign-modal-container");
const closeModalBtn = document.querySelector(".cancel-btn");

openModalBtn.addEventListener("click", () => {
  assignModalContainer.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  assignModalContainer.classList.add("hidden");
});
