#!/bin/bash
# 🔧 Wacom Web Apps Fix - Solución rápida para problemas de presión en navegadores
# Este script aplica la configuración correcta para que apps web (Excalidraw, etc.) funcionen

export DEVICE_ID=$(xsetwacom --list devices | grep -i "stylus" | grep -o "id: [0-9]*" | awk '{print $2}')

echo "🔧 Aplicando fix para apps web..."
echo "📍 Detectando stylus..."

STYLUS_ID=$DEVICE_ID
if [ -z "$STYLUS_ID" ]; then
 echo "❌ No se detectó stylus Wacom"
 exit 1
fi

echo "✅ Stylus detectado: ID $STYLUS_ID"
echo "⚙️ Configurando..."

# Aplicar configuración optimizada para web
xsetwacom --set "$STYLUS_ID" PressureCurve 0 0 100 100
xsetwacom --set "$STYLUS_ID" Threshold 10
xsetwacom --set "$STYLUS_ID" PressureRecalibration off

echo "✅ Configuración aplicada!"
echo "📊 Valores actuales:"
echo "   PressureCurve: $(xsetwacom --get "$STYLUS_ID" PressureCurve)"
echo "   Threshold: $(xsetwacom --get "$STYLUS_ID" Threshold)"
echo ""
echo "💡 Probá en: https://excalidraw.com/ ahora"
