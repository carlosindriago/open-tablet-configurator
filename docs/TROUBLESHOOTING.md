# 🔧 Guía de Troubleshooting - Wacom Linux

## Problema: Tableta solo dibuja puntos (no líneas continuas) en apps web

**Síntomas:**
- Usando Chrome/Firefox en apps web (Excalidraw, Figma, etc.)
- El stylus hace click (punto) pero no arrastra/dibuja líneas
- Funciona bien con mouse

**Causa:** Configuración de presión con `Threshold` alto (26) y `PressureCurve` con zona muerta.

**Solución rápida:**
```bash
./wacom-fix-web-apps.sh
```

O manualmente:
```bash
xsetwacom --set 9 PressureCurve 0 0 100 100
xsetwacom --set 9 Threshold 10
xsetwacom --set 9 PressureRecalibration off
```

**Solución permanente:** Actualizar a la última versión del instalador con el fix incorporado.
