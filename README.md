# Horizen Pong

Based on [javascript-pong](https://github.com/jakesgordon/javascript-pong/)

## Requirements and dependencies

- NodeJS

## Clone the project

Use the command below:

```sh
git clone https://github.com/MLH/pong-game-horizen.git
```

## Setup Script (Optional)

This workshop has a setup script called `setup.sh`.

In order to be run it needs to be executable. You need to give it permission to run on your machine by using the command:

```sh
chmod +x setup.sh
```

It can then be run with the command:

```sh
./setup.sh
```

## Set Up Environment variables

To quickly set up environment variables, make a copy of the `.env.example` and rename it to `.env`. Then make sure to modify it following the instructions below.

### ZEN_PONG_WALLET_SEED

A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover a wallet. Provide your seed phrase like the example bellow:

```sh
ZEN_PONG_WALLET_SEED="specify limited specify limited specify limited specify limited specify limited specify limited specify limited specify limited specify limited specify limited specify limited specify limited"
```

## Executing the application

To run the application, you only need to execute the start script.

```
yarn start
```

### Open your app

Your app will be running on http://localhost:8000

## How to use the Game

[Check this quick guide](https://github.com/MLH/pong-game-horizen/blob/master/TUTORIAL.md)

## Repl.it
[![Run on Repl.it](https://repl.it/badge/github/MLH/pong-game-horizen)](https://repl.it/github/MLH/pong-game-horizen)

Make sure to create a `.env` file and configure your `ZEN_PONG_WALLET_SEED`.
