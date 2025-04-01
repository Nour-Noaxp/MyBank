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

assignModalContainer.addEventListener("click", (event) => {
  console.log(event.target);
  if (event.target !== assignModalContainer) {
    assignModalContainer.classList.add("hidden");
  }
});
