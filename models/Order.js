import { Schema, model } from "mongoose";
import mongoose from "mongoose"; // Add this line to import mongoose

let Order;

if (mongoose.connection.models["Order"]) {
  Order = mongoose.connection.models["Order"];
} else {
  const OrderSchema = new Schema(
    {
      products: Object,
      name: String,
      email: String,
      address: String,
      city: String,
      paid: { type: Number, default: 0 },
    },
    { timestamps: true }
  );

  Order = model("Order", OrderSchema);
}

export default Order;
