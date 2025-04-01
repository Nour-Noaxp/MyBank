const assignBtn = document.querySelector(".assign-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const assignModal = document.querySelector(".assign-modal");

assignBtn.addEventListener("click", function () {
  assignModal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", function () {
  assignModal.classList.add("hidden");
});

// var x = document.getElementById("myForm");
// if (x.style.display == "none") {
//   x.style.display = "block";
// } else {
//   x.style.display = "none";
// }
