import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommunicationsLogSchema = new Schema(
  {
    audienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Audience" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    status: { type: String, default: "PENDING" },
  },
  {
    timestamps: true,
  }
);

const CommunicationsLog = mongoose.model(
  "CommunicationsLog",
  CommunicationsLogSchema
);

export default CommunicationsLog;
