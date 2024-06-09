import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: String,
  email: String,
  totalSpends: Number,
  visits: Number,
  lastVisit: Date,
});

const Customer= mongoose.model("Customer", CustomerSchema);
export default Customer;
