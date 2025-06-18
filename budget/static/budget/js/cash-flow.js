document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".cash-flow-chart");
  const months = chart.dataset.chartMonths;
  const income = chart.dataset.chartIncome;
  const spending = chart.dataset.chartSpending;

  // const months_in_letters = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  const chartColors = {
    red: "rgb(255, 99, 132)",
    blue: "rgb(54, 162, 235)",
  };

  const labels = ["5", "8", "10"];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: income,
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blue,
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: "Spending",
        data: spending,
        borderColor: chartColors.red,
        backgroundColor: chartColors.red,
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const cashFlowGraph = new Chart(chart, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Income vs. Spending",
        },
      },
    },
  });
});
