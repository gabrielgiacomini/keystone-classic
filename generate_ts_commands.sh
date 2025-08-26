#!/bin/bash

# generate_ts_commands.sh (Enhanced Version)
#
# Generates individual 'printf ... > file.d.ts' commands to create placeholder
# type definition files with more detailed JSDoc comments to guide implementation.
# Designed for KeystoneJS v4 project structure.
#
# Run this script from the KeystoneJS v4 project root.

# --- Configuration ---
creation_date=$(date '+%Y-%m-%d %H:%M:%S %Z')
readonly creation_date

# --- Helper Functions ---

# Function to determine placeholder info based on the JS file path
get_file_info() {
    local js_file="$1"
    # Reset global variables for this file
    summary=""
    description=""
    specific_todo=""
    suggested_imports="// Add necessary imports here (e.g., mongoose, express, base types)\n"

    case "$js_file" in
        "./index.js")
            summary="Main module definition for KeystoneJS v4."
            description="Defines the main \`keystone\` object exported by the package. This is the entry point for using KeystoneJS."
            specific_todo="Define the main Keystone interface, including methods like init(), start(), list(), set(), get(), Field/Types, app, mongoose, etc."
            suggested_imports="import * as express from 'express';\nimport * as mongoose from 'mongoose';\n// Possibly import List, Field definitions later\n"
            ;;
        "./lib/list.js")
            summary="KeystoneJS List class/object definition."
            description="Defines the core class or object representing a Keystone List, returned by \`keystone.list()\`. Includes methods for data operations, field registration, etc."
            specific_todo="Define the List class/interface, its constructor options, methods like add(), register(), getData(), paginate(), updateItem(), model property (mongoose.Model), etc."
            suggested_imports="import * as mongoose from 'mongoose';\n// Possibly import Field, UpdateHandler definitions later\n"
            ;;
        "./lib/view.js")
            summary="KeystoneJS View class/object definition."
            description="Defines the types related to KeystoneJS Views, used for rendering templates (often with Express response methods)."
            specific_todo="Define the View class/interface and its methods, especially \`render()\`. Consider interaction with Express Response."
            suggested_imports="import * as express from 'express';\n"
            ;;
        "./lib/updateHandler.js")
            summary="KeystoneJS UpdateHandler definition."
            description="Defines the types for Keystone's UpdateHandler, used for processing form data safely, typically via \`item.getUpdateHandler(req).process()\`. "
            specific_todo="Define the UpdateHandler interface/class and its \`process()\` method, including its options and callback arguments."
            suggested_imports="import * as express from 'express';\nimport * as mongoose from 'mongoose';\n"
            ;;
        "./lib/email.js")
            summary="KeystoneJS Email class/object definition."
            description="Defines the types related to sending emails via KeystoneJS, handling templates and transport."
            specific_todo="Define the Email class/interface, its options, and methods like \`send()\`. Note dependency on template engines/options."
            ;;
        "./lib/core/init.js")
            summary="KeystoneJS core initialization logic."
            description="Handles the primary \`keystone.init(options)\` setup, processing configuration options."
            specific_todo="Define the main KeystoneInitOptions interface covering all valid settings passed to \`keystone.init()\`. This is crucial."
            ;;
        "./lib/core/start.js")
            summary="KeystoneJS core startup logic."
            description="Handles the \`keystone.start()\` process, typically starting the web server."
            specific_todo="Define any options or callback types for \`keystone.start()\`. Note its asynchronous nature."
            ;;
        "./lib/core/"*)
            summary="KeystoneJS core utility or logic."
            description="Type definitions for internal core functionality related to: $(basename "$js_file" .js)."
            specific_todo="Define the exported functions, classes, or objects from this core module."
            ;;
        "./lib/list/"*)
            summary="KeystoneJS List helper method."
            description="Type definitions for a specific helper method used by List instances: $(basename "$js_file" .js)."
            specific_todo="Define the function signature(s) exported by this module, paying attention to arguments like query options, data, etc."
            suggested_imports="// May need List, Field, mongoose types\n"
            ;;
        "./lib/middleware/"*)
            summary="KeystoneJS custom Express middleware."
            description="Type definitions for the Express middleware: $(basename "$js_file" .js)."
            specific_todo="Define the function signature as Express middleware (req, res, next). Check if it uses augmented Request/Response properties."
            suggested_imports="import * as express from 'express';\n"
            ;;
        "./lib/security/"*)
            summary="KeystoneJS security utility."
            description="Type definitions for a security-related utility: $(basename "$js_file" .js)."
            specific_todo="Define the exported function or object related to security (e.g., CSRF, Frame Guard, IP restriction)."
            ;;
        "./lib/storage/"* | "./lib/storage/adapters/"*)
            summary="KeystoneJS storage adapter or utility."
            description="Type definitions related to file storage: $(basename "$js_file" .js)."
            specific_todo="Define the storage adapter interface or specific utility functions/classes."
            ;;
        "./server/"*)
            summary="KeystoneJS server setup utility."
            description="Type definitions for server initialization or middleware binding logic: $(basename "$js_file" .js)."
            specific_todo="Define exported functions, likely related to Express app configuration or server startup."
            suggested_imports="import * as express from 'express';\n"
            ;;
        "./fields/types/Field.js")
            summary="Base class definition for KeystoneJS Fields."
            description="Defines the common interface, properties, and methods for all KeystoneJS field *instances* (e.g., on a Mongoose document)."
            specific_todo="Define the base Field class/interface. Include common methods like \`validateInput\`, \`updateItem\`, \`getData\`, properties like \`path\`, \`options\`, etc."
            suggested_imports="import * as mongoose from 'mongoose';\n// May need List definition\n"
            ;;
        "./fields/types/Type.js")
            summary="Base class definition for KeystoneJS Field Types."
            description="Defines the common interface and properties for all KeystoneJS field type *constructors* (e.g., \`keystone.Field.Text\`)."
            specific_todo="Define the base Field Type class/interface. Include static properties, constructor signature, \`addToSchema\`, \`register\` methods, etc."
            ;;
        "./fields/types/"*"/"*".js") # Match specific field type files like TextType.js
            # Extract field type name more reliably
            local type_name_candidate=$(basename "$js_file" .js)
            local field_name="${type_name_candidate%Type}" # Remove 'Type' suffix if present
            [[ -z "$field_name" ]] && field_name="$type_name_candidate" # Fallback if no 'Type' suffix

            summary="KeystoneJS ${field_name} Field Type definition."
            description="Defines the specific options, methods, and behavior for the ${field_name} field type."
            specific_todo="Define the specific options interface (e.g., ${field_name}Options) extending base field options. Define the class/interface extending the base Field Type. Implement/override necessary methods."
            suggested_imports="// Import the base Field type\n// import { Field } from '../Field'; // Adjust path as needed\n// import { FieldType } from '../Type'; // Adjust path as needed\n"
            ;;
         "./fields/"*".js") # Match files directly under fields/ (if any)
             summary="KeystoneJS fields system utility/component."
             description="Type definitions for a file within the fields system: $(basename "$js_file" .js)."
             specific_todo="Define the purpose and exports of this file within the field system."
            ;;
        "./fields/utils/"*)
            summary="KeystoneJS fields utility function."
            description="Type definitions for a utility function used by field types: $(basename "$js_file" .js)."
            specific_todo="Define the exported utility function signature(s)."
            ;;
        *) # Default fallback
            summary="Type definitions for ${js_file}"
            description="Placeholder description for the types defined in this file."
            specific_todo="Determine the purpose of this file and implement the necessary type definitions."
            ;;
    esac
}

