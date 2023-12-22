
FROM oven/bun:latest 
WORKDIR /usr/src/app


COPY package.json bun.lockb /usr/src/app/


RUN bun install  --production

COPY . /usr/src/app


EXPOSE 3000 
ENTRYPOINT [ "bun","run","start" ]
