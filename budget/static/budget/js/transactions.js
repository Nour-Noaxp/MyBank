document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector(".form-container");
  const transactionForm = document.querySelector(".transaction-form");
  const addTransactionBtn = document.querySelector(".add-transaction-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const { accountId, csrfToken } = transactionForm.dataset;
  const errorMsgContainer = document.querySelector(".error-message-container");
  const workingBalanceElement = document.querySelector(".working-balance");
  const deleteButtons = document.querySelectorAll(".delete-button");
  const editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const transactionId = button.dataset.transactionId;
      const accountId = button.dataset.accountId;

      // <------------------------- Prefill Transaction Fields ------------------------------>
      console.log("date : ", button.dataset.date);

      transactionForm.querySelector('input[name="date"]').value =
        button.dataset.date;
      transactionForm.querySelector('input[name="payee"]').value =
        button.dataset.payee;
      transactionForm.querySelector('select[name="category_id"]').value =
        button.dataset.categoryId;
      transactionForm.querySelector('input[name="memo"]').value =
        button.dataset.memo;
      transactionForm.querySelector('input[name="outflow"]').value =
        button.dataset.outflow;
      transactionForm.querySelector('input[name="inflow"]').value =
        button.dataset.inflow;

      const url = transactionForm.dataset.editUrl.replace(
        "none",
        transactionId
      );
      transactionForm.action = url;
      console.log("edit button clicked !");
      console.log("trnsaction form url : ", url);

      formContainer.classList.remove("hidden");

      console.log("form action content : ", transactionForm.action);
    });
  });

  // <----------------------------- Define Functions ----------------------->
  const showErrorMessages = (errors) => {
    errorMsgContainer.innerHTML = "";
    errors.forEach((error) => {
      const divError = document.createElement("div");
      divError.textContent = error;
      divError.className = "rounded-xl bg-red-200 w-fit p-2 my-4";
      errorMsgContainer.appendChild(divError);
    });
    errorMsgContainer.classList.remove("hidden");
  };

  const deleteTransaction = (e, deleteButton) => {
    e.preventDefault();
    const url = deleteButton.getAttribute("href");
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data.success) {
          const {
            transaction_id: transactionId,
            working_balance: workingBalance,
          } = data;
          const transactionRow = document.querySelector(
            `.table-row[data-transaction-id="${transactionId}"]`
          );
          transactionRow.remove();
          workingBalanceElement.textContent = workingBalance;
        } else {
          showErrorMessages(data.errors);
        }
      });
  };

  // <---------------------------------------------------->

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteTransaction(e, button);
    });
  });

  addTransactionBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.add("hidden");
    errorMsgContainer.classList.add("hidden");
    errorMsgContainer.innerHTML = "";
  });

  transactionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(transactionForm);
    const formValues = Object.fromEntries(formData.entries());
    transactionForm.action = transactionForm.dataset.createUrl;
    const url = transactionForm.action;

    console.log("create button clicked !");
    console.log("trnsaction form url : ", url);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data.success) {
          const tableBody = document.querySelector(".table-body");
          const date = new Date(data.transaction.date);
          const workingBalance = data.working_balance;
          const formattedDate = date.toLocaleString("fr-FR");
          const newTransactionRow = tableBody.insertRow(0);
          newTransactionRow.classList.add(
            "table-row",
            "border-b",
            "border-gray-200"
          );
          newTransactionRow.dataset.transactionId = data.transaction.id;
          newTransactionRow.innerHTML = `
            <td class="py-4 px-3 pl-4 font-medium text-gray-900">${formattedDate}</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.transaction.payee}</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.transaction.category}</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.transaction.memo}</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.transaction.outflow}</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data.transaction.inflow}</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">
              <a class="delete-button inline-block" data-transaction-id="${data.transaction.id}" href="/accounts/${accountId}/transactions/${data.transaction.id}/delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </a>
            </td>`;

          const deleteButton =
            newTransactionRow.querySelector(".delete-button");
          deleteButton.addEventListener("click", (e) => {
            deleteTransaction(e, deleteButton);
          });

          transactionForm.reset();
          errorMsgContainer.classList.add("hidden");
          workingBalanceElement.textContent = workingBalance;
        } else {
          showErrorMessages(data.errors);
        }
      });
  });
});
