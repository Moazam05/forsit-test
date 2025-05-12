import { defineStore } from "pinia";
import {
  products,
  salesData,
  categories,
  generateSalesData,
} from "../constants/mockData.js";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    products: [...products],
    salesData: [...salesData],
    categories: [...categories],
    nextProductId: products.length + 1,
  }),

  getters: {
    lowStockProducts: (state) => {
      return state.products.filter(
        (product) => product.stock <= product.lowStockThreshold
      );
    },

    totalRevenue: (state) => {
      return state.salesData
        .reduce((sum, sale) => sum + sale.revenue, 0)
        .toFixed(2);
    },

    totalOrders: (state) => {
      return state.salesData.reduce((sum, sale) => sum + sale.quantity, 0);
    },
  },

  actions: {
    addProduct(product) {
      // Create a new product with the next available ID
      const newProduct = {
        id: this.nextProductId,
        ...product,
      };

      this.products.push(newProduct);
      this.nextProductId++;

      return newProduct;
    },

    updateProductStock(productId, newStock) {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        product.stock = newStock;
      }
    },

    generateNewSalesData() {
      this.salesData = generateSalesData();
    },
  },
});
