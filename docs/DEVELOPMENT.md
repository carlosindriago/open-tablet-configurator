# 🛠️ Development Guide

This guide will help you set up your local environment to contribute to the Wacom Linux project.

## 📦 Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v20 or higher) - For Dashboard development
- **npm** (v10 or higher)
- **xsetwacom** (`xserver-xorg-input-wacom`) - For shell script testing
- **whiptail** - For testing the TUI installer

## 🖥️ Dashboard Development

The dashboard is built with Electron, React, Vite, Tailwind CSS, and Zustand.

### Setup
```bash
cd dashboard
npm install
```

### Available Scripts

- `npm run dev`: Starts the application in development mode with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript and builds for production.
- `npm run preview`: Previews the production build locally.
- `npm run dist`: Packages the application into distributable formats (DEB, AppImage) using electron-builder.
- `npm run lint`: Runs ESLint to identify code quality issues.
- `npm run typecheck`: Runs TypeScript compiler to verify types without emitting files.
- `npm run test`: Runs the Vitest test suite.
- `npm run test:e2e`: Runs Playwright end-to-end tests.

## 🐚 Shell Script Development

Our core configuration logic relies heavily on Bash scripting.

### Best Practices
- **Use ShellCheck:** Always run `shellcheck` against your scripts before opening a PR. This is enforced by our CI pipeline.
- **Portability:** Stick to standard Bash conventions. Avoid bashisms where standard POSIX `sh` syntax is just as clear.
- **Error Handling:** Use `set -e` where appropriate to fail fast, but handle expected errors gracefully.

### Testing Shell Scripts

To avoid messing up your actual hardware configuration while developing, we use a mocking strategy.
See `tests/test_logic.sh` for an example of how we mock the `xsetwacom` binary.

You can run the tests locally:
```bash
chmod +x tests/test_logic.sh
./tests/test_logic.sh
```
