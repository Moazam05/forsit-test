// Product categories
export const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Books",
  "Toys",
];

// Products data
export const products = [
  {
    id: 1,
    name: "Smartphone X",
    category: "Electronics",
    price: 799.99,
    stock: 45,
    description: "Latest smartphone with advanced features",
    lowStockThreshold: 10,
  },
  {
    id: 2,
    name: "Laptop Pro",
    category: "Electronics",
    price: 1299.99,
    stock: 12,
    description: "High-performance laptop for professionals",
    lowStockThreshold: 5,
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 19.99,
    stock: 150,
    description: "Comfortable cotton t-shirt",
    lowStockThreshold: 20,
  },
  {
    id: 4,
    name: "Denim Jeans",
    category: "Clothing",
    price: 49.99,
    stock: 75,
    description: "Classic denim jeans",
    lowStockThreshold: 15,
  },
  {
    id: 5,
    name: "Coffee Maker",
    category: "Home & Kitchen",
    price: 89.99,
    stock: 30,
    description: "Automatic coffee maker",
    lowStockThreshold: 8,
  },
  {
    id: 6,
    name: "Novel Collection",
    category: "Books",
    price: 29.99,
    stock: 60,
    description: "Collection of bestselling novels",
    lowStockThreshold: 10,
  },
  {
    id: 7,
    name: "Building Blocks",
    category: "Toys",
    price: 24.99,
    stock: 90,
    description: "Educational building blocks for kids",
    lowStockThreshold: 20,
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 129.99,
    stock: 35,
    description: "High-quality wireless earbuds",
    lowStockThreshold: 8,
  },
  {
    id: 9,
    name: "Kitchen Blender",
    category: "Home & Kitchen",
    price: 69.99,
    stock: 25,
    description: "Powerful kitchen blender",
    lowStockThreshold: 5,
  },
  {
    id: 10,
    name: "Winter Jacket",
    category: "Clothing",
    price: 149.99,
    stock: 55,
    description: "Warm winter jacket",
    lowStockThreshold: 10,
  },
];

// Generate sales data for the past year
export const generateSalesData = () => {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  const salesData = [];
  let currentDate = new Date(lastYear);

  while (currentDate <= today) {
    const dailySales = products
      .map((product) => {
        // Generate random quantity between 0 and 5
        const quantity = Math.floor(Math.random() * 6);

        return {
          productId: product.id,
          productName: product.name,
          category: product.category,
          date: new Date(currentDate),
          quantity: quantity,
          revenue: quantity * product.price,
        };
      })
      .filter((sale) => sale.quantity > 0); // Only include sales with quantity > 0

    salesData.push(...dailySales);

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return salesData;
};

// Export sales data
export const salesData = generateSalesData();
