document.addEventListener("DOMContentLoaded", () => {
  console.log("inside js");
  const chart = document.querySelector(".myChart");
  const chart_labels = chart.dataset.chartLabels;
  const chart_data = chart.dataset.chartData;
  console.log(chart.dataset.chartLabels);
  console.log(
    "chart labels before parsing",
    chart_labels,
    "type :",
    typeof chart_labels
  );
  console.log(
    "chart data before parsing",
    chart_data,
    "type :",
    typeof chart_data
  );

  console.log(
    "chart labels after parsing",
    JSON.parse(chart_labels),
    "type :",
    typeof JSON.parse(chart_labels)
  );
  console.log(
    "chart data after parsing",
    JSON.parse(chart_data),
    "type :",
    typeof JSON.parse(chart_data)
  );

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
