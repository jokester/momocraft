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
  exec psql "$DB_NAME" "$@"
else
  set -x
  exec psql postgres "$@"
fi
