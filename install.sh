#!/bin/bash

# Documentation MCP Server Installation Script
# This script helps set up the Documentation MCP Server

# Set colored output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║           Documentation MCP Server Installer               ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo

# Check if required tools are installed
echo -e "${YELLOW}Checking prerequisites...${NC}"

command -v node >/dev/null 2>&1 || { 
  echo -e "${RED}Node.js is required but not installed. Please install Node.js (v18 or higher).${NC}" 
  exit 1
}

NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ $NODE_MAJOR_VERSION -lt 18 ]; then
  echo -e "${RED}Node.js version $NODE_VERSION detected. Version 18 or higher is required.${NC}"
  exit 1
fi

command -v npm >/dev/null 2>&1 || { 
  echo -e "${RED}npm is required but not installed.${NC}" 
  exit 1
}

echo -e "${GREEN}✓ Node.js version $NODE_VERSION${NC}"
echo -e "${GREEN}✓ npm$(npm -v)${NC}"

# Create required directories
echo -e "\n${YELLOW}Creating required directories...${NC}"
mkdir -p data/libraries
mkdir -p logs
echo -e "${GREEN}✓ Directories created${NC}"

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Set up environment variables
echo -e "\n${YELLOW}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file from example${NC}"
  echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
else
  echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Final steps
echo
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}       Documentation MCP Server installed successfully!      ${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo
echo -e "To start the server:"
echo -e "  ${BLUE}npm start${NC}"
echo
echo -e "To start the server in development mode with auto-reload:"
echo -e "  ${BLUE}npm run dev${NC}"
echo
echo -e "The server will be available at:"
echo -e "  ${BLUE}http://localhost:3000${NC}"
echo
echo -e "For more information, see:"
echo -e "  ${BLUE}README.md${NC} - General information"
echo -e "  ${BLUE}INSTALLATION.md${NC} - Detailed installation guide"
echo
