import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    amount: Number,
    date: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
