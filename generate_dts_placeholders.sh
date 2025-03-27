#!/bin/bash

# generate_ts_commands_from_list.sh (Enhanced Version)
#
# Generates individual 'printf ... > file.d.ts' commands based on an explicit
# list of target .d.ts files provided within the script. Creates placeholder
# type definition files with detailed JSDoc comments to guide implementation.
# Tailored for the full KeystoneJS v4 project structure including admin UI & website.
#
# Run this script from the KeystoneJS v4 project root.

# --- Configuration ---
creation_date=$(date '+%Y-%m-%d %H:%M:%S %Z')
readonly creation_date

# --- Helper Functions ---

# Function to determine placeholder info based on the JS file path
get_file_info() {
    local js_file="$1" # Derived JS file path
    local ts_file="$2" # Original TS file path from the list

    # Reset global variables for this file
    summary="Type definitions for ${js_file}"
    description="Placeholder description for the types defined in this file."
    specific_todo="Determine the purpose of this file and implement the necessary type definitions."
    suggested_imports="// Add necessary imports here\n"

    case "$js_file" in
        # --- Core Keystone ---
        "index.js")
            summary="Main module definition for KeystoneJS v4."
            description="Defines the main \`keystone\` object exported by the package. This is the entry point for using KeystoneJS."
            specific_todo="Define the main Keystone interface, including methods like init(), start(), list(), set(), get(), Field/Types, app, mongoose, etc."
            suggested_imports="import * as express from 'express';\nimport * as mongoose from 'mongoose';\n// Possibly import List, Field definitions later\n"
            ;;
        "lib/list.js")
            summary="KeystoneJS List class/object definition."
            description="Defines the core class or object representing a Keystone List, returned by \`keystone.list()\`. Includes methods for data operations, field registration, etc."
            specific_todo="Define the List class/interface, its constructor options, methods like add(), register(), getData(), paginate(), updateItem(), model property (mongoose.Model), etc."
            suggested_imports="import * as mongoose from 'mongoose';\n// Possibly import Field, UpdateHandler definitions later\n"
            ;;
        "lib/view.js") summary="KeystoneJS View class/object definition"; description="Defines the types related to KeystoneJS Views, used for rendering templates"; specific_todo="Define the View class/interface and its methods, especially \`render()\`"; suggested_imports="import * as express from 'express';\n";;
        "lib/updateHandler.js") summary="KeystoneJS UpdateHandler definition"; description="Defines the types for Keystone's UpdateHandler, used for processing form data"; specific_todo="Define the UpdateHandler interface/class and its \`process()\` method"; suggested_imports="import * as express from 'express';\nimport * as mongoose from 'mongoose';\n";;
        "lib/email.js") summary="KeystoneJS Email class/object definition"; description="Defines the types related to sending emails via KeystoneJS"; specific_todo="Define the Email class/interface, its options, and methods like \`send()\`." ;;
        "lib/core/init.js") summary="KeystoneJS core initialization logic"; description="Handles the primary \`keystone.init(options)\` setup"; specific_todo="Define the main KeystoneInitOptions interface";;
        "lib/core/start.js") summary="KeystoneJS core startup logic"; description="Handles the \`keystone.start()\` process"; specific_todo="Define any options or callback types for \`keystone.start()\`." ;;
        "lib/core/"*) summary="KeystoneJS core utility: $(basename "$js_file" .js)"; description="Types for internal core functionality"; specific_todo="Define the exported functions, classes, or objects";;
        "lib/list/"*) summary="KeystoneJS List helper: $(basename "$js_file" .js)"; description="Types for a helper method used by List instances"; specific_todo="Define the exported function signature(s)"; suggested_imports="// May need List, Field, mongoose types\n";;
        "lib/middleware/"*) summary="KeystoneJS Express middleware: $(basename "$js_file" .js)"; description="Types for an Express middleware function"; specific_todo="Define the function signature as Express middleware (req, res, next)"; suggested_imports="import * as express from 'express';\n";;
        "lib/security/"*) summary="KeystoneJS security utility: $(basename "$js_file" .js)"; description="Types for a security-related utility"; specific_todo="Define the exported function or object";;
        "lib/storage/"* | "lib/storage/adapters/"*) summary="KeystoneJS storage component: $(basename "$js_file" .js)"; description="Types related to file storage adapters or utilities"; specific_todo="Define the storage adapter interface or specific utility functions/classes";;
        "lib/content/"*) summary="KeystoneJS content type/utility: $(basename "$js_file" .js)"; description="Types related to the (likely deprecated?) lib/content system"; specific_todo="Define the exports for this content-related module";;

        # --- Server ---
        "server/"*) summary="KeystoneJS server setup: $(basename "$js_file" .js)"; description="Types for server initialization or middleware binding logic"; specific_todo="Define exported functions, likely related to Express app configuration or server startup"; suggested_imports="import * as express from 'express';\n";;

        # --- Fields ---
        "fields/types/Field.js") summary="Base class definition for KeystoneJS Fields"; description="Defines the common interface for all KeystoneJS field *instances*"; specific_todo="Define the base Field class/interface (methods: \`validateInput\`, \`updateItem\`, etc.)"; suggested_imports="import * as mongoose from 'mongoose';\n";;
        "fields/types/Type.js") summary="Base class definition for KeystoneJS Field Types"; description="Defines the common interface for all KeystoneJS field type *constructors*"; specific_todo="Define the base Field Type class/interface (static props, constructor, \`addToSchema\`, etc.)";;
        "fields/types/"*"/"*".js") # Match specific field type files like TextType.js
            local type_name_candidate=$(basename "$js_file" .js)
            local field_name="${type_name_candidate%Type}" # Remove 'Type' suffix
            [[ "$field_name" == "$type_name_candidate" ]] && field_name="${type_name_candidate%Field}" # Try removing 'Field'
            [[ "$field_name" == "$type_name_candidate" ]] && field_name="${type_name_candidate%Filter}" # Try removing 'Filter'
             [[ "$field_name" == "$type_name_candidate" ]] && field_name="${type_name_candidate%Column}" # Try removing 'Column'
            [[ -z "$field_name" ]] && field_name="$type_name_candidate" # Fallback
            summary="KeystoneJS ${field_name} Field Type component: $(basename "$js_file" .js)"; description="Defines specific options, methods, or UI elements for the ${field_name} field type"; specific_todo="Define the class/interface/component, extending base types or React components as appropriate. Define specific options interface if this is the main Type file"; suggested_imports="// May need: import { Field } from '.Field'; import { FieldType } from '.Type'; import React from 'react';\n";;
        "fields/utils/"*) summary="KeystoneJS fields utility: $(basename "$js_file" .js)"; description="Types for a utility function used within the fields system"; specific_todo="Define the exported utility function signature(s)";;
        "fields/mixins/"*) summary="KeystoneJS fields mixin: $(basename "$js_file" .js)"; description="Types for a mixin used by field types (e.g., ArrayField)"; specific_todo="Define the mixin structure and the properties/methods it adds";;
        "fields/explorer/"*) summary="KeystoneJS Field Explorer utility/component: $(basename "$js_file" .js)"; description="Types for the internal Field Explorer tool"; specific_todo="Define the exports (likely React components or server logic)"; suggested_imports="// May need React\n";;

        # --- Admin Server ---
        "admin/server/index.js") summary="KeystoneJS Admin UI Server Entry Point"; description="Sets up and manages the Express app/router for the Admin UI backend"; specific_todo="Define the main function signature and its return type (likely an Express Router or App)"; suggested_imports="import * as express from 'express';\n";;
        "admin/server/app/"*) summary="KeystoneJS Admin UI App component: $(basename "$js_file" .js)"; description="Core logic for creating parts of the Admin UI backend application"; specific_todo="Define the exported function (e.g., creating routers, handlers)"; suggested_imports="import * as express from 'express';\n";;
        "admin/server/middleware/"*) summary="KeystoneJS Admin UI middleware: $(basename "$js_file" .js)"; description="Custom Express middleware used specifically for the Admin UI backend"; specific_todo="Define the Express middleware function signature"; suggested_imports="import * as express from 'express';\n";;
        "admin/server/api/"* | "admin/server/routes/"*) summary="KeystoneJS Admin UI API/Route handler: $(basename "$js_file" .js)"; description="Handles specific API requests or renders routes for the Admin UI"; specific_todo="Define the Express route handler function signature (req, res, next). Type request body/params and response structure"; suggested_imports="import * as express from 'express';\n";;

        # --- Admin Client (React Components, Utils, etc.) ---
        # Note: Based on your profile, you avoid React, but Keystone v4 Admin UI uses it.
        "admin/client/App/index.js" | "admin/client/App/App.js") summary="KeystoneJS Admin UI Main React App component"; description="The root component for the Admin UI single-page application"; specific_todo="Define the main React component props and state. This is the entry point for the client-side UI"; suggested_imports="import React from 'react';\n// Import Redux/Router types if used\n";;
        "admin/client/Signin/index.js" | "admin/client/Signin/Signin.js") summary="KeystoneJS Admin UI Signin Page component"; description="The React component responsible for rendering the sign-in interface"; specific_todo="Define the React component props and state for the Signin page"; suggested_imports="import React from 'react';\n";;
        "admin/client/App/screens/"*"/"*".js") summary="KeystoneJS Admin UI Screen component: $(basename "$js_file" .js)"; description="A major view/screen component within the Admin UI (e.g., Home, List, Item)"; specific_todo="Define the React component props, state, and potentially connected Redux state/dispatch types"; suggested_imports="import React from 'react';\n// Import Redux types (connect, actions, reducers) if applicable\n";;
        "admin/client/App/components/"*"/"*".js" | "admin/client/App/shared/"*"/"*".js" | "admin/client/App/elemental/"*"/"*".js" | "admin/client/Signin/components/"*)
            summary="KeystoneJS Admin UI React Component: $(basename "$js_file" .js)."
            description="A reusable UI component (Elemental UI based or custom) used within the Admin UI."
            specific_todo="Define the React component's props (PropTypes/TypeScript interface) and state if any."
            suggested_imports="import React from 'react';\n// Potentially import PropTypes or other Elemental components\n"
            ;;
        "admin/client/App/sagas/"*) summary="KeystoneJS Admin UI Redux Saga: $(basename "$js_file" .js)"; description="Handles side effects for Redux actions using redux-saga"; specific_todo="Define generator functions, action types they handle, and effects used (call, put, select)"; suggested_imports="// Import saga effects, action types, selectors\n";;
        "admin/client/App/reducers/"* | "admin/client/App/screens/"*"reducer.js") summary="KeystoneJS Admin UI Redux Reducer: $(basename "$js_file" .js)"; description="Manages a slice of the Redux state"; specific_todo="Define the reducer function signature (state, action), the shape of the state slice, and the action types handled"; suggested_imports="// Import action types, initial state shape\n";;
        "admin/client/App/actions/"* | "admin/client/App/screens/"*"actions.js") summary="KeystoneJS Admin UI Redux Actions: $(basename "$js_file" .js)"; description="Defines action creators and action type constants for Redux"; specific_todo="Define action creator function signatures and return types (Flux Standard Actions?). Define action type constants";;
        "admin/client/App/store.js") summary="KeystoneJS Admin UI Redux Store configuration"; description="Configures and creates the Redux store, including middleware (sagas, logger)"; specific_todo="Define the overall Redux state shape. Type the store configuration function"; suggested_imports="// Import Redux, reducers, middleware\n";;
        "admin/client/constants.js" | "admin/client/App/screens/"*"constants.js") summary="KeystoneJS Admin UI Constants: $(basename "$js_file" .js)"; description="Defines constant values (e.g., action types, config values) for the Admin UI"; specific_todo="Define the constants and their types (string literals, numbers, etc.)";;
        "admin/client/utils/"*) summary="KeystoneJS Admin UI Client Utility: $(basename "$js_file" .js)"; description="A utility function or module for the client-side Admin UI"; specific_todo="Define the exported function signatures or object types";;
        "admin/client/"*) summary="KeystoneJS Admin UI client file: $(basename "$js_file" .js)"; description="A file related to the Admin UI client build or setup"; specific_todo="Determine file purpose (build, theme, etc.) and define exports/types";;

        # --- Admin Public Assets ---
        "admin/public/js/lib/"*) summary="Vendor JS Library (Admin UI): $(basename "$js_file" .js)"; description="A third-party JavaScript library bundled with the Admin UI. Types may exist externally"; specific_todo="Consider adding a triple-slash directive to existing @types if available (e.g., /// <reference types=\"jquery\" />). Otherwise, minimal definitions for required global/exports"; suggested_imports="// Check for existing @types package for this library.\n";;
        "admin/public/js/"*) summary="Admin UI Public JS: $(basename "$js_file" .js)"; description="Custom JavaScript for the Admin UI, potentially loaded outside the main React app"; specific_todo="Define any global functions, objects, or jQuery plugins defined here"; suggested_imports="// May interact with globals like jQuery, Keystone\n";;

        # --- Website (Gatsby) ---
        "website/gatsby-config.js") summary="Gatsby site configuration file"; description="Defines site metadata, plugins, and other configurations for the Gatsby build"; specific_todo="Define the shape of the exported configuration object, including plugin options"; suggested_imports="// Reference Gatsby types if available (@types/gatsby)\n";;
        "website/gatsby-node.js") summary="Gatsby Node APIs implementation"; description="Implements Gatsby's Node APIs for controlling the build process (e.g., creating pages, modifying webpack config)"; specific_todo="Define functions like \`createPages\`, \`onCreateNode\`, etc., using Gatsby's API signatures"; suggested_imports="// Reference Gatsby Node API types (@types/gatsby)\n";;
        "website/src/html.js") summary="Gatsby custom HTML shell component"; description="Provides a custom structure for the base HTML file Gatsby generates"; specific_todo="Define the React component props for the custom HTML shell"; suggested_imports="import React from 'react';\n";;
        "website/src/layouts/"*) summary="Gatsby layout component: $(basename "$js_file" .js)"; description="A reusable layout component wrapping pages in the Gatsby site"; specific_todo="Define the React component props (usually includes \`children\`)"; suggested_imports="import React from 'react';\n";;
        "website/src/pages/"*) summary="Gatsby page component: $(basename "$js_file" .js)"; description="A React component representing a page in the Gatsby site"; specific_todo="Define the React component props (including data from GraphQL queries if any)"; suggested_imports="import React from 'react';\n// May need 'graphql' tag type from Gatsby\n";;
        "website/src/"*) summary="Gatsby website source file: $(basename "$js_file" .js)"; description="A source file within the Gatsby website project"; specific_todo="Determine purpose (component, util, template) and define types"; suggested_imports="// May need React, Gatsby APIs\n";;
        "website/components/"*) summary="Gatsby website component: $(basename "$js_file" .js)"; description="A reusable React component for the Gatsby marketing website"; specific_todo="Define the React component props"; suggested_imports="import React from 'react';\n";;
        "website/templates/"*) summary="Gatsby template component: $(basename "$js_file" .js)"; description="A template component used by Gatsby to generate pages programmatically"; specific_todo="Define the React component props (often includes \`pageContext\` and GraphQL \`data\`)"; suggested_imports="import React from 'react';\n// May need 'graphql' tag type from Gatsby\n";;
        "website/utils/"*) summary="Gatsby website utility: $(basename "$js_file" .js)"; description="A utility function or module for the Gatsby website"; specific_todo="Define exported functions or objects";;
        "website/"*) summary="Gatsby website file: $(basename "$js_file" .js)"; description="A file related to the Gatsby website configuration or build"; specific_todo="Determine file purpose (config, data, theme) and define types";;

        # --- Config Files ---
        ".eslintrc.js") summary="ESLint configuration file"; description="Defines linting rules and settings for the project"; specific_todo="Define the shape of the exported ESLint configuration object";;
        # Add other top-level config files if needed (e.g., prettier.config.js)

        # --- Build/Other Scripts ---
        "build.js") summary="Project build script"; description="Custom script likely used for building or packaging parts of the project"; specific_todo="Define any exported functions or the main execution logic if run directly";;
        "greenkeeper-prs/"*) summary="Greenkeeper utility script: $(basename "$js_file" .js)"; description="Script related to Greenkeeper dependency management"; specific_todo="Define exported functions or script logic";;

        # --- Global ---
        "global.d.ts") # Match the TS file directly for this special case
            summary="Global type augmentations for KeystoneJS v4."
            description="Use this file for module augmentation (e.g., adding properties to Express Request/Response) or declaring global types/constants."
            specific_todo="Giaco: Add necessary global augmentations. Common need: Augment \`Express.Request\`."
            suggested_imports="// Import types needed for augmentation\n"
            js_file="N/A" # No corresponding JS file
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
    local js_file="$1" # Can be "N/A" for global.d.ts
    local current_summary="$2"
    local current_description="$3"
    local current_specific_todo="$4"
    local current_suggested_imports="$5"
    local current_creation_date="$6"
    local module_tag=""
    local see_tag=""

    if [[ "$js_file" != "N/A" ]]; then
        module_tag=$(printf "\n * @module %s" "$js_file")
        see_tag=$(printf "\n * @see %s" "$js_file")
    fi

    # Using printf with variables. Ensure variables don't contain % unless intended.
    printf "/**\n * @summary %s%s\n * @creationDate %s\n *\n * @description\n * %s\n *%s\n * @todo %s\n */\n\n%s\n// --- Concrete type definitions start here ---\n\n\n\n// --- Concrete type definitions end here ---\n\nexport {}; // Ensures this file is treated as a module.\n" \
      "$current_summary" \
      "$module_tag" \
      "$current_creation_date" \
      "$current_description" \
      "$see_tag" \
      "$current_specific_todo" \
      "$current_suggested_imports"
}


