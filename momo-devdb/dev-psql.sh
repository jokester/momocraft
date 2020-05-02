#!/bin/bash

set -ue

DB_SERVER='127.0.0.1'
DB_PORT='54432'
DB_USER='pguser'
DB_PWD='secret'

if [[ $# -gt 0 ]]; then
  echo "using DB_NAME=$1"
  DB_NAME="$1"
  shift
  set -x
  exec psql "postgresql://$DB_USER:$DB_PWD@$DB_SERVER:$DB_PORT/$DB_NAME" "$@"
else
  set -x
  exec psql "postgresql://$DB_USER:$DB_PWD@$DB_SERVER:$DB_PORT/postgres"
fi
