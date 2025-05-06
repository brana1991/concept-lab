#!/bin/bash

# Function to watch files and rebuild when changes are detected
watch_and_rebuild() {
  echo "Watching for changes in *.mjs files..."
  
  # Initial build
  ./rebuild.sh
  
  # Watch for changes
  while true; do
    CHANGED_FILES=$(find . -name "*.mjs" -mtime -1m -type f -print)
    
    if [ ! -z "$CHANGED_FILES" ]; then
      echo "Change detected in: $CHANGED_FILES"
      echo "Rebuilding..."
      ./rebuild.sh
    fi
    
    sleep 5
  done
}

# Make sure rebuild script is executable
chmod +x rebuild.sh

# Start watching
watch_and_rebuild 