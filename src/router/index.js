import { createRouter, createWebHistory } from "vue-router";

// Import pages
import Dashboard from "../views/Dashboard/index.vue";
import Inventory from "../views/Inventory/index.vue";
import ProductRegistration from "../views/ProductRegistration/index.vue";

// Define routes
const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: Dashboard, name: "Dashboard" },
  { path: "/inventory", component: Inventory, name: "Inventory" },
  {
    path: "/product-registration",
    component: ProductRegistration,
    name: "ProductRegistration",
  },
];

// Create and export router
const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "router-link-active",
});

export default router;
