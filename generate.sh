#!/bin/bash

# This script generates individual 'touch' commands for each .d.ts file.
# Run it from the project root.
# You can run it as: bash generate_touch_commands.sh
# Or execute its output: bash <(bash generate_touch_commands.sh)

./generate_dts_files.sh
./generate_dts_placeholders.sh