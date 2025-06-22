FROM node:20-alpine AS build
WORKDIR /app

# Accept NODE_ENV as build argument, default to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Serve the React app using `serve`
FROM node:20-alpine
WORKDIR /usr/src/app

# Set NODE_ENV for runtime (though React build has already baked in the values)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm install -g serve
COPY --from=build /app/build .
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
