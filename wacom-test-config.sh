#!/bin/bash
echo "=== PRUEBA DE CONFIGURACIÓN WACOM ==="
echo ""
echo "📍 Detectando dispositivos..."
xsetwacom --list devices
echo ""
echo "📝 Leyendo configuración actual..."
echo -n "ID 9 PressureCurve: "
xsetwacom --get 9 PressureCurve 2>/dev/null || echo "ERROR"
echo -n "ID 9 Threshold: "
xsetwacom --get 9 Threshold 2>/dev/null || echo "ERROR"
echo -n "ID 9 PressureRecalibration: "
xsetwacom --get 9 PressureRecalibration 2>/dev/null || echo "ERROR"
echo ""
echo "⚙️ Aplicando fix web apps..."
xsetwacom --set 9 PressureCurve 0 0 100 100
sleep 0.2
xsetwacom --set 9 Threshold 10
sleep 0.2
xsetwacom --set 9 PressureRecalibration off
sleep 0.2
echo ""
echo "✅ Nueva configuración:"
xsetwacom --get 9 PressureCurve
xsetwacom --get 9 Threshold
xsetwacom --get 9 PressureRecalibration
