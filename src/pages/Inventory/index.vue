<template>
  <div class="inventory">
    <h2>Inventory Management</h2>

    <div class="inventory-header">
      <div class="search-filters">
        <div class="search">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
          />
        </div>

        <div class="filter">
          <label for="category-filter">Category:</label>
          <select id="category-filter" v-model="categoryFilter">
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

        <div class="filter checkbox">
          <input type="checkbox" id="low-stock" v-model="showLowStockOnly" />
          <label for="low-stock">Show Low Stock Only</label>
        </div>
      </div>

      <div class="low-stock-summary" v-if="lowStockCount > 0">
        <div class="alert">
          <strong>Low Stock Alert:</strong>
          {{ lowStockCount }} products need restocking
        </div>
      </div>
    </div>

    <div class="inventory-table">
      <table>
        <thead>
          <tr>
            <th
              @click="sortProducts('id')"
              :class="{ 'active-sort': sortField === 'id' }"
            >
              ID
              {{
                sortField === "id" ? (sortDirection === "asc" ? "▲" : "▼") : ""
              }}
            </th>
            <th
              @click="sortProducts('name')"
              :class="{ 'active-sort': sortField === 'name' }"
            >
              Product Name
              {{
                sortField === "name"
                  ? sortDirection === "asc"
                    ? "▲"
                    : "▼"
                  : ""
              }}
            </th>
            <th
              @click="sortProducts('category')"
              :class="{ 'active-sort': sortField === 'category' }"
            >
              Category
              {{
                sortField === "category"
                  ? sortDirection === "asc"
                    ? "▲"
                    : "▼"
                  : ""
              }}
            </th>
            <th
              @click="sortProducts('price')"
              :class="{ 'active-sort': sortField === 'price' }"
            >
              Price
              {{
                sortField === "price"
                  ? sortDirection === "asc"
                    ? "▲"
                    : "▼"
                  : ""
              }}
            </th>
            <th
              @click="sortProducts('stock')"
              :class="{ 'active-sort': sortField === 'stock' }"
            >
              Current Stock
              {{
                sortField === "stock"
                  ? sortDirection === "asc"
                    ? "▲"
                    : "▼"
                  : ""
              }}
            </th>
            <th>Low Stock Threshold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in sortedProducts"
            :key="product.id"
            :class="{
              'low-stock-row': product.stock <= product.lowStockThreshold,
            }"
          >
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td
              :class="{
                'low-stock-cell': product.stock <= product.lowStockThreshold,
              }"
            >
              <template
                v-if="editingProduct && editingProduct.id === product.id"
              >
                <input
                  type="number"
                  v-model="editStockValue"
                  min="0"
                  class="stock-input"
                />
              </template>
              <template v-else>
                {{ product.stock }}
              </template>
            </td>
            <td>{{ product.lowStockThreshold }}</td>
            <td>
              <span :class="['status', getProductStatus(product).class]">
                {{ getProductStatus(product).text }}
              </span>
            </td>
            <td>
              <template
                v-if="editingProduct && editingProduct.id === product.id"
              >
                <button @click="saveInventory" class="btn-save">Save</button>
                <button @click="cancelEditing" class="btn-cancel">
                  Cancel
                </button>
              </template>
              <template v-else>
                <button
                  @click="adjustInventory(product, -1)"
                  class="btn-decrease"
                  :disabled="product.stock <= 0"
                >
                  -
                </button>
                <button
                  @click="adjustInventory(product, 1)"
                  class="btn-increase"
                >
                  +
                </button>
                <button @click="startEditing(product)" class="btn-update">
                  Update
                </button>
              </template>
            </td>
          </tr>
          <tr v-if="sortedProducts.length === 0">
            <td colspan="8" class="no-results">
              No products match your filters
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useInventoryStore } from "../../stores/inventory";

// Get store
const inventoryStore = useInventoryStore();

// State variables
const searchQuery = ref("");
const categoryFilter = ref("all");
const showLowStockOnly = ref(false);
const editingProduct = ref(null);
const editStockValue = ref(0);

// Filtered products based on search and filters
const filteredProducts = computed(() => {
  let filtered = [...inventoryStore.products];

  // Apply category filter
  if (categoryFilter.value !== "all") {
    filtered = filtered.filter(
      (product) => product.category === categoryFilter.value
    );
  }

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Apply low stock filter
  if (showLowStockOnly.value) {
    filtered = filtered.filter(
      (product) => product.stock <= product.lowStockThreshold
    );
  }

  return filtered;
});

// Count of low stock products
const lowStockCount = computed(() => {
  return filteredProducts.value.filter((p) => p.stock <= p.lowStockThreshold)
    .length;
});

// Product status
const getProductStatus = (product) => {
  if (product.stock <= 0) {
    return { text: "Out of Stock", class: "out-of-stock" };
  } else if (product.stock <= product.lowStockThreshold) {
    return { text: "Low Stock", class: "low-stock" };
  } else {
    return { text: "In Stock", class: "in-stock" };
  }
};

// Start editing inventory
const startEditing = (product) => {
  editingProduct.value = product;
  editStockValue.value = product.stock;
};

// Save edited inventory
const saveInventory = () => {
  if (editingProduct.value) {
    inventoryStore.updateProductStock(
      editingProduct.value.id,
      editStockValue.value
    );
    alert(
      `Updated ${editingProduct.value.name} stock to ${editStockValue.value}`
    );
    editingProduct.value = null;
  }
};

// Cancel editing
const cancelEditing = () => {
  editingProduct.value = null;
};

// Increase/decrease inventory
const adjustInventory = (product, amount) => {
  const newStock = product.stock + amount;
  if (newStock >= 0) {
    inventoryStore.updateProductStock(product.id, newStock);
  }
};

// Sort products
const sortField = ref("id");
const sortDirection = ref("asc");

const sortProducts = (field) => {
  if (sortField.value === field) {
    // Toggle direction if same field
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // New field, default to ascending
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value];

  sorted.sort((a, b) => {
    let comparison = 0;

    if (a[sortField.value] < b[sortField.value]) {
      comparison = -1;
    } else if (a[sortField.value] > b[sortField.value]) {
      comparison = 1;
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  return sorted;
});
</script>

<style>
.inventory {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.inventory-header {
  margin-bottom: 1.5rem;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter.checkbox {
  cursor: pointer;
}

.low-stock-summary {
  margin-top: 1rem;
}

.alert {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.75rem 1.25rem;
  border: 1px solid #ffeeba;
  border-radius: 4px;
}

.inventory-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  cursor: pointer;
}

th.active-sort {
  background-color: #e9ecef;
}

.low-stock-row {
  background-color: rgba(255, 243, 205, 0.1);
}

.low-stock-cell {
  background-color: rgba(255, 193, 7, 0.2);
}

.status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.in-stock {
  background-color: #d4edda;
  color: #155724;
}

.low-stock {
  background-color: #fff3cd;
  color: #856404;
}

.out-of-stock {
  background-color: #f8d7da;
  color: #721c24;
}

.stock-input {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

/* Button styles */
button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin-right: 0.25rem;
  font-size: 0.8rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-decrease {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-increase {
  background-color: #d4edda;
  color: #155724;
}

.btn-update {
  background-color: #cce5ff;
  color: #004085;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}
</style>
