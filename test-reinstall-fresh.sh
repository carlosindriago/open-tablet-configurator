#!/bin/bash
echo "═══════════════════════════════════════════════════════════"
echo "   TEST DE INTEGRACIÓN COMPLETO: REINSTALACIÓN LIMPIA"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "PASO 0: Guardando evidencia de configuración actual..."
xsetwacom --get 9 PressureCurve 2>/dev/null > /tmp/pre-test-pressure.txt || echo "No hay tableta conectada"
echo ""

echo "PASO 1: DESINSTALACIÓN COMPLETA"
echo "───────────────────────────────────────────────────────────"
echo "1.1 Eliminando scripts antiguos..."
rm -f ~/.wacom_*.sh ~/.wacom_settings.env 2>/dev/null
echo "✅ Scripts limpiados"

echo "1.2 Eliminando autostart..."
rm -f ~/.config/autostart/wacom*.desktop 2>/dev/null
echo "✅ Autostart limpiado"

echo "1.3 Eliminando reglas udev..."
sudo rm -f /etc/udev/rules.d/99-wacom.rules /etc/udev/rules.d/69-wacom.rules 2>/dev/null
echo "✅ Reglas limpiadas"

echo "1.4 Recargando reglas..."
sudo udevadm control --reload-rules && sudo udevadm trigger
echo "✅ UDEV recargado"

echo ""
echo "✅ SISTEMA LIMPIO - Desconectá la tableta USB AHORA"
read -p "Presioná ENTER cuando hayas desconectado..."
echo ""

echo "PASO 2: INSTALACIÓN NUEVA"
echo "───────────────────────────────────────────────────────────"
echo "2.1 Copiando scripts frescos (con fixes aplicados)..."
cd /home/carlos/wacom-zurdo-setup
cp -v .wacom_*.sh "$HOME/"
chmod +x "$HOME"/.wacom_*.sh
echo "✅ Scripts copiados"

echo "2.2 Creando regla udev..."
sudo bash -c 'cat > /etc/udev/rules.d/99-wacom.rules << EOF
ACTION=="add", SUBSYSTEM=="usb", ATTRS{idVendor}=="056a", RUN+="/home/carlos/.wacom_udev_trigger.sh"
EOF'
echo "✅ Regla creada"

echo "2.3 Recargando reglas..."
sudo udevadm control --reload-rules && sudo udevadm trigger
echo "✅ UDEV recargado"

echo ""
echo "✅ INSTALACIÓN LISTA - Conectá la tableta USB AHORA"
read -p "Presioná ENTER cuando hayas conectado (esperar 5 segundos)..."
sleep 5

echo ""
echo "PASO 3: VERIFICACIÓN DE CONEXIÓN"
echo "───────────────────────────────────────────────────────────"
if xsetwacom --list devices >/dev/null 2>&1; then
  echo "✅ Tableta detectada:"
  xsetwacom --list devices
  echo ""
else
  echo "⚠️  Tableta no detectada. Reintentando en 5s..."
  sleep 5
  if xsetwacom --list devices >/dev/null 2>&1; then
    echo "✅ Tableta detectada:"
    xsetwacom --list devices
    echo ""
  else
    echo "❌ Error: Tableta no detectada"
    exit 1
  fi
fi

echo "PASO 4: VERIFICACIÓN DE CONFIGURACIÓN"
echo "────────────────────────────────────────"
echo "Configuración de presión:"
xsetwacom --get 9 PressureCurve
echo ""
xsetwacom --get 9 Threshold
echo ""
xsetwacom --get 9 PressureRecalibration
echo ""
echo "✅ Debe ser: 0 0 100 100 / 10 / off"
echo ""

echo "PASO 5: TEST DE DIBUJO WEB"
echo "────────────────────────────────────────"
echo "1. Abrí Firefox y andá a https://excalidraw.com"
echo "2. Dibujá con el stylus"
echo "3. Debe dibujar líneas continuas (no solo puntos)"
echo ""
read -p "¿Funciona? (s/n): " -n 1 -r resultado
echo ""
if [[ $resultado == "s" ]]; then
  echo "✅ TEST EXITOSO"
else
  echo "❌ TEST FALLADO"
fi

echo ""
echo "PASO 6: TEST DE PERSONALIZACIÓN DE BOTONES (Dashboard)"
echo "───────────────────────────────────────────────────────────"
echo "1. cd ~/.open-tablet-configurator/dashboard && npm run dev"
echo "2. Ir a 'Button Mapping'"
echo "3. Configurar Button 2 = 'key +ctrl +z'"
echo "4. Aplicar"
echo "5. Volver a probar dibujo"
echo ""
read -p "¿Dibuja bien después de custom? (s/n): " -n 1 -r resultado2
echo ""
if [[ $resultado2 == "s" ]]; then
  echo "✅ FIX VALIDADO"
else
  echo "❌ FIX FALLÓ"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "   RESULTADO FINAL"
echo "═══════════════════════════════════════════════════════════"
echo ""
if [[ $resultado == "s" && $resultado2 == "s" ]]; then
  echo "🎉 SUCCESS: Todo funciona correctamente"
  echo "   - Instalación limpia funciona"
  echo "   - Dibujo web funciona"
  echo "   - Custom de botones no rompe la presión"
  echo ""
  echo "✅ PRIMED PARA MERGE A MAIN"
  exit 0
else
  echo "❌ FAILURE: Requiere más debugging"
  exit 1
fi
