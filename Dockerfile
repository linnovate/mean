FROM node:20-slim
WORKDIR /app

ENV HUSKY_SKIP_INSTALL = 1
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive \
    && yarn cache clean
COPY . .
RUN yarn build:prod

USER node

EXPOSE 4040
CMD ["yarn", "serve"]
