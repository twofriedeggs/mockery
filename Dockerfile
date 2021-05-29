FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY .next /usr/src/app/.next
COPY .env /usr/src/app
COPY .env.production /usr/src/app
COPY next.config.js /usr/src/app
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
