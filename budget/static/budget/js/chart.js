document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".myChart");
  const chartLabels = JSON.parse(chart.dataset.chartLabels);
  const chartData = JSON.parse(chart.dataset.chartData);
  const chartPercentages = JSON.parse(chart.dataset.chartPercentages);
  const totalSpending = JSON.parse(chart.dataset.totalSpendingData);
  const spendingPerCategoryContainer = document.querySelector(
    ".spending_per_category_container"
  );

  const doughnutCenterValue = {
    id: "doughnutCenter",
    beforeDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      if (!meta.data.length) return;

      const { x: cx, y: cy } = meta.data[0];
      const ctx = chart.ctx;

      const fontSize = Math.round(chart.width / 25);
      const lineHeight = fontSize * 1.2;

      ctx.save();
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText("Total Spending", cx, cy - lineHeight / 2);
      ctx.fillText(`${totalSpending} €`, cx, cy + lineHeight / 2);
      ctx.restore();
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
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: { legend: { display: false } },
      radius: "70%",
    },
    plugins: [doughnutCenterValue],
  });

  // Generate detailed data on the side
  const chartColors = chartGraph.data.datasets[0].backgroundColor;

  chartLabels.forEach((label, index) => {
    const color = chartColors[index];
    const value = chartData[index];

    spendingPerCategoryContainer.innerHTML += `
      <div class="flex justify-between items-center mb-1">
        <div class="flex items-center gap-2">
          <span class="inline-block rounded-full w-3 h-3" style="background-color:${color};"></span>
          <span class="categories">${label}</span>
        </div>
        <div class="spending">${value}€</div>
      </div>`;
  });
});
