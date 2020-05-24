FROM node:12.16-buster-slim

RUN \
    adduser --shell /bin/bash appuser \
    && mkdir -pv /app                 \
    && chown -v appuser:appuser /app

USER appuser
COPY . /app/
WORKDIR /app
RUN find && yarn --production && rm -rf ~/.cache

CMD yarn start
