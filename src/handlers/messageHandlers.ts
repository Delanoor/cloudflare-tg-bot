import type { Context } from "grammy";
import { MESSAGES } from "../constants";
import {
	validateTwitterUsername,
	validateEmail,
	extractUserIdFromMessage,
	isReplyToBotMessage,
} from "../utils/validation";
import type { UserService } from "../services/userService";
import type { AlphaService } from "../services/alphaService";

export class MessageHandlers {
	constructor(
		private userService: UserService,
		private alphaService: AlphaService,
	) {}

	async handleTextMessage(ctx: Context): Promise<void> {
		if (!ctx.from || !ctx.message) return;

		const messageText = ctx.message.text?.trim();
		if (!messageText) return;

		// Skip if message starts with '/' (commands)
		if (messageText.startsWith("/")) {
			return;
		}

		// Check if this is a reply to a bot message
		if (!ctx.message.reply_to_message) {
			this.handleNonReplyMessage(ctx, messageText);
			return;
		}

		// Handle Twitter username collection
		if (this.isTwitterReply(ctx)) {
			await this.handleTwitterUsernameReply(ctx, messageText);
			return;
		}

		// Handle Alpha testing application
		// if (this.isAlphaReply(ctx)) {
		// 	await this.handleAlphaApplicationReply(ctx, messageText);
		// 	return;
		// }
	}

	private isTwitterReply(ctx: Context): boolean {
		if (!ctx.message?.reply_to_message) return false;
		return isReplyToBotMessage(
			ctx.message.reply_to_message,
			"🐦 Help Us Connect Your Twitter Account!",
		);
	}

	// private isAlphaReply(ctx: Context): boolean {
	// 	if (!ctx.message?.reply_to_message) return false;
	// 	return isReplyToBotMessage(
	// 		ctx.message.reply_to_message,
	// 		"Android Alpha Testing Application",
	// 	);
	// }

	private async handleTwitterUsernameReply(
		ctx: Context,
		messageText: string,
	): Promise<void> {
		if (!ctx.from || !ctx.message?.reply_to_message) return;

		// Validate user authorization
		const originalMessageText = ctx.message.reply_to_message.text;
		const userIdMatch = extractUserIdFromMessage(originalMessageText || "");

		if (!userIdMatch || userIdMatch !== ctx.from.id.toString()) {
			await ctx.reply(MESSAGES.ERRORS.WRONG_USER_REPLY);
			return;
		}

		// Validate Twitter username format
		if (!validateTwitterUsername(messageText)) {
			await ctx.reply(MESSAGES.ERRORS.INVALID_TWITTER_USERNAME);
			return;
		}

		await this.processTwitterUsername(ctx, messageText);
	}

	private async handleAlphaApplicationReply(
		ctx: Context,
		messageText: string,
	): Promise<void> {
		if (!ctx.from || !ctx.message?.reply_to_message) return;

		// Validate user authorization
		const originalMessageText = ctx.message.reply_to_message.text;
		const userIdMatch = extractUserIdFromMessage(originalMessageText || "");

		if (!userIdMatch || userIdMatch !== ctx.from.id.toString()) {
			await ctx.reply(MESSAGES.ERRORS.WRONG_USER_REPLY);
			return;
		}

		// Validate email format
		if (!validateEmail(messageText)) {
			await ctx.reply(MESSAGES.ERRORS.INVALID_EMAIL);
			return;
		}

		await this.processAlphaApplication(ctx, messageText);
	}

	private async processTwitterUsername(
		ctx: Context,
		username: string,
	): Promise<void> {
		if (!ctx.from) return;

		const tgId = ctx.from.id.toString();

		try {
			const user = await this.userService.findUserByTgId(tgId);

			if (!user) {
				await ctx.reply(MESSAGES.ERRORS.USER_NOT_FOUND);
				return;
			}

			const success = await this.userService.updateTwitterUsername(
				tgId,
				username,
			);
			if (!success) {
				await ctx.reply(MESSAGES.ERRORS.GENERIC_ERROR);
				return;
			}

			const userName = await this.userService.getUserDisplayName(user);

			await ctx.reply(
				`✅ Success! Your Twitter username has been saved!\n\n👤 Player: ${userName}\n🐦 Twitter: @${username}\n\nThank you for helping us connect your account! 🐱✨\n\n🎮 Continue playing: https://t.me/StoopidCatsBot/stoopid_cats`,
			);

			console.log(`✅ Updated Twitter username for user ${tgId}: @${username}`);
		} catch (error) {
			console.error("Error updating Twitter username:", error);
			await ctx.reply(MESSAGES.ERRORS.GENERIC_ERROR);
		}
	}

	private async processAlphaApplication(
		ctx: Context,
		email: string,
	): Promise<void> {
		if (!ctx.from) return;

		const tgId = ctx.from.id.toString();

		try {
			const user = await this.userService.findUserByTgId(tgId);

			if (!user) {
				await ctx.reply(MESSAGES.ERRORS.USER_NOT_FOUND);
				return;
			}

			const success = await this.alphaService.submitAlphaApplication(
				user.id,
				email,
			);
			if (!success) {
				await ctx.reply(MESSAGES.ERRORS.GENERIC_ERROR);
				return;
			}

			const userName = await this.userService.getUserDisplayName(user);

			await ctx.reply(
				`✅ Alpha Application Received! 📱\n\n👤 Player: ${userName}\n📧 Email: ${email}\n\n🎯 What happens next:\n• Our team will review your application\n• You'll receive an email if selected\n• Alpha testers get first access and exclusive rewards\n\n📧 Contact: If you have questions, reach out to our support team.\n\n🎮 Continue playing: https://t.me/StoopidCatsBot/stoopid_cats\n\nThank you for your interest in alpha testing! 🚀`,
			);

			console.log(`✅ Alpha application received from user ${tgId}: ${email}`);
		} catch (error) {
			console.error("Error processing alpha application:", error);
			await ctx.reply(MESSAGES.ERRORS.GENERIC_ERROR);
		}
	}

	private handleNonReplyMessage(ctx: Context, messageText: string): void {
		// Provide helpful guidance if user sends a message that looks like a Twitter username
		if (validateTwitterUsername(messageText)) {
			ctx.reply(MESSAGES.ERRORS.TWITTER_GUIDANCE);
		}
	}
}
