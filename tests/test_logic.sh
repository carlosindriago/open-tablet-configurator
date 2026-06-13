#!/bin/bash
# 🧪 Open Graphic Tablet Configurator - Advanced Logic Tester (CI-Safe)
# shellcheck disable=SC2329

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_SCRIPT="$REPO_DIR/.wacom_config.sh"
# shellcheck disable=SC1091
source "$REPO_DIR/tests/mock-hardware.sh"

echo "--- 🧪 INICIANDO ADVANCED LOGIC TESTS ---"

run_test() {
    local test_name="$1"
    local expected="$2"
    
    rm -f "$MOCK_LOG"
    bash "$CONFIG_SCRIPT" >/dev/null 2>&1 || true
    
    if [ -f "$MOCK_LOG" ] && grep -q "$expected" "$MOCK_LOG"; then
        echo -e "${GREEN}PASSED${NC}: $test_name"
    else
        echo -e "${RED}FAILED${NC}: $test_name"
        echo "Expected to find: $expected"
        [ -f "$MOCK_LOG" ] && cat "$MOCK_LOG" || echo "No se generó el log."
        exit 1
    fi
}

# ---------------------------------------------------------
# Test 1: Left-handed rotation (half)
# ---------------------------------------------------------
cat > "$HOME/.wacom_settings.env" << 'EOF'
ROTATION="half"
SCREEN="ALL"
PRESSURE_CURVE="0 20 80 100"
EOF
run_test "Left-handed rotation applies 'Rotate half'" "SET: Wacom Intuos Pro M Pen stylus Rotate half"

# ---------------------------------------------------------
# Test 2: Right-handed rotation (none)
# ---------------------------------------------------------
cat > "$HOME/.wacom_settings.env" << 'EOF'
ROTATION="none"
SCREEN="ALL"
EOF
run_test "Right-handed rotation applies 'Rotate none'" "SET: Wacom Intuos Pro M Pen stylus Rotate none"

# ---------------------------------------------------------
# Test 3: Specific screen mapping
# ---------------------------------------------------------
cat > "$HOME/.wacom_settings.env" << 'EOF'
ROTATION="none"
SCREEN="HDMI-1"
EOF
run_test "Maps to specific screen (HDMI-1)" "SET: Wacom Intuos Pro M Pen stylus MapToOutput HDMI-1"

# ---------------------------------------------------------
# Test 4: Web App compatibility defaults
# ---------------------------------------------------------
rm -f "$HOME/.wacom_settings.env"
run_test "Applies web-app compatible pressure curve by default" "SET: Wacom Intuos Pro M Pen stylus PressureCurve 0 0 100 100"

echo -e "\n${GREEN}✅ ¡TODOS LOS TESTS PASARON!${NC}"
rm -f "$MOCK_LOG" "$HOME/.wacom_settings.env"

