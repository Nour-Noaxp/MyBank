document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector(".form-container");
  const transactionForm = document.querySelector(".transaction-form");
  const addTransactionBtn = document.querySelector(".add-transaction-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const accountId = transactionForm.dataset.accountId;
  const csrfToken = transactionForm.dataset.csrfToken;
  const errorMsgContainer = document.querySelector(".error-message-container");

  addTransactionBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden");
  });
  cancelBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    errorMsgContainer.classList.add("hidden");
    errorMsgContainer.innerHTML = "";
  });

  transactionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      date: document.querySelector(".date-input").value,
      payee: document.querySelector(".payee-input").value,
      category_id: document.querySelector(".category-id-input").value,
      memo: document.querySelector(".memo-input").value,
      outflow: document.querySelector(".outflow-input").value,
      inflow: document.querySelector(".inflow-input").value,
    };
    console.log("raw data", data);
    console.log("stringified data", JSON.stringify(data));
    console.log("fetch url : ", `accounts/${accountId}/transactions/new`);

    fetch(`/accounts/${accountId}/transactions/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            console.log("Response status : ", response.status);
            console.log("Response Error : ", error);
            throw new Error(error.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("response data : ", data);
        if (!data.success) {
          errorMsgContainer.innerHTML = "";
          data.errors.forEach((error) => {
            const divError = document.createElement("div");
            divError.textContent = error;
            divError.className = "rounded-xl bg-red-200 w-fit p-2 my-4";
            errorMsgContainer.appendChild(divError);
          });
          errorMsgContainer.classList.remove("hidden");
          console.log("data error message : ", data["errors"]);
        } else {
          const tableBody = document.querySelector(".table-body");
          const date = new Date(data["transaction"]["date"]);
          const formatted_date = date.toLocaleString("fr-FR");
          const transactionRow = tableBody.insertRow(0);
          transactionRow.classList.add("border-b", "border-gray-200");
          transactionRow.innerHTML = `
        <td class="py-4 px-3 pl-4 font-medium text-gray-900">${formatted_date}</td>
        <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data["transaction"]["payee"]}</td>
        <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data["transaction"]["category"]}</td>
        <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data["transaction"]["memo"]}</td>
        <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data["transaction"]["outflow"]}</td>
        <td class="py-4 px-3 pl-4 font-medium text-gray-500">${data["transaction"]["inflow"]}</td>`;
          transactionForm.reset();
          errorMsgContainer.classList.add("hidden");
        }
      })
      .catch((error) => {
        console.log("Promise Error : ", error.message);
      });
  });
});
