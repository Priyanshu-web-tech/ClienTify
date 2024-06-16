import mongoose from "mongoose";
const { Schema } = mongoose;

const AudienceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    customerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    status: {
      type: String,
      default: "PENDING",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically includes createdAt and updatedAt fields
    timestamps: true,
    collection: "audience",
  }
);

// Create the model from the schema
const Audience = mongoose.model("Audience", AudienceSchema);

export default Audience;
