# Documentation MCP Server

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

A server for developers to access updated documentation of their favorite libraries.

## Overview

This MCP (Model-Controller-Presenter) server provides a unified interface for accessing documentation from various libraries. It aggregates documentation from multiple sources, allows for search across all libraries, and ensures developers have access to the most up-to-date information.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Documentation+MCP+Server+Screenshot" alt="Documentation MCP Server Screenshot">
</div>

## Features

- **Documentation Aggregation**: Collects documentation from various library sources
- **Search Functionality**: Search across all libraries or filter by specific libraries
- **Version Management**: Access documentation for different versions of libraries
- **Automatic Updates**: Regular fetching of the latest documentation
- **API Access**: Programmatic access to documentation through an API
- **Interactive UI**: Web interface for browsing documentation

## Quick Installation

### Using Installation Script

The easiest way to get started:

```bash
# Clone the repository
git clone https://github.com/SubaashNair/documentation-mcp-server.git
cd documentation-mcp-server

# Make the installation script executable
chmod +x install.sh

# Run the installation script
./install.sh
```

### Using Docker

```bash
# Clone the repository
git clone https://github.com/SubaashNair/documentation-mcp-server.git
cd documentation-mcp-server

# Copy and edit environment variables
cp .env.example .env

# Start with Docker Compose
docker-compose up -d
```

### Manual Installation

For detailed installation instructions, see the [Installation Guide](INSTALLATION.md).

## Usage

### Web Interface

Navigate to `http://localhost:3000` in your browser to access the web interface.

<div align="center">
  <img src="https://via.placeholder.com/600x400?text=Web+Interface+Demo" alt="Web Interface Demo">
</div>

### API Usage

The server provides a RESTful API for programmatic access to documentation.

**Example: Search for documentation**

```bash
curl -X GET "http://localhost:3000/api/search?q=useState&library=react"
```

**Example: Get library documentation**

```bash
curl -X GET "http://localhost:3000/api/libraries/react/hooks/useState"
```

**Example: Get API status**

```bash
curl -X GET "http://localhost:3000/api/status"
```

For full API documentation, visit `/api-docs` on your server (e.g., `http://localhost:3000/api-docs`).

## Architecture

The Documentation MCP Server follows the Model-Controller-Presenter (MCP) pattern:

- **Model**: Data services for fetching and storing documentation (`src/services/`)
- **Controller**: Request handlers for API endpoints (`src/controllers/`)
- **Presenter**: Front-end interface and API response formatting (`public/`)

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=MCP+Architecture+Diagram" alt="MCP Architecture Diagram">
</div>

## Configuration

The server can be configured by editing the `.env` file or setting environment variables.

### Basic Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3000` |
| `GITHUB_TOKEN` | GitHub token for API access | - |
| `DOCUMENTATION_UPDATE_SCHEDULE` | Cron schedule for updates | `0 0 * * *` (daily) |
| `LIBRARIES` | Comma-separated list of libraries to fetch | `react,vue,angular` |

For complete configuration options, see the [Installation Guide](INSTALLATION.md#configuration).

## Adding New Libraries

To add a new library to the documentation server:

1. Create a new file in `src/libraries/` following the pattern of existing libraries
2. Implement the required interfaces for fetching and parsing the documentation
3. Add the library to the configuration

Example implementation:

```javascript
// src/libraries/your-library.js
const fetchYourLibraryDocumentation = async (version) => {
  // Implementation for fetching documentation
  // ...
};

module.exports = {
  fetchDocumentation: fetchYourLibraryDocumentation
};
```

Then add it to your `.env` file:

```
LIBRARIES=react,vue,angular,your-library
```

## Documentation

- [Installation Guide](INSTALLATION.md) - Detailed setup instructions
- [API Documentation](http://localhost:3000/api-docs) - OpenAPI documentation (on running server)
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

## Roadmap

- [ ] Add support for more libraries (TypeScript, Node.js, etc.)
- [ ] Implement user accounts and favorites
- [ ] Add offline documentation support
- [ ] Create a CLI tool for accessing documentation
- [ ] Implement community contributions for documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Documentation and API design inspired by [DevDocs](https://devdocs.io/)
- Architecture patterns from [Express.js](https://expressjs.com/)
- Search functionality powered by [Lunr.js](https://lunrjs.com/)
