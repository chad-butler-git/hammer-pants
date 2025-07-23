# Grocery Web

A React-based frontend for the grocery shopping application. This SPA (Single Page Application) allows users to create shopping lists, onboard stores, and navigate through optimized shopping routes.

## Features

- Browse and select grocery items
- Create and manage shopping lists
- Add and configure stores with aisle categories
- Generate optimized shopping routes
- View items grouped by aisles for efficient shopping

## Tech Stack

- React 18
- Vite
- React Router v6
- Zustand (with Immer) for state management
- Axios for API communication
- Tailwind CSS for styling
- Vitest + React Testing Library for testing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd grocery-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API URL if needed.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | URL of the grocery API | http://localhost:3000/api |

## Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Main page with item selector and store picker |
| `/onboard` | StoreOnboardPage | Form to add a new store with aisle-to-category mapping |
| `/list` | ShoppingListPage | View and manage the current shopping list |
| `/route` | RouteViewPage | View the optimized shopping route |

## Docker

A multi-stage Dockerfile is included for containerized deployment:

1. Build the Docker image:
   ```bash
   docker build -t grocery-web .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 grocery-web
   ```

3. Access the application at http://localhost:3001

## Development

The application is structured as follows:

```
grocery-web/src/
  api/               # Axios wrappers for API endpoints
    items.js
    stores.js
    lists.js
    route.js
  pages/             # Page components
    HomePage.jsx
    StoreOnboardPage.jsx
    ShoppingListPage.jsx
    RouteViewPage.jsx
  components/        # Reusable components
    ItemSelector.jsx
    StorePicker.jsx
    AisleRouteCard.jsx
    AisleBuilder.jsx
  state/             # Zustand store
    useAppStore.js
  App.jsx            # Main application component
  main.jsx           # Entry point
```

## Store Onboarding Flow

The store onboarding process allows users to create new grocery stores with detailed aisle-to-category mappings. This helps optimize shopping routes by ensuring items are grouped correctly by their location in the store.

![Store Onboarding Flow](./public/store-onboarding-flow.gif)

### Process:

1. Navigate to `/onboard` route
2. Enter store details (name and address)
3. Use the dynamic aisle builder to:
   - Select an aisle number (1-20)
   - Choose one or more categories for that aisle
   - Add the aisle mapping to the store
4. Review all aisle mappings in the table
5. Submit the form to create the store
6. Upon success, you'll be redirected to the home page

### Default Categories:

The system provides 12 default categories for grocery items:

- Produce
- Dairy
- Meat
- Bakery
- Frozen
- Canned Goods
- Dry Goods
- Beverages
- Snacks
- Household
- Personal Care
- Pet Supplies

These categories can be assigned to different aisles based on the store's layout. Each aisle can have multiple categories, and the same category should not appear in multiple aisles for optimal routing.

## Shopping Flow Workflow

The shopping flow allows users to select a store, build a shopping list, and follow an optimized aisle-by-aisle route through the store.

### Process:

1. **Select Store and Items (Home Page)**
   - Choose a store from the store picker
   - Search and select items to add to your shopping list
   - Preview your list with the most recently added items
   - Click "Start Shopping" to proceed to the list view

2. **Review and Edit List (Shopping List Page)**
   - View all items in your list, grouped by aisle category
   - Remove any unwanted items
   - Click "Generate Route" to create an optimized shopping route
   - Optionally, clear the entire list to start over

3. **Follow Shopping Route (Route View Page)**
   - View a step-by-step route through the store's aisles
   - Each step shows the aisle name and all items to pick up
   - Mark steps as completed as you shop
   - Choose between different route planner types:
     - Linear (default): Simple front-to-back aisle traversal
     - Optimized: More efficient path based on store layout
   - Reset the route if needed or click "Finish Shopping" when done

### Navigation:

The application includes breadcrumb navigation to help you move between pages:
- Home → Shopping List → Shopping Route

Each page also displays your current store and item count for quick reference.

## License

MIT

## ⚠️ Known Vulnerabilities (intentional)

| Package | Version | Description | Type |
|---------|---------|-------------|------|
| eventsource-parserr | 0.1.0 | Typosquat of legitimate "eventsource-parser" package | Malicious package |

This vulnerability is intentionally included for security testing and educational purposes. The package "eventsource-parserr" (note the double "r") is a typosquat of the legitimate "eventsource-parser" package. In a real-world scenario, such typosquats could contain malicious code that exfiltrates data or compromises the application.

## 🔍 False-Positive Examples

| Package | Version | Pattern | Explanation | Why it's a false positive |
|---------|---------|---------|-------------|---------------------------|
| dompurify | 2.2.6 | Safe use of vulnerable lib | Added to dependencies and used in ItemSelector.jsx | Only sanitizes constant strings, not user input |

This false-positive pattern demonstrates a scenario where a vulnerable package is used in a way that doesn't expose the application to the actual vulnerability. DOMPurify 2.2.6 has known security issues when sanitizing certain types of user input, but in our application, it's only used to sanitize constant strings that are hardcoded in the application. Security scanners will flag this vulnerability, but it poses no actual risk since we're not passing untrusted user input to the vulnerable function.