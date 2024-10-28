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

import { Bot, type Context, InlineKeyboard, webhookCallback } from "grammy";

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

		const webAppUrl = "https://t.me/stoopid_cats_dev_bot/sc_dev_test";
		const webAppUrlStart =
			"https://t.me/stoopid_cats_dev_bot/sc_dev_test?startapp";
		// Create buttons
		const twaKeyboard = new InlineKeyboard().webApp("Open Web App", webAppUrl);

		// Welcome image (URL or local file path)
		const welcomeImageUrl =
			"https://jfh5hylzykmxvrqk.public.blob.vercel-storage.com/x_money-sbwQeACUothAHebL01T6rvTxWLgO8e.png";

		// Welcome message
		const welcomeText = `Welcome to Stoopid Cats! 🎉

Brace yourself for a world of purrplexing nonsense, where every cat's goal is to hoard $MEOW, the finest trash coin in existence! 💩✨

▪️ Dive Right In 🚀
This is Free2Play for all the underdogs (or should we say, undercats?) ready to claw their way to the top of the meme ladder.

▪️ Catnip Casino 🎰
Spin the Slap Machine! Sometimes you’ll strike gold, other times just furballs. Risk it all in the name of…absolutely nothing valuable.

▪️ Round Up Your Clowder 🐾
Call in your gang of ridiculous pals, because there’s no shame in farming $MEOW together. Well, maybe a little.

▪️ Meowcoin Hype 🎉
$MEOW is destined for greatness (or total obscurity) on the blockchain. Which one? Only the cats know.

▪️ Airdrop Incoming 🪂
Stockpile those meow-ments and prepare for a drop so insane you’ll question why you ever wanted $MEOW in the first place.
`;

		const welcomeKeyboard = new InlineKeyboard()
			.url("🕹 Play", "https://t.me/stoopid_cats_dev_bot/sc_dev_test")
			.row()
			.row()
			.switchInline("Share This Bot", webAppUrlStart);

		bot.command("start", async (ctx) => {
			await ctx.replyWithPhoto(welcomeImageUrl, {
				caption: welcomeText,
				parse_mode: "HTML",
				reply_markup: welcomeKeyboard,
			});
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

		return webhookCallback(bot, "cloudflare-mod")(request);
	},
};
