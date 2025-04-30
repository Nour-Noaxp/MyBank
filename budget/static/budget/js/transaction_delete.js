document.addEventListener("DOMContentLoaded", () => {
  const deleteButton = document.querySelector(".delete-button");
  // const transactionForm = document.querySelector(".transaction-form");
  // const { accountId, csrfToken } = transactionForm.dataset;
  console.log("tessst");

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const url = deleteButton.getAttribute("href");
    console.log("fetch url : ", url);
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
          if (response.status == 204) {
            console.log("Transaction supprimée avec succès");
            return { success: true };
          }
          return response.json();
        }
      })
      .then((data) => {
        console.log("raw data content : ", data);
        if (data.success) {
          const transactionId = data.transaction_id;
          const transactionRow = document.querySelector(
            `.table-row[data-transaction-id="${transactionId}"]`
          );
          transactionRow.remove();
        } else {
          data.errors.forEach((error) => {
            console.log(error);
          });
        }
      });
  });
});
