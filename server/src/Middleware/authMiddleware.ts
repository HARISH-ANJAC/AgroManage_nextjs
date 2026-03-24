import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

interface DecodedUser {
    id: number;
    loginName: string;
    role: string;
    iat: number;
    exp: number;
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}

/**
 * Middleware to verify JWT token and attach user to request object
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token) as DecodedUser;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
};

/**
 * Middleware generator to check if the authenticated user has one of the required roles
 */
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ msg: "Not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: `Access denied. Role '${req.user.role}' not authorized.` });
        }

        next();
    };
};
