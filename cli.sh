#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
STORAGE_PATH=storage node $SCRIPT_DIR/bin/index.js "$@"