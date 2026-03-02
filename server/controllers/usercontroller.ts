import { Request, Response } from "express";
import userModel from "../models/userModel.js";

export const getUsersData = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
