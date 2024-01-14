# Stage 1: Build Stage
FROM node:lts-alpine3.19 as build

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --production=false --frozen-lockfile

COPY . .

RUN yarn run build

# Stage 2: Production Stage
FROM node:lts-alpine3.19

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/build/ /app/build/
COPY package.json yarn.lock /app/

# using npm to ommit dev dependencies as 
# yarn install dev dep. even if --production=true flag is set which results in 1.61GB image size
# current image size ~400mb
RUN npm i --omit=dev --frozen-lockfile

CMD ["yarn","start"]
