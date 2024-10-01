# Stage: Builder
FROM node:lts-alpine AS builder

WORKDIR /home/task-tracker

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

# Stage: Prod Dependencies Builder
FROM node:lts-alpine AS prod-dependencies

WORKDIR /home/task-tracker

COPY --from=builder /home/task-tracker/package.json ./package.json

RUN yarn install --prod

# Stage: Prod Image
FROM node:lts-alpine

WORKDIR /home/task-tracker

COPY --from=builder /home/task-tracker/lib ./lib
COPY --from=prod-dependencies /home/task-tracker/node_modules /node_modules

EXPOSE 8848

CMD ["node", "lib/index.js"]
