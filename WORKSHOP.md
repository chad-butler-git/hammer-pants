# Hammer Pants Workshop

This document provides instructions for setting up and running the Hammer Pants application in different environments.

## Prerequisites

Before you begin, make sure you have one of the following installed:

- **For Local Docker Compose**: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **For VS Code Dev Container**: [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- **For GitHub Codespaces**: Access to GitHub Codespaces through your GitHub account

## Quick Start Options

### Option 1: Local Docker Compose

The simplest way to run the application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hammer-pants.git
   cd hammer-pants
   ```

2. Start the application with a single command:
   ```bash
   make up
   ```

3. Access the application:
   - Web UI: http://localhost:5173
   - API: http://localhost:3000/api

4. To view logs:
   ```bash
   make logs
   ```

5. To stop the application:
   ```bash
   make down
   ```

### Option 2: VS Code Dev Container

For a fully configured development environment:

1. Install the [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hammer-pants.git
   ```

3. Open the project in VS Code:
   ```bash
   code hammer-pants
   ```

4. When prompted, click "Reopen in Container" or use the command palette (F1) and select "Dev Containers: Reopen in Container"

5. VS Code will build and start the containers automatically, and forward the necessary ports

6. Access the application:
   - Web UI: http://localhost:5173
   - API: http://localhost:3000/api

### Option 3: GitHub Codespaces

For a cloud-based development environment:

1. Navigate to the repository on GitHub

2. Click the "Code" button and select "Open with Codespaces"

3. Click "New codespace"

4. GitHub will create and start a new codespace with the development environment

5. The ports will be forwarded automatically. Click on the "Ports" tab to see the forwarded URLs for:
   - Web UI (port 5173)
   - API (port 3000)

## Exposed URLs

- **Web UI**: http://localhost:5173
  - The frontend application for the grocery shopping demo

- **API**: http://localhost:3000/api
  - RESTful API endpoints:
    - `/api/items` - Grocery items
    - `/api/stores` - Store information
    - `/api/lists` - Shopping lists
    - `/api/route` - Optimized shopping routes

## Common Troubleshooting

### Container Issues

If containers fail to start:

```bash
# View container logs
make logs

# Rebuild containers
make down
make up
```

### Port Conflicts

If you see errors about ports being in use:

1. Check if you have other applications using ports 3000 or 5173
2. Stop those applications or modify the `docker-compose.yml` file to use different ports

### Data Not Loading

If sample data doesn't appear:

1. Check API logs: `docker logs grocery-api`
2. Manually trigger seed data: `docker exec -it grocery-api npm run seed`

### Dev Container Not Working

If VS Code Dev Container fails:

1. Make sure Docker Desktop is running
2. Try rebuilding the container: Command Palette (F1) → "Dev Containers: Rebuild Container"
3. Check VS Code logs: Command Palette (F1) → "Developer: Show Logs"

## Additional Commands

```bash
# Build images without starting containers
make build

# View logs
make logs

# Stop containers
make down