# --- Main Execution ---

echo "# --- Generating commands (run from project root) ---"
echo "# Based on the explicit list provided."
echo "# Review these commands before executing."
echo "# Execute using: bash <(bash generate_ts_commands_from_list.sh)" # Assuming script saved with this name
echo ""

# Read the list of target .d.ts files from the heredoc
while IFS= read -r ts_file; do
    # Skip empty lines if any
    [[ -z "$ts_file" ]] && continue

    # Determine corresponding JS file (or handle global.d.ts)
    js_file=""
    if [[ "$ts_file" == "global.d.ts" ]]; then
        js_file="N/A" # Special case handled in get_file_info
    else
        # Derive JS file path from TS file path
        js_file="${ts_file%.d.ts}.js"
    fi

    # Get the specific info for this file
    # Pass both ts_file and derived js_file
    get_file_info "$js_file" "$ts_file" # Sets global vars: summary, description, specific_todo, suggested_imports

    # Generate the content for the .d.ts file
    content=$(generate_content "$js_file" "$summary" "$description" "$specific_todo" "$suggested_imports" "$creation_date")

    # Escape single quotes within the content for the outer printf command
    # escaped_content="${content//\'/\'\\\'\'}" # Replaces ' with '\''

    # # # Generate the final printf command for this file
    # # printf "printf '%s' > '%s'\n" "$escaped_content" $ts_file
    # # Write the content to the file
    # printf '%s' "$escaped_content" > "$ts_file"
    # # Write the content directly to the file without escaping
    # printf '%s' "$content" > "$ts_file"
  # Write the content to the file with proper escape sequence interpretation
    echo -e "$content" > "$ts_file"

