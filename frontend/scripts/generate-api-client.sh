#!/usr/bin/env bash
set -uex
set -o pipefail

cd $(dirname "$0")/..

GENERATED_ROOT="src/api-generated"

rm -rf $GENERATED_ROOT && mkdir -pv $GENERATED_ROOT

curl http://127.0.0.1:3001/api-json > $GENERATED_ROOT/openapi.json

export TS_POST_PROCESS_FILE="yarn prettier --write"

yarn openapi-generator generate      \
    -g typescript-fetch              \
    -c scripts/typescript-fetch.json \
    --enable-post-process-file       \
    -i $GENERATED_ROOT/openapi.json  \
    -o $GENERATED_ROOT
