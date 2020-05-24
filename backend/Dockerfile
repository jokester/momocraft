FROM node:12.16-buster-slim

RUN \
    apk add --no-cache --update yarn nodejs-lts && yarn --production \
    && adduser -s /bin/bash -D appuser                               \
    && mkdir -pv /app                                            \
    && chown -v appuser:appuser /app

USER appuser
COPY . /app/
WORKDIR /app
RUN find && yarn --production && rm -rf ~/.cache

CMD yarn start
