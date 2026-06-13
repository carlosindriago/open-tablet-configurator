#!/bin/bash
# 🛠️ Open Graphic Tablet Configurator - Shared Library

# Colors
export BLUE='\033[0;34m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export RED='\033[0;31m'
export NC='\033[0m'
export CYAN='\033[0;36m'
export BOLD='\033[1m'

print_step() {
    echo -e "\n${BLUE}${BOLD}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

get_wacom_device() {
    xsetwacom --list devices 2>/dev/null | grep -i 'STYLUS' | head -1 | cut -f 1 | xargs
}
