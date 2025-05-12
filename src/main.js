import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
// Custom Imports
import "./style.css";
import App from "./App.vue";

// Import pages
import Dashboard from "./pages/Dashboard/index.vue";
import Inventory from "./pages/Inventory/index.vue";
import ProductRegistration from "./pages/ProductRegistration/index.vue";

// Define routes
const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: Dashboard },
  { path: "/inventory", component: Inventory },
  { path: "/product-registration", component: ProductRegistration },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Create Pinia store
const pinia = createPinia();

// Create and mount the app
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
