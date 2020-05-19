FROM alpine:3.11

RUN \
    apk add --no-cache --update yarn nodejs-lts && yarn --production \
    && adduser -s /bin/bash -D appuser                               \
    && mkdir -pv /app                                            \
    && chown -v appuser:appuser /app

USER appuser
COPY * /app/
WORKDIR /app
RUN yarn --production && rm -rf ~/.cache

CMD yarn start
