import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommunicationsLogSchema = new Schema(
  {
    audienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Audience", required: true},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true},
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" , required: true},
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
