export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
	DATABASE_URL: string;
}

export interface UserData {
	id: string;
	tgId: string | null;
	twitterUsername?: string | null;
	nickname?: string | null;
	name?: string | null;
}

export interface AlphaApplicationData {
	userId: string;
	email: string;
	airdropSeasonId: string;
}

export interface TwitterUsernameData {
	userId: string;
	username: string;
}
