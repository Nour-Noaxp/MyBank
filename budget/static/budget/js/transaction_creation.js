const transactionForm = document.querySelector(".transaction-form");
const addTransactionBtn = document.querySelector(".add-transaction-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-Btn");
const accountId = document.querySelector(".transaction-form").dataset.accountId;

console.log("voici le account id", accountId);

transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const data = {
    date: document.querySelector(".date-input").value,
    payee: document.querySelector(".payee-input").value,
    category: document.querySelector(".category-input").value,
    memo: document.querySelector(".memo-input").value,
    outflow: document.querySelector(".outflow-input").value,
    inflow: document.querySelector(".inflow-input").value,
  };
  console.log(data);
});
// const categoryId =
//   document.querySelector(".category-option").dataset.categoryId;

addTransactionBtn.addEventListener("click", () => {
  transactionForm.classList.remove("hidden");
});
cancelBtn.addEventListener("click", () => {
  transactionForm.classList.add("hidden");
});
// saveBtn.addEventListener("click", (event) => {
//   event.preventDefault();
// });
