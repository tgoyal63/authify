#!/bin/bash

# Source bashrc if it exists
if [ -f ~/.bashrc ]; then
  source ~/.bashrc
fi

# Navigate to the cf directory
cd cf || exit 1

# Install production dependencies
yarn install --production

# Restart the application using pm2
pm2 restart clanflare-backend-dev