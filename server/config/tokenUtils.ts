import jwt from 'jsonwebtoken'
import { Response } from 'express'

export function generateAccessToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' })
}

export function generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
}

// Set both tokens as secure, cross-origin cookies
export function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
        httpOnly: true, // Prevents client-side scripts from accessing the cookie (XSS protection)
        secure: isProduction, // Ensures cookie is only sent over HTTPS in production
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax', // 'none' allows cross-origin requests, 'lax' is better for localhost
        path: '/', // Makes the cookie available across the entire site
    };

    // Access Token Cookie
    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000 // Short lifespan for the primary access token (15 mins)
    });

    // Refresh Token Cookie
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7-day lifespan for persistent login session
    });

    // 🚀 Non-httpOnly indicator for the client to check session presence locally
    res.cookie('client_session', 'true', {
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    });
}

// Clear cookies using the same security options as when they were set
export function clearTokenCookies(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('client_session', cookieOptions);
}
