import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verifyOtp: string | null;
    verifyOtpExpiry: number | null;
    isAccountVerified: boolean;
    resetotp: string | null;
    resetotpExpiry: number | null;
    refreshToken: string | null;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: null,
    },
    verifyOtpExpiry: {
        type: Number,
        default: null,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetotp: {
        type: String,
        default: null,
    },
    resetotpExpiry: {
        type: Number,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
});

const userModel: Model<IUser> = mongoose.models.user || mongoose.model<IUser>('user', userSchema);
export default userModel;
