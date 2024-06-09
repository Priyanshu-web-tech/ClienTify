import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
    name: String,
    audience: Array,
    status: String
});

const Campaign=mongoose.model('Campaign', CampaignSchema);
export default Campaign;
