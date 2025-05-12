# E-commerce Admin Dashboard

A comprehensive web-based admin dashboard for e-commerce managers, providing insights into sales, revenue, and inventory status for effective decision-making.

## Features

### Revenue Analysis
- Real-time display of total orders, sales (revenue), and average order value
- Interactive charts to visualize orders and sales trends over time
- Data filtering by product categories and timeframes (daily, weekly, monthly, annually)

### Inventory Management
- List view of all products with current inventory status
- Sorting, filtering, and search functionality
- Ability to update inventory levels directly from the dashboard
- Low inventory alerts and visual indicators

### Product Registration
- Form to add new products to the inventory
- Support for product details including name, description, price, and stock level
- Image upload with preview
- Form validation and success notifications

## Technical Details

- Built with Vue.js 3 and Vite
- State management with Pinia
- Interactive charts using Chart.js and vue-chartjs

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```

## Design Decisions

- Used Vue 3 Composition API for better code organization and reusability
- Implemented a centralized store with Pinia for efficient state management across components
- Used Chart.js for interactive data visualization with good performance
- Built custom UI components for better user experience

## Challenges and Solutions

- **Challenge**: Creating dynamic charts that update based on filters
  **Solution**: Implemented computed properties and watchers to efficiently update chart data

- **Challenge**: Managing inventory updates in real-time
  **Solution**: Created a centralized store and implemented proper action methods

- **Challenge**: Ensuring form validation and good user feedback
  **Solution**: Built comprehensive validation logic with clear error messages and success notifications

## Screenshot

![Dashboard Screenshot](https://iili.io/38cdEKB.png)
![Dashboard Screenshot](https://iili.io/38cfk8B.png)
![Dashboard Screenshot](https://iili.io/38cC3T7.png)
![Dashboard Screenshot](https://iili.io/38cBTss.png)
