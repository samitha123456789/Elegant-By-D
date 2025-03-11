// ecommerce-platform/lib/db/models/discountBanner.ts
import mongoose, { Schema } from "mongoose";

const discountBannerSchema = new Schema({
  text: { type: String, required: true },
  backgroundColor: { type: String, default: "#000000" },
  backgroundImage: { type: String, default: "" },
  isActive: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const DiscountBanner =
  mongoose.models.DiscountBanner || mongoose.model("DiscountBanner", discountBannerSchema);

export default DiscountBanner;