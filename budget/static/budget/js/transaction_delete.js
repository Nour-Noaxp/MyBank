document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const csrfContainer = document.querySelector(".csrf-container");
  const csrfToken = csrfContainer.dataset.csrfToken;
  console.log("tessst");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const url = button.getAttribute("href");
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
              console.log("Transaction successfully delete!");
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
});
