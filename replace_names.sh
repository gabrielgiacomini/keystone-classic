#!/bin/bash

# Script to prefix KeystoneJS v4 custom types in index.d.ts with 'Keystone'
# WARNING: This script modifies the file in-place. Ensure you have a backup!

# --- Configuration ---
TARGET_FILE="index.d.ts"
BACKUP_SUFFIX=".bak"
# For macOS, you might need SED_I_ARG="-i ''". For Linux, SED_I_ARG="-i".
SED_I_ARG="-i"
# --- End Configuration ---

# Check if target file exists
if [ ! -f "$TARGET_FILE" ]; then
  echo "Error: File '$TARGET_FILE' not found in current directory."
  exit 1
fi

# Check if sed is available
if ! command -v sed &> /dev/null; then
    echo "Error: 'sed' command could not be found. Please install sed."
    exit 1
fi

# Create a backup
BACKUP_FILE="$TARGET_FILE$BACKUP_SUFFIX"
cp "$TARGET_FILE" "$BACKUP_FILE"
if [ $? -ne 0 ]; then
  echo "Error: Failed to create backup file '$BACKUP_FILE'."
  exit 1
fi
echo "Backup created: $BACKUP_FILE"

echo "Applying replacements to $TARGET_FILE..."

# Function to apply sed command
apply_sed() {
  local search="$1"
  local replace="$2"
  # Use printf for pattern to handle potential special characters if needed later
  printf -v sed_cmd 's/\\b%s\\b/%s/g' "$search" "$replace"
  sed $SED_I_ARG "$sed_cmd" "$TARGET_FILE"
  if [ $? -ne 0 ]; then
      echo "Warning: 'sed' command might have failed for $search -> $replace."
      # Optionally exit on failure: exit 1
  fi
}

# --- Renaming Order: Specific interfaces/types first, then base types/aliases ---

# Specific Field Types (Options -> Interface -> Constructor -> Filter)
apply_sed "TextFieldOptions" "KeystoneTextFieldOptions"
apply_sed "TextField" "KeystoneTextField"
apply_sed "TextTypeConstructor" "KeystoneTextTypeConstructor"
apply_sed "TextFilter" "KeystoneTextFilter"

apply_sed "NumberFieldOptions" "KeystoneNumberFieldOptions"
apply_sed "NumberField" "KeystoneNumberField"
apply_sed "NumberTypeConstructor" "KeystoneNumberTypeConstructor"
apply_sed "NumberFilter" "KeystoneNumberFilter"

apply_sed "TextareaFieldOptions" "KeystoneTextareaFieldOptions"
apply_sed "TextareaField" "KeystoneTextareaField"
apply_sed "TextareaTypeConstructor" "KeystoneTextareaTypeConstructor"

apply_sed "BooleanFieldOptions" "KeystoneBooleanFieldOptions"
apply_sed "BooleanField" "KeystoneBooleanField"
apply_sed "BooleanTypeConstructor" "KeystoneBooleanTypeConstructor"
apply_sed "BooleanFilter" "KeystoneBooleanFilter"

apply_sed "SelectOption" "KeystoneSelectOption"
apply_sed "SelectFieldOptions" "KeystoneSelectFieldOptions"
apply_sed "SelectFilter" "KeystoneSelectFilter"
apply_sed "SelectField" "KeystoneSelectField"
apply_sed "SelectTypeConstructor" "KeystoneSelectTypeConstructor"

apply_sed "DateFieldOptions" "KeystoneDateFieldOptions"
apply_sed "DateTimeFieldOptions" "KeystoneDateTimeFieldOptions"
apply_sed "DateFilter" "KeystoneDateFilter" # Filter first
apply_sed "DateField" "KeystoneDateField"
apply_sed "DateTimeField" "KeystoneDateTimeField"
apply_sed "DateTypeConstructor" "KeystoneDateTypeConstructor"
apply_sed "DateTimeTypeConstructor" "KeystoneDateTimeTypeConstructor"

apply_sed "HtmlFieldOptions" "KeystoneHtmlFieldOptions"
apply_sed "HtmlField" "KeystoneHtmlField"
apply_sed "HtmlTypeConstructor" "KeystoneHtmlTypeConstructor"

# UI Elements
apply_sed "FieldUIElement" "KeystoneFieldUIElement"
apply_sed "HeadingUIElement" "KeystoneHeadingUIElement"
apply_sed "IndentUIElement" "KeystoneIndentUIElement"
apply_sed "OutdentUIElement" "KeystoneOutdentUIElement"
apply_sed "UIElement" "KeystoneUIElement" # Alias last

# List related
apply_sed "ListOptions" "KeystoneListOptions"
apply_sed "ListMappings" "KeystoneListMappings"
apply_sed "List" "KeystoneList" # Class name last among list items

# Base Field Types & Aliases
apply_sed "FieldOptions" "KeystoneFieldOptions"
apply_sed "FieldTypeConstructor" "KeystoneFieldTypeConstructor"
apply_sed "FieldDefinition" "KeystoneFieldDefinition" # Type alias
apply_sed "HeadingDefinition" "KeystoneHeadingDefinition" # Interface
apply_sed "Field" "KeystoneField" # Base interface last among field items

# App Options
apply_sed "KeystoneOptions" "KeystoneAppOptions"


echo "Replacements attempted."
echo "Please carefully review '$TARGET_FILE' for correctness using a diff tool against '$BACKUP_FILE'."
echo "e.g., diff '$BACKUP_FILE' '$TARGET_FILE'"