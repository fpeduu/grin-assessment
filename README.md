# Grin Assessment Dashboard

A modern healthcare dashboard application that provides insights into patient satisfaction metrics and practice performance. Made for GetGrin Assessment.

## Features

- Real-time patient satisfaction tracking
- Interactive data visualization
- Responsive design for all devices
- Patient communication history
- Practice performance metrics

## Prerequisites

- Node.js (v18 or higher)
- yarn
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/fpeduu/grin-assessment.git
cd grin-assessment
```

### 2. Install Dependencies

#### Install API Dependencies
```bash
cd api
yarn install
```

#### Install Client Dependencies
```bash
cd ../client
yarn install
```

### 3. Start the Development Servers

#### Start the API Server
From the project root:
```bash
cd api
yarn run dev
```

The API server will start on http://localhost:3001

#### Start the Client Application
In a new terminal, from the project root:
```bash
cd client
yarn run dev
```

The client application will be available at http://localhost:3000

## Project Structure

```
grin-assessment/
├── api/                 # Backend API server
│   ├── src/
│   │   ├── services/    # Business logic
│   │   └── data/        # Mock data
│   └── package.json
│
├── client/              # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── __tests__/   # Tests
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── styles/      # Global styles
│   └── package.json
│
└── README.md
```

## Available Scripts

### API Server
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Client Application
- `npm start` - Start the development server (runs on http://localhost:3000)
- `npm test` - Run tests
- `npm run build` - Build the app for production
- `npm run eject` - Eject from create-react-app (use with caution)
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier

## Environment Variables

### API
Create a `.env` file in the `api` directory with:
```
PORT=3001
NODE_ENV=development
```

### Client
Create a `.env` file in the `client` directory with:
```
VITE_API_URL=http://localhost:3001
```

## Testing

Run tests for both client and server:

```bash
# Run API tests
cd api
npm test

# Run client tests
cd ../client
npm test
```