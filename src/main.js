import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";

// Import router
import router from "./router";

// Create Pinia store
const pinia = createPinia();

// Create and mount the app
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
