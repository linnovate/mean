FROM node:8

WORKDIR /usr/src/app
ADD . /usr/src/app

RUN yarn
RUN yarn build

EXPOSE 4040

CMD ["yarn", "serve"]
