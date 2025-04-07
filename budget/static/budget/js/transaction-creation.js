const transactionForm = document.querySelector(".transaction-form");
const addTransactionBtn = document.querySelector(".add-transaction-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".saveBtn");

addTransactionBtn.addEventListener("click", () => {
  transactionForm.classList.remove("hidden");
});
cancelBtn.addEventListener("click", () => {
  transactionForm.classList.add("hidden");
});
saveBtn.addEventListener("click", (event) => {
  const data = {
    created_at: $("date").val(),
    payee: $("payee").val(),
    category: $("category").val(),
    memo: $("memo").val(),
    outflow: $("outflow").val(),
    inflow: $("inflow").val(),
  };
});
fetch(`accounts/${account_id}/transactions/new`, {
  method: "POST",
  body: JSON.stringify({ created_at, payee, category, memo, outflow, inflow }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });

// const response = await fetch("accounts/<account_id>/transactions/new", {
//   method: "POST",
//   body: JSON.stringify({ created_at:"created_at", payee:"payee", category:"category", memo:"memo", outflow:"outflow", inflow:"inflow"})
// })
