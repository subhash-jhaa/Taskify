import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';

/**
 * Generates an Access Token (short-lived)
 */
export const generateAccessToken = (userId: string | Types.ObjectId): string => {
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT Secret not found");

    return jwt.sign({ userId }, secret, {
        expiresIn: '15m',
    });
};

/**
 * Generates a Refresh Token (long-lived)
 */
export const generateRefreshToken = (userId: string | Types.ObjectId): string => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT Secret not found");

    return jwt.sign({ userId }, secret, {
        expiresIn: '7d',
    });
};

/**
 * Sets tokens in secure cookies
 */
export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
    const isProd = process.env.NODE_ENV === 'production';

    // Set Access Token Cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set Refresh Token Cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

/**
 * Clears authentication cookies
 */
export const clearTokenCookies = (res: Response): void => {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? (isProd ? 'none' : 'strict') as 'none' | 'strict' : 'strict' as const,
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
};

