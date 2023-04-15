# Inquire

## Getting Started

- Make sure you're using Node.js 18.0.0 or higher. You can run:

  ```sh
  node -v
  ```

  to check which version you're on.

- Install dependencies:

  ```sh
  npm i
  ```

- Make sure your system can run the Husky hooks (Mac & Linux):

  ```sh
  chmod a+x .husky/pre-commit
  ```

- Create a `.env` file and add these environment variables (see `.env.example`, too):

  - `MAGIC_PUBLISHABLE_KEY` and `MAGIC_SECRET_KEY` - You'll need to grab a public key and a secret key for your project from your [Magic dashboard](https://magic.link). Use a Magic app only used for development.
  - `SESSION_SECRET` - The session secret can be any string that is at least 32 characters long.
  - `DATABASE_URL` - The url under which the SQLite database will operate. You may use the value from `.env.example` for this.

- Add a `console.warn` to `getUserIdFromSession()` in `app/features/user-authentication/user-authentication-session.server.ts`:

  ```ts
  const getUserIdFromSession = (session: Session): string | undefined => {
    const userId = session.get(USER_SESSION_KEY);
    console.warn('userId', userId);
    return userId;
  };
  ```

- Set up the database:

  ```sh
  npm run db:setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

- Sign up for an account under `/login` by logging in with Magic.

- Grab the `userId` that you logged out in the previous step from the terminal in which you ran `npm run dev` and add it to your `.env` file as `SEED_USER_ID`.

- Remove the `console.warn` from `getUserIdFromSession()`.

- Now you can add the remaining value to your `.env` file, which is used by the seed script:

  - `SEED_USER_ID` - The steps above outlined how to get this value. This value
    is the user id of the user that will be seeded in the database. This value
    is required for the `"db:seed"` script.

- Lastly, run

  ```sh
  npm run db:reset-dev
  ```

  to wipe & seed the database.

## Development

Read our [contributing guide][contributing] to learn about our development process. Architecture decisions for this project [are documented here][adrs], using the [Architecture Decision Records (ADR)][adrs-pattern] pattern.

<!-- Links -->

[adrs-pattern]: http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions

<!-- Repo links -->

[adrs]: https://github.com/iulspop/inquire/tree/main/docs/adr
[contributing]: https://github.com/iulspop/inquire/blob/main/CONTRIBUTING.md
