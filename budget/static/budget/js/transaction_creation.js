const transactionForm = document.querySelector(".transaction-form");
const addTransactionBtn = document.querySelector(".add-transaction-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-Btn");
const accountId = transactionForm.dataset.accountId;
const csrfToken = transactionForm.dataset.csrfToken;

addTransactionBtn.addEventListener("click", () => {
  transactionForm.classList.remove("hidden");
});
cancelBtn.addEventListener("click", () => {
  transactionForm.classList.add("hidden");
});

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    date: document.querySelector(".date-input").value,
    payee: document.querySelector(".payee-input").value,
    category: document.querySelector(".category-input").value,
    memo: document.querySelector(".memo-input").value,
    outflow: document.querySelector(".outflow-input").value,
    inflow: document.querySelector(".inflow-input").value,
  };
  console.log("raw data", data);
  console.log("stringified data", JSON.stringify(data));
  console.log(`accounts/${accountId}/transactions/new`);

  fetch(`/accounts/${accountId}/transactions/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      // console.log("first response global", response);
      if (!response.ok) {
        throw new Error("Request Error!!!!!!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("promise data", data);

      const tableBody = document.querySelector(".table-body");
      if (data.success) {
        const transactionRow = tableBody.insertRow(0);
        transactionRow.classList.add("border-b", "border-gray-200");
        transactionRow.innerHTML = `
      <td class="py-4 px-3 pl-4 font-medium text-gray-900">${data.date}</td>
      <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.payee}</td>
      <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.category}</td>
      <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.memo}</td>
      <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.outflow}</td>
      <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.inflow}</td>`;
      }
      transactionForm.classList.add("hidden");
      transactionForm.reset();
    })
    .catch((error) => {
      console.log("Promise Error!!!!! :", error);
    });
});
