
FROM node:12.22.1-slim

RUN apt-get update && apt-get install -y git yarn python gcc g++ make bash curl && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY . .

RUN yarn install --frozen-lock

EXPOSE 3000

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
CMD [ "./run.sh" ]
