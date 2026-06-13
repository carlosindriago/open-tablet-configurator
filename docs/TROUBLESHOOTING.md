# 🔧 Troubleshooting Guide - Wacom Linux

If you're experiencing issues, check the common solutions below. If your issue persists, please open a Bug Report on GitHub.

## 🖥️ Display Server Issues (Wayland vs X11)

**Symptoms:**
- The scripts run, but the tablet doesn't respond.
- `xsetwacom` returns errors like "Cannot connect to X server".

**Cause:**
This tool requires the X11 display server. It is NOT compatible with Wayland (the modern default in GNOME and KDE).

**Solution:**
Verify your display server:
```bash
echo $XDG_SESSION_TYPE
```
If it says `wayland`, you must log out, select your user, look for a gear icon (⚙️) in the bottom right corner, and select "GNOME on Xorg", "Plasma (X11)", or "XFCE".

## 🖋️ Drawing Issues in Web Apps (Figma, Excalidraw, Chrome)

**Symptoms:**
- Using Chrome/Firefox in web apps (Excalidraw, Figma, etc.).
- The stylus clicks (makes a dot) but doesn't drag or draw continuous lines.
- It works perfectly fine with a standard mouse.

**Cause:**
The default Linux pressure configuration uses a high `Threshold` (26) and a `PressureCurve` with a dead zone. This causes web browsers to drop continuous pointer drag events.

**Solution:**
Run our provided fix script:
```bash
./wacom-fix-web-apps.sh
```

Or apply the commands manually:
```bash
xsetwacom --set "Your Device Name stylus" PressureCurve 0 0 100 100
xsetwacom --set "Your Device Name stylus" Threshold 10
xsetwacom --set "Your Device Name stylus" PressureRecalibration off
```

*(Note: The latest version of `setup.sh` applies this fix automatically).*

## 🖱️ Stylus Button Not Toggling Modes

**Symptoms:**
- Pressing the configured toggle button on the stylus does nothing.

**Cause:**
The toggle daemon might not be running or shortcut capture is failing.

**Solution:**
1. Check if the toggle script is running:
   ```bash
   ps aux | grep wacom_toggle
   ```
2. Verify that your Desktop Environment (XFCE, Openbox) correctly mapped the shortcut in its settings. You can re-run the `install.sh` script to reapply shortcuts.

## 🔌 Tablet Not Detected on Plug-In

**Symptoms:**
- The tablet works if you run `~/.wacom_config.sh` manually, but it doesn't configure automatically when plugged in.

**Cause:**
The udev rule might not be loading or triggering.

**Solution:**
Reload the udev rules manually:
```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```
If it still fails, ensure the Vendor ID of your tablet matches `056a` by running `lsusb`.

## 📜 Logs and Diagnostics

You can generate a diagnostic report of your current Wacom pressure settings to help with debugging:

```bash
./diagnose-wacom-pressure.sh
```
This will output the current mode, threshold, curve, and recalibration status of your detected tablet.
