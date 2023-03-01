# Development

## Style Guide

### Conventional Commits

We enforce [conventional commits][conventional-commits] using [commitlint][commitlint]. Refer to the Angular [commit message guidelines][angular-convention] for learning when to use commit types other than `fix` or `feat`.

The motivation is primarily to [measure defect commit rate][defect-rate].

## Testing

### Playwright

> **Note:** make sure you've run `npm run dev` at least one time before you run
> the E2E tests!

We use Playwright for our End-to-End tests in this project. You'll find those in
the `playwright/` directory. As you make changes to your app, add to an existing
file or create a new file in the `playwright/e2e` directory to test your
changes.

[Playwright natively features testing library selectors](https://playwright.dev/docs/release-notes#locators)
for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e` which will start the
dev server for the app as well as the Playwright client.

## Deployment

A Docker image is built and deployed to [fly.io](fly.io).

### Continuous Deployment

GitHub actions is configured to run tests and deploy to [fly.io](fly.io) on every commit to the main branch.

The following GitHub repository secrets must be set:

- `DATABASE_URL` same as `.env`

- `FLY_API_TOKEN`. Go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- `MAGIC_PUBLISHABLE_KEY`, `MAGIC_SECRET_KEY` use the credentials for the Magic app used for testing and development.

- `SESSION_SECRET` same as `.env`

### Initial Deployment

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create the app on Fly:

  ```sh
  fly apps create
  ```

  > **Note:** The app name is taken from the `app` set in your `fly.toml` file.

- Add a `SESSION_SECRET` to your Fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32)
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Add your production Magic app `MAGIC_PUBLISHABLE_KEY` and `MAGIC_SECRET_KEY` credentials to your Fly app secrets.

- Create a persistent volume for the sqlite database. Run the following:

  ```sh
  fly volumes create data --size 1
  ```

### Subsequent Deployments

The app is continuously deployed on every commit. However, you can deploy manually using `fly deploy`.

### Testing Docker Container

The Docker image is used only for deploying on Fly and isn't used in development. However you can test it by building the image and starting the container locally.

Build image and name it:

```sh
docker build -t inquire_image .
```

Start the container with the port open:

```sh
docker run -i -t -e MAGIC_PUBLISHABLE_KEY="x" \
-e MAGIC_SECRET_KEY="x" \
-e SESSION_SECRET="x" \
-p 8080:8080 \
--name inquire_container inquire_image
```

The env variables must be set or the error `Invariant Failed` will be thrown by `remix-serve build`.

### Debugging Deployment

Fly deployment throwing a `"Failed due to unhealthy allocations"` might be because secrets are not set correctly on the Fly app. See [Troubleshooting your Deployment](https://fly.io/docs/getting-started/troubleshooting/) for more troubleshooting options.

## Utilities

### Prisma helper scripts

- `"db:test-changes` - Applies schema changes to database without creating a migration. Use to prototype a schema change before creating a migration.
- `"db:apply-changes"` - Generates a migration for your schema changes and applies it to database.
- `"db:seed"` - Seeds the database with a user profile.
- `"db:setup"` - Sets up the database.
- `"db:wipe"` - Wipes the database (irrevocably delete all data, but keep
  the schema).
- `"db:reset-dev"` - Wipes the database, seeds it and starts the dev server.
  This is a utility script that you can use in development to get clean starts.
- `"db:studio"` - Open Prisma studio for read and writing table data.

### Generating boilerplate

This repository uses [Plop](https://plopjs.com/documentation/#getting-started)
to automate the generation of common boilerplate.

Run `npm run gen` and then choose what you want to create, e.g.:

```
$ npm run gen

> gen
> plop

? What do you want to generate? React component
? For what feature do you want to generate the React component? user profile
? What is the name of the React component? user name
✔  ++ /app/features/user-profile/user-name-component.tsx
✔  ++ /app/features/user-profile/user-name-component.test.tsx
```

Out of the box, there are three options:

- React component with unit test
- Database model utils
- E2E tests for a route

## Credits

Configuration based on the [French House Stack](https://github.com/janhesters/french-house-stack) and [Indie Stack](https://github.com/remix-run/indie-stack) Remix templates.

<!-- Links -->

[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[commitlint]: https://github.com/conventional-changelog/commitlint#what-is-commitlint
[angular-convention]: https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines
[defect-rate]: https://medium.com/javascript-scene/the-hardest-part-of-being-a-software-manager-5293b1b02f94
