FROM node:14.18-alpine

WORKDIR /usr/src/app
COPY . /usr/src/app

ENV HUSKY_SKIP_INSTALL=true
RUN yarn --pure-lockfile --non-interactive --no-progress
RUN yarn build:prod

EXPOSE 4040

CMD ["yarn", "serve"]
