import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// add userId to req so controllers can use it without parsing the token again
declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({ success: false, message: 'Please login to continue' })
    }

    try {
        const secret = process.env.JWT_ACCESS_SECRET!
        const decoded = jwt.verify(token, secret) as { userId: string }
        req.userId = decoded.userId
        next()
    } catch (err) {
        // token expired or tampered
        return res.status(401).json({ success: false, message: 'Session expired, please login again' })
    }
}

export default userAuth
