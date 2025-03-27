#!/bin/bash

# This script generates individual 'touch' commands for each .d.ts file.
# Run it from the project root.
# You can run it as: bash generate_touch_commands.sh
# Or execute its output: bash <(bash generate_touch_commands.sh)

echo "# List of .js files:" > print_js_files_results.md
find . \
  \( -path ./node_modules -o -path ./fields/components -o -wholename '*/test/*' \) -prune \
  -o \
  -name '*.js' -print >> print_js_files_results.md
