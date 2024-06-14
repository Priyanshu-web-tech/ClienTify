import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampaignSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
