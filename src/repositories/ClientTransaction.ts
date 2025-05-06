import { Prisma, PrismaClient } from "../generated/prisma";

export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;

