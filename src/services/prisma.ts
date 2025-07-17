import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export function createPrismaClient(databaseUrl: string) {
	return new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	}).$extends(withAccelerate());
}

export async function disconnectPrisma(
	prisma: ReturnType<typeof createPrismaClient>,
): Promise<void> {
	try {
		await prisma.$disconnect();
	} catch (error) {
		console.error("Error disconnecting Prisma:", error);
	}
}
