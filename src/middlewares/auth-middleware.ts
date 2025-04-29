import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../database';
import { User } from '../generated/prisma';


declare module "express" {
    interface Request {
        user?: User & {
            User_Roles?: Array<{ roles: { role_type: string } }> 
         }; 
    }
}

const JWT_KEY = process.env.JWT_KEY;

if (!JWT_KEY) {
    throw new Error("JWT_KEY environment variable is not defined.");
}

export const ensureAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized! (Token not provided)' });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
         res.status(401).json({ message: 'Invalid token format. Use: Bearer <token>' });
         return;
    }

    const token = parts[1];

    try {
        const decodedPayload = jwt.verify(token, JWT_KEY) as { id: string | number };
        const userId = typeof decodedPayload.id === 'number' ? decodedPayload.id : parseInt(decodedPayload.id, 10);

        if (isNaN(userId)) {
             res.status(401).json({ message: 'Invalid token (invalid user ID in payload)!' });
             return;
        }

        const user = await prisma.user.findUnique({ 
            where: { id: userId }, 
            include: {
                User_Roles: {
                    select: {
                        roles: {
                            select: {
                                role_type: true
                            }
                        }
                    }
                }    
            }
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid token (User not found)!' });
            return;
        }

        req.user = user;
        next(); 

    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: 'Invalid token!' });
        return;
    }
};

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        console.error("Middleware configuration error: ensureAdmin running before ensureAuth or req.user not set.");
        res.status(500).json({ message: "Internal server error." });
        return;
    }

    const isAdmin = req.user.User_Roles?.some(
        userRole => userRole.roles?.role_type === 'Admin'
    );

    if (isAdmin) {
        next(); 
    } else {
        res.status(403).json({ message: 'Access denied. Requires administrator privileges.' });
    }
};

export const ensureProvider = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        console.error("Middleware configuration error: ensureProvider running before ensureAuth or req.user not defined.");
        res.status(500).json({ message: "Internal server error." });
        return;
    }

    const isProvider = req.user.User_Roles?.some(
        userRole => userRole.roles?.role_type === 'Provider'
    );

    if (isProvider) {
        next(); 
    } else {
        res.status(403).json({ message: 'Access denied. Requires service provider privileges.' });
    }
};