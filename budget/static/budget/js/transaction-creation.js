const transactionForm = document.querySelector(".transaction-form");
const addTransactionBtn = document.querySelector(".add-transaction-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-Btn");

addTransactionBtn.addEventListener("click", () => {
  transactionForm.classList.remove("hidden");
});
cancelBtn.addEventListener("click", () => {
  transactionForm.classList.add("hidden");
});
// saveBtn.addEventListener("click", (event) => {
//   event.preventDefault();
// });
