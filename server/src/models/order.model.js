import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
