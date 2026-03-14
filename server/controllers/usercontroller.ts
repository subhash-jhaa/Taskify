import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const getUsersData = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                isAccountVerified: true,
                createdAt: true,
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        return res.json({ success: true, userData: user })
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message })
    }
}