done << 'EOF'
greenkeeper-prs/filterbranches.d.ts
website/theme.d.ts
website/utils/typography.d.ts
website/components/Navbar/index.d.ts
website/components/Navbar/utils/index.d.ts
website/components/Navbar/utils/makeSection.d.ts
website/components/Navbar/Item.d.ts
website/components/Navbar/Brand.d.ts
website/components/Navbar/Menu.d.ts
website/components/Version5.d.ts
website/components/GithubButton.d.ts
website/components/TwitterButton.d.ts
website/components/index.d.ts
website/components/Header.d.ts
website/components/Navigation.d.ts
website/components/Container.d.ts
website/components/Grid/widths.d.ts
website/components/Grid/index.d.ts
website/gatsby-config.d.ts
website/gatsby-node.d.ts
website/.eslintrc.d.ts
website/templates/template-doc-page.d.ts
website/templates/template-doc-layout.d.ts
website/data/navigation.d.ts
website/src/html.d.ts
website/src/layouts/components/Navbar.d.ts
website/src/layouts/default.d.ts
website/src/pages/404.d.ts
website/src/pages/index.d.ts
website/src/pages/components/home/ValueProps2.d.ts
website/src/pages/components/home/WhereNext.d.ts
website/src/pages/components/home/ValueProps.d.ts
website/src/pages/components/home/AdminInterface.d.ts
website/src/pages/components/home/Hero.d.ts
website/src/pages/components/home/CommunityResponse.d.ts
website/src/pages/components/home/Footer.d.ts
build.d.ts
admin/server/middleware/browserify.d.ts
admin/server/middleware/apiError.d.ts
admin/server/middleware/logError.d.ts
admin/server/middleware/initList.d.ts
admin/server/app/createDynamicRouter.d.ts
admin/server/app/createHealthchecksHandler.d.ts
admin/server/app/createStaticRouter.d.ts
admin/server/index.d.ts
admin/server/api/download.d.ts
admin/server/api/s3.d.ts
admin/server/api/cloudinary.d.ts
admin/server/api/item/update.d.ts
admin/server/api/item/get.d.ts
admin/server/api/item/sortOrder.d.ts
admin/server/api/counts.d.ts
admin/server/api/list/download.d.ts
admin/server/api/list/update.d.ts
admin/server/api/list/delete.d.ts
admin/server/api/list/create.d.ts
admin/server/api/list/get.d.ts
admin/server/api/session/signin.d.ts
admin/server/api/session/signout.d.ts
admin/server/api/session/get.d.ts
admin/server/routes/index.d.ts
admin/server/routes/signin.d.ts
admin/server/routes/signout.d.ts
admin/public/js/packages.d.ts
admin/public/js/content/editor.d.ts
admin/public/js/lib/codemirror/codemirror-compressed.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-angular.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-validate.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-ui.d.ts
admin/public/js/lib/jqueryfileupload/main.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-jquery-ui.d.ts
admin/public/js/lib/jqueryfileupload/cors/jquery.xdr-transport.d.ts
admin/public/js/lib/jqueryfileupload/cors/jquery.postmessage-transport.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-video.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-image.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-process.d.ts
admin/public/js/lib/jqueryfileupload/jquery.iframe-transport.d.ts
admin/public/js/lib/jqueryfileupload/jquery.fileupload-audio.d.ts
admin/public/js/lib/jqueryfileupload/app.d.ts
admin/public/js/lib/jqueryfileupload/vendor/jquery.ui.widget.d.ts
admin/public/js/lib/jquery/jquery-1.10.2.d.ts
admin/public/js/lib/jquery/jquery-1.10.2.min.d.ts
admin/public/js/lib/cloudinary/jquery.cloudinary.d.ts
admin/client/constants.d.ts
admin/client/App/parsers/tests/index.test.d.ts
admin/client/App/parsers/index.d.ts
admin/client/App/parsers/filters.d.ts
admin/client/App/store.d.ts
admin/client/App/index.d.ts
admin/client/App/shared/Kbd.d.ts
admin/client/App/shared/FlashMessage.d.ts
admin/client/App/shared/InvalidFieldType.d.ts
admin/client/App/shared/AlertMessages.d.ts
admin/client/App/shared/ConfirmationDialog.d.ts
admin/client/App/shared/Portal.d.ts
admin/client/App/shared/FlashMessages.d.ts
admin/client/App/shared/CreateForm.d.ts
admin/client/App/shared/Popout/PopoutPane.d.ts
admin/client/App/shared/Popout/index.d.ts
admin/client/App/shared/Popout/PopoutHeader.d.ts
admin/client/App/shared/Popout/PopoutListHeading.d.ts
admin/client/App/shared/Popout/PopoutListItem.d.ts
admin/client/App/shared/Popout/PopoutList.d.ts
admin/client/App/shared/Popout/PopoutBody.d.ts
admin/client/App/shared/Popout/PopoutFooter.d.ts
admin/client/App/screens/Home/constants.d.ts
admin/client/App/screens/Home/reducer.d.ts
admin/client/App/screens/Home/actions.d.ts
admin/client/App/screens/Home/index.d.ts
admin/client/App/screens/Home/utils/getRelatedIconClass.d.ts
admin/client/App/screens/Home/components/Section.d.ts
admin/client/App/screens/Home/components/Lists.d.ts
admin/client/App/screens/Home/components/ListTile.d.ts
admin/client/App/screens/Item/constants.d.ts
admin/client/App/screens/Item/reducer.d.ts
admin/client/App/screens/Item/actions.d.ts
admin/client/App/screens/Item/index.d.ts
admin/client/App/screens/Item/components/AltText.d.ts
admin/client/App/screens/Item/components/DrilldownItem.d.ts
admin/client/App/screens/Item/components/FormHeading.d.ts
admin/client/App/screens/Item/components/EditForm.d.ts
admin/client/App/screens/Item/components/Toolbar/index.d.ts
admin/client/App/screens/Item/components/Toolbar/ToolbarSection.d.ts
admin/client/App/screens/Item/components/RelatedItemsList/RelatedItemsListDragDrop.d.ts
admin/client/App/screens/Item/components/RelatedItemsList/RelatedItemsList.d.ts
admin/client/App/screens/Item/components/RelatedItemsList/RelatedItemsListRow.d.ts
admin/client/App/screens/Item/components/EditFormHeader.d.ts
admin/client/App/screens/Item/components/FooterBar.d.ts
admin/client/App/screens/Item/components/Drilldown.d.ts
admin/client/App/screens/Item/components/EditFormHeaderSearch.d.ts
admin/client/App/screens/List/constants.d.ts
admin/client/App/screens/List/index.d.ts
admin/client/App/screens/List/components/ListHeaderToolbar.d.ts
admin/client/App/screens/List/components/ItemsTable/ItemsTableRow.d.ts
admin/client/App/screens/List/components/ItemsTable/ItemsTable.d.ts
admin/client/App/screens/List/components/ItemsTable/ItemsTableDragDropZoneTarget.d.ts
admin/client/App/screens/List/components/ItemsTable/ItemsTableDragDrop.d.ts
admin/client/App/screens/List/components/ItemsTable/ItemsTableDragDropZone.d.ts
admin/client/App/screens/List/components/Filtering/getFilterLabel.d.ts
admin/client/App/screens/List/components/Filtering/ListFiltersAdd.d.ts
admin/client/App/screens/List/components/Filtering/ListFiltersAddForm.d.ts
admin/client/App/screens/List/components/Filtering/Filter.d.ts
admin/client/App/screens/List/components/Filtering/ListFilters.d.ts
admin/client/App/screens/List/components/ListControl.d.ts
admin/client/App/screens/List/components/ListColumnsForm.d.ts
admin/client/App/screens/List/components/ListManagement.d.ts
admin/client/App/screens/List/components/ListHeaderButton.d.ts
admin/client/App/screens/List/components/ListHeaderSearch.d.ts
admin/client/App/screens/List/components/ListHeaderTitle.d.ts
admin/client/App/screens/List/components/UpdateForm.d.ts
admin/client/App/screens/List/components/ListDownloadForm.d.ts
admin/client/App/screens/List/components/ListSort.d.ts
admin/client/App/screens/List/actions/dragdrop.d.ts
admin/client/App/screens/List/actions/index.d.ts
admin/client/App/screens/List/actions/items.d.ts
admin/client/App/screens/List/actions/active.d.ts
admin/client/App/screens/List/reducers/main.d.ts
admin/client/App/screens/List/reducers/active.d.ts
admin/client/App/sagas/index.d.ts
admin/client/App/sagas/queryParamsSagas.d.ts
admin/client/App/components/Footer/index.d.ts
admin/client/App/components/Navigation/Mobile/SectionItem.d.ts
admin/client/App/components/Navigation/Mobile/ListItem.d.ts
admin/client/App/components/Navigation/Mobile/index.d.ts
admin/client/App/components/Navigation/Primary/NavItem.d.ts
admin/client/App/components/Navigation/Primary/index.d.ts
admin/client/App/components/Navigation/Secondary/NavItem.d.ts
admin/client/App/components/Navigation/Secondary/index.d.ts
admin/client/App/elemental/ScreenReaderOnly/index.d.ts
admin/client/App/elemental/FormSelect/index.d.ts
admin/client/App/elemental/FormSelect/styles.d.ts
admin/client/App/elemental/BlankState/index.d.ts
admin/client/App/elemental/Pagination/page.d.ts
admin/client/App/elemental/Pagination/index.d.ts
admin/client/App/elemental/Form/index.d.ts
admin/client/App/elemental/Form/styles.d.ts
admin/client/App/elemental/PassContext/index.d.ts
admin/client/App/elemental/Portal/index.d.ts
admin/client/App/elemental/GlyphField/index.d.ts
admin/client/App/elemental/ResponsiveText/index.d.ts
admin/client/App/elemental/Alert/index.d.ts
admin/client/App/elemental/Alert/colors.d.ts
admin/client/App/elemental/Alert/styles.d.ts
admin/client/App/elemental/LoadingButton/index.d.ts
admin/client/App/elemental/Center/index.d.ts
admin/client/App/elemental/Center/styles.d.ts
admin/client/App/elemental/FormInput/index.d.ts
admin/client/App/elemental/FormInput/noedit.d.ts
admin/client/App/elemental/FormInput/styles.d.ts
admin/client/App/elemental/Chip/index.d.ts
admin/client/App/elemental/Chip/colors.d.ts
admin/client/App/elemental/Chip/styles.d.ts
admin/client/App/elemental/index.d.ts
admin/client/App/elemental/FormField/index.d.ts
admin/client/App/elemental/FormField/styles.d.ts
admin/client/App/elemental/Spinner/sizes.d.ts
admin/client/App/elemental/Spinner/index.d.ts
admin/client/App/elemental/Spinner/colors.d.ts
admin/client/App/elemental/Spinner/styles.d.ts
admin/client/App/elemental/FormLabel/index.d.ts
admin/client/App/elemental/FormLabel/styles.d.ts
admin/client/App/elemental/FormNote/index.d.ts
admin/client/App/elemental/FormNote/styles.d.ts
admin/client/App/elemental/GridCol/index.d.ts
admin/client/App/elemental/Container/sizes.d.ts
admin/client/App/elemental/Container/index.d.ts
admin/client/App/elemental/Container/styles.d.ts
admin/client/App/elemental/GlyphButton/index.d.ts
admin/client/App/elemental/Button/index.d.ts
admin/client/App/elemental/Button/styles.d.ts
admin/client/App/elemental/SegmentedControl/index.d.ts
admin/client/App/elemental/SegmentedControl/colors.d.ts
admin/client/App/elemental/SegmentedControl/styles.d.ts
admin/client/App/elemental/Glyph/sizes.d.ts
admin/client/App/elemental/Glyph/index.d.ts
admin/client/App/elemental/Glyph/colors.d.ts
admin/client/App/elemental/Glyph/styles.d.ts
admin/client/App/elemental/Glyph/octicons.d.ts
admin/client/App/elemental/Modal/dialog.d.ts
admin/client/App/elemental/Modal/index.d.ts
admin/client/App/elemental/Modal/header.d.ts
admin/client/App/elemental/Modal/body.d.ts
admin/client/App/elemental/Modal/footer.d.ts
admin/client/App/elemental/ScrollLock/index.d.ts
admin/client/App/elemental/DropdownButton/index.d.ts
admin/client/App/elemental/GridRow/index.d.ts
admin/client/App/elemental/LabelledControl/index.d.ts
admin/client/App/elemental/LabelledControl/styles.d.ts
admin/client/App/elemental/InlineGroup/index.d.ts
admin/client/App/elemental/Grid/index.d.ts
admin/client/App/elemental/InlineGroupSection/index.d.ts
admin/client/App/elemental/InlineGroupSection/styles.d.ts
admin/client/App/App.d.ts
admin/client/packages.d.ts
admin/client/theme.d.ts
admin/client/utils/cloudinaryResize.d.ts
admin/client/utils/queryParams.d.ts
admin/client/utils/List.d.ts
admin/client/utils/lists.d.ts
admin/client/utils/color.d.ts
admin/client/utils/string.d.ts
admin/client/utils/css.d.ts
admin/client/utils/concatClassnames.d.ts
admin/client/Signin/index.d.ts
admin/client/Signin/Signin.d.ts
admin/client/Signin/components/Alert.d.ts
admin/client/Signin/components/Brand.d.ts
admin/client/Signin/components/LoginForm.d.ts
admin/client/Signin/components/UserInfo.d.ts
index.d.ts
server/bindIPRestrictions.d.ts
server/startSecureServer.d.ts
server/startSocketServer.d.ts
server/initViewEngine.d.ts
server/bindRedirectsHandler.d.ts
server/initLetsEncrypt.d.ts
server/initSslRedirect.d.ts
server/bindSassMiddleware.d.ts
server/initViewLocals.d.ts
server/startHTTPServer.d.ts
server/bindStaticMiddleware.d.ts
server/createApp.d.ts
server/bindSessionMiddleware.d.ts
server/bindBodyParser.d.ts
server/bindErrorHandlers.d.ts
server/bindStylusMiddleware.d.ts
server/initTrustProxy.d.ts
server/bindLessMiddleware.d.ts
lib/middleware/cors.d.ts
lib/middleware/api.d.ts
lib/middleware/language.d.ts
lib/safeRequire.d.ts
lib/updates.d.ts
lib/core/closeDatabaseConnection.d.ts
lib/core/redirect.d.ts
lib/core/start.d.ts
lib/core/initDatabaseConfig.d.ts
lib/core/initExpressApp.d.ts
lib/core/createItems.d.ts
lib/core/openDatabaseConnection.d.ts
lib/core/options.d.ts
lib/core/initNav.d.ts
lib/core/importer.d.ts
lib/core/list.d.ts
lib/core/init.d.ts
lib/core/populateRelated.d.ts
lib/core/createRouter.d.ts
lib/core/wrapHTMLError.d.ts
lib/core/createKeystoneHash.d.ts
lib/core/initExpressSession.d.ts
lib/core/getOrphanedLists.d.ts
lib/updateHandler.d.ts
lib/session.d.ts
lib/security/frameGuard.d.ts
lib/security/ipRangeRestrict.d.ts
lib/security/csrf.d.ts
lib/security/escapeValueForExcel.d.ts
lib/schemaPlugins/sortable.d.ts
lib/schemaPlugins/options/transform.d.ts
lib/schemaPlugins/track.d.ts
lib/schemaPlugins/methods/getRelated.d.ts
lib/schemaPlugins/methods/populateRelated.d.ts
lib/schemaPlugins/autokey.d.ts
lib/schemaPlugins/history.d.ts
lib/content/types/html.d.ts
lib/content/types/index.d.ts
lib/content/types/text.d.ts
lib/content/type.d.ts
lib/content/page.d.ts
lib/content/index.d.ts
lib/fieldTypes.d.ts
lib/list.d.ts
lib/storage/index.d.ts
lib/storage/adapters/fs/index.d.ts
lib/uploads.d.ts
lib/list/getDocumentName.d.ts
lib/list/expandColumns.d.ts
lib/list/addFiltersToQuery.d.ts
lib/list/getData.d.ts
lib/list/processFilters.d.ts
lib/list/addSearchToQuery.d.ts
lib/list/field.d.ts
lib/list/getOptions.d.ts
lib/list/paginate.d.ts
lib/list/apiForGet.d.ts
lib/list/relationship.d.ts
lib/list/register.d.ts
lib/list/getAdminURL.d.ts
lib/list/underscoreMethod.d.ts
lib/list/add.d.ts
lib/list/ensureTextIndex.d.ts
lib/list/expandSort.d.ts
lib/list/set.d.ts
lib/list/getCSVData.d.ts
lib/list/automap.d.ts
lib/list/getSearchFilters.d.ts
lib/list/declaresTextIndex.d.ts
lib/list/selectColumns.d.ts
lib/list/isReserved.d.ts
lib/list/getPages.d.ts
lib/list/expandPaths.d.ts
lib/list/updateItem.d.ts
lib/list/map.d.ts
lib/list/buildSearchTextIndex.d.ts
lib/list/getUniqueValue.d.ts
lib/path.d.ts
lib/view.d.ts
lib/schemaPlugins.d.ts
lib/email.d.ts
fields/types/s3file/S3FileType.d.ts
fields/types/s3file/S3FileField.d.ts
fields/types/s3file/S3FileFilter.d.ts
fields/types/s3file/S3FileColumn.d.ts
fields/types/password/PasswordField.d.ts
fields/types/password/PasswordFilter.d.ts
fields/types/password/PasswordType.d.ts
fields/types/password/PasswordColumn.d.ts
fields/types/Type.d.ts
fields/types/textarray/TextArrayType.d.ts
fields/types/textarray/TextArrayField.d.ts
fields/types/textarray/TextArrayColumn.d.ts
fields/types/textarray/TextArrayFilter.d.ts
fields/types/file/FileType.d.ts
fields/types/file/FileField.d.ts
fields/types/file/FileFilter.d.ts
fields/types/file/FileColumn.d.ts
fields/types/datetime/DatetimeField.d.ts
fields/types/datetime/DatetimeFilter.d.ts
fields/types/datetime/DatetimeColumn.d.ts
fields/types/datetime/DatetimeType.d.ts
fields/types/markdown/MarkdownFilter.d.ts
fields/types/markdown/MarkdownField.d.ts
fields/types/markdown/lib/bootstrap-markdown.d.ts
fields/types/markdown/MarkdownColumn.d.ts
fields/types/markdown/MarkdownType.d.ts
fields/types/location/LocationFilter.d.ts
fields/types/location/LocationColumn.d.ts
fields/types/location/LocationType.d.ts
fields/types/location/LocationField.d.ts
fields/types/color/transparent-swatch.d.ts
fields/types/color/colored-swatch.d.ts
fields/types/color/ColorColumn.d.ts
fields/types/color/ColorField.d.ts
fields/types/color/ColorType.d.ts
fields/types/color/ColorFilter.d.ts
fields/types/Field.d.ts
fields/types/date/DateColumn.d.ts
fields/types/date/DateFilter.d.ts
fields/types/date/DateField.d.ts
fields/types/date/DateType.d.ts
fields/types/geopoint/GeoPointType.d.ts
fields/types/geopoint/GeoPointField.d.ts
fields/types/geopoint/GeoPointColumn.d.ts
fields/types/geopoint/GeoPointFilter.d.ts
fields/types/code/CodeField.d.ts
fields/types/code/CodeType.d.ts
fields/types/code/CodeFilter.d.ts
fields/types/code/CodeColumn.d.ts
fields/types/html/HtmlColumn.d.ts
fields/types/html/HtmlFilter.d.ts
fields/types/html/HtmlField.d.ts
fields/types/html/HtmlType.d.ts
fields/types/embedly/EmbedlyType.d.ts
fields/types/embedly/EmbedlyFilter.d.ts
fields/types/embedly/EmbedlyField.d.ts
fields/types/embedly/EmbedlyColumn.d.ts
fields/types/key/KeyColumn.d.ts
fields/types/key/KeyType.d.ts
fields/types/key/KeyFilter.d.ts
fields/types/key/KeyField.d.ts
fields/types/url/UrlField.d.ts
fields/types/url/UrlColumn.d.ts
fields/types/url/UrlType.d.ts
fields/types/url/UrlFilter.d.ts
fields/types/number/NumberField.d.ts
fields/types/number/NumberType.d.ts
fields/types/number/NumberColumn.d.ts
fields/types/number/NumberFilter.d.ts
fields/types/relationship/RelationshipFilter.d.ts
fields/types/relationship/RelationshipColumn.d.ts
fields/types/relationship/RelationshipType.d.ts
fields/types/relationship/RelationshipField.d.ts
fields/types/textarea/TextareaType.d.ts
fields/types/textarea/TextareaColumn.d.ts
fields/types/textarea/TextareaFilter.d.ts
fields/types/textarea/TextareaField.d.ts
fields/types/money/MoneyColumn.d.ts
fields/types/money/MoneyFilter.d.ts
fields/types/money/MoneyType.d.ts
fields/types/money/MoneyField.d.ts
fields/types/boolean/BooleanFilter.d.ts
fields/types/boolean/BooleanField.d.ts
fields/types/boolean/BooleanType.d.ts
fields/types/boolean/BooleanColumn.d.ts
fields/types/cloudinaryimages/CloudinaryImagesThumbnail.d.ts
fields/types/cloudinaryimages/CloudinaryImagesFilter.d.ts
fields/types/cloudinaryimages/CloudinaryImagesType.d.ts
fields/types/cloudinaryimages/CloudinaryImagesColumn.d.ts
fields/types/cloudinaryimages/CloudinaryImagesField.d.ts
fields/types/azurefile/AzureFileColumn.d.ts
fields/types/azurefile/AzureFileType.d.ts
fields/types/azurefile/AzureFileFilter.d.ts
fields/types/azurefile/AzureFileField.d.ts
fields/types/numberarray/NumberArrayFilter.d.ts
fields/types/numberarray/NumberArrayField.d.ts
fields/types/numberarray/NumberArrayType.d.ts
fields/types/numberarray/NumberArrayColumn.d.ts
fields/types/localfiles/LocalFilesColumn.d.ts
fields/types/localfiles/LocalFilesFilter.d.ts
fields/types/localfiles/LocalFilesType.d.ts
fields/types/localfiles/LocalFilesField.d.ts
fields/types/text/TextFilter.d.ts
fields/types/text/TextColumn.d.ts
fields/types/text/TextField.d.ts
fields/types/text/TextType.d.ts
fields/types/select/SelectColumn.d.ts
fields/types/select/SelectFilter.d.ts
fields/types/select/SelectType.d.ts
fields/types/select/SelectField.d.ts
fields/types/datearray/DateArrayFilter.d.ts
fields/types/datearray/DateArrayType.d.ts
fields/types/datearray/DateArrayColumn.d.ts
fields/types/datearray/DateArrayField.d.ts
fields/types/localfile/LocalFileFilter.d.ts
fields/types/localfile/LocalFileType.d.ts
fields/types/localfile/LocalFileColumn.d.ts
fields/types/localfile/LocalFileField.d.ts
fields/types/name/NameColumn.d.ts
fields/types/name/NameField.d.ts
fields/types/name/NameFilter.d.ts
fields/types/name/NameType.d.ts
fields/types/cloudinaryimage/CloudinaryImageFilter.d.ts
fields/types/cloudinaryimage/CloudinaryImageField.d.ts
fields/types/cloudinaryimage/CloudinaryImageColumn.d.ts
fields/types/cloudinaryimage/CloudinaryImageType.d.ts
fields/types/email/EmailFilter.d.ts
fields/types/email/EmailColumn.d.ts
fields/types/email/EmailType.d.ts
fields/types/email/EmailField.d.ts
fields/mixins/ArrayField.d.ts
fields/explorer/server.d.ts
fields/explorer/index.d.ts
fields/explorer/components/FieldType.d.ts
fields/explorer/components/FieldSpec.d.ts
fields/explorer/components/Row.d.ts
fields/explorer/components/Col.d.ts
fields/utils/addPresenceToQuery.d.ts
fields/utils/definePrototypeGetters.d.ts
fields/utils/bindFunctions.d.ts
fields/utils/evalDependsOn.d.ts
global.d.ts
# --- END OF LIST ---
EOF

echo ""
echo "# --- End of commands ---"