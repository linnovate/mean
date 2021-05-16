FROM node:14

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn --pure-lockfile --non-interactive --no-progress
RUN yarn build:prod

EXPOSE 4040

CMD ["yarn", "serve"]
