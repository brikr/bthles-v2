#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"

tmux \
  new-session "cd $SCRIPT_DIR/client; ng serve; read" \; \
  split-window "cd $SCRIPT_DIR/backend; npm start; read" \; \
  select-layout even-vertical
