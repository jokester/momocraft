FROM node:12.18-buster-slim

RUN adduser --shell /bin/bash worker \
    && mkdir -pv /app                \
    && chown -v worker:worker /app

USER worker
COPY --chown=worker:worker . /app/
WORKDIR /app/
RUN yarn && yarn build && yarn --production && rm -rf ~/.cache
CMD yarn start
