#!/bin/bash

# This script generates individual 'touch' commands for each .d.ts file.
# Run it from the project root.
# You can run it as: bash generate_touch_commands.sh
# Or execute its output: bash <(bash generate_touch_commands.sh)

find . \
  \( -path ./node_modules -o -path ./fields/components -o -wholename '*/test/*' \) -prune \
  -o \
  -name '*.js' -exec bash -c 'f="{}"; touch "${f%.js}.d.ts"' \;

touch global.d.ts