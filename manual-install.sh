#!/bin/bash
echo "═══════════════════════════════════════════════"
echo "  INSTALACIÓN MANUAL WACOM (FIX PRESIÓN/WEB)"
echo "═══════════════════════════════════════════════"
echo ""

# PASO 1: Copiar scripts
echo "📋 PASO 1: Copiando scripts de configuración..."
if ! command -v xsetwacom &> /dev/null; then
    echo "xserver-xorg-input-wacom no está instalado. Ejecuta:"
    echo "sudo apt install xserver-xorg-input-wacom"
    exit 1
fi
if ! cp -v .wacom_*.sh "$HOME/"; then
  echo "❌ Error: No se pudieron copiar los scripts"
  exit 1
fi
chmod +x "$HOME"/.wacom_*.sh
echo "✅ Scripts copiados a $HOME/.wacom_*.sh"
echo ""

# PASO 2: Eliminar regla conflictiva del sistema
echo "🔥 PASO 2: Eliminando regla conflictiva (69-wacom.rules)..."
sudo rm -f /etc/udev/rules.d/69-wacom.rules 2>/dev/null
echo "✅ Regla del sistema eliminada"
echo ""

# PASO 3: Crear regla udev personalizada
echo "⚙️  PASO 3: Creando regla personalizada (99-wacom.rules)..."
if ! sudo bash -c 'cat > /etc/udev/rules.d/99-wacom.rules << EOF
ACTION=="add", SUBSYSTEM=="usb", ATTRS{idVendor}=="056a", RUN+="/home/carlos/.wacom_udev_trigger.sh"
EOF'; then
  echo "❌ Error al crear regla udev"
  exit 1
fi
echo "✅ Regla creada: /etc/udev/rules.d/99-wacom.rules"
echo ""

# PASO 4: Recargar reglas
echo "🔄 PASO 4: Recargando reglas udev..."
sudo udevadm control --reload-rules
sudo udevadm trigger
echo "✅ Reglas recargadas"
echo ""

# PASO 5: Desconectar físicamente y reconectar
echo "🔄 PASO 5: IMPORTANTE: Desconectá y volvé a conectar"
echo "   la tableta USB físicamente AHORA"
echo ""
read -r -p "Presiona ENTER para salir..."
echo ""

# PASO 6: Esperar y verificar
echo "⏳ PASO 6: Esperando 5 segundos para que configure..."
sleep 5
echo ""

echo "📊 PASO 7: Verificando conexión..."
echo ""
if xsetwacom --list devices >/dev/null 2>&1; then
  xsetwacom --list devices
  echo ""
  echo "✅ Tableta detectada correctamente"
  echo ""
  echo "CONFIGURACIÓN ACTUAL:"
  xsetwacom --get 9 PressureCurve 2>/dev/null || echo "No se pudo obtener PressureCurve"
  xsetwacom --get 9 Threshold 2>/dev/null || echo "No se pudo obtener Threshold"
  echo ""
  echo "🎉 INSTALACIÓN COMPLETA"
  echo ""
  echo "Próximos pasos:"
  echo "1. Mover el stylus y verificar que el cursor sigue"
  echo "2. Si funciona, probar en Excalidraw"
  echo ""
else
  echo "⚠️  Tableta no detectada. Posibles causas:"
  echo "   - No está bien conectada"
  echo "   - El driver no cargó"
  echo "   - El ID cambió (no es 9)"
  echo ""
  xsetwacom --list devices 2>&1 || echo "xsetwacom falló"
fi

exit 0
