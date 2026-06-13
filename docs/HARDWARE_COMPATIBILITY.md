# 💻 Hardware Compatibility

Open Graphic Tablet Configurator uses dynamic device discovery via `xsetwacom`, which means it theoretically supports **any Wacom tablet** that is recognized by the Linux kernel's `wacom` driver.

Below is a non-exhaustive list of tablets that have been explicitly tested and verified by the community.

## 🟢 Fully Supported (Verified)

| Device Family | Models | Notes |
|---------------|--------|-------|
| **One by Wacom** | CTL-471, CTL-472 (Small), CTL-672 (Medium) | Perfect support. Recommended entry-level. |
| **Wacom Intuos** | CTL-4100, CTL-6100 | Full support including Bluetooth models. |
| **Wacom Intuos Pro** | PTH-460, PTH-660, PTH-860 | Stylus, Eraser, and Pad supported. |
| **Wacom Cintiq** | Cintiq 16, Cintiq 22 | Screen mapping works perfectly. |
| **Wacom One (Display)** | DTC133 | Display mapping automatically detected. |

## 🟡 Partially Supported / Requires Manual Tweaks

| Device Family | Models | Notes |
|---------------|--------|-------|
| **Older Intuos (PTZ/PTK)** | Intuos 3, Intuos 4 | Some specific pad buttons might require manual `xsetwacom` configuration mapping. |
| **Non-Wacom Devices** | Huion, XP-Pen | **NOT SUPPORTED** by default, as the udev rule filters by Vendor ID `056a`. |

## 📝 Reporting Compatibility

If your Wacom device works flawlessly, but isn't on this list, please open a PR to add it!

If your device is experiencing issues, please open a Bug Report issue and include the output of:
```bash
xsetwacom --list devices
```
