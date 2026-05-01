# ========================================
# Optimized Multi-Stage Dockerfile
# Node.js TypeScript Application
# ========================================

ARG NODE_VERSION=24.14.1
FROM node:${NODE_VERSION} AS base

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node


### BUILD FRONTEND ####
FROM base AS frontend

# Set working directory
WORKDIR /frontend

# Copy package files
COPY --chown=node:node frontend/package*.json .
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node frontend/ .
RUN npm run build



### BUILD BACKEND ####
FROM base AS backend


# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT


# install dependencies first, in a different location for easier app bind mounting for local development
# WORKDIR now sets correct permissions if you set USER first
WORKDIR /backend

# Copy package files
COPY --chown=node:node backend/package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci && npm cache clean --force

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

# copy in our source code last, as it changes the most
# copy in as node user, so permissions match what we need
COPY --chown=node:node backend/ .

# copy frontend files to backend
COPY --from=frontend --chown=node:node /frontend/dist/ ./dist/

# if you want to use npm start instead, then use `docker run --init in production`
# so that signals are passed properly. Note the code in index.js is needed to catch Docker signals
# using node here is still more graceful stopping then npm with --init afaik
# I still can't come up with a good production way to run with npm and graceful shutdown
CMD [ "node", "./index.js" ]