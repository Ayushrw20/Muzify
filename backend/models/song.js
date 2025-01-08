import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    songId: {
        type: String,
        required: true
    },
    songUrl: {
        type: String,
        required: true      
    }
})

const Song = mongoose.model("Song", songSchema);

export default Song;