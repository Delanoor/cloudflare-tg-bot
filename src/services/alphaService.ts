import { BOT_CONFIG } from "../constants";

export class AlphaService {
	constructor(
		private prisma: ReturnType<
			typeof import("../services/prisma").createPrismaClient
		>,
	) {}

	async submitAlphaApplication(
		userId: string,
		email: string,
	): Promise<boolean> {
		try {
			await this.prisma.userAirdropApplication.upsert({
				where: {
					userId_airdropSeasonId: {
						userId,
						airdropSeasonId: BOT_CONFIG.ALPHA_AIRDROP_ID,
					},
				},
				update: {
					userId,
					airdropSeasonId: BOT_CONFIG.ALPHA_AIRDROP_ID,
					walletAddress: email, // Store email as wallet address
					status: "PENDING",
				},
				create: {
					userId,
					airdropSeasonId: BOT_CONFIG.ALPHA_AIRDROP_ID,
					walletAddress: email, // Store email as wallet address
					status: "PENDING",
				},
			});
			return true;
		} catch (error) {
			console.error("Error submitting alpha application:", error);
			return false;
		}
	}

	async checkExistingApplication(userId: string): Promise<boolean> {
		try {
			const existingApplication =
				await this.prisma.userAirdropApplication.findUnique({
					where: {
						userId_airdropSeasonId: {
							userId,
							airdropSeasonId: BOT_CONFIG.ALPHA_AIRDROP_ID,
						},
					},
				});
			return !!existingApplication;
		} catch (error) {
			console.error("Error checking existing alpha application:", error);
			return false;
		}
	}
}
