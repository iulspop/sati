FROM node:18-bullseye-slim as base

ENV NODE_ENV production

# Install openssl for Prisma & python3 ake gcc g++ for bufferutil npm package which requires node-gyp
# Run `npm ls bufferutil` to see which packages cause the dependency
RUN apt-get update && apt-get install -y openssl sqlite3 python3 make gcc g++

FROM base as deps

WORKDIR /myapp

ADD package.json .npmrc ./
RUN npm install --production=false --ignore-scripts

FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json .npmrc ./
RUN npm prune --production

FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

FROM base

ENV DATABASE_URL="file:/data/sqlite.db"
ENV PORT="8080"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma

EXPOSE 8080

ENTRYPOINT [ "./start.sh" ]
