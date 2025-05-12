<template>
  <div class="dashboard">
    <h2>Revenue Analysis</h2>

    <div class="filters">
      <div class="filter">
        <label for="timeframe">Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe">
          <option v-for="tf in timeframes" :key="tf.value" :value="tf.value">
            {{ tf.label }}
          </option>
        </select>
      </div>

      <div class="filter">
        <label for="category">Category:</label>
        <select id="category" v-model="selectedCategory">
          <option value="all">All Categories</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="value">${{ totalRevenue }}</p>
      </div>

      <div class="stat-card">
        <h3>Total Orders</h3>
        <p class="value">{{ totalOrders }}</p>
      </div>

      <div class="stat-card">
        <h3>Average Order Value</h3>
        <p class="value">${{ averageOrderValue }}</p>
      </div>
    </div>

    <div class="charts">
      <div class="chart-container">
        <h3>Revenue Trends</h3>
        <LineChart
          v-if="salesChartData"
          :chartData="salesChartData"
          :chartOptions="chartOptions"
        />
      </div>

      <div class="chart-container">
        <h3>Order Trends</h3>
        <BarChart
          v-if="orderChartData"
          :chartData="orderChartData"
          :chartOptions="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useInventoryStore } from "../../stores/inventory";
import LineChart from "./components/LineChart.vue";
import BarChart from "./components/BarChart.vue";
import {
  aggregateData,
  createRevenueChartData,
  createOrdersChartData,
  defaultChartOptions,
} from "../../utils/ChartUtils.js";

// Get store
const inventoryStore = useInventoryStore();

// State variables
const selectedTimeframe = ref("monthly");
const selectedCategory = ref("all");
const salesChartData = ref(null);
const orderChartData = ref(null);
const totalRevenue = ref(0);
const totalOrders = ref(0);
const averageOrderValue = ref(0);

const categories = computed(() => inventoryStore.categories);

// List of timeframes for selector
const timeframes = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
];

// Chart options
const chartOptions = defaultChartOptions;

// Filter data based on selected category
const filteredSalesData = computed(() => {
  const data = inventoryStore.salesData;
  if (selectedCategory.value === "all") {
    return data;
  }
  return data.filter((sale) => sale.category === selectedCategory.value);
});

// Update chart data
const updateCharts = () => {
  const { labels, revenueData, ordersData } = aggregateData(
    filteredSalesData.value,
    selectedTimeframe.value
  );

  // Create chart data using utility functions
  salesChartData.value = createRevenueChartData(labels, revenueData);
  orderChartData.value = createOrdersChartData(labels, ordersData);

  // Calculate totals
  totalRevenue.value = filteredSalesData.value
    .reduce((sum, sale) => sum + sale.revenue, 0)
    .toFixed(2);
  totalOrders.value = filteredSalesData.value.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  if (totalOrders.value > 0) {
    averageOrderValue.value = (totalRevenue.value / totalOrders.value).toFixed(
      2
    );
  } else {
    averageOrderValue.value = 0;
  }
};

// Watch for changes in timeframe or category
watch([selectedTimeframe, selectedCategory], () => {
  updateCharts();
});

// Initialize on component mount
onMounted(() => {
  updateCharts();
});
</script>

<style scoped>
.dashboard {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.stat-card h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-card .value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.chart-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
}

.chart-container h3 {
  margin-bottom: 1rem;
  color: #555;
}

@media (min-width: 768px) {
  .charts {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
