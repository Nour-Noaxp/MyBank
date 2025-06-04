document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".myChart");
  const chart_labels = JSON.parse(chart.dataset.chartLabels);
  const chart_data = JSON.parse(chart.dataset.chartData);

  new Chart(chart, {
    type: "doughnut",
    data: {
      labels: chart_labels,
      datasets: [
        {
          label: "Spending per Category",
          data: chart_data,
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
