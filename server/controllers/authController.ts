import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import prisma from '../config/prisma.js'
import transporter from '../config/nodemailer.js'
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../config/tokenUtils.js'

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const accessToken = generateAccessToken('temp');
        const refreshToken = generateRefreshToken('temp');

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                refreshToken,
            }
        });

        // Re-generate tokens with real ID
        const finalAccessToken = generateAccessToken(user.id);
        const finalRefreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: finalRefreshToken }
        });

        setTokenCookies(res, finalAccessToken, finalRefreshToken);

        try {
            await transporter.sendMail({
                from: `"Taskify" <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: 'Welcome to Taskify!',
                html: `<h2>Welcome, ${name}!</h2><p>Thanks for signing up. Start managing your tasks now.</p>`
            })
            console.log(`✅ Welcome email sent to ${email}`);
        } catch (emailErr) {
            console.error('❌ welcome email failed to send:', emailErr)
        }

        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error in registering user", error: error.message });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        // use the same error message so we don't leak if email exists or not
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        setTokenCookies(res, accessToken, refreshToken);

        return res.status(200).json({ success: true, message: "Login successful" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error in logging in", error: error.message });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (userId) {
            await prisma.user.update({
                where: { id: userId as string },
                data: { refreshToken: null }
            });
        }

        clearTokenCookies(res);
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error in logging out", error: error.message });
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No refresh token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        // make sure the token matches what we stored (token rotation check)
        if (!user || user.refreshToken !== token) {
            return res.status(401).json({ success: false, message: 'Invalid session' })
        }

        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });

        setTokenCookies(res, newAccessToken, newRefreshToken);

        return res.json({ success: true, message: "Session updated" });

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendVerifyOtp = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId as string } })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.user.update({
            where: { id: user.id },
            data: { verifyOtp: otp, verifyOtpExpiry: otpExpiry }
        });

        try {
            await transporter.sendMail({
                from: `"Taskify" <${process.env.SENDER_EMAIL}>`,
                to: user.email,
                subject: 'Your Account Verification OTP',
                html: `<h2>Verify your email</h2>
                       <p>Hello <strong>${user.name}</strong>,</p>
                       <p>Your OTP for account verification is: <strong style="font-size: 24px; color: #22D172;">${otp}</strong></p>
                       <p>This OTP is valid for 24 hours.</p>
                       <p>Best regards,<br>The Taskify Team</p>`
            });
            console.log(`✅ Verification OTP sent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Email sending failed (Verify OTP):', emailError);
            return res.status(500).json({ success: false, message: "Failed to send OTP email" });
        }

        return res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.userId;
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing details" });
    }
    try {
        const user = await prisma.user.findUnique({ where: { id: userId as string } });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpiry && user.verifyOtpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' })
        }

        await prisma.user.update({
            where: { id: userId as string },
            data: { isAccountVerified: true, verifyOtp: null, verifyOtpExpiry: null }
        });

        return res.status(200).json({ success: true, message: "Account verified successfully" });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const isAuthenticated = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.json({ success: true, message: "User is authenticated" });
    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendResetOtp = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { resetOtp: otp, resetOtpExpiry: otpExpiry }
        });

        try {
            await transporter.sendMail({
                from: `"Taskify" <${process.env.SENDER_EMAIL}>`,
                to: user.email,
                subject: 'Your Password Reset OTP',
                html: `<h2>Password Reset Request</h2>
                       <p>Hello <strong>${user.name}</strong>,</p>
                       <p>Your OTP for password reset is: <strong style="font-size: 24px; color: #22D172;">${otp}</strong></p>
                       <p>This OTP is valid for 10 minutes.</p>
                       <p>Best regards,<br>The Taskify Team</p>`
            });
            console.log(` Reset OTP sent to ${user.email}`);
        } catch (emailError) {
            console.error(' Email sending failed (Reset OTP):', emailError);
            return res.status(500).json({ success: false, message: "Failed to send reset OTP email" });
        }

        return res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.resetOtpExpiry && user.resetOtpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetOtp: null, resetOtpExpiry: null }
        });

        return res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}