import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
  }],
  total: { type: Number, required: true },
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;