#!/bin/bash
echo "=== DIAGNÓSTICO DE PRESIÓN WACOM ==="
echo ""
echo "1️⃣ Configuración ACTUAL (antes de trigger):"
xsetwacom --get 9 PressureCurve 2>&1 | grep -v "Cannot find" || echo "Tableta no conectada"
xsetwacom --get 9 Threshold 2>&1 | grep -v "Cannot find" || echo "Tableta no conectada"
xsetwacom --get 9 PressureRecalibration 2>&1 | grep -v "Cannot find" || echo "Tableta no conectada"
echo ""
echo "2️⃣ Forzando reconexión (desconectá y conectá la tableta AHORA)"
echo "Presioná ENTER cuando la hayas reconectado..."
read
sleep 3
echo ""
echo "3️⃣ Después de reconectar (con defaults del sistema):"
xsetwacom --get 9 PressureCurve 2>&1
echo "  └─ ¿Esta es la configuración con la que funciona Excalidraw?"
echo ""
echo "4️⃣ Ejecutando nuestro udev trigger..."
~/.wacom_udev_trigger.sh &
echo "   └─ Proceso iniciado en background (esperando 6 segundos...)"
sleep 6
echo ""
echo "5️⃣ Después del trigger (nuestra configuración):"
xsetwacom --get 9 PressureCurve
echo "  └─ ¿ESTA es la configuración con la que NO funciona?"
echo ""
echo "=== COMPAREMOS ==="
echo "Si los valores del paso 3 funcionan y los del paso 5 no, es nuestro trigger."
echo "Si ambos funcionan o fallan igual, es otra cosa."
