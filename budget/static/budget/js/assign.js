const assignBtnModal = document.querySelector(".assign-btn-modal");
const cancelBtn = document.querySelector(".cancel-btn");
const assignBtn = document.querySelector(".assign-btn");
const assignModalContainer = document.querySelector(".assign-modal-container");

assignBtnModal.addEventListener("click", function () {
  assignModalContainer.classList.remove("hidden");
});

cancelBtn.addEventListener("click", function () {
  assignModalContainer.classList.add("hidden");
});

assignBtn.addEventListener("click", function () {
  assignModalContainer.classList.add("hidden");
});
