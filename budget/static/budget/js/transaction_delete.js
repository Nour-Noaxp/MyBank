document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const csrfContainer = document.querySelector(".csrf-container");
  const csrfToken = csrfContainer.dataset.csrfToken;
  const workingBalanceElement = document.querySelector(".working-balance");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const url = button.getAttribute("href");
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => {
          console.log("inside fetch request with response : ", response);
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          console.log("raw data content : ", data);
          if (data.success) {
            const transactionId = data.transaction_id;
            const workingBalance = data.working_balance;
            console.log("transaction id", transactionId);
            const transactionRow = document.querySelector(
              `.table-row[data-transaction-id="${transactionId}"]`
            );
            transactionRow.remove();
            workingBalanceElement.textContent = workingBalance;
          } else {
            data.errors.forEach((error) => {
              console.log(error);
            });
          }
        });
    });
  });
});
