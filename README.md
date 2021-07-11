This directory contains server, client and Cypress end to end tests code of published blog-list app.

<pre>
.
├── client  (React client)
├── cypress (End to end tests)
└── server  (Node js api server)
</pre>

Before running the application the following environment variables have to be set in root of the project.

- MONGODB_URI
- JWT_SECRET
- TEST_MONGODB_URI

# Installing dependencies

```bash
 npm install
```

# Starting the application

### Run the full stack app with single command

```bash
  npm run app
```

### Running react app

```bash
  npm run client
```

### Starting api server

```bash
  # Start server in dev mode
  npm run start:dev
```

# Testing the application

### Server testing

```bash
  # Go to server directory and start server in test mode
  npm run test:server
```

### UI testing

```bash
  npm run test:client
```

### End to end testing

```bash
# To open the Browser
npm run cy:open

# To run tests headless
 npm run test:e2e
```
