import { Bot, webhookCallback } from "grammy";
import type { Env } from "./types";
import { createPrismaClient, disconnectPrisma } from "./services/prisma";
import { UserService } from "./services/userService";
import { AlphaService } from "./services/alphaService";
import { CommandHandlers } from "./handlers/commandHandlers";
import { MessageHandlers } from "./handlers/messageHandlers";

export function createBot(env: Env) {
	const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

	// Initialize services
	const prisma = createPrismaClient(env.DATABASE_URL);
	const userService = new UserService(prisma);
	const alphaService = new AlphaService(prisma);

	// Initialize handlers
	const commandHandlers = new CommandHandlers(userService);
	const messageHandlers = new MessageHandlers(userService, alphaService);

	// Register command handlers
	bot.command("start", commandHandlers.handleStart.bind(commandHandlers));
	bot.command(
		"connect_twitter",
		commandHandlers.handleConnectTwitter.bind(commandHandlers),
	);
	bot.command(
		"alpha_apply",
		commandHandlers.handleAlphaApply.bind(commandHandlers),
	);
	bot.command(
		"my_twitter",
		commandHandlers.handleMyTwitter.bind(commandHandlers),
	);
	bot.command("help", commandHandlers.handleHelp.bind(commandHandlers));

	// Register message handlers
	bot.on(
		"message:text",
		messageHandlers.handleTextMessage.bind(messageHandlers),
	);

	// Register inline query handler
	bot.inlineQuery(
		"startapp",
		commandHandlers.handleInlineQuery.bind(commandHandlers),
	);

	// Error handling
	bot.catch((err) => {
		console.error("Bot error:", err);
	});

	return { bot, prisma };
}

export function createWebhookHandler(env: Env) {
	const { bot, prisma } = createBot(env);

	return async (request: Request, ctx: ExecutionContext): Promise<Response> => {
		// Ensure Prisma connection is closed after request
		ctx.waitUntil(disconnectPrisma(prisma));

		return webhookCallback(bot, "cloudflare-mod")(request);
	};
}
