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

# Using npm to omit dev dependencies as 
# yarn install includes them even with --production flag
# current image size ~400mb
RUN npm install --omit=dev --frozen-lockfile

CMD ["yarn", "start"]
