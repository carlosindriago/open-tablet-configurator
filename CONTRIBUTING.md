# 🤝 Contributing Guidelines

First off, thank you for considering contributing to Wacom Linux! It's people like you that make the open-source community such a fantastic place to learn, inspire, and create.

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally: `git clone https://github.com/YOUR-USERNAME/open-tablet-configurator.git`
3. **Set up your environment**. Refer to the [Development Guide](docs/DEVELOPMENT.md) for local setup instructions.
4. **Create a branch** for your feature or bugfix: `git checkout -b feature/amazing-feature` or `git checkout -b fix/annoying-bug`.

## 📜 Commit Conventions

We strictly follow [Conventional Commits](https://www.conventionalcommits.org/). Your commit messages should follow this format:

```
<type>(<scope>): <subject>

<body>
```

**Allowed Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

## 🧪 Testing

All new features and bug fixes **must** include appropriate tests.

For shell scripts:
- We use a mock-based testing approach. See `tests/test_logic.sh` for examples.
- You can test logic without physical hardware using our mock utilities.

For the Electron dashboard:
- Ensure `npm run test` passes.
- Ensure `npm run lint` and `npm run typecheck` report no errors.

## 🔀 Pull Request Process

1. Ensure all tests and linters pass (`npm run test`, `./tests/test_logic.sh`).
2. Update the README.md or documentation in `docs/` with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
3. Open a Pull Request against the `main` branch.
4. Fill out the PR template completely.
5. Wait for a code review from the maintainers. We aim to review PRs within 48 hours.

## 🐛 Bug Reports

If you find a bug, please open an issue using the Bug Report template. Include:
- Your exact Wacom model.
- Your Linux distribution and version.
- Your Desktop Environment (XFCE, GNOME, etc.).
- Steps to reproduce the behavior.
- Expected behavior vs. actual behavior.

Thank you for contributing!
