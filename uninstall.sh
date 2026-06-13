#!/bin/bash
# 🧹 Open Graphic Tablet Configurator - Uninstaller
# Removes all scripts, rules, and configurations from the system

set -e

# Colors
BLUE='\033[0;34m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${RED}   🗑️  DESINSTALADOR OPEN GRAPHIC TABLET CONFIGURATOR              ${NC}"
echo -e "${BLUE}====================================================${NC}"

read -rp "¿Estás seguro de que deseas eliminar toda la configuración? [s/N]: " confirm
if [[ ! $confirm =~ ^[Ss]$ ]]; then
    echo "Operación cancelada."
    exit 0
fi

# 1. Eliminar scripts del HOME
echo -e "\n${BLUE}[1/4] Eliminando scripts del HOME...${NC}"
rm -f "$HOME/.wacom_config.sh"
rm -f "$HOME/.wacom_toggle.sh"
rm -f "$HOME/.wacom_udev_trigger.sh"
rm -f "$HOME/.wacom_button_logic.sh"
rm -f "$HOME/.wacom_rotation_toggle.sh"
rm -f "$HOME/.wacom_settings.env"
echo "✅ Archivos de configuración en HOME eliminados (legacy)."
echo "✅ Scripts y perfiles eliminados."

# 2. Eliminar regla de udev (Requiere SUDO)
echo -e "\n${BLUE}[2/4] Eliminando regla de sistema (udev)...${NC}"
RULE_PATH="/etc/udev/rules.d/99-wacom.rules"
if [ -f "$RULE_PATH" ]; then
    sudo rm -f "$RULE_PATH"
    sudo udevadm control --reload-rules
    sudo udevadm trigger
    echo "✅ Regla de udev eliminada y sistema recargado."
else
    echo "ℹ️  No se encontró la regla de udev."
fi

# 3. Eliminar Autostart
echo -e "\n${BLUE}[3/4] Eliminando inicio automático...${NC}"
AUTOSTART_FILE="$HOME/.config/autostart/wacom-config.desktop"
if [ -f "$AUTOSTART_FILE" ]; then
    rm -f "$AUTOSTART_FILE"
    echo "✅ Archivo de autostart eliminado."
else
    echo "ℹ️  No se encontró archivo de autostart."
fi

# 4. Limpieza Final
echo -e "\n${BLUE}[4/4] Restaurando valores de fábrica (si la tablet está conectada)...${NC}"
DEVICE=$(xsetwacom --list devices 2>/dev/null | grep -i 'STYLUS' | head -1 | cut -f 1 | xargs)
if [ -n "$DEVICE" ]; then
    xsetwacom --set "$DEVICE" Rotate none
    xsetwacom --set "$DEVICE" ResetParameters
    echo "✅ Valores de la tablet reseteados."
else
    echo "ℹ️  Tablet no detectada, no se requiere reseteo de hardware."
fi

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}   🎉 DESINSTALACIÓN COMPLETADA                    ${NC}"
echo -e "${BLUE}====================================================${NC}"
echo "El sistema ha quedado limpio. ¡Gracias por usar la herramienta!"
