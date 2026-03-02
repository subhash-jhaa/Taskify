import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to DB");
    });

    const dbUrl = process.env.MONGODB_URL;
    if (!dbUrl) {
        throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(dbUrl);
};

export default connectDB;
