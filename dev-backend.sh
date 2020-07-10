#!/usr/bin/env bash

set -uex

cd $(dirname "$0")/backend

SCREEN_SESSION='momocraft-backend'

screen -dm -S $SCREEN_SESSION

# window 0: vim
screen -S $SCREEN_SESSION -p 0 -X stuff "vim ."

# window1: yarn dev
screen -S $SCREEN_SESSION -X screen 1
screen -S $SCREEN_SESSION -p 1 -X stuff "yarn dev"

# window2: yarn typecheck
screen -S $SCREEN_SESSION -X screen 2
screen -S $SCREEN_SESSION -p 2 -X stuff "yarn typecheck --watch"

exec screen -r $SCREEN_SESSION

