#!/bin/bash

# Script to preprocess all .epub files in the 'apps/api/src/epub/' directory
# This script is intended to be run from the 'apps/api/' directory,
# and it assumes 'preprocess-epub' is defined in 'apps/api/package.json'.

# Relative path from apps/api/ to the EPUBs directory
DATA_DIR="./src/epub/data/"
# The npm script name defined in apps/api/package.json
SCRIPT_NAME="preprocess-epub"

echo "DEBUG: Script starting. Current directory: $(pwd)"
echo "DEBUG: DATA_DIR is set to: $DATA_DIR"
ABSOLUTE_DATA_DIR=$(realpath "$DATA_DIR" 2>/dev/null || echo "Failed to resolve $DATA_DIR")
echo "DEBUG: DATA_DIR resolves to absolute path: $ABSOLUTE_DATA_DIR"

# Check if the data directory exists
if [ ! -d "$DATA_DIR" ]; then
  echo "Error: Directory $DATA_DIR (resolved to $ABSOLUTE_DATA_DIR) does not exist." >&2
  echo "Please ensure EPUB files are in $DATA_DIR." >&2
  exit 1
fi
echo "DEBUG: Data directory $DATA_DIR exists."

# Check if there are any .epub files and list them for debugging
echo "DEBUG: Checking for .epub files in $DATA_DIR..."
FOUND_FILES=$(find "$DATA_DIR" -maxdepth 1 -name '*.epub')

if [ -z "$FOUND_FILES" ]; then
  echo "No .epub files found in $DATA_DIR (resolved to $ABSOLUTE_DATA_DIR)." >&2
  exit 0
else
  echo "DEBUG: Found the following .epub files:"
  echo "$FOUND_FILES"
fi

echo "Starting EPUB preprocessing from apps/api/..."

# Find all .epub files in the data directory and process them
echo "DEBUG: About to enter processing loop."

find "$DATA_DIR" -maxdepth 1 -name '*.epub' -print0 | while IFS= read -r -d $'\0' epub_file_path; do
  echo "DEBUG: LOOP_ENTERED - Processing file from find: $epub_file_path"
  echo "---------------------------------------------------"
  echo "Processing: $epub_file_path"
  echo "---------------------------------------------------"
  
  if npm run "$SCRIPT_NAME" -- "$epub_file_path"; then
    echo "Successfully processed $epub_file_path"
  else
    echo "Error processing $epub_file_path. See output above for details." >&2
    # exit 1 # Uncomment to stop on first error
  fi
  echo ""
  echo "---------------------------------------------------"
  echo ""
done

echo "DEBUG: Exited processing loop."
echo "All .epub files processed." 