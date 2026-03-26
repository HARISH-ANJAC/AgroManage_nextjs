import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_USER_INFO_HDR } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken, signRefreshToken } from "../utils/jwt.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { LOGIN_NAME, PASSWORD_USER_HDR, MAIL_ID_USER_HDR, ROLE_USER_HDR } = req.body;

        if (!LOGIN_NAME || !PASSWORD_USER_HDR) {
            return res.status(400).json({ msg: 'Please provide login name and password' });
        }

        // Check if user already exists
        const existingUser = await db.select().from(TBL_USER_INFO_HDR).where(eq(TBL_USER_INFO_HDR.LOGIN_NAME, LOGIN_NAME)).limit(1);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(PASSWORD_USER_HDR, 10);

        // Create user
        await db.insert(TBL_USER_INFO_HDR).values({
            LOGIN_NAME,
            PASSWORD_USER_HDR: hashedPassword,
            MAIL_ID_USER_HDR,
            ROLE_USER_HDR,
            STATUS_USER_HDR: 'Active',
            CREATED_DATE_USER_HDR: new Date()
        });

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { LOGIN_NAME, PASSWORD_USER_HDR } = req.body;

        if (!LOGIN_NAME || !PASSWORD_USER_HDR) {
            return res.status(400).json({ msg: 'Please provide login name and password' });
        }

        // Find user
        const userResult = await db.select().from(TBL_USER_INFO_HDR).where(eq(TBL_USER_INFO_HDR.LOGIN_NAME, LOGIN_NAME)).limit(1);
        
        if (userResult.length === 0) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const user = userResult[0];

        // Check password
        const isMatch = await bcrypt.compare(PASSWORD_USER_HDR, user.PASSWORD_USER_HDR!);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const payload = { 
            id: user.LOGIN_ID_USER_HDR, 
            loginName: user.LOGIN_NAME, 
            role: user.ROLE_USER_HDR 
        };

        // Generate Tokens using utilities
        const accessToken = signToken(payload);
        const refreshToken = signRefreshToken(payload);

        res.status(200).json({
            msg: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user.LOGIN_ID_USER_HDR,
                loginName: user.LOGIN_NAME,
                mailId: user.MAIL_ID_USER_HDR,
                role: user.ROLE_USER_HDR,
                stockShowStatus: user.STOCK_SHOW_STATUS,
                outsideAccessYn: user.OUTSIDE_ACCESS_Y_N
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
