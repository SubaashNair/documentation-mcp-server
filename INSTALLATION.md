# Documentation MCP Server Installation Guide

This guide provides instructions for setting up the Documentation MCP Server either manually or using Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
  - [Method 1: Using Docker](#method-1-using-docker)
  - [Method 2: Manual Installation](#method-2-manual-installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing the Documentation MCP Server, ensure you have the following:

- For Docker installation:
  - Docker Engine (20.10.0 or later)
  - Docker Compose (2.0.0 or later)
  
- For manual installation:
  - Node.js (18.x or later)
  - npm (9.x or later) or yarn (1.22.x or later)
  - Git

- Other requirements:
  - GitHub personal access token (if fetching documentation from GitHub repositories)
  - Access to the internet for pulling dependencies

## Installation Methods

### Method 1: Using Docker

The easiest way to set up the Documentation MCP Server is using Docker.

1. Clone the repository:
   ```bash
   git clone https://github.com/SubaashNair/documentation-mcp-server.git
   cd documentation-mcp-server
   ```

2. Create a `.env` file with your configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

4. The server will be available at `http://localhost:3000`.

### Method 2: Manual Installation

If you prefer not to use Docker, you can set up the server manually.

1. Clone the repository:
   ```bash
   git clone https://github.com/SubaashNair/documentation-mcp-server.git
   cd documentation-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with your configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your preferred text editor
   ```

4. Create required directories:
   ```bash
   mkdir -p data/libraries
   mkdir -p logs
   ```

5. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

6. For development with automatic reloading:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. The server will be available at `http://localhost:3000`.

## Configuration

The Documentation MCP Server can be configured through environment variables or the `.env` file.

### Essential Configuration Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `API_KEY` | API key for protected endpoints | - |
| `GITHUB_TOKEN` | GitHub personal access token | - |
| `LIBRARIES` | Comma-separated list of libraries to fetch | `react,vue,angular` |

### Advanced Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DOCUMENTATION_UPDATE_SCHEDULE` | Cron schedule for documentation updates | `0 0 * * *` (daily at midnight) |
| `LOG_LEVEL` | Logging level (error, warn, info, verbose, debug) | `info` |
| `SEARCH_RESULT_LIMIT` | Default maximum search results | `20` |

## Running Tests

To run tests:

```bash
npm test
# or
yarn test
```

To run tests with coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Troubleshooting

### Common Issues

#### Server Won't Start

If the server fails to start, check:
- `.env` file exists and has correct values
- Required directories (`data` and `logs`) exist and are writable
- Port 3000 (or configured port) is not already in use

#### Documentation Not Fetching

If documentation is not being fetched:
- Check your `GITHUB_TOKEN` is valid and has appropriate permissions
- Verify internet connectivity
- Check the server logs for specific error messages

#### Search Not Working

If search functionality isn't working:
- Make sure documentation has been fetched at least once
- Check if the specified libraries exist
- Verify search index is being built correctly

### Logs

Logs are stored in the `logs` directory:
- `logs/error.log` - Contains error messages
- `logs/combined.log` - Contains all log messages

You can increase verbosity by setting `LOG_LEVEL=debug` in your `.env` file.

### Getting Help

If you continue to experience issues:
1. Check the GitHub issues for similar problems
2. Open a new issue with detailed information about your problem
3. Include relevant logs and environment details
