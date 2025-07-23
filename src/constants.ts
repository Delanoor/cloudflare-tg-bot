// Bot configuration
export const BOT_CONFIG = {
	WEB_APP_URL: "https://t.me/StoopidCatsBot/stoopid_cats",
	WEB_APP_URL_START: "https://t.me/StoopidCatsBot/stoopid_cats?startapp",
	WELCOME_IMAGE_URL:
		"https://jfh5hylzykmxvrqk.public.blob.vercel-storage.com/images/bot-bBV4t7BRaHdQ7rslw0zXup6U4OdwKE.png",
	ALPHA_AIRDROP_ID: "cmd71ei1v0000js0449mlzsgf",
	ALPHA_APPLICATION_CLOSED: "cmd71ei1v0000js0449mlzsgf",
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
	TWITTER_USERNAME: /^[a-zA-Z0-9_]{1,15}$/,
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Message templates
export const MESSAGES = {
	WELCOME: `Welcome to Stoopid Cats!
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
Be Stoopid and Have Fun! 🐾`,

	TWITTER_REQUEST: (
		firstName: string,
		userId: number,
	) => `🐦 Help Us Connect Your Twitter Account! 🐦

Hey there, ${firstName}! 🐱

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

⚠️ IMPORTANT: Only ${firstName} (User ID: ${userId}) can reply to this message.

Ready? Just reply to this message with your Twitter username! 👇`,

	ALPHA_APPLICATION: (
		firstName: string,
		userId: number,
	) => `📱 Android Alpha Testing Application 📱

Hey there, ${firstName}! 🎮

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

⚠️ IMPORTANT: Only ${firstName} (User ID: ${userId}) can reply to this message.

Ready to join our alpha testing program? Reply with your Google Play email address! 📱`,

	HELP: `🤖 Bot Commands:

• /connect_twitter - Connect your Twitter account
• /my_twitter - Check your saved Twitter username
• /alpha_apply - Apply for Android alpha testing
• /help - Show this help message

🎮 Play the game: https://t.me/StoopidCatsBot/stoopid_cats`,

	ALPHA_APPLICATION_CLOSED: `🚫 Alpha Testing Application Closed (Android Only) 🚫

Thank you for your interest in our alpha testing program!

We're currently not accepting applications for alpha testing.

Please stay tuned for future updates!`,

	ERRORS: {
		USER_NOT_FOUND:
			"❌ User not found in our system.\n\nPlease make sure you've played the game at least once:\n🎮 https://t.me/StoopidCatsBot/stoopid_cats",
		INVALID_EMAIL:
			"❌ Invalid email address!\n\nPlease provide a valid Google Play email address.\n\nExamples:\n• user@gmail.com\n• player@outlook.com\n• gamer@yahoo.com",
		INVALID_TWITTER_USERNAME:
			'❌ Invalid Twitter username format!\n\nPlease make sure your username:\n• Contains only letters, numbers, and underscores\n• Is 1-15 characters long\n• Does NOT include the @ symbol\n\nExample: "stoopidcats" ✅\nTry again! 👇',
		WRONG_USER_REPLY:
			"❌ You can only reply to your own command! Please use the appropriate command to start your own process.",
		TWITTER_GUIDANCE:
			"💡 To connect your Twitter account, please use the /connect_twitter command first, then reply to that message with your username!",
		ALPHA_ALREADY_APPLIED:
			"❌ You have already applied for alpha testing!\n\nWe have received your application and will contact you if selected.\n\n🎮 Continue playing: https://t.me/StoopidCatsBot/stoopid_cats",
		GENERIC_ERROR:
			"❌ Sorry, there was an error processing your request.\n\nPlease try again in a few moments. If the problem persists, contact support.",
	},
} as const;
