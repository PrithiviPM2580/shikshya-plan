import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "#/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("Env variable errors.");
}

const globalPrismaThis = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaNeon({
	connectionString,
});

const prisma = new PrismaClient({
	adapter,
});

if (process.env.NODE_ENV !== "production") {
	globalPrismaThis.prisma = prisma;
}

export default prisma;
