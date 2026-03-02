import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken extends JwtPayload {
    userId: string;
}

const userAuth = (req: Request, res: Response, next: NextFunction): void | Response => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: Login Again" });
    }

    try {
        const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT Secret not found");

        const tokenDecode = jwt.verify(token, secret) as DecodedToken;

        if (tokenDecode.userId) {
            req.body.userId = tokenDecode.userId;
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
        }
    } catch (error) {
        // If access token is invalid/expired, the client should call /refresh
        return res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }
}

export default userAuth;
