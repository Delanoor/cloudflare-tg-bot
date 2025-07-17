import type { UserData } from "../types";

export class UserService {
	constructor(
		private prisma: ReturnType<
			typeof import("../services/prisma").createPrismaClient
		>,
	) {}

	async findUserByTgId(tgId: string): Promise<UserData | null> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { tgId },
				select: {
					id: true,
					tgId: true,
					twitterUsername: true,
					nickname: true,
					name: true,
				},
			});
			return user;
		} catch (error) {
			console.error("Error finding user by tgId:", error);
			return null;
		}
	}

	async updateTwitterUsername(
		tgId: string,
		username: string,
	): Promise<boolean> {
		try {
			await this.prisma.user.update({
				where: { tgId },
				data: { twitterUsername: username.toLowerCase() },
			});
			return true;
		} catch (error) {
			console.error("Error updating Twitter username:", error);
			return false;
		}
	}

	async getUserDisplayName(user: UserData): Promise<string> {
		return user.nickname || user.name || "Stoopid Cat";
	}
}
