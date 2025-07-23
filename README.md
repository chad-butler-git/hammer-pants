# Hammer Pants

A multi-repository application with API, web frontend, and shared libraries.

![CI](https://github.com/chadbutler/hammer_pants/actions/workflows/ci.yml/badge.svg)

## Repositories

- **grocery-api**: Backend API service
- **grocery-web**: Frontend web application
- **grocery-shared**: Shared models and utilities
- **grocery-infra**: Infrastructure code, Docker configurations, and sample data

## Getting Started

For detailed instructions on how to set up and run the project, please see the [Workshop Guide](WORKSHOP.md).

## Development

Each repository has its own npm scripts for testing and linting:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint
```

## Docker

The application can be run using Docker Compose:

```bash
# Using the Makefile at the root
make up
```

This will start both the API and web services. For more options, see the [Workshop Guide](WORKSHOP.md).

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

- Unit tests for all repositories
- Static code analysis and linting
- Security vulnerability scanning
- Docker image building and publishing
- End-to-end testing with Playwright

See `.github/workflows/ci.yml` for the complete workflow configuration.