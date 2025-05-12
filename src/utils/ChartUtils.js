export const aggregateData = (data, timeframe) => {
  const aggregated = {};

  data.forEach((sale) => {
    const date = new Date(sale.date);
    let key = "";

    switch (timeframe) {
      case "daily":
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        break;
      case "weekly":
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        const weekNum = Math.ceil(
          (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
        );
        key = `${date.getFullYear()}-W${weekNum}`;
        break;
      case "monthly":
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        break;
      case "annually":
        key = `${date.getFullYear()}`;
        break;
    }

    if (!aggregated[key]) {
      aggregated[key] = { revenue: 0, orders: 0 };
    }

    aggregated[key].revenue += sale.revenue;
    aggregated[key].orders += sale.quantity;
  });

  // Sort keys and create arrays for chart
  const sortedKeys = Object.keys(aggregated).sort();
  const labels = [];
  const revenueData = [];
  const ordersData = [];

  // Format labels based on timeframe
  sortedKeys.forEach((key) => {
    let label = key;
    if (timeframe === "monthly") {
      const [year, month] = key.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      label = `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (timeframe === "weekly") {
      const [year, week] = key.split("-W");
      label = `Week ${week}, ${year}`;
    }

    labels.push(label);
    revenueData.push(aggregated[key].revenue.toFixed(2));
    ordersData.push(aggregated[key].orders);
  });

  return { labels, revenueData, ordersData };
};

export const createRevenueChartData = (labels, data) => {
  return {
    labels,
    datasets: [
      {
        label: "Revenue",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: data,
      },
    ],
  };
};

export const createOrdersChartData = (labels, data) => {
  return {
    labels,
    datasets: [
      {
        label: "Orders",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        data: data,
      },
    ],
  };
};

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
