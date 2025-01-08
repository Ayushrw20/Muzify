import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.info("DB connected");
    }
    catch(error) {
        console.error(error);
    }
}

export default connectDB;