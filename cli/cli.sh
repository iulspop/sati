#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
DATABASE_URL="file:./personal.db" node $SCRIPT_DIR/bin/cli/src/index.js "$@"