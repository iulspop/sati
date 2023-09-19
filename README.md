# Sati

This project is the seed for two tools that will work together:

- Inquire: A self-inquiry tool designed to cultivate and expand self-insight through daily practice.
- Sati: A self-observability tool that helps you maintain a coherent life rhythm with an at-a-glance report of your well-being and steer yourself into desired states through control loops.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up and Fly pre-installed:

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

## Getting Started

- Make sure you're using the latest Active LTS Node.js release (V18). You can run:

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

## Running Tests

- Run unit and integration tests in parallel:

```sh
npm run test
```

By convention, we name our test files which include tests with database I/O as `*.integration.test`. These tests typically involve interactions with a live database, and therefore, previously had to run sequentially to avoid conflicts.

However, with our recent updates, we've ensured that every database interaction within these tests is scoped by the `userId` or entity id. This means each test operates within its own unique context, effectively eliminating the possibility of conflicts between tests, even when they interact with the same database. As a result, these `*.integration.test` files can now be run in parallel.

- To run e2e tests, first start Remix server for e2e tests (uses separate database than dev server, also allows seeing logs output on the server (as opposed to client) when running e2e tests):

```sh
npm run dev:e2e
```

Then install playwright browsers and run the e2e tests:

```sh
npx playwright install && npm run test:e2e
```

Playwright UI mode is handy for running e2e tests in watch mode with screenshots and logs for each test run:

```sh
npm run test:e2e:ui
```

When using VS Code, you can also start a task using `Cmd+Shift+B` (or `Ctrl+Shift+B` on Windows/Linux) and select `tsc: watch`. This starts the TypeScript compiler in watch mode and report any encounters in the "Problems" tab at the bottom of the Visual Studio Code window. Handy for keeping track of large refactoring when you change types used all over like domain entities.

## Development

Read our [contributing guide][contributing] to learn about our development process. Architecture decisions for this project [are documented here][adrs], using the [Architecture Decision Records (ADR)][adrs-pattern] pattern.

<!-- Links -->

[adrs-pattern]: http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions

<!-- Repo links -->

[adrs]: https://github.com/iulspop/inquire/tree/main/docs/adr
[contributing]: https://github.com/iulspop/inquire/blob/main/CONTRIBUTING.md
