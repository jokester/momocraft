#!/usr/bin/env bash

set -uex

cd $(dirname "$0")/momo-devdb

SCREEN_SESSION='momocraft-devdb'

screen -dm -S $SCREEN_SESSION

# window 0: htop
screen -S $SCREEN_SESSION -p 0 -X stuff 'htop
'

# window1: docker compose
screen -S $SCREEN_SESSION -X screen 1
screen -S $SCREEN_SESSION -p 1 -X stuff "docker-compose up"

exec screen -r $SCREEN_SESSION

