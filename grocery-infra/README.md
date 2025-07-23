# Grocery Infrastructure

Infrastructure configuration for the grocery application.

## Description

This repository contains Docker configurations, CI/CD pipelines, and other infrastructure-related files for the grocery application ecosystem.

## Components

- `docker-compose.yml` - Docker Compose configuration for local development
- GitHub Actions workflows for CI/CD
- Sample data generation and import scripts
- Vulnerability scanning and verification scripts

## Usage

### Sample Data

The repository includes scripts for generating and importing deterministic sample data for the grocery application.

#### Generating Sample Data

```bash
# Generate sample data
npm run gen-data
```

This will:
1. Generate exactly 250 unique items
2. Generate 3 stores, each with 10-20 aisles and 3-6 categories per aisle
3. Generate shopping lists for each store
4. Save the data as JSON files in the `sample-data/` directory:
   - `items.json`
   - `stores.json`
   - `shoppingLists.json`

The data generation uses a fixed random seed (1337), ensuring that the generated data is identical on every run. This makes it perfect for testing, benchmarking, and sharing consistent fixtures across environments.

Example item:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Practical Steel Keyboard",
  "category": "Electronics"
}
```

Example store (abbreviated):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Westborough Grocery",
  "address": "123 Main Street, Suite 456, Westborough, 12345",
  "aisles": [
    {
      "number": 1,
      "categories": ["Produce", "Dairy", "Bakery"]
    },
    // More aisles...
  ]
}
```

#### Importing Sample Data

```bash
# Import sample data to a running API
npm run import-data

# Import to a custom API endpoint
npm run import-data -- --base-url http://custom-host:4000/api
```

This will:
1. Read the JSON files from the `sample-data/` directory
2. POST the data to a running grocery-api instance
3. Skip any items that already exist (409 Conflict responses)
4. Log a summary of the import results

### Running the Application

```bash
# Start all containers
npm start
# or
docker-compose up

# Start in detached mode
docker-compose up -d

# Build containers
npm run build
# or
docker-compose build

# Stop and remove containers
npm run down
# or
docker-compose down
```

### Accessing Services

- API: http://localhost:3000
- Web: http://localhost:5173

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

- Unit tests for all repositories
- Static code analysis and linting
- Security vulnerability scanning
- Docker image building and publishing
- End-to-end testing with Playwright

### Required Secrets

For the CI pipeline to function properly, the following secrets need to be configured in your GitHub repository:

| Secret Name | Description | Required For |
|-------------|-------------|-------------|
| `GHCR_PAT` | GitHub Personal Access Token with `write:packages` permission | Docker image publishing to GitHub Container Registry |

For public repositories, the default `GITHUB_TOKEN` can be used instead of `GHCR_PAT`.

## Security Scanning

The project includes a CI job for vulnerability scanning using OSV-scanner.

### Running the Vulnerability Scan

```bash
# Install osv-scanner
curl -sSfL https://raw.githubusercontent.com/google/osv-scanner/main/install.sh | sh -s -- -b .
chmod +x ./osv-scanner

# Run the scan
./osv-scanner --recursive .
```

### Verification Script

The project includes a verification script that checks for the presence of expected vulnerabilities:

```bash
# Run the verification script
node scripts/verifyVulns.js
```

This script:
1. Runs osv-scanner to detect vulnerabilities
2. Verifies that all expected CVEs are detected
3. Fails the CI job if any expected vulnerabilities are missing

The script checks for the following intentional vulnerabilities:
- CVE-2021-23337 (lodash in grocery-api)
- CVE-2022-23529 (jsonwebtoken in grocery-api)
- CVE-2021-3762 (validator in grocery-shared)

## ⚠️ Known Vulnerabilities (intentional)

This project intentionally includes several vulnerabilities for security testing and educational purposes. These vulnerabilities are documented in the respective package READMEs:

- grocery-api: CVE-2021-23337 (lodash), CVE-2022-23529 (jsonwebtoken)
- grocery-web: Typosquat package (eventsource-parserr)
- grocery-shared: CVE-2021-3762 (validator)

## 🔍 False-Positive Examples

| Package | Version | Pattern | Explanation | Why it's a false positive |
|---------|---------|---------|-------------|---------------------------|
| fsevents | 1.2.9 | OS-specific optionalDependency | Added to optionalDependencies | Only installs on macOS; not used on other platforms |

This false-positive pattern demonstrates a common scenario where a vulnerable package is included as an optional dependency that only installs on specific operating systems (in this case, macOS). Security scanners will flag this vulnerability regardless of the operating system, but it poses no risk on non-macOS platforms since the package won't be installed.

## License

MIT