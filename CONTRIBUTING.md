# Contributing to M&T Immigration Law Firm Website

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/mangeshraut712/MT-Immigration.git
   cd MT-Immigration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Write clear, descriptive commit messages
   - Test your changes thoroughly

3. **Run linting and build**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## Code Style Guidelines

- **TypeScript**: Use TypeScript for all new files
- **Components**: Use functional components with hooks
- **Naming**: Use PascalCase for components, camelCase for functions
- **Imports**: Group imports (React, external, internal)
- **Formatting**: Run `npm run lint` before committing

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure all tests pass and the build succeeds
3. Update documentation for any new features
4. Request review from maintainers
5. Address any feedback from code review

## Reporting Bugs

Use the bug report template when creating an issue. Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## Feature Requests

Use the feature request template. Include:
- Problem description
- Proposed solution
- Alternative solutions considered
- Additional context

## Questions?

Feel free to open an issue with the question label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
