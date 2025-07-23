#!/bin/sh
# Install the shared module explicitly
cd /app && npm install ../grocery-shared && npm run seed && exec node src/index.js