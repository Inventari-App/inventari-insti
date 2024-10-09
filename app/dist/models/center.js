import mongoose from "mongoose";
import { capitalizeFields } from "../db/middlewares";
const Schema = mongoose.Schema;
const CenterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
CenterSchema.pre('save', capitalizeFields(["name"]));
export default mongoose.model("Center", CenterSchema);
