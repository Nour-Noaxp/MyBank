document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".myChart");
  const chartLabels = JSON.parse(chart.dataset.chartLabels);
  const chartData = JSON.parse(chart.dataset.chartData);
  const totalSpending = JSON.parse(chart.dataset.totalSpendingData);

  new Chart(chart, {
    type: "doughnut",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Spending per Category",
          data: chartData,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
