#!/bin/bash

# Script to force apply XCConfig settings to Xcode project file
# macOS bash-3.2 safe (no associative arrays)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
XCCONFIG_FILE="${SCRIPT_DIR}/brandng.xcconfig"
PROJECT_FILE="${SCRIPT_DIR}/TragofoneNew.xcodeproj/project.pbxproj"
BACKUP_FILE="${PROJECT_FILE}.backup"

# colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

[ ! -f "$XCCONFIG_FILE" ] && echo -e "${RED}XCConfig not found${NC}" && exit 1
[ ! -f "$PROJECT_FILE" ] && echo -e "${RED}Project not found${NC}" && exit 1

echo "Parsing XCConfig file: $XCCONFIG_FILE"
echo ""

XCCONFIG_KEYS=()
XCCONFIG_VALS=()

while IFS= read -r line; do
  [[ "$line" =~ ^[[:space:]]*$ ]] && continue
  [[ "$line" =~ ^[[:space:]]*// ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ "$line" =~ include ]] && continue

  if [[ "$line" =~ = ]]; then
    key="${line%%=*}"
    val="${line#*=}"
    key=$(echo "$key" | xargs)
    val=$(echo "$val" | xargs)
    val="${val#\"}"
    val="${val%\"}"
    XCCONFIG_KEYS+=("$key")
    XCCONFIG_VALS+=("$val")
    echo "  $key = $val"
  fi
done < "$XCCONFIG_FILE"

# resolves $(VAR) inside string e.g. $(BRAND_NAME)App
resolve_variables() {
  local input="$1"
  while [[ "$input" =~ \$\(([A-Za-z0-9_]+)\) ]]; do
    ref="${BASH_REMATCH[1]}"
    rep="$ref"
    for i in "${!XCCONFIG_KEYS[@]}"; do
      if [ "${XCCONFIG_KEYS[$i]}" == "$ref" ]; then
        rep="${XCCONFIG_VALS[$i]}"
        break
      fi
    done
    input="${input//\$\($ref\)/$rep}"
  done
  echo "$input"
}

echo ""
echo "Applying settings to project file..."
cp "$PROJECT_FILE" "$BACKUP_FILE"
echo "Backup created at: $BACKUP_FILE"
echo ""

UPDATE_KEYS=()
UPDATE_VALS=()

add_update() {
  UPDATE_KEYS+=("$1")
  UPDATE_VALS+=("$2")
}

for i in "${!XCCONFIG_KEYS[@]}"; do
  key="${XCCONFIG_KEYS[$i]}"
  val="${XCCONFIG_VALS[$i]}"
  resolved="$(resolve_variables "$val")"
  case "$key" in
    APP_DISPLAY_NAME) add_update "INFOPLIST_KEY_CFBundleDisplayName" "$resolved" ;;
    PRODUCT_BUNDLE_IDENTIFIER) add_update "PRODUCT_BUNDLE_IDENTIFIER" "$resolved" ;;
    MARKETING_VERSION) add_update "MARKETING_VERSION" "$resolved" ;;
    CURRENT_PROJECT_VERSION) add_update "CURRENT_PROJECT_VERSION" "$resolved" ;;
    CODE_SIGN_ENTITLEMENTS) add_update "CODE_SIGN_ENTITLEMENTS" "$resolved" ;;
    CODE_SIGN_STYLE) add_update "CODE_SIGN_STYLE" "$resolved" ;;
    PRODUCT_NAME) add_update "PRODUCT_NAME" "$resolved" ;;
    DEVELOPMENT_TEAM) add_update "DEVELOPMENT_TEAM" "$resolved" ;;
  esac
done

changes_made=0

