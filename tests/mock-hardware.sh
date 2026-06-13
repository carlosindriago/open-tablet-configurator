#!/bin/bash
# 🧪 Open Graphic Tablet Configurator - Hardware Mocks

export MOCK_LOG="/tmp/xsetwacom_mock.log"

# Clean previous log
rm -f "$MOCK_LOG"

xsetwacom() {
    case "$1" in
        --list)
            # Default to Intuos Pro if no env var is set
            echo -e "${WACOM_MOCK_DEVICE:-Wacom Intuos Pro M Pen stylus \t id: 10 \t type: STYLUS}"
            if [ -n "$WACOM_MOCK_ERASER" ]; then
                echo -e "Wacom Intuos Pro M Pen eraser \t id: 11 \t type: ERASER"
            fi
            ;;
        --set)
            echo "SET: $*" >> "$MOCK_LOG"
            ;;
        --get)
            echo "${WACOM_MOCK_GET_RESULT:-Absolute}"
            ;;
    esac
}

notify-send() {
    echo "NOTIFY: $*" >> "$MOCK_LOG"
}

export -f xsetwacom
export -f notify-send
