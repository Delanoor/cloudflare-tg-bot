import { VALIDATION_PATTERNS } from "../constants";

export function validateTwitterUsername(username: string): boolean {
	return VALIDATION_PATTERNS.TWITTER_USERNAME.test(username);
}

export function validateEmail(email: string): boolean {
	return VALIDATION_PATTERNS.EMAIL.test(email);
}

export function extractUserIdFromMessage(messageText: string): string | null {
	const userIdMatch = messageText?.match(/User ID: (\d+)/);
	return userIdMatch ? userIdMatch[1] : null;
}

export function isReplyToBotMessage(
	replyToMessage: { from?: { is_bot?: boolean }; text?: string } | undefined,
	expectedText: string,
): boolean {
	return !!(
		replyToMessage?.from?.is_bot && replyToMessage?.text?.includes(expectedText)
	);
}
