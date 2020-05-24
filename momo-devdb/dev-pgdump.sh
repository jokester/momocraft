#!/bin/bash

set -ue

export PGHOST='127.0.0.1'
export PGPORT='54432'
export PGUSER='pguser'
export PGPASSWORD='secret'

if [[ $# -gt 0 ]]; then
  echo "using DB_NAME=$1"
  DB_NAME="$1"
  shift
  set -x
  NOW=$(date '+%Y%m%d-%H%M%S-%N')
  pg_dump "$DB_NAME" | gzip -9 > "$DB_NAME-$NOW.sql.gz"
else
  echo "USAGE: $0 DB_NAME"
  exit 1
fi
