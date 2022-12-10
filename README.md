# Inquire

Inquire is a multi-purpose tool for self-inquiry.

## How To Start

1. Have Node.js 18.12.1 (LTS Hydrogen) installed.
2. Install packages: `npm install`
3. Compile: `npm run compile`
4. Initialize SQLite:
   1. Create `.env` file
   2. Add `DATABASE_URL="file:./dev.db"` to `.env` file
   3. Run `npx prisma migrate dev`
5. Run `bash cli.sh --help` for CLI command instructions

## Example use

`bash cli.sh add 'Have you meditated 20 minutes today?'` creates a recurring question which prompts you once a day. Currently only supports once a day, yes/no questions.

`bash cli.sh query` queries for prompts to be answered. You're only prompted once the day has passed for that data point.

Add `bash path-to-cli/cli.sh query` to your `.bashrc` or `.zshrc` file to prompt you to collect unanswered data points.

Data is stored in JSON under `./storage` folder.
