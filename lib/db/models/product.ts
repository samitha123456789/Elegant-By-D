// ecommerce-platform/lib/db/models/product.ts
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String },
  category: { type: String },
  discount: { type: Number },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 }, // Overall stock (optional, kept for compatibility)
  sizes: [
    {
      size: { type: String, required: true }, // e.g., "S", "40"
      stock: { type: Number, default: 0 },   // Stock per size
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;