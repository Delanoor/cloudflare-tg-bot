# Stoopid Cats Telegram Bot

A modular Telegram bot built with Cloudflare Workers, Prisma, and the grammy framework for the Stoopid Cats game.

## 🏗️ Architecture

The bot is organized into a modular structure for better maintainability and separation of concerns:

### 📁 Project Structure

```
src/
├── index.ts              # Main entry point
├── bot.ts               # Bot setup and initialization
├── types.ts             # TypeScript interfaces and types
├── constants.ts         # Configuration constants and messages
├── services/            # Business logic services
│   ├── prisma.ts       # Database client setup
│   ├── userService.ts  # User-related operations
│   └── alphaService.ts # Alpha testing operations
├── handlers/            # Request handlers
│   ├── commandHandlers.ts # Bot command handlers
│   └── messageHandlers.ts # Text message handlers
└── utils/              # Utility functions
    └── validation.ts   # Input validation utilities
```

### 🔧 Key Components

#### Services Layer
- **`UserService`**: Handles user database operations (find, update Twitter username)
- **`AlphaService`**: Manages alpha testing applications
- **`PrismaService`**: Database client initialization and connection management

#### Handlers Layer
- **`CommandHandlers`**: Processes bot commands (`/start`, `/connect_twitter`, etc.)
- **`MessageHandlers`**: Handles text message replies and validation

#### Utilities
- **`validation.ts`**: Input validation for Twitter usernames, emails, and message parsing
- **`constants.ts`**: Centralized configuration and message templates

## 🚀 Features

### Commands
- `/start` - Welcome message with game information
- `/connect_twitter` - Connect Twitter account (reply-based)
- `/my_twitter` - Check saved Twitter username
- `/alpha_apply` - Apply for Android alpha testing (reply-based)
- `/help` - Show available commands

### Security Features
- Reply-based input validation
- User authorization checks (only command initiator can reply)
- Input sanitization and validation
- Error handling and logging

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Cloudflare Workers account
- Prisma database setup

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `wrangler.toml`:
   ```toml
   [vars]
   BOT_INFO = '{"id":123456789,"is_bot":true,"first_name":"YourBot","username":"your_bot_username"}'
   
   [[vars]]
   name = "BOT_TOKEN"
   value = "your_bot_token"
   
   [[vars]]
   name = "DATABASE_URL"
   value = "prisma://your-database-url"
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

## 📝 Adding New Features

### Adding a New Command
1. Add command handler in `handlers/commandHandlers.ts`
2. Register the command in `bot.ts`
3. Add help text in `constants.ts`

### Adding a New Service
1. Create service class in `services/` directory
2. Inject Prisma client in constructor
3. Add to bot initialization in `bot.ts`

### Adding New Validation
1. Add validation function in `utils/validation.ts`
2. Import and use in appropriate handlers

## 🔒 Security Considerations

- All user inputs are validated and sanitized
- Reply-based input prevents unauthorized access
- User ID verification ensures only command initiator can respond
- Database operations are wrapped in try-catch blocks
- Sensitive data is not logged

## 📊 Database Schema

The bot uses Prisma with the following key models:
- `User`: Stores user information and Twitter usernames
- `UserAirdropApplication`: Stores alpha testing applications

## 🤝 Contributing

1. Follow the modular structure
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test thoroughly before deployment

## 📄 License

This project is part of the Stoopid Cats game ecosystem. 