<script setup>
import { ref, computed } from "vue";
import { categories } from "../../constants/mockData";

// Form state
const productForm = ref({
  name: "",
  description: "",
  category: "",
  price: null,
  stock: null,
  lowStockThreshold: null,
  image: null,
});

// Error state
const errors = ref({});

// Preview image
const imagePreview = ref(null);

// Form submission status
const isSubmitting = ref(false);
const isSuccess = ref(false);
const successMessage = ref("");

// Handle image selection
const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Create URL for preview
    imagePreview.value = URL.createObjectURL(file);
    productForm.value.image = file;
  }
};

// Clear image
const clearImage = () => {
  imagePreview.value = null;
  productForm.value.image = null;
  // Reset file input
  const fileInput = document.getElementById("product-image");
  if (fileInput) {
    fileInput.value = "";
  }
};

// Validate form
const validateForm = () => {
  const newErrors = {};

  if (!productForm.value.name.trim()) {
    newErrors.name = "Product name is required";
  }

  if (!productForm.value.description.trim()) {
    newErrors.description = "Product description is required";
  }

  if (!productForm.value.category) {
    newErrors.category = "Please select a category";
  }

  if (!productForm.value.price || productForm.value.price <= 0) {
    newErrors.price = "Please enter a valid price";
  }

  if (productForm.value.stock === null || productForm.value.stock < 0) {
    newErrors.stock = "Please enter a valid stock value";
  }

  if (
    !productForm.value.lowStockThreshold ||
    productForm.value.lowStockThreshold <= 0
  ) {
    newErrors.lowStockThreshold = "Please enter a valid threshold value";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // In a real app, you would make an API call here to save the product
    // For this demo, we'll simulate a successful save after a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create a new product object
    const newProduct = {
      id: Math.floor(Math.random() * 10000) + 100, // Generate a random ID
      name: productForm.value.name,
      description: productForm.value.description,
      category: productForm.value.category,
      price: parseFloat(productForm.value.price),
      stock: parseInt(productForm.value.stock),
      lowStockThreshold: parseInt(productForm.value.lowStockThreshold),
      image: imagePreview.value || "https://via.placeholder.com/150",
    };

    // Here we would add the product to our database
    // For demo, we'll log it to console
    console.log("New product registered:", newProduct);

    // Show success message
    isSuccess.value = true;
    successMessage.value = `Product "${newProduct.name}" has been successfully added to inventory.`;

    // Reset form after success
    resetForm();
  } catch (error) {
    console.error("Error saving product:", error);
    // In a real app, you would handle errors more gracefully
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  productForm.value = {
    name: "",
    description: "",
    category: "",
    price: null,
    stock: null,
    lowStockThreshold: null,
    image: null,
  };
  clearImage();
  errors.value = {};
};

// Dismiss success message
const dismissSuccess = () => {
  isSuccess.value = false;
  successMessage.value = "";
};
</script>

<template>
  <div class="product-registration">
    <h2>Product Registration</h2>

    <div class="form-container">
      <!-- Success message -->
      <div v-if="isSuccess" class="success-message">
        <div class="success-content">
          <p>{{ successMessage }}</p>
          <button @click="dismissSuccess" class="btn-dismiss">Dismiss</button>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="product-form">
        <div class="form-group">
          <label for="product-name">Product Name*</label>
          <input
            type="text"
            id="product-name"
            v-model="productForm.name"
            :class="{ 'input-error': errors.name }"
          />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>

        <div class="form-group">
          <label for="product-description">Description*</label>
          <textarea
            id="product-description"
            v-model="productForm.description"
            rows="4"
            :class="{ 'input-error': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="error-message">
            {{ errors.description }}
          </p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="product-category">Category*</label>
            <select
              id="product-category"
              v-model="productForm.category"
              :class="{ 'input-error': errors.category }"
            >
              <option value="">Select a category</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
            <p v-if="errors.category" class="error-message">
              {{ errors.category }}
            </p>
          </div>

          <div class="form-group">
            <label for="product-price">Price ($)*</label>
            <input
              type="number"
              id="product-price"
              v-model="productForm.price"
              min="0.01"
              step="0.01"
              :class="{ 'input-error': errors.price }"
            />
            <p v-if="errors.price" class="error-message">{{ errors.price }}</p>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="product-stock">Initial Stock*</label>
            <input
              type="number"
              id="product-stock"
              v-model="productForm.stock"
              min="0"
              step="1"
              :class="{ 'input-error': errors.stock }"
            />
            <p v-if="errors.stock" class="error-message">{{ errors.stock }}</p>
          </div>

          <div class="form-group">
            <label for="product-threshold">Low Stock Threshold*</label>
            <input
              type="number"
              id="product-threshold"
              v-model="productForm.lowStockThreshold"
              min="1"
              step="1"
              :class="{ 'input-error': errors.lowStockThreshold }"
            />
            <p v-if="errors.lowStockThreshold" class="error-message">
              {{ errors.lowStockThreshold }}
            </p>
          </div>
        </div>

        <div class="form-group">
          <label for="product-image">Product Image</label>
          <div class="image-upload-container">
            <input
              type="file"
              id="product-image"
              @change="handleImageSelect"
              accept="image/*"
            />

            <div v-if="imagePreview" class="image-preview-container">
              <img
                :src="imagePreview"
                alt="Product preview"
                class="image-preview"
              />
              <button
                type="button"
                @click="clearImage"
                class="btn-remove-image"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn-reset">
            Reset
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Submitting..." : "Add Product" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.product-registration {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

label {
  font-weight: bold;
  color: #555;
}

input,
select,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.input-error {
  border-color: #e53e3e !important;
  background-color: #fff5f5;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.image-upload-container {
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 1.5rem;
  text-align: center;
}

.image-preview-container {
  margin-top: 1rem;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-reset {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-submit {
  background-color: #4299e1;
  color: white;
}

.btn-remove-image {
  background-color: #e53e3e;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-dismiss {
  background-color: #4299e1;
  color: white;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-in-out;
}

.success-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
