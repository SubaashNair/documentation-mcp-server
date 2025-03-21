# Contributing to Documentation MCP Server

Thank you for considering contributing to Documentation MCP Server! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by the Documentation MCP Server Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Describe the behavior you observed and what behavior you expected
- Include screenshots if possible
- Include details about your environment (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Any potential implementation ideas you have
- Why this enhancement would be useful to users

### Adding New Libraries

If you want to add support for a new library:

1. Ensure the library has accessible documentation
2. Create an issue discussing the new library before implementing
3. Follow the existing patterns in the code

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from example:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Pull Request Process

1. Update the README.md or other documentation with details of changes
2. Update the CHANGELOG.md with a description of your changes
3. The PR should work with existing tests or include new ones
4. Ensure your code follows the established coding standards
5. Your PR will be reviewed by at least one maintainer

## Coding Standards

- Use 2 spaces for indentation
- Use camelCase for variable and function names
- Use PascalCase for class names
- Add JSDoc comments for all functions and methods
- Keep functions small and focused
- Follow the existing code organization patterns

Example:

```javascript
/**
 * Fetches documentation for a specific component
 * @param {string} libraryName - Name of the library
 * @param {string} componentPath - Path to the component
 * @param {string} [version] - Optional version, defaults to latest
 * @returns {Promise<Object>} Component documentation
 */
async function fetchComponentDocumentation(libraryName, componentPath, version) {
  // Implementation
}
```

## Testing

We strive for good test coverage. When adding new features or fixing bugs:

1. Add or update tests that verify your changes
2. Make sure all tests pass:
   ```bash
   npm test
   ```
3. Check test coverage:
   ```bash
   npm run test:coverage
   ```

## Documentation

Always update the documentation when making changes:

- For API changes, update the Swagger documentation (`src/swagger.yaml`)
- For user-facing changes, update the relevant README sections
- For major changes, consider updating the INSTALLATION.md guide

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Additional Notes

### Issue and Pull Request Labels

| Label Name | Description |
|------------|-------------|
| `bug` | Confirmed bugs or reports that are likely to be bugs |
| `enhancement` | Feature requests |
| `documentation` | Improvements or additions to documentation |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention is needed |
| `question` | Further information is requested |

## Thank You!

Your contributions are what make the open source community such an amazing place to learn, inspire, and create. We appreciate your time and effort!
