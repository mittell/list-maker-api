# List Maker API

A Node based API for a simple List Maker Web App.

<div align="center">
  
| Metric | Prod | Dev |
| ----------- | ----------- | ----------- |
| CircleCI Build | ![CircleCI Build](https://img.shields.io/circleci/build/github/mittell/list-maker-api/main?style=for-the-badge) | ![CircleCI Build](https://img.shields.io/circleci/build/github/mittell/list-maker-api/dev?style=for-the-badge)
| SonarCloud Tech Debt | ![SonarCloud Tech Debt](https://img.shields.io/sonar/tech_debt/mittell_list-maker-api/main?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge) | ![SonarCloud Tech Debt](https://img.shields.io/sonar/tech_debt/mittell_list-maker-api/dev?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
| Libraries.io Dependency Status | ![Libraries.io Dependency Status](https://img.shields.io/librariesio/github/mittell/list-maker-api?style=for-the-badge) | ![Libraries.io Dependency Status](https://img.shields.io/librariesio/github/mittell/list-maker-api?style=for-the-badge)
| GitHub Monthly Commits | ![GitHub Commits Current Month](https://img.shields.io/github/commit-activity/m/mittell/list-maker-api/main?style=for-the-badge) | ![GitHub Commits Current Month](https://img.shields.io/github/commit-activity/m/mittell/list-maker-api/dev?style=for-the-badge)
| GitHub Last Commit | ![GitHub Last Commit](https://img.shields.io/github/last-commit/mittell/list-maker-api/main?style=for-the-badge) | ![GitHub Last Commit](https://img.shields.io/github/last-commit/mittell/list-maker-api/dev?style=for-the-badge)

</div>

## About

My first attempt at building an API with Node/Express and TypeScript.

This API was made as a proof-of-concept for a simple List Maker App idea.

The main goal of this project was to have a working API running through CircleCI for testing and building, along with Heroku for deployment.

SonarCloud was integrated to provide code analysis.

## Technologies

The List Maker API was built and deployed with the following technologies:

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [Mongoose](https://mongoosejs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Sentry](https://sentry.io/)
-   [SonarCloud](https://sonarcloud.io/)
-   [CircleCI](https://circleci.com/)
-   [Heroku](https://www.heroku.com/)

## Getting Started

Clone this repo, and make sure to run the commands mentioned below from your terminal within the root project directory.

### Prerequisites

Make use Node.js is installed, and npm is up to date:

    npm@latest -g

Run the provided setup script:

    npm run setup

Created a .env file in the project root, and make sure the following keys are added:

    PORT=<Add Port Number - e.g. 3000>
    SENTRY_URL=<Add Sentry URL>
    NODE_ENV=<Add Environment - e.g. development>
    MONGO_URL=<Add MongoDB PATH/URL>
    API_VERSION=<Add Version - e.g. v1>
    JWT_SECRET=<Add Secret - Make it long and random!>

Run and debug the application with the dev script:

    npm run dev

Run tests on the application with the test script:

    npm run test

Build and run the compiled version with the build and start scripts:

    npm run build
    npm run start

## Development Status

Development on this project has stopped, another one using Inversify for Dependency Injection was started. - [List Maker API v2](https://github.com/mittell/list-maker-api-v2)

## Contact

Feel free to find and contact me at the following:

[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/CMittell)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chris-mittell/)

</div>
