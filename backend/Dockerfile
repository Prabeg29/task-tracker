FROM node:lts-bullseye-slim AS base

WORKDIR /home/task-tracker

COPY package.json yarn.lock ./

# Stage: Development
FROM base AS dev

RUN yarn

COPY . .

CMD ["yarn", "start:dev"]

# Stage: Builder
FROM base AS builder

COPY --from=dev /home/task-tracker/node_modules ./node_modules

COPY . .

RUN yarn build

# Stage: Prod Dependencies Builder
FROM base AS prod-dependencies

RUN yarn install --prod

# Stage: Prod Image
FROM base AS production

COPY --from=builder /home/task-tracker/lib ./lib
COPY --from=prod-dependencies /home/task-tracker/node_modules /node_modules

EXPOSE 8848

CMD ["node", "lib/index.js"]
