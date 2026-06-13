# ✍️ Open Graphic Tablet Configurator (Linux)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Wacom Linux CI](https://github.com/carlosindriago/open-tablet-configurator/actions/workflows/ci.yml/badge.svg)](https://github.com/carlosindriago/open-tablet-configurator/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/carlosindriago/open-tablet-configurator/branch/main/graph/badge.svg)](https://codecov.io/gh/carlosindriago/open-tablet-configurator)

A professional, automated configuration suite for **ANY Wacom Tablet** on Linux. Features dynamic device detection, advanced multi-monitor mapping, an interactive TUI installer, and a **modern Electron Dashboard GUI**.

> [!WARNING]
> **CRITICAL REQUIREMENT: X11 ONLY**
> This tool relies on `xsetwacom` and `xrandr`. It **DOES NOT** support Wayland (which is the default in modern GNOME and KDE). If you are on Wayland, this script will not work. Wayland support via adapter pattern is planned for a future release.

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Key Features](#-key-features)
- [Dashboard GUI](#%EF%B8%8F-dashboard-gui-features)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

### 1. Verify Display Server
Ensure you are running an X11 session:
```bash
echo $XDG_SESSION_TYPE
# Output must be "x11"
```

### 2. One-Line Installation
```bash
# Using wget
wget -qO- https://raw.githubusercontent.com/carlosindriago/open-tablet-configurator/main/setup.sh | bash

OR

curl -fsSL https://raw.githubusercontent.com/carlosindriago/open-tablet-configurator/main/setup.sh | bash
```
This automatically installs the universal configuration scripts, integrates with your X11 session, sets up keyboard shortcuts, and prepares the optional Dashboard GUI.

### 3. Manual Installation
If you prefer a manual setup:
```bash
git clone https://github.com/carlosindriago/open-tablet-configurator.git
cd open-tablet-configurator
chmod +x install.sh
./install.sh
```

### 4. Uninstallation
To remove all scripts, configurations, and system rules:
```bash
cd ~/.open-tablet-configurator
chmod +x uninstall.sh
./uninstall.sh
```

---

## 🌟 Key Features

- **🖥️ Modern Dashboard GUI:** Electron-based dashboard with dark mode, real-time configuration, and visual pressure curve preview.
- **🚀 Universal Device Support (X11):** Automatically detects any Wacom stylus device (Intuos, One, Pro, etc.) using dynamic X11 sensing.
- **🖥️ Multi-Monitor Mapping:** Choose to map your tablet to a specific monitor or the entire extended desktop.
- **🔌 Vendor-Level Persistence:** Custom `udev` rules detect any Wacom hardware by Vendor ID (`056a`) for instant configuration.
- **🖱️ Tablet/Mouse Mode Toggle:** Seamlessly switch between absolute (drawing) and relative (navigation) modes.
- **🛠️ Professional TUI:** Interactive installer built with `whiptail` for a guided CLI experience.
- **✏️ 60+ Button Actions:** Comprehensive button mapping with categorized options for tools, editing, navigation, and more.

---

## 🖥️ Dashboard GUI Features

Launch the modern Electron dashboard for real-time configuration:
```bash
cd ~/.open-tablet-configurator/dashboard
npm install
npm run dev
```

### Interface & Options
- **Dark Mode Elegance:** Professional dark theme with subtle gradients.
- **Real-time Updates:** Device connection status and live config changes.
- **Orientation:** Normal, Rotated 90°, Rotated -90°, Flipped 180° (Left-handed mode).
- **Positioning Mode:** Absolute (drawing) or Relative (mouse-like).
- **Pressure Curve:** 5 presets with visual SVG preview.

---

## 📚 Documentation

For an in-depth understanding of the project, please refer to our dedicated documentation files:

- 🏗️ **[Architecture](docs/ARCHITECTURE.md):** System design and component interaction.
- 🔧 **[Troubleshooting](docs/TROUBLESHOOTING.md):** Solutions to common issues.
- 💻 **[Hardware Compatibility](docs/HARDWARE_COMPATIBILITY.md):** List of tested and supported devices.
- 🛠️ **[Development Guide](docs/DEVELOPMENT.md):** Setup guide for local development.

---

## 🤝 Contributing

We adhere to a high standard for open-source contributions. Please review our **[Contributing Guidelines](CONTRIBUTING.md)** before submitting a Pull Request.

Key areas where you can help:
- Wayland compatibility layer
- Support for additional Desktop Environments (KDE Plasma, GNOME extensions)
- Expanding the test suite

Please also read our **[Code of Conduct](CODE_OF_CONDUCT.md)**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---
*Created with ❤️ by the Wacom Linux Community - 2026*
