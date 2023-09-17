import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
    url: {
        required: true,
        type: String,
    },
    id: {
        required: true,
        type: Number
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
});

const URL = mongoose.model("URL", urlSchema);

export default URL;