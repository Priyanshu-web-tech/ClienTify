import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalSpends: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastVisit: { type: Date, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true},
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