# Function to generate the content for the .d.ts file
generate_content() {
    local js_file="$1"
    local current_summary="$2"
    local current_description="$3"
    local current_specific_todo="$4"
    local current_suggested_imports="$5"
    local current_creation_date="$6"

    # Using printf with variables. Ensure variables don't contain % unless intended.
    printf "/**\n * @summary %s\n * @module %s\n * @creationDate %s\n *\n * @description\n * %s\n *\n * @see %s\n *\n * @todo Giaco: %s\n */\n\n%s\n// --- Concrete type definitions start here ---\n\n\n\n// --- Concrete type definitions end here ---\n\nexport {}; // Ensures this file is treated as a module.\n" \
      "$current_summary" \
      "$js_file" \
      "$current_creation_date" \
      "$current_description" \
      "$js_file" \
      "$current_specific_todo" \
      "$current_suggested_imports"
}


# --- Main Execution ---

echo "# --- Generating commands (run from project root) ---"
echo "# Review these commands before executing."
echo "# Execute using: bash <(bash generate_ts_commands.sh)"
echo ""

# Use find and pipe to while read loop for cleaner processing
find . -type d \( -path ./node_modules -o -path ./fields/components -o -wholename '*/test' \) -prune \
       -o \
       -type f -name '*.js' -print0 | \
while IFS= read -r -d $'\0' js_file; do
    # Ensure path starts with ./ for consistency
    [[ "$js_file" != ./* ]] && js_file="./$js_file"
    ts_file="${js_file%.js}.d.ts"

    # Get the specific info for this file
    get_file_info "$js_file" # Sets global vars: summary, description, specific_todo, suggested_imports

    # Generate the content for the .d.ts file
    content=$(generate_content "$js_file" "$summary" "$description" "$specific_todo" "$suggested_imports" "$creation_date")

    # Escape single quotes within the content for the outer printf command
    # Replaces ' with '\''
    escaped_content="${content//\'/\'\\\'\'}"

    # Generate the final printf command for this file
    # Format: printf 'CONTENT' > 'FILENAME'
    printf "printf '%s' > '%s'\n" "$escaped_content" "$ts_file"

done

# --- Command for global.d.ts (handled separately) ---
global_js_file="global.d.ts" # Treat it like a JS file for the function args
global_summary="Global type augmentations for KeystoneJS v4."
global_description="Use this file for module augmentation, e.g., adding properties to Express Request/Response objects modified by KeystoneJS, or declaring global constants/types if any."
global_specific_todo="Giaco: Add necessary global augmentations. Common need: Augment \`Express.Request\` with \`keystone\`, \`list\`, \`item\`, etc. properties if used."
global_suggested_imports="// Import types needed for augmentation, e.g.:\n// import { Keystone } from './index'; // Adjust path\n// import { List } from './lib/list'; // Adjust path\n// import * as mongoose from 'mongoose';\n"
global_content=$(generate_content "$global_js_file" "$global_summary" "$global_description" "$global_specific_todo" "$global_suggested_imports" "$creation_date")
escaped_global_content="${global_content//\'/\'\\\'\'}"
printf "printf '%s' > '%s'\n" "$escaped_global_content" "global.d.ts"


echo ""
echo "# --- End of commands ---"