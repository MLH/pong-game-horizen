#!/bin/bash
# setup script for aws env

# check for node
echo "--- Checking for NodeJS installation ---"

if ! [ -x "$(command -v node)" ]; then
  echo 'Error: NodeJS is not installed. You can install Node at https://nodejs.org/en/download/'
  exit 1
fi

echo "--- NodeJS successfully found! ---"

# check for yarn installation
echo "--- Checking for yarn installation ---"

if ! [ -x "$(command -v yarn)" ]; then
  echo 'Error: yarn is not installed. You can install yarn at https://classic.yarnpkg.com/en/docs/install'
  exit 1
fi

echo "--- yarn successfully found! ---"

echo "--- Installing dependencies ---"

echo '--- running yarn ---'
yarn
echo '--- yarn successfully run! Exiting. ---'

echo "--- Finished installing dependencies ---"
