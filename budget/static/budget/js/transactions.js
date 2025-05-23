document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector(".form-container");
  const transactionForm = document.querySelector(".transaction-form");
  const addTransactionBtn = document.querySelector(".add-transaction-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const errorMsgContainer = document.querySelector(".error-message-container");
  const workingBalanceElement = document.querySelector(".working-balance");
  const deleteButtons = document.querySelectorAll(".delete-button");
  const editButtons = document.querySelectorAll(".edit-button");
  const { accountId, csrfToken } = transactionForm.dataset;

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

  const clearErrorsAndCloseForm = () => {
    errorMsgContainer.innerHTML = "";
    errorMsgContainer.classList.add("hidden");
    transactionForm.reset();
    formContainer.classList.add("hidden");
  };

  const editTransaction = (e, editButton) => {
    e.preventDefault();
    transactionForm.setAttribute("action", editButton.getAttribute("href"));
    transactionForm.dataset.transactionId = editButton.dataset.transactionId;
    transactionForm.querySelector('input[name="date"]').value =
      editButton.dataset.date;
    transactionForm.querySelector('input[name="payee"]').value =
      editButton.dataset.payee;
    transactionForm.querySelector('select[name="category_id"]').value =
      editButton.dataset.categoryId;
    transactionForm.querySelector('input[name="memo"]').value =
      editButton.dataset.memo;
    transactionForm.querySelector('input[name="outflow"]').value =
      editButton.dataset.outflow;
    transactionForm.querySelector('input[name="inflow"]').value =
      editButton.dataset.inflow;

    formContainer.classList.remove("hidden");
  };

  const saveTransaction = (e, transactionForm) => {
    e.preventDefault();
    const formData = new FormData(transactionForm);
    const formValues = Object.fromEntries(formData.entries());
    const url = transactionForm.getAttribute("action");

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
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${
              data.transaction.payee
            }</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${
              data.transaction.category?.name || ""
            }</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${
              data.transaction.memo
            }</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${
              data.transaction.outflow
            }</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">${
              data.transaction.inflow
            }</td>
            <td class="py-4 px-3 pl-4 font-medium text-gray-500">
              <a class="delete-button inline-block" data-transaction-id="${
                data.transaction.id
              }" href="/accounts/${accountId}/transactions/${
            data.transaction.id
          }/delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </a>
              <a class="edit-button inline-block pl-4" data-transaction-id="${
                data.transaction.id
              }" data-account-id="${accountId}" data-date="${
            data.transaction.date
          }" data-payee="${data.transaction.payee}" data-category-id="${
            data.transaction.category?.id
          }" data-memo="${data.transaction.memo}" data-outflow="${
            data.transaction.outflow
          }" data-inflow="${
            data.transaction.inflow
          }" href="/accounts/${accountId}/transactions/${
            data.transaction.id
          }/edit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </a>
            </td>`;

          const editButton = newTransactionRow.querySelector(".edit-button");
          editButton.addEventListener("click", (e) => {
            editTransaction(e, editButton);
          });

          const deleteButton =
            newTransactionRow.querySelector(".delete-button");
          deleteButton.addEventListener("click", (e) => {
            deleteTransaction(e, deleteButton);
          });

          workingBalanceElement.textContent = workingBalance;
          clearErrorsAndCloseForm();

          if (url.includes("edit")) {
            const editedTransactionRow = document.querySelector(
              `.table-row[data-transaction-id="${transactionForm.dataset.transactionId}"]`
            );
            editedTransactionRow.remove();
          }
        } else {
          showErrorMessages(data.errors);
        }
      });
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

  transactionForm.addEventListener("submit", (e) => {
    saveTransaction(e, transactionForm);
  });

  addTransactionBtn.addEventListener("click", () => {
    transactionForm.setAttribute("action", transactionForm.dataset.createUrl);
    formContainer.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrorsAndCloseForm();
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      editTransaction(e, button);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteTransaction(e, button);
    });
  });
});
