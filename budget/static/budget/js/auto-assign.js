document.addEventListener("DOMContentLoaded", () => {
  console.log("JS chargé");
  const underfundedBloc = document.querySelector(".underfunded-bloc");
  const assignModal = document.querySelector(".assign-modal");
  const closeModal = document.querySelector(".close-modal");
  const assignMoney = document.querySelector(".assign-button");

  underfundedBloc.addEventListener("click", (e) => {
    console.log("underfunded clicked");
    assignModal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    assignModal.classList.add("hidden");
  });

  assignMoney.addEventListener("click", (e) => {
    assignModal.classList.add("hidden");
  });
});
