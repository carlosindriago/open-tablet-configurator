#!/bin/bash
# ============================================================
# 🚀 Open Tablet Configurator - One-Line Installer
# 
# Instalación rápida con un solo comando:
#   wget -qO- https://raw.githubusercontent.com/carlosindriago/open-tablet-configurator/main/setup.sh | bash
#   # o
#   curl -fsSL https://raw.githubusercontent.com/carlosindriago/open-tablet-configurator/main/setup.sh | bash
#
# Este script:
#   1. Detecta dependencias faltantes
#   2. Clona el repositorio
#   3. Ejecuta el instalador TUI
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Config
REPO_URL="https://github.com/carlosindriago/open-tablet-configurator.git"
INSTALL_DIR="$HOME/.open-tablet-configurator"
BRANCH="${WACOM_BRANCH:-main}"

# Print functions
print_header() {
    echo -e "\n${CYAN}${BOLD}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}${BOLD}║${NC}  ${BOLD}🎨 Wacom Linux - Instalador Automático${NC}                  ${CYAN}${BOLD}║${NC}"
    echo -e "${CYAN}${BOLD}║${NC}  ${GREEN}Configuración universal para tabletas Wacom${NC}             ${CYAN}${BOLD}║${NC}"
    echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════════╝${NC}\n"
}

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

# Cleanup on error
cleanup() {
    print_error "La instalación falló. Limpiando..."
    rm -rf "$INSTALL_DIR" 2>/dev/null || true
    exit 1
}

trap cleanup ERR INT TERM

# ============================================================
# MAIN INSTALLATION
# ============================================================

print_header

# Check for X11 session
print_step "Verificando sesión gráfica..."
if [ -n "$XDG_SESSION_TYPE" ] && [ "$XDG_SESSION_TYPE" != "x11" ]; then
    print_error "Wayland detectado. Este script requiere X11."
    echo -e "\n${YELLOW}Para usar Wacom Linux, cambiá a una sesión X11:${NC}"
    echo -e "  1. Cerrá sesión"
    echo -e "  2. En el login, seleccioná 'Xfce' o 'Xorg'"
    echo -e "  3. Ejecutá el instalador nuevamente\n"
    exit 1
fi
print_success "Sesión X11 detectada"

# Check essential tools
print_step "Verificando dependencias esenciales..."
missing_deps=()

if ! command -v git &> /dev/null; then
    missing_deps+=(git)
fi

if ! command -v whiptail &> /dev/null; then
    missing_deps+=(whiptail)
fi

if ! command -v xsetwacom &> /dev/null; then
    missing_deps+=(xserver-xorg-input-wacom)
fi

if [ ${#missing_deps[@]} -gt 0 ]; then
    echo -e "${YELLOW}Faltan dependencias: ${missing_deps[*]}${NC}"
    echo -e "${BLUE}Instalando...${NC}"
    
    if command -v apt &> /dev/null; then
        sudo apt update && sudo apt install -y "${missing_deps[@]}"
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y "${missing_deps[@]}"
    elif command -v pacman &> /dev/null; then
        sudo pacman -S --noconfirm "${missing_deps[@]}"
    else
        print_error "No se pudo instalar dependencias. Instalá manualmente: ${missing_deps[*]}"
        exit 1
    fi
fi
print_success "Dependencias instaladas"

# Remove existing installation if present
if [ -d "$INSTALL_DIR" ]; then
    print_step "Actualizando instalación existente..."
    rm -rf "$INSTALL_DIR"
fi

# Clone repository
print_step "Descargando Wacom Linux..."
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$INSTALL_DIR"
print_success "Repositorio clonado en $INSTALL_DIR"

# Enter directory
cd "$INSTALL_DIR"

# Show what we're installing
echo -e "\n${CYAN}${BOLD}📦 Contenido del paquete:${NC}"
echo -e "  ${GREEN}•${NC} Scripts de configuración universal"
echo -e "  ${GREEN}•${NC} Multi-acción para botones (1 tap = toggle, 2 taps = copiar, 3 taps = pegar)"
echo -e "  ${GREEN}•${NC} Toggle zurdo/diestro con atajo de teclado"
echo -e "  ${GREEN}•${NC} Dashboard GUI (Electron + React)"
echo -e "  ${GREEN}•${NC} Integración con XFCE/Openbox"

# Ask if user wants to proceed
echo -e "\n${BOLD}¿Deseás continuar con la instalación interactiva?${NC}"
echo -e "(${GREEN}s${NC}/${RED}n${NC}): \c"
read -r response

case "$response" in
    [sS]|[yY]|[sS][iI]|[yY][eE][sS])
        # Run the main installer
        print_step "Iniciando configuración interactiva..."
        chmod +x install.sh
        exec bash install.sh
        ;;
    *)
        # Just install scripts without TUI
        print_step "Instalación rápida sin configuración interactiva..."
        
        # Make scripts executable
        chmod +x "$INSTALL_DIR"/scripts/core/*.sh
        chmod +x "$INSTALL_DIR"/scripts/udev/*.sh
        chmod +x "$INSTALL_DIR"/scripts/utils/*.sh
        
        # Create default settings
        cat <<EOF > "$HOME/.wacom_settings.env"
# Wacom Settings (Quick Install - Default)
ROTATION="none"
BUTTON_2="3"
BUTTON_3="key F10"
SCREEN="ALL"
PRESSURE_CURVE="0 20 80 100"
EOF
        
        # udev rule
        echo "ACTION==\"add\", SUBSYSTEM==\"usb\", ATTRS{idVendor}==\"056a\", RUN+=\"$INSTALL_DIR/scripts/udev/wacom-udev-trigger.sh\"" | sudo tee /etc/udev/rules.d/99-wacom.rules > /dev/null
        sudo udevadm control --reload-rules && sudo udevadm trigger
        
        # Autostart
        mkdir -p "$HOME/.config/autostart"
        cat <<EOF > "$HOME/.config/autostart/wacom-config.desktop"
[Desktop Entry]
Type=Application
Exec=$INSTALL_DIR/scripts/core/wacom-config.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=Wacom Universal Config
EOF
        
        # Apply now if possible
        if [ -n "$DISPLAY" ]; then
            bash "$INSTALL_DIR/scripts/core/wacom-config.sh"
            print_success "Configuración aplicada"
        fi
        
        print_success "Instalación completada"
        echo -e "\n${CYAN}${BOLD}🎉 ¡Instalación rápida completada!${NC}"
        echo -e "\n${YELLOW}Configuración por defecto aplicada:${NC}"
        echo -e "  ${GREEN}•${NC} Orientación: Diestro (sin rotación)"
        echo -e "  ${GREEN}•${NC} Pantalla: Todas"
        echo -e "  ${GREEN}•${NC} Botón: Multi-acción"
        echo -e "\n${BLUE}Para personalizar, ejecutá:${NC}"
        echo -e "  ${BOLD}cd $INSTALL_DIR && ./install.sh${NC}"
        echo -e "\n${BLUE}Para lanzar el Dashboard GUI:${NC}"
        echo -e "  ${BOLD}cd $INSTALL_DIR/dashboard && npm install && npm run dev${NC}"
        ;;
esac

echo -e "\n${GREEN}${BOLD}¡Gracias por usar Wacom Linux!${NC}"
echo -e "${CYAN}Documentación: https://github.com/carlosindriago/open-tablet-configurator${NC}\n"
