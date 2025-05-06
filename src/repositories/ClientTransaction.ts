import { Prisma, PrismaClient } from "../generated/prisma/client";

export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;

