document.addEventListener("DOMContentLoaded", () => {
  const deleteButton = document.querySelector(".delete-button");
  const transactionForm = document.querySelector(".transaction-form");
  const { accountId, csrfToken } = transactionForm.dataset;

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const transactionId = document.querySelector(`[data-transaction-id]`)
      .dataset.transactionId;
    fetch(`/accounts/${accountId}/transactions/${transactionId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          if (response.status == 204) {
            console.log("Transaction supprimée avec succès");
            return { success: true };
          }
          return response.json();
        }
      })
      .then((data) => {
        console.log("Suppression réussie:", data);
        if (data.success) {
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
