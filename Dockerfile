FROM node:12-alpine

WORKDIR /user/app
COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]