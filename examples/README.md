# Battlefield 6 API - Examples

This directory contains usage examples for the `battlefield6-api` package.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Edit `.env` and add your session ID:

```env
SESSION=web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Running Examples

Run any example using ts-node:

```bash
npx ts-node tests/example-basic.ts
npx ts-node tests/example-playelements.ts
npx ts-node tests/example-connector.ts
npx ts-node tests/example-import-styles.ts
```

## Examples Overview

### 1. `example-basic.ts`
Basic usage showing how to:
- Set up authentication with a session ID
- Fetch blueprint lists
- Get detailed blueprint information

### 2. `example-playelements.ts`
PlayElement management demonstrating:
- Listing owned PlayElements with different publish states
- Creating new PlayElements
- Updating existing PlayElements
- Deleting (archiving) PlayElements

### 3. `example-connector.ts`
Advanced object-oriented approach using:
- The Connector class
- Custom Configuration instances
- Multiple backend services (Blueprint, PlayElement, Experience, Mod)

### 4. `example-import-styles.ts`
Different import patterns:
- Namespace imports (`import * as`)
- Named imports
- Using the singleton Instance
- Type-only imports for TypeScript

### 5. `main.ts`
Original comprehensive test file with real-world scenarios.

## Authentication

All examples use environment variables for authentication via a `.env` file.

To get your session ID:
1. Log into the Battlefield Portal (https://portal.battlefield.com)
2. Open browser DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Look for any API request
6. Find the `x-gateway-session-id` header value
7. Copy this value to your `.env` file

## Important Notes

- The `delete()` method doesn't permanently delete PlayElements, it archives them
- Session IDs expire after some time
- Always handle errors appropriately in production code
- Some operations require specific permissions
