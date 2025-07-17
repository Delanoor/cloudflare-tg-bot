/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
	DATABASE_URL: string;
}

// Create Prisma instance optimized for serverless with Accelerate
// function createPrismaClient(databaseUrl: string) {
// 	const prisma = new PrismaClient({
// 		log: ["error"],
// 	}).$extends(withAccelerate());

// 	return prisma;
// }

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

		// Initialize Prisma client
		const prisma = new PrismaClient({
			datasources: {
				db: {
					url: env.DATABASE_URL,
				},
			},
		}).$extends(withAccelerate());

		const webAppUrl = "https://t.me/StoopidCatsBot/stoopid_cats";
		const webAppUrlStart = "https://t.me/StoopidCatsBot/stoopid_cats?startapp";
		// Create buttons
		const twaKeyboard = new InlineKeyboard().webApp("Open Web App", webAppUrl);

		// Welcome image (URL or local file path)
		const welcomeImageUrl =
			"https://jfh5hylzykmxvrqk.public.blob.vercel-storage.com/images/bot-bBV4t7BRaHdQ7rslw0zXup6U4OdwKE.png";

		// Welcome message
		const welcomeText = `Welcome to Stoopid Cats!
Get ready for some casual fun—feed your cat, spin the wheel, and earn $STOCAT airdrops along the way!

🕹️ Key Game Info:
- Airdrop Pool: 15% of total $STOCAT supply
- Player Limit: Adjusted from 1,000,000 → 250,000 players
- Game Duration: 6 months

💰 Upcoming Airdrop Events:
💙 Season 1: 50M $STOCAT – ✅ Completed
💙 Season 2: 100M $STOCAT – 🔜 TBA
💙 Season 3: 150M $STOCAT – 🔜 TBA

To ensure fair and meaningful rewards, inactive players (over 2 weeks) and accounts found cheating will be removed.

⚠️ Important Notes:
1️⃣ Unfair play results in an automatic ban at the airdrop claim stage.
2️⃣ Found a critical bug? Please report it!
3️⃣ Abuse will be detected during airdrop review—you will be disqualified.

📄 Don't forget to read the Terms of Service in the in-game settings.
Be Stoopid and Have Fun! 🐾
`;

		const welcomeKeyboard = new InlineKeyboard()
			.url("🕹 Play", "https://t.me/StoopidCatsBot/stoopid_cats")
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

		// Twitter username collection message
		const twitterRequestMessage = `🐦 Help Us Connect Your Twitter Account! 🐦

Hey there, Stoopid Cat! 🐱

We're preparing for some exciting Twitter integration features and need your help!

📝 What to do:
Reply to this message with your Twitter username (without the @ symbol)

✅ Examples:
• Good: "goodFellas" 
• Good: "stoopidcats123"
• ❌ Bad: "@goodFellas"

💡 Why we need this:
• Future Twitter-based features
• Community engagement opportunities  
• Enhanced reward systems

🔒 Privacy Note: Your Twitter username will only be used for game features and will never be shared without permission.

Ready? Just reply to this message with your Twitter username! 👇`;

		bot.command("start", async (ctx) => {
			await ctx.replyWithPhoto(welcomeImageUrl, {
				caption: welcomeText,
				parse_mode: "HTML",
				reply_markup: welcomeKeyboard,
			});
		});

		// Command to connect Twitter username
		bot.command("connect_twitter", async (ctx) => {
			if (!ctx.from) return;

			const customMessage = `🐦 Help Us Connect Your Twitter Account! 🐦

Hey there, ${ctx.from.first_name}! 🐱

We're preparing for some exciting Twitter integration features and need your help!

📝 What to do:
Reply to this message with your Twitter username (without the @ symbol)

✅ Examples:
• Good: "goodFellas" 
• Good: "stoopidcats123"
• ❌ Bad: "@goodFellas"

💡 Why we need this:
• Future Twitter-based features
• Community engagement opportunities  
• Enhanced reward systems

🔒 Privacy Note: Your Twitter username will only be used for game features and will never be shared without permission.

⚠️ IMPORTANT: Only ${ctx.from.first_name} (User ID: ${ctx.from.id}) can reply to this message.

Ready? Just reply to this message with your Twitter username! 👇`;

			await ctx.reply(customMessage, {
				reply_markup: {
					force_reply: true,
					input_field_placeholder: "Enter your Twitter username (without @)",
				},
			});
		});

		// Command to apply for Android alpha testing
		bot.command("alpha_apply", async (ctx) => {
			if (!ctx.from) return;

			const alphaMessage = `📱 Android Alpha Testing Application 📱

Hey there, ${ctx.from.first_name}! 🎮

We're excited to announce that we're looking for alpha testers for our Android mobile game!

📋 What we need from you:
Reply to this message with your Google Play email address (the email you use to sign into Google Play Store)

✅ Examples:
• Good: "user@gmail.com"
• Good: "player@outlook.com"
• Good: "gamer@yahoo.com"
• ❌ Bad: "myemail" (must be a valid email address)

🎯 Alpha Testing Benefits:
• First access to new features
• Exclusive alpha tester rewards
• Direct feedback to developers
• Special recognition in the community

📊 Requirements:
• Android device (version 8.0 or higher)
• Google Play account with valid email
• Active Telegram account
• Willingness to provide feedback

⚠️ IMPORTANT: Only ${ctx.from.first_name} (User ID: ${ctx.from.id}) can reply to this message.

Ready to join our alpha testing program? Reply with your Google Play email address! 📱`;

			await ctx.reply(alphaMessage, {
				reply_markup: {
					force_reply: true,
					input_field_placeholder: "Enter your Google Play email address",
				},
			});
		});

		// Command to check current Twitter username
		bot.command("my_twitter", async (ctx) => {
			if (!ctx.from) return;

			const tgId = ctx.from.id.toString();

			try {
				const user = await prisma.user.findUnique({
					where: { tgId: tgId },
					select: {
						twitterUsername: true,
						nickname: true,
						name: true,
					},
				});

				if (!user) {
					await ctx.reply("❌ User not found in our system.");
					return;
				}

				const userName = user.nickname || user.name || "Stoopid Cat";

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
		});

		// Handle text messages for Twitter username collection (only when replying to connect_twitter)
		bot.on("message:text", async (ctx) => {
			if (!ctx.from) return;

			const messageText = ctx.message.text.trim();

			// Skip if message starts with '/' (commands)
			if (messageText.startsWith("/")) {
				return;
			}

			// Only process Twitter usernames if this is a reply to the connect_twitter command
			if (
				!ctx.message.reply_to_message ||
				!ctx.message.reply_to_message.from?.is_bot ||
				!ctx.message.reply_to_message.text?.includes(
					"🐦 Help Us Connect Your Twitter Account!",
				)
			) {
				// Provide helpful guidance if user sends a message that looks like a Twitter username
				const twitterUsernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
				if (twitterUsernameRegex.test(messageText)) {
					await ctx.reply(
						"💡 To connect your Twitter account, please use the /connect_twitter command first, then reply to that message with your username!",
					);
				}
				return;
			}

			// Check if the user replying is the same user who initiated the command
			const originalMessageText = ctx.message.reply_to_message.text;
			const userIdMatch = originalMessageText?.match(/User ID: (\d+)/);

			if (!userIdMatch || userIdMatch[1] !== ctx.from.id.toString()) {
				await ctx.reply(
					"❌ You can only reply to your own command! Please use the appropriate command to start your own process.",
				);
				return;
			}

			const tgId = ctx.from.id.toString();

			// ================================ Alpha Testing Application ================================

			// Check if this is an alpha application reply
			if (originalMessageText?.includes("Android Alpha Testing Application")) {
				try {
					// Check if user exists in database
					const user = await prisma.user.findUnique({
						where: { tgId: tgId },
						select: {
							id: true,
							nickname: true,
							name: true,
						},
					});

					if (!user) {
						await ctx.reply(
							"❌ User not found in our system.\n\nPlease make sure you've played the game at least once:\n🎮 https://t.me/StoopidCatsBot/stoopid_cats",
						);
						return;
					}

					// Validate email address format
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(messageText)) {
						await ctx.reply(
							"❌ Invalid email address!\n\nPlease provide a valid Google Play email address.\n\nExamples:\n• user@gmail.com\n• player@outlook.com\n• gamer@yahoo.com",
						);
						return;
					}

					// Check if user already applied for this airdrop
					const existingApplication =
						await prisma.userAirdropApplication.findUnique({
							where: {
								userId_airdropSeasonId: {
									userId: user.id,
									airdropSeasonId: "cmd71ei1v0000js0449mlzsgf",
								},
							},
						});

					if (existingApplication) {
						await ctx.reply(
							"❌ You have already applied for alpha testing!\n\nWe have received your application and will contact you if selected.\n\n🎮 Continue playing: https://t.me/StoopidCatsBot/stoopid_cats",
						);
						return;
					}

					// Create airdrop application using existing model
					await prisma.userAirdropApplication.create({
						data: {
							userId: user.id,
							airdropSeasonId: "cmd71ei1v0000js0449mlzsgf",
							walletAddress: messageText, // Store email as wallet address
							status: "PENDING",
						},
					});

					const userName = user.nickname || user.name || "Stoopid Cat";

					await ctx.reply(
						`✅ Alpha Application Received! 📱\n\n👤 Player: ${userName}\n📧 Email: ${messageText}\n\n🎯 What happens next:\n• Our team will review your application\n• You'll receive an email if selected\n• Alpha testers get first access and exclusive rewards\n\n📧 Contact: If you have questions, reach out to our support team.\n\n🎮 Continue playing: https://t.me/StoopidCatsBot/stoopid_cats\n\nThank you for your interest in alpha testing! 🚀`,
					);

					console.log(
						`✅ Alpha application received from user ${tgId}: ${messageText}`,
					);
				} catch (error) {
					console.error("Error processing alpha application:", error);
					await ctx.reply(
						"❌ Sorry, there was an error processing your alpha application.\n\nPlease try again in a few moments. If the problem persists, contact support.",
					);
				}
				return;
			}

			// Validate Twitter username format
			const twitterUsernameRegex = /^[a-zA-Z0-9_]{1,15}$/;

			if (!twitterUsernameRegex.test(messageText)) {
				await ctx.reply(
					'❌ Invalid Twitter username format!\n\nPlease make sure your username:\n• Contains only letters, numbers, and underscores\n• Is 1-15 characters long\n• Does NOT include the @ symbol\n\nExample: "stoopidcats" ✅\nTry again! 👇',
				);
				return;
			}

			try {
				// Check if user exists in database
				const user = await prisma.user.findUnique({
					where: { tgId: tgId },
					select: {
						id: true,
						twitterUsername: true,
						nickname: true,
						name: true,
					},
				});

				if (!user) {
					await ctx.reply(
						"❌ User not found in our system.\n\nPlease make sure you've played the game at least once:\n🎮 https://t.me/StoopidCatsBot/stoopid_cats",
					);
					return;
				}

				// Update user's Twitter username
				await prisma.user.update({
					where: { tgId: tgId },
					data: { twitterUsername: messageText.toLowerCase() },
				});

				const userName = user.nickname || user.name || "Stoopid Cat";

				await ctx.reply(
					`✅ Success! Your Twitter username has been saved!\n\n👤 Player: ${userName}\n🐦 Twitter: @${messageText}\n\nThank you for helping us connect your account! 🐱✨\n\n🎮 Continue playing: https://t.me/StoopidCatsBot/stoopid_cats`,
				);

				console.log(
					`✅ Updated Twitter username for user ${tgId}: @${messageText}`,
				);
			} catch (error) {
				console.error("Error updating Twitter username:", error);
				await ctx.reply(
					"❌ Sorry, there was an error saving your Twitter username.\n\nPlease try again in a few moments. If the problem persists, contact support.",
				);
			}
		});

		// Add help command
		bot.command("help", async (ctx) => {
			await ctx.reply(
				"🤖 Bot Commands:\n\n• /connect_twitter - Connect your Twitter account\n• /mytwitter - Check your saved Twitter username\n• /alpha_apply - Apply for Android alpha testing\n• /help - Show this help message\n\n🎮 Play the game: https://t.me/StoopidCatsBot/stoopid_cats",
			);
		});

		bot.inlineQuery("startapp", async (ctx) => {
			// Answer inline query with a link to open the Web App directly
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
		});

		// Error handling
		bot.catch((err) => {
			console.error("Bot error:", err);
		});

		// Ensure Prisma connection is closed after request
		ctx.waitUntil(
			(async () => {
				try {
					await prisma.$disconnect();
				} catch (error) {
					console.error("Error disconnecting Prisma:", error);
				}
			})(),
		);

		return webhookCallback(bot, "cloudflare-mod")(request);
	},
};
