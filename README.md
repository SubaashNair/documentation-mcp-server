# Documentation MCP Server

A server for developers to access updated documentation of their favorite libraries.

## Overview

This MCP (Model-Controller-Presenter) server provides a unified interface for accessing documentation from various libraries. It aggregates documentation from multiple sources, allows for search across all libraries, and ensures developers have access to the most up-to-date information.

## Features

- **Documentation Aggregation**: Collects documentation from various library sources
- **Search Functionality**: Search across all libraries or filter by specific libraries
- **Version Management**: Access documentation for different versions of libraries
- **Automatic Updates**: Regular fetching of the latest documentation
- **API Access**: Programmatic access to documentation through an API
- **Interactive UI**: Web interface for browsing documentation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

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

3. Configure the server:
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

4. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

The server will be available at `http://localhost:3000` by default.

## Usage

### Web Interface

Navigate to `http://localhost:3000` in your browser to access the web interface.

### API Usage

The server provides a RESTful API for programmatic access to documentation.

**Example: Search for documentation**

```bash
curl -X GET "http://localhost:3000/api/search?query=useState&library=react"
```

**Example: Get library documentation**

```bash
curl -X GET "http://localhost:3000/api/libraries/react/hooks/useState"
```

## Configuration

The server can be configured by editing the `.env` file or setting environment variables.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3000` |
| `GITHUB_TOKEN` | GitHub token for API access | - |
| `UPDATE_INTERVAL` | Interval for documentation updates (in minutes) | `60` |
| `LIBRARIES` | Comma-separated list of libraries to fetch | `react,vue,angular` |

## Adding New Libraries

To add a new library to the documentation server:

1. Create a new file in `src/libraries/` following the pattern of existing libraries
2. Implement the required interfaces for fetching and parsing the documentation
3. Add the library to the configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
