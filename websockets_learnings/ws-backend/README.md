# Websockets Learnings

This project is a learning repository for understanding and experimenting with WebSockets using TypeScript.

## Project Structure

- **`app/index.ts`**: Entry point of the application.
- **`tsconfig.json`**: TypeScript configuration file.
- **`package.json`**: Project metadata and scripts.

## Prerequisites

- Node.js installed on your system.
- TypeScript and Nodemon installed globally (`npm install -g typescript nodemon`).

## Setup

1. Initialize the project:
   ```bash
   npm init -y
   ```

2. Install TypeScript:
   ```bash
   npm install typescript
   ```

3. Initialize TypeScript configuration:
   ```bash
   npx tsc --init
   ```

4. Update the `tsconfig.json` file:
   - Set `"rootDir": "./src"` to specify the source directory.
   - Set `"outDir": "./dist"` to specify the output directory.

5. Add a development script to `package.json`:
   ```json
   "dev": "nodemon --exec ts-node app/index.ts"
   ```

6. Install dependencies:
   ```bash
   npm install
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

## What This Project Does

- Logs a simple message (`"anrab saha"`) to the console as a starting point for WebSocket experiments.

## Future Enhancements

- Implement WebSocket server and client communication.
- Add real-time messaging features.
- Explore advanced WebSocket use cases.
