document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".myChart");
  const chartLabels = JSON.parse(chart.dataset.chartLabels);
  const chartData = JSON.parse(chart.dataset.chartData);
  const totalSpending = JSON.parse(chart.dataset.totalSpendingData);
  const spendingPerCategory = document.querySelector(".spending_per_category");

  const doughnutCenterValue = {
    id: "doughnutCenter",
    beforeDatasetsDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`Total Spending`, xCoor, yCoor - 15);
      ctx.fillText(`${totalSpending}€`, xCoor, yCoor + 15);
    },
  };

  const chartGraph = new Chart(chart, {
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
      plugins: {
        legend: {
          display: false,
        },
      },
      aspectRatio: 2,
    },
    plugins: [doughnutCenterValue],
  });

  const chartLegend = (chart, labels, data) => {
    const chartColors = chart.data.datasets[0].backgroundColor;

    labels.forEach((label, index) => {
      const color = chartColors[index];
      const value = data[index];

      spendingPerCategory.innerHTML += `
        <div class="flex justify-between items-center mb-1">
          <div class="flex items-center gap-2">
            <span class="inline-block rounded-full w-3 h-3" style="background-color:${color};"></span>
            <span class="categories">${label}</span>
          </div>
          <div class="spending">${value}€</div>
        </div>`;
    });
  };
  chartLegend(chartGraph, chartLabels, chartData);
});