for i in "${!UPDATE_KEYS[@]}"; do
  k="${UPDATE_KEYS[$i]}"
  v="${UPDATE_VALS[$i]}"

  escaped_k=$(printf '%s\n' "$k" | sed 's/[][\.\*^$(){}|?+]/\\&/g')

  if grep -q "${k}[[:space:]]*=" "$PROJECT_FILE"; then
      # Escape for sed replacement string
      escaped_v=$(printf '%s\n' "$v" | sed -e 's/[&\\/]/\\&/g')
      
      # For CODE_SIGN_ENTITLEMENTS and PRODUCT_NAME, skip NotificationServiceExtension and ShareExtension
      if [ "$k" == "CODE_SIGN_ENTITLEMENTS" ] || [ "$k" == "PRODUCT_NAME" ]; then
          # Two-pass approach: first identify extension buildSettings blocks, then update
          # Pass 1: Identify which buildSettings blocks contain extension INFOPLIST_FILE
          awk '
          BEGIN { 
              in_build_settings = 0
              block_start_line = 0
          }
          /buildSettings[[:space:]]*=[[:space:]]*\{/ { 
              in_build_settings = 1
              block_start_line = NR
          }
          in_build_settings {
              if (/INFOPLIST_FILE.*NotificationServiceExtension|INFOPLIST_FILE.*ShareExtension/) {
                  print block_start_line
              }
              if (/^[[:space:]]*\};/) {
                  in_build_settings = 0
              }
          }
          ' "$PROJECT_FILE" > /tmp/extension_blocks.txt
          
          # Pass 2: Update CODE_SIGN_ENTITLEMENTS and PRODUCT_NAME, skipping extension blocks
          awk -v new_val="\"${v}\"" -v ext_blocks="/tmp/extension_blocks.txt" '
          BEGIN {
              # Read extension block start lines
              while ((getline line < ext_blocks) > 0) {
                  ext_block_starts[line] = 1
              }
              close(ext_blocks)
              in_build_settings = 0
              block_start_line = 0
          }
          /buildSettings[[:space:]]*=[[:space:]]*\{/ { 
              in_build_settings = 1
              block_start_line = NR
          }
          in_build_settings {
              if (/^[[:space:]]*\};/) {
                  in_build_settings = 0
              }
          }
          /CODE_SIGN_ENTITLEMENTS[[:space:]]*=/ {
              if (in_build_settings && ext_block_starts[block_start_line]) {
                  # Skip updating - this is for an extension
                  print
              } else {
                  # Update this CODE_SIGN_ENTITLEMENTS
                  sub(/CODE_SIGN_ENTITLEMENTS[[:space:]]*=[[:space:]]*"[^"]*";/, "CODE_SIGN_ENTITLEMENTS = " new_val ";")
                  print
              }
              next
          }
          /PRODUCT_NAME[[:space:]]*=/ {
              if (in_build_settings && ext_block_starts[block_start_line]) {
                  # Skip updating - this is for an extension
                  print
              } else {
                  # Update this PRODUCT_NAME (handle both quoted and unquoted values)
                  if (match($0, /PRODUCT_NAME[[:space:]]*=[[:space:]]*"[^"]*";/)) {
                      sub(/PRODUCT_NAME[[:space:]]*=[[:space:]]*"[^"]*";/, "PRODUCT_NAME = " new_val ";")
                  } else {
                      sub(/PRODUCT_NAME[[:space:]]*=[[:space:]]*[^;]*;/, "PRODUCT_NAME = " new_val ";")
                  }
                  print
              }
              next
          }
          { print }
          ' "$PROJECT_FILE" > "${PROJECT_FILE}.tmp" && mv "${PROJECT_FILE}.tmp" "$PROJECT_FILE"
          
          # Cleanup
          rm -f /tmp/extension_blocks.txt
      else
          sed -i '' -E "s/([[:space:]]${escaped_k}[[:space:]]=[[:space:]])[^;]*;/\1\"${escaped_v}\";/g" "$PROJECT_FILE"
      fi
      echo -e "  ${GREEN}✓${NC} Updated $k = $v"
      ((changes_made++))
  else
      echo -e "  ${YELLOW}-${NC} $k not found in project"
  fi
done

if [ $changes_made -gt 0 ]; then
  echo ""
  echo -e "${GREEN}✓ $changes_made values applied${NC}"
else
  echo ""
  echo -e "${YELLOW}No changes${NC}"
fi
