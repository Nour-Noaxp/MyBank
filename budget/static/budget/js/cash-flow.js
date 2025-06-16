document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".cash-flow-chart");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const chartColors = {
    red: "rgb(255, 99, 132)",
    blue: "rgb(54, 162, 235)",
  };

  const labels = months;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: [
          1200, 1250, 1200, 1380, 1214, 900, 2356, 1300, 1400, 1250, 1500, 1450,
        ],
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blue,
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: "Spending",
        data: [20, 1300, 1190, 324, 1214, 356, 2356, 276, 55, 60, 80, 98],
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
