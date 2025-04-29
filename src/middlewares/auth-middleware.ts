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
        res.status(401).json({ message: 'Não autorizado! (Token não fornecido)' });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
         res.status(401).json({ message: 'Formato do token inválido. Use: Bearer <token>' });
         return;
    }

    const token = parts[1];
    console.log(JWT_KEY)

    try {
        const decodedPayload = jwt.verify(token, JWT_KEY) as { id: string | number };
        const userId = typeof decodedPayload.id === 'number' ? decodedPayload.id : parseInt(decodedPayload.id, 10);

        if (isNaN(userId)) {
             res.status(401).json({ message: 'Token inválido (ID de usuário inválido no payload)!' });
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
            res.status(401).json({ message: 'Token inválido (Usuário não encontrado)!' });
            return;
        }

        req.user = user;
        next(); 

    } catch (error) {
        console.error("Erro de autenticação:", error);
        res.status(401).json({ message: 'Token inválido!' });
        return;
    }
};

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        console.error("Erro de configuração de middleware: ensureAdmin rodando antes de ensureAuth ou req.user não foi definido.");
        res.status(500).json({ message: "Erro interno do servidor." });
        return;
    }

    const isAdmin = req.user.User_Roles?.some(
        userRole => userRole.roles?.role_type === 'Admin'
    );

    if (isAdmin) {
        next(); 
    } else {
        res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }
};