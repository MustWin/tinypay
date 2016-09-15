FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY . /usr/src/app
COPY scripts/run.sh /usr/src/app/

RUN npm install

EXPOSE 80

CMD ["./run.sh"]
