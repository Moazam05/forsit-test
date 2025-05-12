<script setup></script>

<template>
  <div class="app">
    <header>
      <h1>E-commerce Admin Dashboard</h1>
      <nav>
        <router-link to="/dashboard">Revenue Analysis</router-link>
        <router-link to="/inventory">Inventory Management</router-link>
        <router-link to="/product-registration"
          >Product Registration</router-link
        >
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
}

header h1 {
  margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

nav a:hover,
nav a.router-link-active {
  background-color: #555;
}

main {
  flex: 1;
  padding: 2rem;
}
</style>
