import { InlineKeyboard } from "grammy";
import type { Context } from "grammy";
import { BOT_CONFIG, MESSAGES } from "../constants";
import type { UserService } from "../services/userService";

export class CommandHandlers {
	constructor(private userService: UserService) {}

	async handleStart(ctx: Context): Promise<void> {
		const welcomeKeyboard = new InlineKeyboard()
			.url("🕹 Play", BOT_CONFIG.WEB_APP_URL)
			.row()
			.row()
			.url("🔗 Official Links", "https://linktr.ee/stoopidcats_partner")
			.switchInline("🤖 Share This Bot")
			.row()
			.url("🌐 Community", "https://t.me/stoopidcats_community")
			.url("📢 Announcement", "https://t.me/stoopidcats_announcement")
			.row()
			.url("Discord", "https://discord.gg/stoopidcats")
			.url("X", "https://x.com/x_stoopidcats_x");

		await ctx.replyWithPhoto(BOT_CONFIG.WELCOME_IMAGE_URL, {
			caption: MESSAGES.WELCOME,
			parse_mode: "HTML",
			reply_markup: welcomeKeyboard,
		});
	}

	async handleConnectTwitter(ctx: Context): Promise<void> {
		if (!ctx.from) return;

		const customMessage = MESSAGES.TWITTER_REQUEST(
			ctx.from.first_name,
			ctx.from.id,
		);

		await ctx.reply(customMessage, {
			reply_markup: {
				force_reply: true,
				input_field_placeholder: "Enter your Twitter username (without @)",
			},
		});
	}

	async handleAlphaApply(ctx: Context): Promise<void> {
		if (!ctx.from) return;

		const alphaMessage = MESSAGES.ALPHA_APPLICATION_IOS(
			ctx.from.first_name,
			ctx.from.id,
		);

		await ctx.reply(alphaMessage, {
			reply_markup: {
				force_reply: true,
				input_field_placeholder: "Enter your Apple ID email address",
			},
		});
	}

	async handleMyTwitter(ctx: Context): Promise<void> {
		if (!ctx.from) return;

		const tgId = ctx.from.id.toString();

		try {
			const user = await this.userService.findUserByTgId(tgId);

			if (!user) {
				await ctx.reply(MESSAGES.ERRORS.USER_NOT_FOUND);
				return;
			}

			const userName = await this.userService.getUserDisplayName(user);

			if (user.twitterUsername) {
				await ctx.reply(
					`📱 Your Current Twitter Username:\n\n👤 Player: ${userName}\n🐦 Twitter: @${user.twitterUsername}\n\nTo update, use /connect_twitter and reply with your new username.`,
				);
			} else {
				await ctx.reply(
					'❌ No Twitter username saved yet.\n\nSend your Twitter username (without @) to save it!\n\nExample: "stoopidcats"',
				);
			}
		} catch (error) {
			console.error("Error fetching Twitter username:", error);
			await ctx.reply(
				"❌ Error retrieving your Twitter username. Please try again.",
			);
		}
	}

	async handleHelp(ctx: Context): Promise<void> {
		await ctx.reply(MESSAGES.HELP);
	}

	async handleInlineQuery(ctx: Context): Promise<void> {
		const twaKeyboard = new InlineKeyboard().webApp(
			"Open Web App",
			BOT_CONFIG.WEB_APP_URL,
		);

		await ctx.answerInlineQuery(
			[
				{
					type: "article",
					id: "share_app",
					title: "Open STOOPID CATS WebApp",
					input_message_content: {
						message_text: "abc inline",
					},
					reply_markup: twaKeyboard,
					description: "Click to try it!",
				},
			],
			{
				cache_time: 0,
			},
		);
	}
}
