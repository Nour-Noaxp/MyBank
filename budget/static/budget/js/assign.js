const openModalBtn = document.querySelector(".open-modal-btn");
const closeModalBtn = document.querySelector(".close-modal-btn");
const assignModalContainer = document.querySelector(".assign-modal-container");

openModalBtn.addEventListener("click", function () {
  assignModalContainer.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", function () {
  assignModalContainer.classList.add("hidden");
});
