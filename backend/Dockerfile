FROM node:12.16-alpine3.11 as builder

RUN                                             \
    apk add --update --no-cache python make g++ \
    && adduser --shell /bin/bash -D appuser     \
    && mkdir -pv /app                           \
    && chown -v appuser:appuser /app

USER appuser
COPY . /app/
WORKDIR /app
RUN find && yarn --production && rm -rf ~/.cache

# -----

FROM node:12.16-alpine3.11 as app
RUN                                         \
    true                                    \
    && adduser --shell /bin/bash -D appuser \
    && mkdir -pv /app                       \
    && chown -v appuser:appuser /app

USER appuser
COPY --from=builder /app /app
WORKDIR /app
CMD yarn start
